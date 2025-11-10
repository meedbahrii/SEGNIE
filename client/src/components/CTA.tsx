import { Button } from "@/components/ui/button";
import { Chrome, ArrowRight, Sparkles, Check } from "lucide-react";
import { useLocation } from "wouter";

export default function CTA() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/register");
  };

  const handleLearnMore = () => {
    const element = document.querySelector("#features");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh"></div>
      
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="glass-strong rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"></div>
          
          <div className="relative space-y-8">
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-primary to-purple-500 shadow-xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-cta-title">
                Ready to Transform
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Your Workflow?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-cta-subtitle">
                Join thousands of users who save hours every week with Segnie. Start organizing your web content today.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-base h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30" 
                onClick={handleGetStarted} 
                data-testid="button-cta-get-started"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Add to Chrome - Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base h-12 px-8 glass-strong border-0" 
                onClick={handleLearnMore} 
                data-testid="button-cta-learn-more"
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
