// POST /api/waitlist  { email, list }
//
// The two hand-raises on the thank-you page: "series" (tell me when the next
// book is ready) and "print" (tell me when the printed edition exists).
//
// These people have already bought, so this endpoint deliberately does NOT
// reuse /api/subscribe - that one sends the free sample, which would be an
// odd thing to send someone who owns the whole book.
//
// The Resend free plan caps us at 3 segments, so both lists file into the
// General segment and the actual interest is recorded on the contact's
// "interests" property instead.

const { sendEmail, addContact, tagInterest } = require('./_resend');
const { waitlistConfirm } = require('./_emails');

const SEGMENT_GENERAL = '16abb5e2-6dc1-46f1-aa49-3252b10ab565';
const LISTS = ['series', 'print'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, message: 'Method not allowed' }); return; }

  let payload = req.body;
  if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch (e) { payload = {}; } }
  payload = payload || {};

  const email = String(payload.email || '').trim().toLowerCase();
  const list = String(payload.list || '').trim().toLowerCase();

  if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 0) {
    res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    return;
  }
  if (LISTS.indexOf(list) === -1) {
    res.status(400).json({ ok: false, message: 'Unknown list.' });
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY missing');
    res.status(500).json({ ok: false, message: 'The list is not connected yet. Please try again later.' });
    return;
  }

  try {
    // Filing the contact is what actually matters here, so it is awaited and
    // its result is what the page is told about. The confirmation email is a
    // courtesy - if Resend refuses to send it, the person is still on the list.
    await addContact(email, SEGMENT_GENERAL);
    await tagInterest(email, list);

    let sent = false;
    try {
      sent = await sendEmail(email, waitlistConfirm(list));
    } catch (e) {
      console.warn('waitlist confirmation email failed', e && e.message);
    }

    console.log('waitlist', list, email.replace(/(.{2}).+(@.*)/, '$1***$2'), 'emailed:', sent);
    res.status(200).json({ ok: true, emailed: sent });
  } catch (err) {
    console.error('waitlist failed', err);
    res.status(500).json({ ok: false, message: 'Something went wrong. Please try again shortly.' });
  }
};
