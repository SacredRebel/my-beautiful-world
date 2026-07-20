// GET /api/download?txn=txn_xxx
// Order-authenticated delivery: we ask Paddle whether this transaction is really
// paid, and only then hand back a short-lived signed link to the book.
//
// Env required:
//   PADDLE_ENV            sandbox | production
//   PADDLE_API_KEY        server-side Paddle API key
//   SUPABASE_URL          https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  service_role key (server-side only, never in the browser)
//   BOOK_BUCKET           storage bucket name        (default: books)
//   BOOK_PATH             object path inside bucket  (default: My-Beautiful-World.pdf)

const LINK_TTL_SECONDS = 900; // 15 minutes

function paddleBase() {
  return (process.env.PADDLE_ENV || 'sandbox').toLowerCase() === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';
}

module.exports = async (req, res) => {
  const txn = (req.query && req.query.txn) || '';
  if (!txn || !/^txn_[a-zA-Z0-9]+$/.test(txn)) {
    res.status(400).json({ ok: false, message: 'Missing or malformed transaction reference.' });
    return;
  }

  const apiKey = process.env.PADDLE_API_KEY;
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  if (!apiKey || !supaUrl || !supaKey) {
    console.error('download: missing env', {
      apiKey: Boolean(apiKey), supaUrl: Boolean(supaUrl), supaKey: Boolean(supaKey)
    });
    res.status(500).json({ ok: false, message: 'Downloads are not configured yet.' });
    return;
  }

  try {
    // 1. Confirm the transaction with Paddle itself. Never trust the URL.
    const tr = await fetch(`${paddleBase()}/transactions/${encodeURIComponent(txn)}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const body = await tr.json().catch(() => ({}));
    if (!tr.ok) {
      console.error('paddle lookup failed', tr.status, body && body.error);
      res.status(200).json({ ok: false, message: 'We could not verify that purchase yet. Please try again in a moment.' });
      return;
    }
    const status = body && body.data && body.data.status;
    if (status !== 'completed' && status !== 'paid' && status !== 'billed') {
      console.warn('transaction not payable', txn, status);
      res.status(200).json({ ok: false, message: 'That payment has not completed yet. If you were charged, email edenverse88@gmail.com.' });
      return;
    }

    // 2. Issue a short-lived signed link to the private file.
    const bucket = process.env.BOOK_BUCKET || 'books';
    const path = process.env.BOOK_PATH || 'My-Beautiful-World.pdf';
    const signRes = await fetch(`${supaUrl}/storage/v1/object/sign/${bucket}/${encodeURI(path)}`, {
      method: 'POST',
      headers: {
        apikey: supaKey,
        Authorization: `Bearer ${supaKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn: LINK_TTL_SECONDS })
    });
    const signed = await signRes.json().catch(() => ({}));
    if (!signRes.ok || !signed.signedURL) {
      console.error('sign failed', signRes.status, signed);
      res.status(200).json({ ok: false, message: 'Your payment went through, but the download link failed. Email edenverse88@gmail.com and I will send it straight over.' });
      return;
    }

    res.status(200).json({ ok: true, url: `${supaUrl}/storage/v1${signed.signedURL}`, expiresIn: LINK_TTL_SECONDS });
  } catch (err) {
    console.error('download failed', err);
    res.status(500).json({ ok: false, message: 'Something went wrong preparing your download.' });
  }
};
