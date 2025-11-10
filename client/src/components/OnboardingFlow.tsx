import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Check, Download, Puzzle, Zap, FolderSearch, FileText, BookOpen, FileSpreadsheet } from "lucide-react";
import { SiGooglesheets, SiNotion } from "react-icons/si";
import { useLocation } from "wouter";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const steps = [
    {
      title: "Welcome to Segnie!",
      description: "Let's get you started with saving content effortlessly",
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Segnie helps you save content from anywhere on the web directly to your favorite apps - Google Sheets, Notion, or PDF.
          </p>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">One-Click Saves</p>
                <p className="text-sm text-muted-foreground">Right-click any content and save instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Multi-App Support</p>
                <p className="text-sm text-muted-foreground">Save to multiple destinations at once</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              <Check className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Smart Organization</p>
                <p className="text-sm text-muted-foreground">Find anything in your unified dashboard</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Install the Browser Extension",
      description: "Get started by installing our Chrome extension",
      icon: Puzzle,
      content: (
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-2">Step 1: Install Extension</Badge>
          <p className="text-muted-foreground">
            The browser extension lets you save content from any webpage with a single click.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <p className="text-sm">Click the "Download Extension" button below</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <p className="text-sm">Extract the ZIP file to a folder on your computer</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <p className="text-sm">Open Chrome and go to <code className="px-2 py-1 bg-muted rounded text-xs">chrome://extensions/</code></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <p className="text-sm">Enable "Developer mode" and click "Load unpacked"</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <p className="text-sm">Select the extracted extension folder</p>
            </div>
          </div>
          <Button className="w-full" size="lg" data-testid="button-download-extension">
            <Download className="w-4 h-4 mr-2" />
            Download Extension
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Coming soon to Chrome Web Store
          </p>
        </div>
      ),
    },
    {
      title: "Connect Your Apps",
      description: "Link your Google Sheets and Notion accounts",
      icon: FolderSearch,
      content: (
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-2">Step 2: Setup Integrations</Badge>
          <p className="text-muted-foreground">
            Connect your favorite productivity apps to start saving content directly to them.
          </p>
          <div className="grid gap-3">
            <div className="p-4 rounded-lg border bg-card hover-elevate transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <SiGooglesheets className="w-4 h-4 text-green-700 dark:text-green-300" />
                  </div>
                  <span className="font-medium">Google Sheets</span>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Save content as organized spreadsheet rows</p>
            </div>
            <div className="p-4 rounded-lg border bg-card hover-elevate transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <SiNotion className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Notion</span>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Create notes in your Notion workspace</p>
            </div>
            <div className="p-4 rounded-lg border bg-card hover-elevate transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-700 dark:text-red-300" />
                  </div>
                  <span className="font-medium">PDF Export</span>
                </div>
                <Badge variant="secondary">Always Available</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Generate PDFs locally, no setup needed</p>
            </div>
          </div>
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={() => setLocation("/connections")}
            data-testid="button-setup-connections"
          >
            Setup Connections Now
          </Button>
        </div>
      ),
    },
    {
      title: "You're All Set!",
      description: "Start saving content from anywhere",
      icon: Check,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <p className="text-center font-medium">
                Welcome aboard! You're ready to save content like a pro.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Quick Start Tips:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Use Quick Save</p>
                  <p className="text-xs text-muted-foreground">Press Ctrl+Shift+S (Cmd+Shift+S on Mac) to quick save</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <FolderSearch className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Access Your Dashboard</p>
                  <p className="text-xs text-muted-foreground">View all saved items in one organized place</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Free Tier Includes</p>
                  <p className="text-xs text-muted-foreground">50 saves/month, PDF generation, and basic features</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setLocation("/subscribe")}
              data-testid="button-view-plans"
            >
              View Premium Plans
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setLocation("/dashboard");
                onComplete();
              }}
              data-testid="button-go-dashboard"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-2 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onComplete}
            data-testid="button-close-onboarding"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CurrentStepIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl" data-testid="text-onboarding-title">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription data-testid="text-onboarding-description">
                {steps[currentStep].description}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-all ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
                data-testid={`progress-step-${index}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div data-testid="onboarding-content">{steps[currentStep].content}</div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              data-testid="button-previous"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground" data-testid="text-step-counter">
              Step {currentStep + 1} of {steps.length}
            </span>
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                data-testid="button-next"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setLocation("/dashboard");
                  onComplete();
                }}
                data-testid="button-finish"
              >
                Finish
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
