// POST /api/subscribe  -> adds an email to the Mailchimp audience
// Requires env var MAILCHIMP_API_KEY (Vercel -> Settings -> Environment Variables).
// Optional: MAILCHIMP_AUDIENCE_ID (otherwise the first audience on the account is used).

let cachedListId = null;

async function mc(path, key, dc, options = {}) {
  const res = await fetch(`https://${dc}.api.mailchimp.com/3.0${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('anystring:' + key).toString('base64'),
      ...(options.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  const key = process.env.MAILCHIMP_API_KEY;
  if (!key || key.indexOf('-') === -1) {
    console.error('MAILCHIMP_API_KEY missing or malformed');
    res.status(500).json({ ok: false, message: 'The list is not connected yet. Please try again later.' });
    return;
  }
  const dc = key.split('-').pop();

  let payload = req.body;
  if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch (e) { payload = {}; } }
  const email = ((payload && payload.email) || '').trim();
  const lang = (payload && payload.lang) || 'en';
  if (!email || email.indexOf('@') < 1) {
    res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    return;
  }

  try {
    let listId = process.env.MAILCHIMP_AUDIENCE_ID || cachedListId;
    if (!listId) {
      const lists = await mc('/lists?count=1', key, dc);
      listId = lists.body && lists.body.lists && lists.body.lists[0] && lists.body.lists[0].id;
      if (!listId) {
        console.error('No Mailchimp audience found', lists.status, lists.body);
        res.status(500).json({ ok: false, message: 'No audience found on the account.' });
        return;
      }
      cachedListId = listId;
    }

    const add = await mc(`/lists/${listId}/members`, key, dc, {
      method: 'POST',
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['founding-reader', 'mbw-landing', 'lang-' + lang]
      })
    });

    if (add.status === 200 || add.status === 201) { res.status(200).json({ ok: true }); return; }
    // Already on the list is a success from the reader's point of view.
    if (add.body && add.body.title === 'Member Exists') { res.status(200).json({ ok: true, already: true }); return; }

    console.error('Mailchimp error', add.status, add.body && add.body.title, add.body && add.body.detail);
    res.status(200).json({ ok: false, message: 'We could not add that address. Please try another one.' });
  } catch (err) {
    console.error('subscribe failed', err);
    res.status(500).json({ ok: false, message: 'Something went wrong. Please try again shortly.' });
  }
};
