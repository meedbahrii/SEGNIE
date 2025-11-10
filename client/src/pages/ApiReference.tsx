import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Globe, Key, Database, Zap } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/items",
    description: "Retrieve all saved items for the authenticated user",
    auth: true,
    params: [
      { name: "page", type: "number", description: "Page number for pagination" },
      { name: "limit", type: "number", description: "Items per page (max 100)" }
    ],
    response: `{
  "items": [
    {
      "id": "123",
      "title": "Example Item",
      "url": "https://example.com",
      "notes": "My notes",
      "tags": ["work", "reference"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}`
  },
  {
    method: "POST",
    path: "/api/items",
    description: "Create a new saved item",
    auth: true,
    body: `{
  "title": "Article Title",
  "url": "https://example.com/article",
  "notes": "Optional notes",
  "tags": ["tag1", "tag2"]
}`,
    response: `{
  "id": "124",
  "title": "Article Title",
  "url": "https://example.com/article",
  "notes": "Optional notes",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-01T00:00:00Z"
}`
  },
  {
    method: "GET",
    path: "/api/items/:id",
    description: "Get a specific item by ID",
    auth: true,
    response: `{
  "id": "123",
  "title": "Example Item",
  "url": "https://example.com",
  "notes": "My notes",
  "tags": ["work"],
  "createdAt": "2024-01-01T00:00:00Z"
}`
  },
  {
    method: "PATCH",
    path: "/api/items/:id",
    description: "Update an existing item",
    auth: true,
    body: `{
  "title": "Updated Title",
  "notes": "Updated notes",
  "tags": ["updated"]
}`,
    response: `{
  "id": "123",
  "title": "Updated Title",
  "notes": "Updated notes",
  "tags": ["updated"]
}`
  },
  {
    method: "DELETE",
    path: "/api/items/:id",
    description: "Delete an item",
    auth: true,
    response: `{
  "success": true,
  "message": "Item deleted successfully"
}`
  }
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  POST: "bg-green-500/10 text-green-500 border-green-500/20",
  PATCH: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  DELETE: "bg-red-500/10 text-red-500 border-red-500/20"
};

export default function ApiReference() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">API Reference</h1>
            <p className="text-lg text-muted-foreground">
              Complete API documentation for integrating with Segnie
            </p>
          </div>

          <Tabs defaultValue="getting-started" className="space-y-8">
            <TabsList data-testid="tabs-api-sections">
              <TabsTrigger value="getting-started" data-testid="tab-getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="authentication" data-testid="tab-authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints" data-testid="tab-endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="webhooks" data-testid="tab-webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <CardTitle>Quick Start</CardTitle>
                  </div>
                  <CardDescription>Get up and running with the Segnie API in minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Base URL</h3>
                    <code className="block bg-muted px-4 py-3 rounded-md text-sm" data-testid="text-base-url">
                      https://api.segnie.com/v1
                    </code>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Rate Limits</h3>
                    <p className="text-sm text-muted-foreground">
                      • Free tier: 100 requests/hour<br />
                      • Pro tier: 1,000 requests/hour<br />
                      • Enterprise: Custom limits
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Example Request</h3>
                    <pre className="bg-muted px-4 py-3 rounded-md text-sm overflow-x-auto" data-testid="code-example-request">
{`curl -X GET https://api.segnie.com/v1/items \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Key className="w-6 h-6 text-primary" />
                    <CardTitle>API Authentication</CardTitle>
                  </div>
                  <CardDescription>Secure your API requests with bearer token authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Getting Your API Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate to Settings → API Keys in your dashboard to generate a new API key.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Using Your API Key</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Include your API key in the Authorization header of every request:
                    </p>
                    <code className="block bg-muted px-4 py-3 rounded-md text-sm" data-testid="code-auth-header">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4">
                    <p className="text-sm font-semibold mb-1">Security Best Practices</p>
                    <p className="text-sm text-muted-foreground">
                      Never expose your API key in client-side code or public repositories. 
                      Always make API requests from your backend server.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={methodColors[endpoint.method]} data-testid={`badge-method-${index}`}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono" data-testid={`text-path-${index}`}>{endpoint.path}</code>
                      {endpoint.auth && (
                        <Badge variant="outline" data-testid={`badge-auth-${index}`}>
                          <Key className="w-3 h-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {endpoint.params && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Query Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.params.map((param, i) => (
                            <div key={i} className="text-sm">
                              <code className="text-primary">{param.name}</code>
                              <span className="text-muted-foreground"> ({param.type}) - {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.body && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Request Body</h4>
                        <pre className="bg-muted px-4 py-3 rounded-md text-sm overflow-x-auto" data-testid={`code-body-${index}`}>
                          {endpoint.body}
                        </pre>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Response</h4>
                      <pre className="bg-muted px-4 py-3 rounded-md text-sm overflow-x-auto" data-testid={`code-response-${index}`}>
                        {endpoint.response}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    <CardTitle>Webhooks</CardTitle>
                  </div>
                  <CardDescription>Receive real-time notifications about events in your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Available Events</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><code className="text-primary">item.created</code> - Triggered when a new item is saved</li>
                      <li><code className="text-primary">item.updated</code> - Triggered when an item is modified</li>
                      <li><code className="text-primary">item.deleted</code> - Triggered when an item is deleted</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Webhook Payload</h3>
                    <pre className="bg-muted px-4 py-3 rounded-md text-sm overflow-x-auto" data-testid="code-webhook-payload">
{`{
  "event": "item.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "123",
    "title": "New Item",
    "url": "https://example.com"
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
