// Small Resend helper: send an email and file the contact into a segment.
const FROM = process.env.RESEND_FROM || 'Edenverse <hello@edenverse.earth>';
const REPLY_TO = process.env.RESEND_REPLY_TO || 'edenverse88@gmail.com';

async function resend(path, body) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY missing');
  const res = await fetch('https://api.resend.com' + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

exports.sendEmail = async function (to, mail) {
  const r = await resend('/emails', {
    from: FROM, to: [to], reply_to: REPLY_TO,
    subject: mail.subject, html: mail.html, text: mail.text
  });
  if (!r.ok) console.error('resend send failed', r.status, JSON.stringify(r.json).slice(0, 300));
  return r.ok;
};

// Best effort: contact filing must never block delivery of the email.
exports.addContact = async function (email, segmentId) {
  try {
    const r = await resend('/contacts', { email, unsubscribed: false, segment_ids: [segmentId] });
    if (!r.ok) console.warn('resend contact add', r.status, JSON.stringify(r.json).slice(0, 200));
    return r.ok;
  } catch (e) {
    console.warn('resend contact error', e.message);
    return false;
  }
};
