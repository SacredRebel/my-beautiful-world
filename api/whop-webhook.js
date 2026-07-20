// POST /api/whop-webhook -> on a completed payment, file the buyer and email the book.
const crypto = require('crypto');
const { sendEmail, addContact } = require('./_resend');
const { bookDelivery } = require('./_emails');

module.exports.config = { api: { bodyParser: false } };

const SEGMENT_BUYERS = 'ccacd682-48e3-4fff-8fa9-7df585e235a2';
const TOLERANCE_SECONDS = 300;

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
function secretKey(secret) {
  const s = String(secret || '');
  const base = s.startsWith('whsec_') ? s.slice(6) : s;
  try { const b = Buffer.from(base, 'base64'); if (b.length) return b; } catch (e) {}
  return Buffer.from(base, 'utf8');
}
function verify(headers, raw, secret) {
  const id = headers['webhook-id'], ts = headers['webhook-timestamp'], sig = headers['webhook-signature'];
  if (!id || !ts || !sig) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;
  const expected = crypto.createHmac('sha256', secretKey(secret))
    .update(`${id}.${ts}.${raw.toString('utf8')}`).digest('base64');
  const expBuf = Buffer.from(expected, 'utf8');
  return String(sig).split(' ').some((part) => {
    const v = part.includes(',') ? part.split(',')[1] : part;
    const got = Buffer.from(v, 'utf8');
    if (got.length !== expBuf.length) return false;
    try { return crypto.timingSafeEqual(got, expBuf); } catch (e) { return false; }
  });
}
function findEmail(obj, depth) {
  if (!obj || typeof obj !== 'object' || (depth || 0) > 5) return '';
  for (const k of ['email', 'user_email', 'customer_email', 'receipt_email']) {
    if (typeof obj[k] === 'string' && obj[k].indexOf('@') > 0) return obj[k];
  }
  for (const k of Object.keys(obj)) {
    const f = findEmail(obj[k], (depth || 0) + 1);
    if (f) return f;
  }
  return '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) { console.error('WHOP_WEBHOOK_SECRET missing'); res.status(500).json({ ok: false }); return; }

  let raw;
  try { raw = await rawBody(req); } catch (e) { res.status(400).json({ ok: false }); return; }
  if (!verify(req.headers, raw, secret)) {
    console.warn('whop webhook rejected: bad signature');
    res.status(401).json({ ok: false, message: 'Invalid signature' });
    return;
  }

  let event = {};
  try { event = JSON.parse(raw.toString('utf8')); } catch (e) { res.status(400).json({ ok: false }); return; }

  const type = String(event.event || event.action || event.type || '');
  console.log('whop webhook', type);

  if (type.indexOf('payment') === 0 && type.indexOf('succeed') > -1) {
    const email = findEmail(event.data || event);
    if (email) {
      await addContact(email, SEGMENT_BUYERS);
      const sent = await sendEmail(email, bookDelivery());
      console.log('buyer handled', email.replace(/(.{2}).+(@.*)/, '$1***$2'), 'emailed:', sent);
    } else {
      console.warn('whop webhook: no email on payment event', JSON.stringify(event).slice(0, 400));
    }
  }

  res.status(200).json({ ok: true });
};
