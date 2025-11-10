import { Client } from '@notionhq/client';

export interface NotionOAuthTokens {
  access_token: string;
  workspace_id: string;
  workspace_name: string;
  workspace_icon?: string;
  bot_id: string;
  owner?: {
    type: string;
    user?: {
      id: string;
      name?: string;
      avatar_url?: string;
    };
  };
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

export function getNotionOAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('NOTION_OAUTH_CLIENT_ID not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    owner: 'user',
    redirect_uri: redirectUri,
  });

  if (state) {
    params.append('state', state);
  }

  return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
}

export async function exchangeNotionCode(code: string, redirectUri: string): Promise<NotionOAuthTokens> {
  const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
  const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Notion OAuth credentials not configured');
  }

  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encoded}`,
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Notion OAuth error:', error);
    throw new Error('Failed to exchange Notion authorization code');
  }

  const data = await response.json();
  return data as NotionOAuthTokens;
}

export function createNotionClient(accessToken: string): Client {
  return new Client({
    auth: accessToken,
  });
}

export async function findOrCreateDatabase(
  client: Client,
  databaseTitle: string = 'SaveTo Items'
): Promise<string> {
  try {
    const searchResponse = await client.search({
      query: databaseTitle,
      filter: {
        property: 'object',
        value: 'database',
      },
    });

    const existingDb = searchResponse.results.find(
      (result: any) => 
        result.object === 'database' && 
        result.title?.[0]?.plain_text === databaseTitle
    );

    if (existingDb) {
      return existingDb.id;
    }

    const parentPage = await client.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      page_size: 1,
    });

    let parentId: string;
    if (parentPage.results.length > 0) {
      parentId = parentPage.results[0].id;
    } else {
      const newPage = await client.pages.create({
        parent: { type: 'workspace', workspace: true } as any,
        properties: {
          title: {
            title: [
              {
                text: {
                  content: 'SaveTo Archive',
                },
              },
            ],
          },
        },
      });
      parentId = newPage.id;
    }

    const database = await client.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: databaseTitle,
          },
        },
      ],
      properties: {
        Title: {
          title: {},
        },
        Content: {
          rich_text: {},
        },
        Type: {
          select: {
            options: [
              { name: 'text', color: 'blue' },
              { name: 'article', color: 'green' },
              { name: 'quote', color: 'purple' },
              { name: 'link', color: 'orange' },
              { name: 'image', color: 'pink' },
              { name: 'note', color: 'gray' },
            ],
          },
        },
        'Source URL': {
          url: {},
        },
        Tags: {
          multi_select: {},
        },
        'Saved At': {
          date: {},
        },
      },
    });

    return database.id;
  } catch (error) {
    console.error('Error finding/creating Notion database:', error);
    throw error;
  }
}

export async function saveToNotion(
  accessToken: string,
  item: SavedItemData,
  databaseId?: string
): Promise<{ success: boolean; databaseId?: string; pageId?: string; error?: string }> {
  try {
    const client = createNotionClient(accessToken);

    let dbId = databaseId;
    if (!dbId) {
      dbId = await findOrCreateDatabase(client);
    }

    const contentPreview = item.content.length > 2000 
      ? item.content.substring(0, 2000) + '...' 
      : item.content;

    const properties: any = {
      Title: {
        title: [
          {
            text: {
              content: item.title.substring(0, 2000),
            },
          },
        ],
      },
      Content: {
        rich_text: [
          {
            text: {
              content: contentPreview,
            },
          },
        ],
      },
      Type: {
        select: {
          name: item.contentType,
        },
      },
      'Saved At': {
        date: {
          start: item.createdAt.toISOString(),
        },
      },
    };

    if (item.sourceUrl) {
      properties['Source URL'] = {
        url: item.sourceUrl,
      };
    }

    if (item.tags && item.tags.length > 0) {
      properties.Tags = {
        multi_select: item.tags.map(tag => ({ name: tag })),
      };
    }

    const page = await client.pages.create({
      parent: {
        type: 'database_id',
        database_id: dbId,
      },
      properties,
    });

    const children: any[] = [];
    
    if ((item.assetUrl || item.imageUrl) && item.savedItemId && item.baseUrl) {
      const assetDownloadUrl = `${item.baseUrl}/api/assets/${item.savedItemId}`;
      
      if (item.assetType === 'pdf' || item.contentType === 'pdf') {
        children.push({
          object: 'block',
          type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '📄' },
            rich_text: [{
              type: 'text',
              text: { 
                content: 'PDF Document - Click link below to download'
              }
            }],
            color: 'blue_background'
          }
        });
        
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { 
                content: 'Download PDF',
                link: { url: assetDownloadUrl }
              }
            }]
          }
        });
      } else if (item.contentType === 'image' || item.contentType === 'screenshot' || item.assetType === 'image') {
        children.push({
          object: 'block',
          type: 'image',
          image: {
            type: 'external',
            external: {
              url: assetDownloadUrl
            }
          }
        });
      }
      
      if (item.sourceUrl) {
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: 'Source: ' }
            }, {
              type: 'text',
              text: { 
                content: item.sourceUrl,
                link: { url: item.sourceUrl }
              }
            }]
          }
        });
      }
    }

    if (children.length > 0) {
      try {
        await client.blocks.children.append({
          block_id: page.id,
          children,
        });
      } catch (error) {
        console.error('Error appending blocks to Notion page:', error);
      }
    }

    return {
      success: true,
      databaseId: databaseId ? undefined : dbId,
      pageId: page.id,
    };
  } catch (error: any) {
    console.error('Error saving to Notion:', error);
    return {
      success: false,
      error: error.message || 'Failed to save to Notion',
    };
  }
}
