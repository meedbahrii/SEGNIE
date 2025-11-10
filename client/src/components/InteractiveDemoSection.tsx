import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer2, Image, FileText, Link as LinkIcon, Sparkles } from "lucide-react";

export default function InteractiveDemoSection() {
  const demoCards = [
    {
      id: 1,
      type: "Article",
      icon: FileText,
      title: "How to Master Productivity in 2025",
      excerpt: "Discover the latest productivity techniques used by top performers. Learn how to optimize your workflow, manage your time effectively, and achieve more in less time.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      type: "Image",
      icon: Image,
      title: "Beautiful Mountain Landscape",
      excerpt: "A stunning photograph of snow-capped mountains at sunset. Perfect example of nature photography with vibrant colors and dramatic lighting.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      type: "Link",
      icon: LinkIcon,
      title: "Essential Design Resources",
      excerpt: "A curated collection of the best design tools, icon libraries, and inspiration websites that every designer should bookmark.",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section className="w-full py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(262_83%_58%/0.05),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="secondary" className="text-sm font-medium border shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Try It Now
          </Badge>
          
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-interactive-demo-title">
            Test the{" "}
            <span className="text-gradient">
              Real Feature
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-interactive-demo-subtitle">
            Right-click on any card below to experience our save menu in action
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8">
            <div className="flex flex-wrap items-start gap-6">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                  <MousePointer2 className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-demo-instructions-title">
                  How to Test
                </h3>
                <ul className="space-y-3 text-base text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">1</span>
                    <span><strong className="text-foreground">Right-click</strong> on any of the content cards below</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">2</span>
                    <span><strong className="text-foreground">Choose</strong> your save destination (Notion, Google Sheets, or PDF)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">3</span>
                    <span><strong className="text-foreground">Select</strong> how you want to save (Save Page, Screenshot, or Zone Selection)</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic mt-4">
                  This is the actual feature you'll use in our browser extension. No simulation!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoCards.map((card) => (
            <Card 
              key={card.id}
              className="group border-2 hover:border-primary/30 hover-elevate transition-all duration-300 cursor-context-menu overflow-hidden relative"
              data-testid={`card-demo-content-${card.id}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.05] transition-all duration-300`}></div>
              
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="outline" className="font-medium">
                    {card.type}
                  </Badge>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} blur-lg opacity-30`}></div>
                    <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-xl leading-tight" data-testid={`text-demo-card-title-${card.id}`}>
                  {card.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-demo-card-excerpt-${card.id}`}>
                  {card.excerpt}
                </p>
                
                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MousePointer2 className="w-3.5 h-3.5 text-primary" />
                    <span>Right-click to save this content</span>
                  </div>
                </div>
              </CardContent>
              
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-primary/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                  Try me!
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Like what you see? Get the full extension for free
          </p>
          <a 
            href="/register" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            data-testid="link-demo-cta"
          >
            Get Started Now
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
