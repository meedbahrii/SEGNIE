# Quick Start: Deploy to Vercel (5 Minutes)

## ⚡ Fast Track Deployment

### 1. Get a Free Database (2 minutes)
- Go to [neon.tech](https://neon.tech)
- Sign up and create a project
- Copy your connection string: `postgresql://user:pass@host/db`

### 2. Deploy to Vercel (2 minutes)
- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Add environment variables:
  ```
  DATABASE_URL=your-neon-connection-string
  SESSION_SECRET=run: openssl rand -base64 32
  ```
- Click **Deploy**

### 3. Update Extension (1 minute)
- Edit `extension/manifest.json`:
  ```json
  "homepage_url": "https://your-app.vercel.app"
  ```
- Reload extension in Chrome (`chrome://extensions/`)

### 4. Done! 🎉
Your app is live at `https://your-app.vercel.app`

---

## Need Stripe Payments?
Add these to Vercel environment variables:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

Then set up webhook:
- Stripe Dashboard → Webhooks
- Add endpoint: `https://your-app.vercel.app/api/webhook/stripe`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

**Full guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
