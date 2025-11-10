import { Zap, Layers, FolderSearch, Users, Download, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Zap,
    title: "One-Click Saves",
    description: "Right-click any content and save it instantly to your favorite apps. No copy-paste, no switching tabs, no friction.",
    gradient: "from-amber-500 to-orange-500",
    color: "text-amber-500"
  },
  {
    icon: Layers,
    title: "Multi-App Support",
    description: "Save to Google Sheets, Notion, or PDF. Premium users can save to multiple destinations simultaneously.",
    gradient: "from-blue-500 to-cyan-500",
    color: "text-blue-500"
  },
  {
    icon: FolderSearch,
    title: "Smart Organization",
    description: "Search, filter, and manage all your saved content from one unified dashboard. Find anything in seconds.",
    gradient: "from-purple-500 to-pink-500",
    color: "text-purple-500"
  },
  {
    icon: Users,
    title: "Multi-Account Management",
    description: "Connect multiple accounts for each service. Perfect for managing work and personal content separately.",
    gradient: "from-green-500 to-emerald-500",
    color: "text-green-500"
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Generate PDFs locally or sync content across all your productivity tools seamlessly. Your data, your way.",
    gradient: "from-red-500 to-rose-500",
    color: "text-red-500"
  },
  {
    icon: Wifi,
    title: "Always Accessible",
    description: "Access your saved content from any device through our web dashboard or browser extension. Work anywhere.",
    gradient: "from-indigo-500 to-violet-500",
    color: "text-indigo-500"
  }
];

export default function Features() {
  return (
    <section id="features" className="w-full py-32 relative">
      <div className="absolute inset-0 bg-muted/40"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <Badge variant="secondary" className="px-5 py-2 text-sm font-medium border shadow-sm">
            Features
          </Badge>
          
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto" data-testid="text-features-title">
            Everything You Need to{" "}
            <span className="text-gradient">
              Stay Organized
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-features-subtitle">
            Powerful features designed to help you capture, organize, and access your content from anywhere, anytime
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-2 hover:border-primary/20 hover-elevate transition-all duration-300 overflow-hidden relative bg-card" 
              data-testid={`card-feature-${index}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-all duration-300`}></div>
              
              <CardContent className="p-8 space-y-6 relative">
                <div className="relative inline-flex">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ring-1 ring-white/20`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed" data-testid={`text-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Trusted by thousands of professionals worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
            <div className="text-2xl font-bold text-foreground">Google</div>
            <div className="text-2xl font-bold text-foreground">Notion</div>
            <div className="text-2xl font-bold text-foreground">Asana</div>
          </div>
        </div>
      </div>
    </section>
  );
}
