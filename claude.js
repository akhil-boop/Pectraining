/**
 * Tangience Engineering Hub — Claude API Proxy
 * Vercel Serverless Function: /api/claude.js
 *
 * Forwards requests to Anthropic API with the server-side API key.
 * Set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables
 */

module.exports = async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: {
        message: 'ANTHROPIC_API_KEY is not set. Go to Vercel dashboard → ' +
                 'Your project → Settings → Environment Variables → Add ANTHROPIC_API_KEY'
      }
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error('Claude proxy error:', err);
    return res.status(500).json({
      error: { message: 'Proxy error: ' + err.message }
    });
  }
};
