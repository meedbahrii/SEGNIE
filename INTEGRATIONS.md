# SaveTo Integrations Guide

## Overview

SaveTo supports saving content to multiple destinations. This guide explains how each integration works and how to set them up.

## Supported Integrations

### 1. Google Sheets

**Status**: Available

**What it does**: Saves content as rows in a Google Sheet, with columns for title, content, date, source URL, and tags.

**Setup**:
1. Use the Replit Google Sheets integration to connect your account
2. The integration handles OAuth authentication automatically
3. Content is saved to a sheet named "SaveTo Items" (created automatically)

**Data Structure**:
```
| Timestamp | Title | Content | Type | Source URL | Tags | Destinations |
```

**Implementation Notes**:
- Uses Google Sheets API v4
- Requires `spreadsheets` scope
- Creates new sheet on first use
- Supports batch operations for premium users

### 2. Notion

**Status**: Available

**What it does**: Creates new pages in a Notion database with your saved content.

**Setup**:
1. Use the Replit Notion integration to connect your account
2. Grant access to a Notion database or workspace
3. Content is saved as database entries with properties

**Data Structure**:
- Title (title property)
- Content (rich text)
- Type (select)
- Source (URL)
- Tags (multi-select)
- Created At (date)

**Implementation Notes**:
- Uses Notion API v1
- Requires database integration connection
- Supports rich text formatting
- Preserves markdown when possible

### 3. Trello

**Status**: Available

**What it does**: Creates cards in a Trello board with your saved content.

**Setup**:
1. Connect your Trello account via OAuth
2. Select a board and list for saved items
3. Cards are created with title, description, and labels

**Data Structure**:
- Card Name: Item title
- Description: Content + source URL
- Labels: Content type and custom tags
- Due Date: Optional

**Implementation Notes**:
- Uses Trello REST API
- Supports attachments for images
- Can create custom labels
- Supports multiple boards per account

### 4. PDF Export

**Status**: Available

**What it does**: Generates a formatted PDF document with your saved content.

**Setup**:
- No setup required
- PDFs are generated locally and can be downloaded

**Features**:
- Professional formatting
- Includes metadata (date, source, tags)
- Supports images
- Table of contents for multiple items
- Customizable templates

**Implementation Notes**:
- Uses PDFKit or similar library
- Client-side generation for privacy
- Supports batch export

## Premium Features

Premium users can:
- Save to **multiple destinations simultaneously**
- Connect **multiple accounts per service**
- Use **advanced filters and organization**
- Access **priority support**

## API Integration Examples

### Google Sheets (Backend Implementation)

```typescript
import { google } from 'googleapis';

async function saveToGoogleSheets(item: SavedItem, credentials: any) {
  const sheets = google.sheets({ version: 'v4', auth: credentials });
  
  const values = [[
    new Date(item.createdAt).toISOString(),
    item.title,
    item.content,
    item.contentType,
    item.sourceUrl || '',
    item.tags?.join(', ') || '',
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    range: 'SaveTo Items!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}
```

### Notion (Backend Implementation)

```typescript
import { Client } from '@notionhq/client';

async function saveToNotion(item: SavedItem, credentials: any) {
  const notion = new Client({ auth: credentials.token });
  
  await notion.pages.create({
    parent: { database_id: credentials.databaseId },
    properties: {
      Title: { title: [{ text: { content: item.title } }] },
      Type: { select: { name: item.contentType } },
      Source: { url: item.sourceUrl },
      Tags: { multi_select: item.tags?.map(tag => ({ name: tag })) || [] },
    },
    children: [{
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: item.content } }],
      },
    }],
  });
}
```

## Using Replit Integrations

SaveTo is designed to work seamlessly with Replit's built-in integrations:

1. **Google Sheets Integration**: Use `connector:google-sheets` or search for Google Sheets in integrations
2. **Notion Integration**: Use `connector:notion` for OAuth setup
3. **Database**: Uses Replit's PostgreSQL for data storage

## Development Notes

- All credentials are stored encrypted in the database
- OAuth tokens are refreshed automatically
- Failed saves are retried with exponential backoff
- Users can disconnect integrations at any time

## Future Integrations

Coming soon:
- Airtable
- Evernote
- OneNote
- Slack
- Discord
- Email
