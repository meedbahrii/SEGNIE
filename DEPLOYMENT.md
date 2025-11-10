# SaveTo - Deployment Guide

## What You Need to Complete Before Publishing

### 1. Database Setup ✅
- PostgreSQL database has been created and configured
- Database schema is ready (run `npm run db:push` after first deployment)
- Storage layer is configured to use PostgreSQL when DATABASE_URL is available

### 2. Stripe Integration ✅
- Stripe API keys have been added to secrets
- Subscription payment flow is implemented
- Premium upgrade feature is ready

### 3. Extension Configuration 📝
**IMPORTANT: Update before publishing the extension**

Edit `extension/manifest.json` and replace:
```json
"homepage_url": "https://YOUR-REPL-NAME.replit.app"
```

With your actual Replit app URL (you'll get this after publishing).

### 4. OAuth Integration Setup (Optional) 🔧
The app currently stores OAuth credentials but doesn't push content to external services. To enable actual integration with Notion, Google Sheets, and Trello, you'll need to:

1. **Create OAuth Apps:**
   - **Notion**: https://www.notion.so/my-integrations
   - **Google Sheets**: https://console.cloud.google.com/
   - **Trello**: https://trello.com/power-ups/admin

2. **Add these environment secrets:**
   - `NOTION_CLIENT_ID`
   - `NOTION_CLIENT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `TRELLO_API_KEY`
   - `TRELLO_API_SECRET`

3. **Set OAuth callback URLs** in each service:
   - Notion: `https://YOUR-APP-URL/api/oauth/notion/callback`
   - Google: `https://YOUR-APP-URL/api/oauth/google-sheets/callback`
   - Trello: `https://YOUR-APP-URL/api/oauth/trello/callback`

> **Note**: The current implementation focuses on authentication only. Users can save content locally, but it won't automatically sync to external services until you implement the API integration logic.

---

## Publishing Your App to Replit

### Step 1: Publish the Web Application

1. Click the **"Publish"** button in your Replit workspace
2. Configure your deployment settings:
   - Choose a custom domain (optional)
   - Set up environment variables if needed
3. Wait for the deployment to complete
4. Copy your published URL (e.g., `https://your-app.replit.app`)

### Step 2: Set Up Stripe Webhook (REQUIRED for Premium Features)

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://YOUR-APP-URL/api/webhook/stripe`
4. Select these events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Click "Reveal" on the webhook signing secret
7. Add the signing secret to your Replit Secrets as `STRIPE_WEBHOOK_SECRET`

**⚠️ CRITICAL:** The webhook secret is REQUIRED - the endpoint will reject all webhooks without it for security. Without proper webhook configuration, premium subscriptions won't activate automatically.

### Step 3: Create Stripe Price ID (Optional but Recommended)

Instead of creating a new price on every subscription request, create a reusable price:

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Name: "SaveTo Premium"
4. Price: $9.99 USD, Recurring: Monthly
5. Save the product
6. Copy the Price ID (starts with `price_`)
7. Add it to Replit Secrets as `STRIPE_PRICE_ID`

### Step 4: Run Database Migration

After your first deployment, the DATABASE_URL will be available. Run:

```bash
npm run db:push
```

This will create all the necessary database tables.

### Step 5: Configure the Chrome Extension

1. Open `extension/manifest.json`
2. Replace `https://YOUR-REPL-NAME.replit.app` with your actual deployed URL
3. Save the file

### Step 6: Load the Extension in Chrome (Testing)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension/` folder from this project
5. The extension should now appear in your extensions list

### Step 7: Test the Complete Flow

1. **Sign Up**: Use the extension to create a new account
2. **Connect Integrations**: Go to the Connections page and authenticate with services
3. **Save Content**: Try saving a webpage using the extension
4. **Upgrade to Premium**: Test the Stripe subscription flow
5. **Verify**: Check the dashboard to see your saved content

---

## Publishing the Extension to Chrome Web Store (Optional)

To make your extension available to everyone:

1. **Create a Chrome Web Store Developer Account**
   - Go to https://chrome.google.com/webstore/devconsole
   - Pay the one-time $5 registration fee

2. **Prepare Extension Package**
   ```bash
   cd extension
   zip -r saveto-extension.zip *
   ```

3. **Upload to Chrome Web Store**
   - Click "New Item" in the developer console
   - Upload `saveto-extension.zip`
   - Fill in the store listing details:
     - Screenshots
     - Description
     - Privacy policy
     - Promotional images

4. **Submit for Review**
   - Chrome will review your extension (usually 1-3 days)
   - Once approved, it will be live on the Chrome Web Store!

---

## Environment Variables Reference

### Required for Basic Operation
- `DATABASE_URL` - Automatically provided by Replit ✅
- `STRIPE_SECRET_KEY` - Your Stripe secret key ✅
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key ✅

### Required for Production (Premium Features)
- `STRIPE_WEBHOOK_SECRET` - Your webhook signing secret from Stripe dashboard 📝
- `STRIPE_PRICE_ID` - Your reusable Stripe Price ID (optional but recommended) 📝

### Optional (for OAuth integrations)
- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `TRELLO_API_KEY`
- `TRELLO_API_SECRET`

---

## What Works Right Now

✅ **User Authentication** - Sign up, login, logout
✅ **Save Limit System** - Free users get 3 saves, premium is unlimited
✅ **Stripe Subscriptions** - Users can upgrade to premium ($9.99/month)
✅ **Browser Extension** - Save content via popup or right-click menu
✅ **Screenshots** - Full page and zone selection screenshots
✅ **PDF Export** - Save pages as PDF
✅ **Dashboard** - View and manage all saved content
✅ **OAuth Flow** - Users can connect Notion, Google Sheets, and Trello accounts

## What Needs Implementation (Future)

⏳ **API Integration** - Actually push saved content to Notion/Google Sheets/Trello (OAuth connection currently stores credentials but doesn't sync data)
⏳ **Rate Limiting** - Add rate limiting for API endpoints
⏳ **CSRF Protection** - Add CSRF token validation for state-changing requests
⏳ **Security Headers** - Add Helmet.js for security headers

---

## Support

If you encounter any issues during deployment:
1. Check the Replit logs for error messages
2. Verify all environment variables are set correctly
3. Ensure DATABASE_URL is available before running db:push
4. Test with Stripe test mode before going live

Good luck with your launch! 🚀
