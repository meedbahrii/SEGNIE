import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chrome, Play, Sparkles, ArrowRight, Star, Check } from "lucide-react";
import { useLocation } from "wouter";

export default function Hero() {
  const [, setLocation] = useLocation();

  const handleAddToChrome = () => {
    setLocation("/register");
  };

  const handleWatchDemo = () => {
    const element = document.querySelector("#features");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40"></div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(262_83%_58%/0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(270_75%_60%/0.06),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-32 lg:py-40">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="space-y-10">
            <div className="inline-flex">
              <Badge 
                variant="secondary" 
                className="px-5 py-2 text-sm font-medium border shadow-sm hover-elevate" 
                data-testid="badge-new-feature"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Auto-sync with Notion & Google Sheets
              </Badge>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05]" data-testid="text-hero-title">
                Save Anything,
                <br />
                <span className="text-gradient">
                  Anywhere,
                </span>
                <br />
                Instantly
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto" data-testid="text-hero-subtitle">
                The browser extension that saves web content to Google Sheets, Notion, and PDF with just one click. Never lose track of important content again.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-10 shadow-lg hover:shadow-xl transition-all group" 
                onClick={handleAddToChrome} 
                data-testid="button-add-to-chrome"
              >
                <Chrome className="w-5 h-5 mr-2.5" />
                Add to Chrome - It's Free
                <ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10" 
                onClick={handleWatchDemo} 
                data-testid="button-watch-demo"
              >
                <Play className="w-5 h-5 mr-2.5" />
                See How It Works
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 justify-center">
              <div className="flex -space-x-3 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 border-[3px] border-background flex items-center justify-center shadow-md"
                  >
                    <span className="text-white text-xs font-bold">{i}K</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground" data-testid="text-trust-indicator">
                    5.0 rating
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by 15,000+ productivity enthusiasts
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-5 h-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-5 h-5 text-primary" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-5 h-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
