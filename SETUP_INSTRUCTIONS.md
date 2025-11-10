# Segnie Project - Setup Instructions

## ✅ Database Already Configured!

**Good news**: This project is already set up with a Neon PostgreSQL database! All your data will be persisted automatically.

## How to Download This Project

1. **In Replit**: Click on the three dots menu (⋮) in the file explorer
2. Select **"Download as zip"** - this will download the entire project

## Local Setup Guide

### Prerequisites
- Node.js (v20 or higher) - Download from [nodejs.org](https://nodejs.org/)
- Git (optional)

### Step 1: Extract and Install Dependencies

```bash
# Extract the downloaded zip file
# Navigate to the project directory
cd segnie-project

# Install all dependencies
npm install
```

### Step 2: Environment Variables Setup

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```env
# ===== REQUIRED CHANGES =====

# Session Secret (REQUIRED - generate a random string)
SESSION_SECRET=your-random-secret-key-here-change-in-production

# Database - You have 2 options:
# Option A: Use Neon (recommended - already set up in Replit)
# Get your Neon connection string from: https://console.neon.tech
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb

# Option B: Leave empty to use in-memory storage (data lost on restart)
# DATABASE_URL=

# ===== KEEP THESE (from your Replit setup) =====

# OAuth - Notion Integration
NOTION_OAUTH_CLIENT_ID=your-notion-client-id
NOTION_OAUTH_CLIENT_SECRET=your-notion-client-secret
NOTION_REDIRECT_URI=http://localhost:5000/api/oauth/notion/callback

# OAuth - Trello Integration  
TRELLO_API_KEY=your-trello-api-key
TRELLO_TOKEN=GET_FROM_TRELLO_APP_KEY_PAGE
TRELLO_REDIRECT_URI=http://localhost:5000/api/oauth/trello/callback

# ===== OPTIONAL =====

# OAuth - Google Sheets Integration
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GOOGLE_REDIRECT_URI=http://localhost:5000/api/oauth/google/callback

# Stripe Payment Processing (if using premium features)
# STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
# STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
# STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
# STRIPE_PRICE_ID=price_your_price_id_here

# Application Configuration
NODE_ENV=development
PORT=5000
```

### Step 3: Generate SESSION_SECRET

Use Node.js to generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `SESSION_SECRET` in `.env`

### Step 4: Get Your API Keys

#### Notion OAuth Setup
Your Notion credentials (should be set in your `.env`):
- Client ID: Add your actual Notion client ID to `.env`
- Client Secret: Add your actual Notion client secret to `.env`

**Important:** Add this redirect URI to your Notion integration:
1. Go to https://www.notion.so/my-integrations
2. Find your integration
3. Add `http://localhost:5000/api/oauth/notion/callback` to redirect URIs

#### Trello Setup
Your Trello API key (from Replit): `a01cfc51a656d6ea1730bda7c18d6be3`

**Get your token:**
1. Go to https://trello.com/app-key
2. Click "generate a token"  
3. Add the token to your `.env` file as `TRELLO_TOKEN`

#### Database Setup

**Option A: Use Neon (Recommended)**

Since your Replit project already uses Neon, you can continue using the same database:

1. Go to https://console.neon.tech
2. Find your existing project or create a new one
3. Copy the connection string
4. Paste in `.env` as `DATABASE_URL`

**Option B: Use In-Memory Storage**

Just leave `DATABASE_URL` commented out or empty. Data will be lost on restart.

**Option C: Use Local PostgreSQL**

Install PostgreSQL locally and create a database, then use:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/saveto
```

### Step 5: Push Database Schema (if using a database)

If you set `DATABASE_URL`, run this to create tables:

```bash
npm run db:push
```

### Step 6: Run the Application

```bash
# Development mode (hot reload)
npm run dev

# The application will be available at:
# http://localhost:5000
```

### Step 7: Build for Production (Optional)

```bash
# Build the application
npm run build

# Run production server
npm start
```

## What You MUST Change

1. ✅ **SESSION_SECRET** - Generate a new random string (32+ characters)
2. ✅ **TRELLO_TOKEN** - Get from https://trello.com/app-key
3. ⚠️ **DATABASE_URL** - Set up Neon or leave empty for in-memory
4. ⚠️ **Notion Redirect URI** - Add localhost URL to your Notion integration settings

## Project Structure

```
saveto-project/
├── client/               # Frontend React application
│   └── src/
│       ├── components/   # Reusable UI components  
│       ├── pages/        # Application pages
│       └── lib/          # Utilities and configs
├── server/               # Backend Express server
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage (auto-switches DB/memory)
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Data models (Drizzle + Zod)
├── extension/            # Chrome extension
├── .env                  # Environment variables (create this!)
├── .env.example          # Environment template
├── package.json          # Dependencies
└── vite.config.ts        # Vite configuration
```

## Troubleshooting

### Port Already in Use
If you see `EADDRINUSE: address already in use 0.0.0.0:5000`:
```bash
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**"DATABASE_URL is not set"**
- Add `DATABASE_URL` to your `.env` file
- OR leave it empty to use in-memory storage

**Database connection errors**
- Verify `DATABASE_URL` format is correct
- Check that Neon database is active
- Run `npm run db:push` to create tables

**Tables don't exist**
- Run `npm run db:push` after setting DATABASE_URL

### OAuth Redirect Issues
Ensure redirect URIs match in your `.env` and in:
- Notion: https://www.notion.so/my-integrations
- Trello: https://trello.com/app-key  
- Google: https://console.cloud.google.com/

## Quick Start Checklist

- [ ] Download and extract the zip file
- [ ] Run `npm install`
- [ ] Create `.env` from `.env.example`
- [ ] Generate and add `SESSION_SECRET`
- [ ] Add `TRELLO_TOKEN`
- [ ] (Optional) Set `DATABASE_URL` for Neon
- [ ] (Optional) Run `npm run db:push` if using database
- [ ] Add `http://localhost:5000/api/oauth/notion/callback` to Notion integration
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5000

## What's Next?

Once the server is running:
1. Open http://localhost:5000
2. Create an account or log in
3. Connect your integrations (Notion, Trello, Google Sheets)
4. Start saving content!

## Chrome Extension (Optional)

The browser extension files are in the `extension/` folder. To use it:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder from this project
5. The extension will connect to `http://localhost:5000/api`

## Need Help?

Common issues:
1. **Session Secret**: Must be at least 32 random characters
2. **Notion Integration**: Share pages with your integration in Notion
3. **Trello Token**: Generate new if expired
4. **Database**: Start with in-memory, add PostgreSQL later
