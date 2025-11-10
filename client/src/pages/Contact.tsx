import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    detail: "support@segnie.com",
    description: "We typically respond within 24 hours"
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am-5pm PST"
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "123 Market St, San Francisco, CA 94103",
    description: "Visit us by appointment"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    detail: "Available in-app",
    description: "Instant support for logged-in users"
  }
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      inquiry: formData.get('inquiry'),
      message: formData.get('message')
    };

    console.log('Contact form submitted:', data);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to work with us? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{method.title}</h3>
                    <p className="text-sm font-medium text-primary" data-testid={`contact-detail-${index}`}>
                      {method.detail}
                    </p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          data-testid="input-contact-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your company (optional)"
                        data-testid="input-contact-company"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inquiry">Type of Inquiry *</Label>
                      <Select name="inquiry" required>
                        <SelectTrigger data-testid="select-inquiry-type">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="press">Press & Media</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help..."
                        className="min-h-32"
                        required
                        data-testid="textarea-contact-message"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                      data-testid="button-send-message"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked</h2>
                <p className="text-muted-foreground mb-6">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">How quickly will I get a response?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We aim to respond to all inquiries within 24 hours during business days. 
                      For urgent support issues, please use our live chat feature.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Do you offer enterprise solutions?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Yes! We offer custom enterprise plans with dedicated support, SSO, 
                      advanced security features, and more. Contact our sales team to learn more.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Can I schedule a demo?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Absolutely! Select "Sales" as your inquiry type and mention you'd like 
                      a demo. We'll schedule a personalized walkthrough of Segnie.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Where are you located?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our headquarters is in San Francisco, CA, but we're a remote-first 
                      company with team members around the world.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
