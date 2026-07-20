// POST /api/paddle-webhook
// Verifies Paddle's signature, then records the buyer. Delivery itself happens
// through /api/download so the customer never waits on an email.
//
// Env required:
//   PADDLE_WEBHOOK_SECRET   endpoint_secret_key from the Paddle notification destination
//   MAILCHIMP_API_KEY       (optional) tags buyers in your audience

const crypto = require('crypto');

module.exports.config = { api: { bodyParser: false } };

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function verify(sigHeader, raw, secret) {
  if (!sigHeader) return false;
  const parts = {};
  String(sigHeader).split(';').forEach((kv) => {
    const [k, v] = kv.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  });
  if (!parts.ts || !parts.h1) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.ts}:${raw.toString('utf8')}`).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(parts.h1, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function tagBuyer(email, lang) {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key || !email || key.indexOf('-') === -1) return;
  const dc = key.split('-').pop();
  const auth = 'Basic ' + Buffer.from('anystring:' + key).toString('base64');
  try {
    const lists = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists?count=1`, { headers: { Authorization: auth } });
    const lj = await lists.json();
    const listId = process.env.MAILCHIMP_AUDIENCE_ID || (lj.lists && lj.lists[0] && lj.lists[0].id);
    if (!listId) return;
    await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['book-buyer', 'mbw-purchase', 'lang-' + (lang || 'en')]
      })
    });
  } catch (e) {
    console.error('tagBuyer failed', e);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }

  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) { console.error('PADDLE_WEBHOOK_SECRET missing'); res.status(500).json({ ok: false }); return; }

  let raw;
  try { raw = await rawBody(req); } catch (e) { res.status(400).json({ ok: false }); return; }

  if (!verify(req.headers['paddle-signature'], raw, secret)) {
    console.warn('rejected webhook: bad signature');
    res.status(401).json({ ok: false, message: 'Invalid signature' });
    return;
  }

  let event = {};
  try { event = JSON.parse(raw.toString('utf8')); } catch (e) { res.status(400).json({ ok: false }); return; }

  const type = event.event_type || '';
  console.log('paddle webhook', type, event.data && event.data.id);

  if (type === 'transaction.completed') {
    const d = event.data || {};
    const email = (d.customer && d.customer.email) || (d.billing_details && d.billing_details.email) || '';
    const lang = (d.custom_data && d.custom_data.lang) || 'en';
    await tagBuyer(email, lang);
  }

  // Always 200 quickly so Paddle does not retry a delivery we already accepted.
  res.status(200).json({ ok: true });
};
