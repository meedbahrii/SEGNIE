import { google } from 'googleapis';

async function getAccessTokenFromReplitConnector() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

export async function getGoogleSheetClient(credentials: any) {
  let accessToken: string;

  if (credentials?.connector === 'replit') {
    accessToken = await getAccessTokenFromReplitConnector();
  } else if (credentials?.access_token) {
    accessToken = credentials.access_token;
  } else {
    throw new Error('Invalid Google Sheets credentials');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export interface SavedItemData {
  title: string;
  content: string;
  contentType: string;
  sourceUrl: string | null;
  tags: string[] | null;
  createdAt: Date;
  imageUrl?: string | null;
  assetUrl?: string | null;
  assetType?: string | null;
  savedItemId?: string;
  baseUrl?: string;
}

export async function saveToGoogleSheets(
  item: SavedItemData,
  credentials: any,
  spreadsheetId?: string
): Promise<{ success: boolean; spreadsheetId?: string }> {
  try {
    const sheets = await getGoogleSheetClient(credentials);
    let createdNew = false;
    
    if (!spreadsheetId) {
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: 'SaveTo Items',
          },
          sheets: [{
            properties: {
              title: 'Saved Content',
            },
            data: [{
              rowData: [{
                values: [
                  { userEnteredValue: { stringValue: 'Timestamp' } },
                  { userEnteredValue: { stringValue: 'Title' } },
                  { userEnteredValue: { stringValue: 'Content' } },
                  { userEnteredValue: { stringValue: 'Type' } },
                  { userEnteredValue: { stringValue: 'Source URL' } },
                  { userEnteredValue: { stringValue: 'Tags' } },
                  { userEnteredValue: { stringValue: 'Asset Note' } },
                  { userEnteredValue: { stringValue: 'Asset Type' } },
                  { userEnteredValue: { stringValue: 'Download URL' } },
                ]
              }]
            }]
          }]
        }
      });
      
      spreadsheetId = response.data.spreadsheetId!;
      createdNew = true;
      console.log('Created new spreadsheet:', spreadsheetId);
    }
    
    const assetInfo = item.assetUrl || item.imageUrl;
    let assetNote = '';
    let assetDownloadUrl = '';
    
    if (assetInfo && item.savedItemId && item.baseUrl) {
      assetDownloadUrl = `${item.baseUrl}/api/assets/${item.savedItemId}`;
      
      if (item.assetType === 'pdf' || item.contentType === 'pdf') {
        assetNote = '📄 PDF';
      } else if (item.contentType === 'screenshot' || item.assetType === 'image') {
        assetNote = '📸 Screenshot';
      }
    }

    const values = [[
      new Date(item.createdAt).toISOString(),
      item.title,
      item.content,
      item.contentType,
      item.sourceUrl || '',
      item.tags?.join(', ') || '',
      assetNote,
      item.assetType || (item.imageUrl ? 'image' : ''),
      assetDownloadUrl,
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Saved Content!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return { success: true, spreadsheetId: createdNew ? spreadsheetId : undefined };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return { success: false };
  }
}
