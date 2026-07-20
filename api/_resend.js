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
// Two steps: create the contact, then file it into the segment. The create call
// does not accept segment ids, so the second call is what actually files it.
exports.addContact = async function (email, segmentId) {
  let contactId = '';
  try {
    const c = await resend('/contacts', { email, unsubscribed: false });
    contactId = (c.json && (c.json.id || (c.json.data && c.json.data.id))) || '';
    if (!c.ok && c.status !== 409) {
      console.warn('resend contact create', c.status, JSON.stringify(c.json).slice(0, 200));
    }
  } catch (e) {
    console.warn('resend contact create error', e.message);
  }

  // file into the segment; try by id first, fall back to email
  const attempts = [];
  if (contactId) attempts.push({ contact_id: contactId });
  attempts.push({ email });
  for (const body of attempts) {
    try {
      const s = await resend('/segments/' + segmentId + '/contacts', body);
      if (s.ok) return true;
      console.warn('resend segment add', s.status, JSON.stringify(s.json).slice(0, 200));
    } catch (e) {
      console.warn('resend segment error', e.message);
    }
  }
  return false;
};
