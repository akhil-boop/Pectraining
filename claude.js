/**
 * Tangience Engineering Hub — Claude API Proxy
 * Vercel Serverless Function: /api/claude
 *
 * This function forwards requests from the browser to the Anthropic API,
 * keeping the API key secure on the server side.
 *
 * Setup:
 *   1. Deploy this project to Vercel
 *   2. In Vercel dashboard → Settings → Environment Variables
 *      Add: ANTHROPIC_API_KEY = sk-ant-xxxx...
 *   3. Redeploy — the proxy will work automatically
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers — allow requests from your Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: {
        message: 'ANTHROPIC_API_KEY environment variable is not set. ' +
                 'Add it in Vercel dashboard → Settings → Environment Variables.'
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

    // Forward the response status and body to the client
    return res.status(response.status).json(data);

  } catch (err) {
    console.error('Claude proxy error:', err);
    return res.status(500).json({
      error: {
        message: 'Proxy error: ' + err.message
      }
    });
  }
}
