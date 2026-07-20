// POST /api/subscribe -> files the reader under "Book — free sample" and emails the 3 pages.
const { sendEmail, addContact } = require('./_resend');
const { freeSample } = require('./_emails');

const SEGMENT_SAMPLE = '6e57156d-c8b0-49b2-b7a1-2206fc9e5731';

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, message: 'Method not allowed' }); return; }

  let payload = req.body;
  if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch (e) { payload = {}; } }
  const email = ((payload && payload.email) || '').trim();
  if (!email || email.indexOf('@') < 1) {
    res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY missing');
    res.status(500).json({ ok: false, message: 'The list is not connected yet. Please try again later.' });
    return;
  }

  try {
    await addContact(email, SEGMENT_SAMPLE);           // best effort
    const sent = await sendEmail(email, freeSample()); // the part that matters
    if (!sent) {
      // the page still shows its own download button, so this is not fatal
      console.warn('sample email not sent to', email);
    }
    res.status(200).json({ ok: true, emailed: sent });
  } catch (err) {
    console.error('subscribe failed', err);
    res.status(500).json({ ok: false, message: 'Something went wrong. Please try again shortly.' });
  }
};
