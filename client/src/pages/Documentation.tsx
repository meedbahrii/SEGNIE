import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Settings, Zap, Link2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const guides = [
  {
    category: "Getting Started",
    icon: Zap,
    items: [
      {
        title: "Quick Start Guide",
        description: "Get up and running with Segnie in 5 minutes",
        link: "#quick-start"
      },
      {
        title: "Installing the Extension",
        description: "Step-by-step installation instructions for Chrome",
        link: "#install"
      },
      {
        title: "Creating Your Account",
        description: "Set up your Segnie account and preferences",
        link: "#account"
      }
    ]
  },
  {
    category: "Core Features",
    icon: BookOpen,
    items: [
      {
        title: "Saving Content",
        description: "Learn how to save articles, links, and images",
        link: "#saving"
      },
      {
        title: "Organizing with Tags",
        description: "Keep your content organized with tags and folders",
        link: "#organizing"
      },
      {
        title: "Advanced Search",
        description: "Find anything instantly with powerful search",
        link: "#search"
      },
      {
        title: "PDF Generation",
        description: "Save web pages as PDF documents",
        link: "#pdf"
      }
    ]
  },
  {
    category: "Integrations",
    icon: Link2,
    items: [
      {
        title: "Notion Integration",
        description: "Connect and sync your content with Notion",
        link: "#notion"
      },
      {
        title: "Google Sheets Integration",
        description: "Automatically save data to Google Sheets",
        link: "#sheets"
      },
      {
        title: "Managing Connections",
        description: "Add, remove, and configure your integrations",
        link: "#connections"
      }
    ]
  },
  {
    category: "Advanced Topics",
    icon: Settings,
    items: [
      {
        title: "Keyboard Shortcuts",
        description: "Speed up your workflow with shortcuts",
        link: "#shortcuts"
      },
      {
        title: "Browser Extension Settings",
        description: "Customize extension behavior and appearance",
        link: "#extension-settings"
      },
      {
        title: "Export & Backup",
        description: "Export your data and create backups",
        link: "#export"
      },
      {
        title: "Premium Features",
        description: "Unlock advanced features with Premium",
        link: "#premium"
      }
    ]
  }
];

const tutorials = [
  {
    title: "Video Tutorial: Getting Started",
    duration: "5 min",
    description: "Complete walkthrough of Segnie's core features"
  },
  {
    title: "Setting Up Multiple Integrations",
    duration: "8 min",
    description: "Learn to connect and configure Notion and Google Sheets"
  },
  {
    title: "Advanced Organization Tips",
    duration: "10 min",
    description: "Pro tips for organizing large collections"
  }
];

const faqs = [
  {
    question: "How do I save content from any website?",
    answer: "Click the Segnie extension icon in your browser toolbar, or right-click on any page and select 'Save to Segnie' from the context menu. You can save entire pages, selected text, or specific links."
  },
  {
    question: "Can I save to multiple destinations at once?",
    answer: "Yes! Premium users can save content to multiple destinations (like Notion AND Google Sheets) with a single click. Free users can save to one destination per action."
  },
  {
    question: "How do I organize my saved items?",
    answer: "Use tags to categorize your content. You can add multiple tags to each item and filter by tags in your dashboard. Premium users also have access to folders and advanced search."
  },
  {
    question: "What browsers are supported?",
    answer: "Currently, Segnie supports Google Chrome and all Chromium-based browsers (Edge, Brave, Opera, etc.). Firefox support is coming soon."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. All data is encrypted in transit and at rest. We use industry-standard security practices and never sell your data. See our Security page for details."
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about using Segnie
            </p>
          </div>

          <Tabs defaultValue="guides" className="space-y-8">
            <TabsList data-testid="tabs-docs-sections">
              <TabsTrigger value="guides" data-testid="tab-guides">Guides</TabsTrigger>
              <TabsTrigger value="tutorials" data-testid="tab-tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="faq" data-testid="tab-faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="space-y-8">
              {guides.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <section.icon className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">{section.category}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="hover-elevate" data-testid={`card-guide-${sectionIndex}-${itemIndex}`}>
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="ghost" size="sm" data-testid={`button-read-guide-${sectionIndex}-${itemIndex}`}>
                            <FileText className="w-4 h-4 mr-2" />
                            Read Guide
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Video Tutorials</h2>
                <p className="text-muted-foreground">
                  Watch step-by-step video guides to master Segnie
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover-elevate" data-testid={`card-tutorial-${index}`}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <Download className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{tutorial.title}</h3>
                          <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                      </div>
                      <Button variant="outline" className="w-full" data-testid={`button-watch-tutorial-${index}`}>
                        Watch Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} data-testid={`card-faq-${index}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center space-y-4">
                  <h3 className="text-xl font-semibold">Still have questions?</h3>
                  <p className="text-muted-foreground">
                    Our support team is here to help
                  </p>
                  <Button data-testid="button-contact-support">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Need Developer Documentation?</h3>
                  <p className="text-muted-foreground">
                    Check out our comprehensive API documentation
                  </p>
                </div>
                <Button size="lg" variant="outline" data-testid="button-view-api-docs">
                  View API Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
