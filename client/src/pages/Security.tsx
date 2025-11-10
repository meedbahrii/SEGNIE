import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, Server, Eye, AlertTriangle, CheckCircle2, FileText } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption"
  },
  {
    icon: Key,
    title: "Secure Authentication",
    description: "Industry-standard authentication with bcrypt password hashing and secure session management"
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description: "Hosted on enterprise-grade infrastructure with 24/7 monitoring and automated backups"
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    description: "We collect only the minimum data necessary and never sell your personal information"
  },
  {
    icon: Shield,
    title: "Regular Audits",
    description: "Quarterly security audits and penetration testing by independent security firms"
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    description: "24/7 security monitoring with rapid incident response and transparent communication"
  }
];

const compliance = [
  {
    name: "SOC 2 Type II",
    status: "Certified",
    description: "Annual audit of our security, availability, and confidentiality controls"
  },
  {
    name: "GDPR",
    status: "Compliant",
    description: "Full compliance with EU General Data Protection Regulation"
  },
  {
    name: "CCPA",
    status: "Compliant",
    description: "California Consumer Privacy Act compliance for user data rights"
  },
  {
    name: "ISO 27001",
    status: "In Progress",
    description: "International standard for information security management"
  }
];

const practices = [
  {
    category: "Data Protection",
    items: [
      "All data encrypted at rest and in transit",
      "Regular automated backups with 30-day retention",
      "Data segregation between customers",
      "Secure data deletion within 30 days of account closure"
    ]
  },
  {
    category: "Access Control",
    items: [
      "Role-based access control (RBAC)",
      "Multi-factor authentication (MFA) available",
      "Regular access reviews and revocation",
      "Principle of least privilege enforced"
    ]
  },
  {
    category: "Application Security",
    items: [
      "Regular security testing and code reviews",
      "Automated vulnerability scanning",
      "OWASP Top 10 protection",
      "Content Security Policy (CSP) headers"
    ]
  },
  {
    category: "Operational Security",
    items: [
      "24/7 security monitoring and alerting",
      "Intrusion detection and prevention systems",
      "DDoS protection and rate limiting",
      "Regular employee security training"
    ]
  }
];

export default function Security() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 px-6 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold">Security at Segnie</h1>
            <p className="text-xl text-muted-foreground">
              Your data security and privacy are our top priorities. We implement industry-leading 
              security practices to protect your information.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Security Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {compliance.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          {item.name}
                        </CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                      <Badge 
                        className={
                          item.status === "Certified" || item.status === "Compliant"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                        data-testid={`badge-compliance-${index}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">Security Practices</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {practices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{practice.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {practice.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-muted/20">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">Vulnerability Disclosure</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Responsible Disclosure Program</CardTitle>
                <CardDescription>
                  We appreciate the security research community's efforts to help keep Segnie secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">How to Report</h3>
                  <p className="text-sm text-muted-foreground">
                    If you discover a security vulnerability, please email us at{" "}
                    <a href="mailto:security@segnie.com" className="text-primary hover:underline">
                      security@segnie.com
                    </a>{" "}
                    with:
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Detailed description of the vulnerability</li>
                    <li>Steps to reproduce the issue</li>
                    <li>Potential impact assessment</li>
                    <li>Your contact information</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Our Commitment</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Acknowledge receipt within 24 hours</li>
                    <li>Provide regular updates on our progress</li>
                    <li>Recognize researchers who report valid issues</li>
                    <li>Work with you to understand and resolve the issue</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4">
                  <p className="text-sm font-semibold mb-1">Please Note</p>
                  <p className="text-sm text-muted-foreground">
                    Do not exploit the vulnerability or access user data. We appreciate responsible 
                    disclosure and will work with you to address valid security concerns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <h2 className="text-2xl font-bold">Questions About Our Security?</h2>
                <p className="text-muted-foreground">
                  Our security team is here to help. Contact us for security inquiries, 
                  compliance documentation, or enterprise security requirements.
                </p>
                <div className="flex gap-4 justify-center flex-wrap mt-6">
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    data-testid="button-contact-security"
                  >
                    Contact Security Team
                  </button>
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 border border-input bg-background hover-elevate active-elevate-2"
                    data-testid="button-view-docs"
                  >
                    View Security Docs
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
