import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cookieTypes = [
  {
    category: "Essential Cookies",
    required: true,
    description: "These cookies are necessary for the website to function and cannot be disabled.",
    cookies: [
      {
        name: "session_id",
        purpose: "Maintains your logged-in state",
        duration: "Session (expires when browser closes)",
        type: "First-party"
      },
      {
        name: "csrf_token",
        purpose: "Security protection against cross-site request forgery",
        duration: "Session",
        type: "First-party"
      }
    ]
  },
  {
    category: "Functional Cookies",
    required: false,
    description: "These cookies enable enhanced functionality and personalization.",
    cookies: [
      {
        name: "theme_preference",
        purpose: "Remembers your light/dark mode preference",
        duration: "1 year",
        type: "First-party"
      },
      {
        name: "user_preferences",
        purpose: "Stores your dashboard layout and settings",
        duration: "1 year",
        type: "First-party"
      }
    ]
  },
  {
    category: "Analytics Cookies",
    required: false,
    description: "These cookies help us understand how visitors use our website.",
    cookies: [
      {
        name: "_ga",
        purpose: "Google Analytics - distinguishes users",
        duration: "2 years",
        type: "Third-party"
      },
      {
        name: "_gid",
        purpose: "Google Analytics - distinguishes users",
        duration: "24 hours",
        type: "Third-party"
      },
      {
        name: "analytics_session",
        purpose: "Tracks user behavior for product improvement",
        duration: "30 days",
        type: "First-party"
      }
    ]
  },
  {
    category: "Marketing Cookies",
    required: false,
    description: "These cookies track your activity to deliver relevant advertisements.",
    cookies: [
      {
        name: "marketing_id",
        purpose: "Tracks marketing campaign effectiveness",
        duration: "90 days",
        type: "First-party"
      }
    ]
  }
];

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: March 15, 2024</p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that are placed on your computer or mobile device when you 
                  visit a website. They are widely used to make websites work more efficiently and provide 
                  information to the website owners.
                </p>
                <p className="text-muted-foreground">
                  Segnie uses cookies and similar technologies to provide, protect, and improve our services. 
                  This policy explains how and why we use these technologies and the choices you have.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Why We Use Cookies</h2>
                <p className="text-muted-foreground">We use cookies to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our service</li>
                  <li>Improve our service based on usage patterns</li>
                  <li>Protect against fraud and abuse</li>
                  <li>Deliver relevant content and advertisements</li>
                </ul>
              </section>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
            
            {cookieTypes.map((category, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{category.category}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge 
                      className={
                        category.required
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-green-500/10 text-green-500 border-green-500/20"
                      }
                      data-testid={`badge-cookie-category-${index}`}
                    >
                      {category.required ? "Required" : "Optional"}
                    </Badge>
                  </div>

                  <div className="space-y-4 mt-4">
                    {category.cookies.map((cookie, cookieIndex) => (
                      <div 
                        key={cookieIndex} 
                        className="border rounded-md p-4 space-y-2"
                        data-testid={`cookie-${index}-${cookieIndex}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {cookie.name}
                          </code>
                          <Badge variant="outline">{cookie.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Purpose:</strong> {cookie.purpose}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Duration:</strong> {cookie.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Third-Party Cookies</h2>
                <p className="text-muted-foreground">
                  We use services from third-party companies that may also set cookies on your device. 
                  These companies include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Google Analytics:</strong> To understand how users interact with our website
                  </li>
                  <li>
                    <strong>Stripe:</strong> For secure payment processing
                  </li>
                  <li>
                    <strong>Content Delivery Networks (CDNs):</strong> To deliver content efficiently
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  These third parties have their own privacy policies and cookie policies. We recommend 
                  reviewing their policies to understand how they use cookies.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Managing Your Cookie Preferences</h2>
                <p className="text-muted-foreground">
                  You have several options to manage cookies:
                </p>

                <h3 className="text-lg font-semibold">Browser Settings</h3>
                <p className="text-muted-foreground">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Delete existing cookies</li>
                  <li>Block all cookies</li>
                  <li>Allow cookies only from trusted websites</li>
                  <li>Block third-party cookies</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Note: Blocking essential cookies will prevent you from using certain features of our service.
                </p>

                <h3 className="text-lg font-semibold">Opt-Out Links</h3>
                <p className="text-muted-foreground">
                  For analytics and advertising cookies, you can opt out using these tools:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Browser Opt-out Add-on</a></li>
                  <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NAI Opt-out</a></li>
                  <li>Digital Advertising Alliance: <a href="https://optout.aboutads.info/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DAA Opt-out</a></li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Do Not Track</h2>
                <p className="text-muted-foreground">
                  Some browsers have a "Do Not Track" feature that signals to websites that you do not 
                  want to have your online activity tracked. Currently, there is no industry standard for 
                  how to respond to Do Not Track signals. We do not currently respond to Do Not Track signals.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Mobile Devices</h2>
                <p className="text-muted-foreground">
                  Mobile devices have settings to control tracking and advertising:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>iOS: Settings → Privacy → Tracking → "Allow Apps to Request to Track"</li>
                  <li>Android: Settings → Google → Ads → "Opt out of Ads Personalization"</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any 
                  material changes by posting the updated policy on this page.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about our use of cookies, please contact us:
                </p>
                <ul className="list-none text-muted-foreground space-y-2">
                  <li>Email: privacy@segnie.com</li>
                  <li>Address: 123 Market St, San Francisco, CA 94103</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
