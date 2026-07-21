// POST /api/whop-webhook
// Verifies Whop's signature, then files the buyer and emails the book.
// Verification tries the known signing schemes and logs which one matched,
// so the exact format is discovered from real traffic rather than assumed.

const crypto = require('crypto');
const { sendEmail, addContact } = require('./_resend');
const { bookDelivery } = require('./_emails');

module.exports.config = { api: { bodyParser: false } };

const SEGMENT_BUYERS = 'ccacd682-48e3-4fff-8fa9-7df585e235a2';
const TOLERANCE_SECONDS = 1800; // generous: Whop retries failed deliveries

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function keyCandidates(secret) {
  const s = String(secret || '');
  const stripped = s.startsWith('whsec_') ? s.slice(6) : s;
  const out = [Buffer.from(s, 'utf8'), Buffer.from(stripped, 'utf8')];
  try {
    const b = Buffer.from(stripped, 'base64');
    if (b.length) out.push(b);
  } catch (e) {}
  return out;
}

function sigValues(headers) {
  const names = ['webhook-signature', 'svix-signature', 'x-whop-signature', 'whop-signature', 'x-signature'];
  const vals = [];
  for (const n of names) {
    const v = headers[n];
    if (!v) continue;
    String(v).split(/[\s,]+/).forEach((piece) => {
      if (!piece) return;
      vals.push(piece);
      if (piece.indexOf('=') > -1) vals.push(piece.split('=').slice(1).join('='));
    });
    // "v1,<sig>" style
    String(v).split(' ').forEach((p) => { if (p.includes(',')) vals.push(p.split(',')[1]); });
  }
  return vals.filter(Boolean);
}

function verify(headers, raw, secret) {
  const id = headers['webhook-id'] || headers['svix-id'] || '';
  const ts = headers['webhook-timestamp'] || headers['svix-timestamp'] || headers['x-whop-timestamp'] || '';
  const body = raw.toString('utf8');

  if (ts) {
    const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
    if (Number.isFinite(age) && age > TOLERANCE_SECONDS) {
      console.warn('whop webhook: stale timestamp', ts);
      return false;
    }
  }

  const payloads = [];
  if (id && ts) payloads.push(`${id}.${ts}.${body}`);
  if (ts) payloads.push(`${ts}.${body}`);
  payloads.push(body);

  const given = sigValues(headers);
  if (!given.length) { console.warn('whop webhook: no signature header found'); return false; }

  for (const key of keyCandidates(secret)) {
    for (const p of payloads) {
      const mac = crypto.createHmac('sha256', key).update(p);
      const b64 = mac.copy().digest('base64');
      const hex = mac.digest('hex');
      for (const g of given) {
        if (g === b64 || g === hex) {
          console.log('whop signature matched scheme:',
            p.startsWith(id + '.') ? 'id.ts.body' : (p.startsWith(ts + '.') ? 'ts.body' : 'body'),
            g === hex ? 'hex' : 'base64');
          return true;
        }
      }
    }
  }
  return false;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }

  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) { console.error('WHOP_WEBHOOK_SECRET missing'); res.status(500).json({ ok: false }); return; }

  let raw;
  try { raw = await rawBody(req); } catch (e) { res.status(400).json({ ok: false }); return; }

  const ok = verify(req.headers, raw, secret);
  if (!ok) {
    // one-time diagnostics: header names and signature shape are not secrets
    console.warn('whop webhook rejected. headers seen:', Object.keys(req.headers).join(','));
    console.warn('signature header value:', String(req.headers['webhook-signature'] || req.headers['x-whop-signature'] || req.headers['svix-signature'] || 'none').slice(0, 120));
    console.warn('body starts:', raw.toString('utf8').slice(0, 220));
    res.status(401).json({ ok: false, message: 'Invalid signature' });
    return;
  }

  let event = {};
  try { event = JSON.parse(raw.toString('utf8')); } catch (e) { res.status(400).json({ ok: false }); return; }

  const type = String(event.event || event.action || event.type || '');
  console.log('whop webhook accepted:', type);

  const paid = type.indexOf('payment') > -1 && type.indexOf('succeed') > -1;
  if (paid) {
    const email = findEmail(event.data || event);
    if (email) {
      await addContact(email, SEGMENT_BUYERS);
      const sent = await sendEmail(email, bookDelivery());
      console.log('buyer handled', email.replace(/(.{2}).+(@.*)/, '$1***$2'), 'emailed:', sent);
    } else {
      console.warn('no email on payment event:', JSON.stringify(event).slice(0, 500));
    }
  }

  res.status(200).json({ ok: true });
};

function findEmail(obj, depth) {
  if (!obj || typeof obj !== 'object' || (depth || 0) > 6) return '';
  for (const k of ['email', 'user_email', 'customer_email', 'receipt_email']) {
    if (typeof obj[k] === 'string' && obj[k].indexOf('@') > 0) return obj[k];
  }
  for (const k of Object.keys(obj)) {
    const f = findEmail(obj[k], (depth || 0) + 1);
    if (f) return f;
  }
  return '';
}
