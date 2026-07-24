// Pinterest Conversions API - server-side conversion reporting.
//
// The sale completes on whop.com, a domain we cannot put a browser tag on, so the
// only honest place to report a purchase is here: the signature-verified webhook
// that already tells us a real payment succeeded. This path also survives ad
// blockers, iOS tracking prevention and third-party cookie loss, which typically
// cost a browser tag 15-30% of conversions.
//
// The token lives in PINTEREST_CONVERSIONS_TOKEN and must never enter the repo -
// this repository is public.

const crypto = require('crypto');

const AD_ACCOUNT = process.env.PINTEREST_AD_ACCOUNT_ID || '549770624334';
const ENDPOINT = `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT}/events`;

// Pinterest requires every user_data field except ip, user agent and click id
// to arrive as a lowercase, trimmed SHA256 hash. The raw address never leaves here.
function sha256(v) {
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

async function sendEvent(event, opts) {
  const token = process.env.PINTEREST_CONVERSIONS_TOKEN;
  if (!token) {
    console.warn('pinterest capi: PINTEREST_CONVERSIONS_TOKEN not set, skipping');
    return false;
  }
  const url = ENDPOINT + ((opts && opts.test) ? '?test=true' : '');
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !(body.num_events_processed > 0)) {
      console.warn('pinterest capi rejected', res.status, JSON.stringify(body).slice(0, 300));
      return false;
    }
    const warn = body.events && body.events[0] && body.events[0].warning_message;
    if (warn) console.log('pinterest capi warning:', String(warn).slice(0, 200));
    console.log('pinterest capi ok:', event.event_name, event.event_id);
    return true;
  } catch (e) {
    console.warn('pinterest capi error:', e && e.message);
    return false;
  }
}

// A completed purchase.
// eventId MUST be stable across Whop's webhook retries - Whop redelivers failed
// webhooks, and without a stable id one sale would be reported several times.
function trackCheckout(o) {
  const opts = o || {};
  if (!opts.email || !opts.eventId) {
    console.warn('pinterest capi: checkout needs both an email and a stable event id');
    return Promise.resolve(false);
  }
  const n = Number(opts.value);
  const value = (Number.isFinite(n) && n > 0 ? n : 12).toFixed(2);
  const qty = Number.isFinite(Number(opts.quantity)) && Number(opts.quantity) > 0 ? Number(opts.quantity) : 1;
  return sendEvent({
    event_name: 'checkout',
    action_source: 'web',
    event_time: Math.floor(Date.now() / 1000),
    event_id: String(opts.eventId),
    event_source_url: 'https://library.edenverse.earth/',
    user_data: { em: [sha256(opts.email)] },
    custom_data: {
      currency: String(opts.currency || 'USD').toUpperCase(),
      value: value,
      num_items: qty,
      order_id: String(opts.eventId),
      content_ids: ['my-beautiful-world-vol1'],
      content_name: 'My Beautiful World',
      content_category: 'Childrens picture books',
      contents: [{ item_price: value, quantity: qty }],
    },
  }, opts);
}

module.exports = { sendEvent, trackCheckout, sha256, AD_ACCOUNT };
