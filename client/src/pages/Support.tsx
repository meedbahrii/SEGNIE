import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Book, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I install the browser extension?",
    answer: "Visit the Chrome Web Store and search for 'Segnie'. Click 'Add to Chrome' and follow the installation prompts. Once installed, you'll see the Segnie icon in your browser toolbar."
  },
  {
    question: "Can I use Segnie across multiple devices?",
    answer: "Yes! All your saved items are synced across all devices where you're logged in. Simply install the extension and sign in with your account on each device."
  },
  {
    question: "How do I organize my saved items?",
    answer: "You can organize items using tags, folders, and our smart search feature. Create custom tags in the dashboard and apply them to any saved item for easy filtering and organization."
  },
  {
    question: "What integrations are available?",
    answer: "Segnie integrates with Notion, Google Sheets, and Stripe for payments. Connect your accounts in the Connections section of your dashboard to enable seamless data sync."
  },
  {
    question: "How do I upgrade to Pro?",
    answer: "Navigate to the Pricing page or your Dashboard, select the Pro plan, and complete the checkout process. Your upgrade will be instant and you'll have access to all Pro features immediately."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "You'll continue to have access to Pro features until the end of your billing period. After that, your account will revert to the Free plan, but all your saved data will remain accessible."
  }
];

export default function Support() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      category: formData.get('category'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    console.log('Support request submitted:', data);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted",
        description: "We've received your support request and will respond within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">Support Center</h1>
            <p className="text-lg text-muted-foreground">
              Get help and find answers to your questions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardHeader>
                <Book className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  Comprehensive guides and tutorials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" data-testid="button-view-docs">
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>
                  Chat with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" data-testid="button-start-chat">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Mail className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Email Support</CardTitle>
                <CardDescription>
                  Get help via email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild data-testid="button-email-support">
                  <a href="mailto:support@segnie.com">Send Email</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger data-testid={`faq-question-${index}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent data-testid={`faq-answer-${index}`}>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      data-testid="input-support-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      data-testid="input-support-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger data-testid="select-support-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Brief description"
                      required
                      data-testid="input-support-subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your issue or question..."
                      className="min-h-32"
                      required
                      data-testid="textarea-support-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-submit-support"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
