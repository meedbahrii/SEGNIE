import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 15, 2024</p>
          </div>

          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Introduction</h2>
                <p className="text-muted-foreground">
                  At Segnie, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our service. Please read this 
                  privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                  please do not access the service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <p className="text-muted-foreground">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Name and email address when you create an account</li>
                  <li>Payment information when you subscribe to a paid plan</li>
                  <li>Content you save through our browser extension or dashboard</li>
                  <li>Communications you send to us</li>
                </ul>

                <h3 className="text-xl font-semibold">Automatically Collected Information</h3>
                <p className="text-muted-foreground">
                  When you use our service, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>IP address and general location data</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                <p className="text-muted-foreground">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, prevent, and address technical issues and security incidents</li>
                  <li>Personalize your experience</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground">
                  We do not sell your personal information. We may share your information in the 
                  following circumstances:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Service Providers:</strong> We share information with third-party service 
                    providers who perform services on our behalf, such as payment processing and data analysis
                  </li>
                  <li>
                    <strong>Integrations:</strong> When you connect third-party services (like Notion or 
                    Google Sheets), we share relevant data to enable those integrations
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose information if required by law 
                    or in response to valid requests by public authorities
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with any merger, sale of company 
                    assets, or acquisition
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. These 
                  measures include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Rights and Choices</h2>
                <p className="text-muted-foreground">You have the following rights regarding your data:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p className="text-muted-foreground">
                  To exercise these rights, please contact us at privacy@segnie.com
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to track activity on our service and 
                  hold certain information. You can instruct your browser to refuse all cookies or to 
                  indicate when a cookie is being sent. However, if you do not accept cookies, you may 
                  not be able to use some portions of our service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as necessary to provide you with our 
                  services and as described in this Privacy Policy. When you delete your account, we will 
                  delete your personal information within 30 days, except where we are required to retain 
                  it for legal or compliance purposes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your country 
                  of residence. These countries may have data protection laws that are different from the 
                  laws of your country. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our service is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you become aware that a child 
                  has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none text-muted-foreground space-y-2">
                  <li>Email: privacy@segnie.com</li>
                  <li>Address: 123 Market St, San Francisco, CA 94103</li>
                  <li>Phone: +1 (555) 123-4567</li>
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
