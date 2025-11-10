import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: March 15, 2024</p>
          </div>

          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using Segnie ("Service"), you agree to be bound by these Terms of Service 
                  ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Description of Service</h2>
                <p className="text-muted-foreground">
                  Segnie is a productivity platform that allows users to save, organize, and access content 
                  from across the web through a browser extension and web dashboard. The Service includes 
                  both free and paid subscription tiers.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">User Accounts</h2>
                <p className="text-muted-foreground">
                  When you create an account with us, you must provide accurate, complete, and current 
                  information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Maintaining the security of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring you are at least 13 years old</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Acceptable Use</h2>
                <p className="text-muted-foreground">You agree not to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Violate or infringe upon the rights of others</li>
                  <li>Transmit any harmful code, viruses, or malicious software</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Resell or redistribute the Service without authorization</li>
                  <li>Remove or alter any proprietary notices</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">User Content</h2>
                <p className="text-muted-foreground">
                  You retain ownership of any content you save through the Service. By using the Service, 
                  you grant us a license to store, process, and display your content solely for the purpose 
                  of providing the Service to you.
                </p>
                <p className="text-muted-foreground">
                  You are responsible for ensuring you have the right to save and store any content you 
                  add to the Service. You represent that your content does not violate any third-party 
                  rights or applicable laws.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Subscription and Billing</h2>
                
                <h3 className="text-xl font-semibold">Free Tier</h3>
                <p className="text-muted-foreground">
                  We offer a free tier with limited features. We reserve the right to modify or discontinue 
                  the free tier at any time.
                </p>

                <h3 className="text-xl font-semibold">Paid Subscriptions</h3>
                <p className="text-muted-foreground">
                  Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us 
                  to charge your payment method for all fees at the beginning of each billing cycle.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You can cancel at any time from your account settings</li>
                  <li>No refunds for partial months or unused time</li>
                  <li>Price changes will be notified 30 days in advance</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Cancellation and Termination</h2>
                <p className="text-muted-foreground">
                  You may cancel your subscription at any time. Upon cancellation, you will retain access 
                  to paid features until the end of your current billing period.
                </p>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account if you violate these Terms or 
                  engage in fraudulent activity. Upon termination, your right to use the Service will 
                  immediately cease.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The Service and its original content (excluding user content), features, and functionality 
                  are owned by Segnie and are protected by international copyright, trademark, patent, trade 
                  secret, and other intellectual property laws.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Third-Party Services</h2>
                <p className="text-muted-foreground">
                  The Service may contain links to third-party websites or services (such as Notion and 
                  Google Sheets integrations) that are not owned or controlled by Segnie. We have no control 
                  over and assume no responsibility for the content, privacy policies, or practices of any 
                  third-party services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER 
                  EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR 
                  ERROR-FREE.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEGNIE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                  WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
                  INTANGIBLE LOSSES.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless Segnie and its officers, directors, employees, 
                  and agents from any claims, damages, losses, liabilities, and expenses (including legal 
                  fees) arising from your use of the Service or violation of these Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the State 
                  of California, United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify or replace these Terms at any time. If a revision is 
                  material, we will provide at least 30 days' notice prior to any new terms taking effect. 
                  Your continued use of the Service after changes become effective constitutes acceptance 
                  of the new Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul className="list-none text-muted-foreground space-y-2">
                  <li>Email: legal@segnie.com</li>
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
