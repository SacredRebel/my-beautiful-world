// Small Resend helper: send an email and file the contact into a segment.
const FROM = process.env.RESEND_FROM || 'Edenverse <hello@edenverse.earth>';
const REPLY_TO = process.env.RESEND_REPLY_TO || 'edenverse88@gmail.com';

async function req(method, path, body) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY missing');
  const init = {
    method,
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch('https://api.resend.com' + path, init);
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

function resend(path, body) {
  return req('POST', path, body);
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

  // File into the segment. The endpoint wants { email } - passing contact_id
  // returns 422 "Missing `email` field", so email goes first and contact_id is
  // kept only as a fallback in case that ever changes.
  const attempts = [{ email }];
  if (contactId) attempts.push({ contact_id: contactId });
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

// Resend does not return contact properties as bare values. It returns them
// wrapped: { interests: { value: "series", type: "string" } }. Reading the
// wrapper directly with String() yields "[object Object]", which then gets
// written back as a tag. This unwraps whichever shape comes back.
function propValue(props, name) {
  const raw = props && props[name];
  if (raw === null || raw === undefined) return '';
  if (typeof raw === 'object') {
    const v = raw.value;
    return v === null || v === undefined ? '' : String(v);
  }
  return String(raw);
}

// Values that must never survive into the stored tag list: "none" is the
// property's own fallback, and "[object object]" is the residue of the bug
// above - listing it here repairs any contact already carrying it.
const JUNK = ['none', '[object object]', 'undefined', 'null'];

// Records what a contact has put their hand up for, in the "interests" contact
// property. The free plan caps us at 3 segments, so interest is tracked as a
// property rather than a segment per list.
//
// It merges rather than overwrites: someone who joins the series list and then
// the print list ends up "series,print", not just "print". Best effort
// throughout - a failure here must never stop the confirmation email going out.
exports.tagInterest = async function (email, tag) {
  const clean = String(tag || '').trim().toLowerCase();
  if (!clean) return false;
  const key = encodeURIComponent(email);

  let existing = '';
  try {
    const g = await req('GET', '/contacts/' + key);
    const c = (g.json && (g.json.data || g.json)) || {};
    existing = propValue(c.properties, 'interests');
  } catch (e) {
    console.warn('resend contact read error', e.message);
  }

  const tags = existing.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (tags.indexOf(clean) === -1) tags.push(clean);
  const merged = tags.filter((t) => JUNK.indexOf(t) === -1).join(',');
  if (merged === existing) return true;

  try {
    const u = await req('PATCH', '/contacts/' + key, { properties: { interests: merged } });
    if (u.ok) return true;
    console.warn('resend property update', u.status, JSON.stringify(u.json).slice(0, 200));
  } catch (e) {
    console.warn('resend property update error', e.message);
  }
  return false;
};
