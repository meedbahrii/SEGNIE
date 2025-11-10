import { Button } from "@/components/ui/button";
import { Chrome, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleGetStarted = () => {
    setLocation("/register");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMobileMenu();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-3 group" data-testid="link-logo">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">Segnie</span>
            </a>
            
            <div className="hidden lg:flex items-center gap-1">
              <a 
                href="#features" 
                onClick={handleNavClick} 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all" 
                data-testid="link-features"
              >
                Features
              </a>
              <a 
                href="#integrations" 
                onClick={handleNavClick} 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all" 
                data-testid="link-integrations"
              >
                Integrations
              </a>
              <a 
                href="#pricing" 
                onClick={handleNavClick} 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all" 
                data-testid="link-pricing"
              >
                Pricing
              </a>
              <a 
                href="/demo" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all" 
                data-testid="link-demo"
              >
                Demo
              </a>
              <a 
                href="/blog" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all" 
                data-testid="link-blog"
              >
                Blog
              </a>
              <a 
                href="#docs" 
                onClick={handleNavClick} 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all" 
                data-testid="link-docs"
              >
                Docs
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden lg:flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={handleLogin} 
                className="font-medium"
                data-testid="button-login"
              >
                Log In
              </Button>
              <Button 
                onClick={handleGetStarted} 
                className="font-medium shadow-md hover:shadow-lg transition-all"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </div>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 py-6 space-y-1 animate-in slide-in-from-top-2" data-testid="mobile-menu">
            <a 
              href="#features" 
              onClick={handleNavClick} 
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all"
            >
              Features
            </a>
            <a 
              href="#integrations" 
              onClick={handleNavClick} 
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all"
            >
              Integrations
            </a>
            <a 
              href="#pricing" 
              onClick={handleNavClick} 
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all"
            >
              Pricing
            </a>
            <a 
              href="/demo" 
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all"
            >
              Demo
            </a>
            <a 
              href="/blog" 
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all"
            >
              Blog
            </a>
            <a 
              href="#docs" 
              onClick={handleNavClick} 
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground rounded-lg hover-elevate transition-all"
            >
              Docs
            </a>
            
            <div className="pt-6 space-y-3 border-t border-border/40 mt-4">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full font-medium" 
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Button 
                size="lg"
                className="w-full font-medium shadow-md" 
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
