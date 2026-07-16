# Tangience Engineering Hub — Vercel Deployment Guide

## What this solves
The Plan Check IQ PDF import and AI response generator need to call the
Claude API. Browsers block direct API calls (CORS). The solution is a
Vercel serverless function (`/api/claude.js`) that acts as a secure
proxy — your API key lives on the server, never in the browser.

---

## Project structure

```
your-project/
├── PEC_Engineering_Hub.html    ← the main tool
├── api/
│   └── claude.js               ← Vercel serverless proxy (handles API calls)
├── vercel.json                  ← Vercel routing config
└── DEPLOYMENT_GUIDE.md          ← this file
```

---

## Step 1 — Get your Anthropic API key

1. Go to https://console.anthropic.com
2. Sign in (or create a free account)
3. Go to **API Keys** → **Create key**
4. Copy the key — it starts with `sk-ant-api03-...`
5. Keep it safe — you only see it once

---

## Step 2 — Set up the Vercel project

### Option A — Deploy from GitHub (recommended)

1. Create a GitHub repository (can be private)
2. Upload all 3 files:
   - `PEC_Engineering_Hub.html`
   - `api/claude.js`
   - `vercel.json`
3. Go to https://vercel.com → **New Project**
4. Import your GitHub repository
5. Click **Deploy** (keep all defaults)

### Option B — Deploy via Vercel CLI

```bash
npm install -g vercel
cd your-project-folder
vercel
```

---

## Step 3 — Add the API key (critical step)

1. In Vercel dashboard → click your project
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your `sk-ant-api03-...` key
   - **Environment:** Production (and Preview if you want)
4. Click **Save**
5. Go to **Deployments** → click the three dots → **Redeploy**

---

## Step 4 — Verify it works

1. Open your Vercel URL (e.g. `tangiencetraining.vercel.app`)
2. Go to **Plan Check IQ** → **Log comment** tab
3. Drop a plan check PDF onto the upload zone
4. Fill in project name and city
5. Click **Extract & import all comments**
6. Should show a green success banner with extracted comments

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "ANTHROPIC_API_KEY not set" | Add the env variable in Vercel dashboard and redeploy |
| "Proxy error: fetch failed" | Check Vercel function logs (dashboard → Functions tab) |
| PDF shows 0 comments | The PDF may be scanned (image-only) — try a text-based PDF |
| Response generator fails | Same API key issue — same fix |
| Works locally but not on Vercel | Make sure `vercel.json` is in the root folder |

---

## Cost

The Claude API charges per token:
- PDF import (extract ~10–20 comments): ~$0.01–0.03 per PDF
- AI response generator (per comment): ~$0.002–0.005 per response
- Very low cost for the volume your team generates

Set up a **spending limit** in the Anthropic console to stay within budget.

---

## Security

- Your API key is stored as a Vercel environment variable — never in the HTML file
- The proxy only forwards POST requests to `/v1/messages` — nothing else
- You can restrict the CORS origin in `api/claude.js` to your Vercel domain if needed

---

*Tangience Engineering Hub — Pro Engineering Consulting (PEC)*
