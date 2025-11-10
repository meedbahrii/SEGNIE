import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, MousePointer2 } from "lucide-react";
import { Link } from "wouter";

export default function LiveDemo() {

  return (
    <section className="w-full py-32 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.03),transparent_70%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center space-y-8">
          <Badge variant="secondary" className="px-5 py-2 text-sm font-medium border shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Interactive Demo
          </Badge>
          
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-demo-title">
            See It in{" "}
            <span className="text-gradient">
              Action
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-demo-subtitle">
            Experience the right-click context menu demo. No installation required.
          </p>

          <div className="flex items-center gap-4 p-8 bg-primary/5 border-2 border-primary/20 rounded-xl max-w-3xl mx-auto mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <MousePointer2 className="relative w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-lg text-foreground mb-2" data-testid="text-demo-instruction-title">
                Try the Interactive Demo
              </p>
              <p className="text-muted-foreground" data-testid="text-demo-instruction-subtitle">
                Right-click on sample content and test the save menu in action
              </p>
            </div>
            <Link href="/demo">
              <Button 
                size="lg"
                data-testid="button-demo-try"
                className="shadow-lg group"
              >
                Launch Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
