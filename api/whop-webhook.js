// POST /api/whop-webhook
// Adds buyers to the Mailchimp audience the moment a payment succeeds.
//
// Whop follows the Standard Webhooks spec:
//   headers: webhook-id, webhook-timestamp, webhook-signature ("v1,<base64>")
//   signed content: `${id}.${timestamp}.${rawBody}`
//   secret: "whsec_<base64>"  (the part after the prefix is base64-encoded key bytes)
//
// Env required:
//   WHOP_WEBHOOK_SECRET   from Whop dashboard -> Developer -> Create Webhook
//   MAILCHIMP_API_KEY     already set
// Optional:
//   MAILCHIMP_AUDIENCE_ID

const crypto = require('crypto');

module.exports.config = { api: { bodyParser: false } };

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
  try {
    const buf = Buffer.from(base, 'base64');
    if (buf.length) return buf;
  } catch (e) { /* fall through */ }
  return Buffer.from(base, 'utf8');
}

function verify(headers, raw, secret) {
  const id = headers['webhook-id'];
  const ts = headers['webhook-timestamp'];
  const sigHeader = headers['webhook-signature'];
  if (!id || !ts || !sigHeader) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) {
    console.warn('whop webhook: timestamp outside tolerance', ts);
    return false;
  }

  const signed = `${id}.${ts}.${raw.toString('utf8')}`;
  const expected = crypto.createHmac('sha256', secretKey(secret)).update(signed).digest('base64');
  const expBuf = Buffer.from(expected, 'utf8');

  // header may carry several space-separated versioned signatures
  return String(sigHeader).split(' ').some((part) => {
    const value = part.includes(',') ? part.split(',')[1] : part;
    const gotBuf = Buffer.from(value, 'utf8');
    if (gotBuf.length !== expBuf.length) return false;
    try { return crypto.timingSafeEqual(gotBuf, expBuf); } catch (e) { return false; }
  });
}

function findEmail(obj, depth) {
  // payload shape varies by event; look for the first plausible email
  if (!obj || typeof obj !== 'object' || (depth || 0) > 5) return '';
  for (const key of ['email', 'user_email', 'customer_email', 'receipt_email']) {
    if (typeof obj[key] === 'string' && obj[key].indexOf('@') > 0) return obj[key];
  }
  for (const k of Object.keys(obj)) {
    const found = findEmail(obj[k], (depth || 0) + 1);
    if (found) return found;
  }
  return '';
}

async function tagBuyer(email) {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key || !email || key.indexOf('-') === -1) return false;
  const dc = key.split('-').pop();
  const auth = 'Basic ' + Buffer.from('anystring:' + key).toString('base64');
  try {
    let listId = process.env.MAILCHIMP_AUDIENCE_ID;
    if (!listId) {
      const lists = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists?count=1`, { headers: { Authorization: auth } });
      const lj = await lists.json();
      listId = lj.lists && lj.lists[0] && lj.lists[0].id;
    }
    if (!listId) { console.error('whop webhook: no mailchimp audience'); return false; }

    const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['book-buyer', 'my-beautiful-world', 'whop']
      })
    });
    if (res.status === 200 || res.status === 201) return true;
    const body = await res.json().catch(() => ({}));
    if (body && body.title === 'Member Exists') return true;   // already on the list: fine
    console.error('mailchimp add failed', res.status, body && body.title);
    return false;
  } catch (e) {
    console.error('tagBuyer failed', e);
    return false;
  }
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

  const type = event.event || event.action || event.type || '';
  console.log('whop webhook', type);

  if (String(type).indexOf('payment') === 0 && String(type).indexOf('succeed') > -1) {
    const email = findEmail(event.data || event);
    if (email) {
      const ok = await tagBuyer(email);
      console.log('buyer tagged', email.replace(/(.{2}).+(@.*)/, '$1***$2'), ok);
    } else {
      console.warn('whop webhook: no email found on payment event');
    }
  }

  // acknowledge quickly so Whop does not retry
  res.status(200).json({ ok: true });
};
