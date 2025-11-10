# Deploying SaveTo to Vercel

This guide will walk you through deploying your SaveTo application to Vercel's free tier.

## Prerequisites

1. [Vercel account](https://vercel.com/signup) (free)
2. [PostgreSQL database](https://neon.tech/) (Neon offers a free tier)
3. GitHub account (to connect your repository)

## Step 1: Set Up PostgreSQL Database

### Option A: Neon (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (format: `postgresql://user:password@host/database`)
4. Keep this for later - you'll need it in Vercel

### Option B: Vercel Postgres

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the `DATABASE_URL` from the environment variables

## Step 2: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure your `.gitignore` includes:**
   ```
   node_modules
   .env
   .env.local
   dist
   .vercel
   ```

## Step 3: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (Vercel will use `vercel-build` from package.json)
   - **Output Directory:** `dist/public`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```env
   DATABASE_URL=postgresql://your-connection-string
   SESSION_SECRET=generate-with-openssl-rand-base64-32
   ```

   **Optional (for Stripe subscriptions):**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

   **Optional (for OAuth integrations):**
   ```env
   NOTION_CLIENT_ID=your-notion-client-id
   NOTION_CLIENT_SECRET=your-notion-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   TRELLO_API_KEY=your-trello-api-key
   ```

5. Click **Deploy**

### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

## Step 4: Set Up Database Tables

After deployment, your session table will be created automatically by `connect-pg-simple`.

To create your application tables:

1. Go to your Vercel project dashboard
2. Navigate to the Deployments tab
3. Click on your latest deployment
4. Go to the "Functions" tab
5. You can manually run migrations or use Drizzle Kit:

```bash
# In your local environment with DATABASE_URL set to production
npm run db:push
```

**Or use the Neon SQL Editor directly:**

Run the SQL schema from `shared/schema.ts` to create the tables.

## Step 5: Update Browser Extension

1. Update `extension/manifest.json`:
   ```json
   {
     "homepage_url": "https://your-app.vercel.app"
   }
   ```

2. The extension will automatically use your Vercel deployment URL

3. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click "Update" or toggle the extension off and on

## Step 6: Configure Stripe Webhooks (Optional)

If using Stripe subscriptions:

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "+ Add endpoint"
3. Enter: `https://your-app.vercel.app/api/webhook/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 7: Generate SESSION_SECRET

Generate a secure session secret:

```bash
openssl rand -base64 32
```

Add this to your Vercel environment variables as `SESSION_SECRET`.

## Vercel Configuration Overview

Your `vercel.json` configures:
- API routes at `/api/*`
- Frontend static files served from `/`
- CORS headers for API requests
- Environment variable references

## Free Tier Limits

### Vercel Free Tier:
- ✅ 100 GB bandwidth per month
- ✅ Unlimited deployments
- ✅ Serverless Functions: 100 GB-hours
- ✅ 6000 execution time per day

### Neon Free Tier:
- ✅ 0.5 GB storage
- ✅ Unlimited branches
- ✅ 1 project

## Troubleshooting

### Issue: "Database connection failed"
- Check that `DATABASE_URL` is set in Vercel environment variables
- Ensure your database allows connections from Vercel's IP range
- Neon databases work out of the box with Vercel

### Issue: "Session not persisting"
- Verify `SESSION_SECRET` is set
- Check that the `user_sessions` table was created in your database
- Make sure cookies are enabled in your browser

### Issue: "Extension not connecting"
- Update `homepage_url` in `manifest.json`
- Reload the extension in Chrome
- Check browser console for CORS errors

### Issue: "Build fails"
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration is correct

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ Yes | Secret for session encryption |
| `STRIPE_SECRET_KEY` | ❌ No | Stripe API secret key |
| `STRIPE_PRICE_ID` | ❌ No | Stripe price ID for subscriptions |
| `STRIPE_WEBHOOK_SECRET` | ❌ No | Stripe webhook signing secret |
| `VITE_STRIPE_PUBLIC_KEY` | ❌ No | Stripe publishable key (frontend) |
| `NOTION_CLIENT_ID` | ❌ No | Notion OAuth client ID |
| `NOTION_CLIENT_SECRET` | ❌ No | Notion OAuth client secret |
| `GOOGLE_CLIENT_ID` | ❌ No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ No | Google OAuth client secret |
| `TRELLO_API_KEY` | ❌ No | Trello API key |

## Post-Deployment

1. Test your application at `https://your-app.vercel.app`
2. Create a test account
3. Test the browser extension save functionality
4. Monitor function execution in Vercel dashboard

## Continuous Deployment

Every push to your main branch will automatically deploy to Vercel!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

**🎉 Your SaveTo app is now live on Vercel's free tier!**
