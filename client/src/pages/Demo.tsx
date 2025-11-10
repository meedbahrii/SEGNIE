import { SaveContextMenu } from '@/components/SaveContextMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Crop, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function Demo() {
  return (
    <SaveContextMenu>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" data-testid="button-back-home" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold" data-testid="text-demo-title">
                Right-Click Context Menu Demo
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-demo-description">
                Right-click anywhere on this page to access save options
              </p>
            </div>

            <Card className="border-2 border-dashed border-primary/50" data-testid="card-instructions">
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
                <CardDescription>
                  Try the different save options available in the context menu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Save Page</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Save the current page content to Notion, Google Sheets, or PDF
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Image className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Full Screenshot</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Capture a screenshot of the entire page and download it automatically
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crop className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Zone Selection</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select a specific area of the page to screenshot by dragging a rectangle
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card data-testid="card-notion">
                <CardHeader>
                  <CardTitle>Save to Notion</CardTitle>
                  <CardDescription>
                    Send content directly to your Notion workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Create new pages with captured content</li>
                    <li>Attach screenshots to pages</li>
                    <li>Organize with tags and properties</li>
                  </ul>
                </CardContent>
              </Card>

              <Card data-testid="card-google-sheets">
                <CardHeader>
                  <CardTitle>Save to Google Sheets</CardTitle>
                  <CardDescription>
                    Log content in your spreadsheets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Add rows with page information</li>
                    <li>Track URLs and timestamps</li>
                    <li>Build research databases</li>
                  </ul>
                </CardContent>
              </Card>

              <Card data-testid="card-pdf">
                <CardHeader>
                  <CardTitle>Save to PDF</CardTitle>
                  <CardDescription>
                    Generate PDF documents for offline access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Create high-quality PDF files</li>
                    <li>Preserve page layout and styling</li>
                    <li>Download automatically to your device</li>
                  </ul>
                </CardContent>
              </Card>

              <Card data-testid="card-screenshots">
                <CardHeader>
                  <CardTitle>Screenshot Options</CardTitle>
                  <CardDescription>
                    Capture exactly what you need
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Full page screenshots with scroll capture</li>
                    <li>Drag to select specific zones</li>
                    <li>High-resolution PNG downloads</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50" data-testid="card-setup">
              <CardHeader>
                <CardTitle>Setup Required</CardTitle>
                <CardDescription>
                  To use Notion and Google Sheets integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Note:</strong> The Notion and Google Sheets integrations require setup
                  to connect to your accounts. PDF downloads and screenshots work immediately.
                </p>
                <p className="text-muted-foreground">
                  Visit the Connections page to set up your integrations after authentication.
                </p>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Try It Now!</h2>
              <p className="text-muted-foreground">
                Right-click anywhere on this page to see the save menu in action
              </p>
            </div>
          </div>
        </div>
      </div>
    </SaveContextMenu>
  );
}
