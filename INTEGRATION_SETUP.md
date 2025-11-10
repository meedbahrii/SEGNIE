# Integration Setup Guide

This document explains how integrations work in SaveTo and what's needed to enable them.

## Overview

SaveTo supports saving content to multiple destinations:
- ✅ **Google Sheets** - Fully working (uses Replit connector)
- ⚠️ **Notion** - OAuth flow exists, but actual data sync not implemented

## Google Sheets Integration (Working)

### Status: ✅ Fully Functional

Google Sheets integration uses **Replit's Google Sheets connector**, which means:
- No manual OAuth app creation needed
- No client ID/secret required
- Replit handles all authentication and token refresh automatically

### How It Works

1. User clicks "Connect Google Sheets" in the Connections page
2. Replit connector handles OAuth flow
3. When user saves content with "google-sheets" destination selected:
   - Backend calls `/api/saved-items` with `destinations: { 'google-sheets': { saved: true } }`
   - Server checks if Google Sheets is in destinations
   - Server uses `server/integrations/google-sheets.ts` to push data
   - If no spreadsheet exists, creates "SaveTo Items" spreadsheet
   - Appends row with: Timestamp, Title, Content, Type, Source URL, Tags

### Files Involved

- `server/integrations/google-sheets.ts` - Google Sheets API client and sync logic
- `server/routes.ts` (lines 175-196) - Calls `saveToGoogleSheets()` when saving items
- Connection uses Replit's managed credentials

### Testing

To test Google Sheets integration:
1. Make sure Google Sheets connector is set up in Replit
2. Register/login to SaveTo
3. Go to Connections page and click "Connect Google Sheets"
4. Authorize access
5. Save content from extension or dashboard
6. Check your Google Sheets - you should see a new "SaveTo Items" spreadsheet

## Notion Integration (Partial)

### Status: ⚠️ OAuth Working, Data Sync Not Implemented

### What's Working
- OAuth connection flow (`/api/oauth/notion/auth` and `/api/oauth/notion/callback`)
- Storing Notion credentials in integration_connections table

### What's Missing
- Actual Notion API integration to create pages
- Notion SDK setup (`@notionhq/client` package is installed but not used)

### To Complete Notion Integration

You would need to:

1. **Use Replit Notion connector** (recommended) or create manual OAuth app at https://www.notion.so/my-integrations

2. **Implement data sync in `server/routes.ts`**:
```typescript
import { Client as NotionClient } from '@notionhq/client';

// In POST /api/saved-items endpoint, after saving item:
if (destinations['notion']) {
  const notionConnection = await storage.getIntegrationConnectionByType(userId, 'notion');
  if (notionConnection) {
    const notion = new NotionClient({ 
      auth: notionConnection.credentials.access_token 
    });
    
    // Create page in Notion database
    await notion.pages.create({
      parent: { database_id: notionConnection.credentials.database_id },
      properties: {
        Title: { title: [{ text: { content: item.title } }] },
        Content: { rich_text: [{ text: { content: item.content } }] },
        Type: { select: { name: item.contentType } },
        // ... more properties
      }
    });
  }
}
```

3. **User needs to select a Notion database** after OAuth (store database_id)

## Environment Variables Required

### Currently Set
- `STRIPE_SECRET_KEY` - For payment processing
- Replit connector handles Google Sheets automatically

### Missing (Optional)
- `VITE_STRIPE_PUBLIC_KEY` - For frontend Stripe integration
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhook verification
- `NOTION_CLIENT_ID` - If not using Replit connector
- `NOTION_CLIENT_SECRET` - If not using Replit connector

## Summary

**Google Sheets**: ✅ Fully working - content syncs automatically
**Notion**: ⚠️ Can connect, but doesn't sync data yet

To enable Notion data syncing, implement the API calls as shown above after users save content.
