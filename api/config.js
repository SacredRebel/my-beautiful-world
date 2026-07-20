// GET /api/config  -> public checkout config only. No secrets are returned.
module.exports = async (req, res) => {
  const environment = (process.env.PADDLE_ENV || 'sandbox').toLowerCase();
  const clientToken = process.env.PADDLE_CLIENT_TOKEN || '';
  const priceId = process.env.PADDLE_PRICE_ID || '';
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200).json({
    ok: true,
    environment,
    clientToken,   // client-side token — safe in the browser by design
    priceId,
    configured: Boolean(clientToken && priceId)
  });
};
