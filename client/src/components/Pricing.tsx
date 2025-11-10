import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals getting started",
    features: [
      "Save to ONE destination per action",
      "Unlimited saves",
      "PDF generation",
      "Single account per service",
      "Browser extension",
      "Basic dashboard access"
    ],
    cta: "Get Started Free",
    highlighted: false,
    badge: null,
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Premium",
    price: "$9",
    period: "per month",
    description: "For professionals who need more power",
    features: [
      "Save to MULTIPLE destinations at once",
      "Unlimited saves",
      "PDF generation with custom branding",
      "Multiple accounts per service",
      "Browser extension",
      "Full dashboard access",
      "Priority email support",
      "Advanced search & filters",
      "Export all content as CSV",
      "Custom tags & collections"
    ],
    cta: "Upgrade to Premium",
    highlighted: true,
    badge: "Most Popular",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time payment",
    description: "Best value for long-term users",
    features: [
      "Everything in Premium",
      "Pay once, use forever",
      "All future updates included",
      "No recurring fees ever",
      "Lifetime priority support",
      "Early access to new features",
      "Custom integrations (coming soon)",
      "API access (coming soon)"
    ],
    cta: "Get Lifetime Access",
    highlighted: false,
    badge: "Best Value",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500"
  }
];

export default function Pricing() {
  const [, setLocation] = useLocation();

  const handlePlanClick = (planName: string) => {
    setLocation("/register");
  };

  return (
    <section className="w-full py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.05),transparent_70%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <Badge variant="secondary" className="px-5 py-2 text-sm font-medium border shadow-sm">
            Pricing
          </Badge>
          
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto" data-testid="text-pricing-title">
            Simple, Transparent{" "}
            <span className="text-gradient">
              Pricing
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-pricing-subtitle">
            Start free and upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-start">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-2 hover-elevate transition-all duration-300 overflow-hidden group ${
                plan.highlighted 
                  ? 'border-primary/30 shadow-2xl shadow-primary/10 lg:scale-105 hover:scale-[1.06]' 
                  : 'border-border hover:border-primary/20 hover:scale-[1.02]'
              }`}
              data-testid={`card-plan-${index}`}
            >
              {plan.badge && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <Badge className={`px-5 py-2 shadow-xl bg-gradient-to-r ${plan.gradient} border-0 text-white font-semibold`} data-testid={`badge-${index}`}>
                    <plan.icon className="w-4 h-4 mr-2" />
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-[0.02] transition-all duration-300`}></div>
              
              <CardHeader className="space-y-8 pb-8 relative pt-10">
                <div className="relative inline-flex">
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-xl ring-1 ring-white/20`}>
                    <plan.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-foreground" data-testid={`text-plan-name-${index}`}>
                    {plan.name}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed" data-testid={`text-plan-description-${index}`}>
                    {plan.description}
                  </p>
                </div>
                
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-6xl font-bold text-foreground" data-testid={`text-plan-price-${index}`}>
                    {plan.price}
                  </span>
                  <span className="text-lg text-muted-foreground" data-testid={`text-plan-period-${index}`}>
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pb-8 relative">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3" data-testid={`list-item-feature-${index}-${featureIndex}`}>
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                      <span className="text-base text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="relative pb-10">
                <Button 
                  size="lg"
                  className={`w-full text-base font-semibold ${
                    plan.highlighted 
                      ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 border-0 shadow-lg text-white` 
                      : ''
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handlePlanClick(plan.name)}
                  data-testid={`button-plan-cta-${index}`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            Have questions about pricing?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="font-medium"
            onClick={() => setLocation("/contact")}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
