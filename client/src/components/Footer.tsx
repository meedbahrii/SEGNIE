import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";
import { SiGithub, SiX, SiLinkedin } from "react-icons/si";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
    { label: "Demo", href: "/demo" }
  ],
  company: [
    { label: "About", href: "/about" }
  ]
};

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    console.log("Newsletter signup submitted:", email);
  };

  return (
    <footer className="w-full bg-muted/20 border-t" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Chrome className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Segnie</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Save anything, anywhere, instantly with our powerful browser extension.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/in/bahrimeed/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="icon" variant="ghost" data-testid="button-social-linkedin" aria-label="Connect on LinkedIn">
                  <SiLinkedin className="w-5 h-5" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-product-${index}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-company-${index}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 space-y-6">
          <div className="max-w-md">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2" aria-label="Newsletter signup">
              <Input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                className="flex-1"
                data-testid="input-newsletter-email"
                required
                aria-label="Email address"
              />
              <Button type="submit" data-testid="button-newsletter-submit">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Get productivity tips and product updates
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 Segnie. All rights reserved.</p>
            <p>
              Developed by{" "}
              <a 
                href="https://www.linkedin.com/in/bahrimeed/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
                data-testid="link-developer"
              >
                Mohammed Bahri
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
