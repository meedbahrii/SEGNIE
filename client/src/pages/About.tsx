import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, Linkedin, Code, Database, Layers } from "lucide-react";

const techStack = [
  {
    icon: Code,
    title: "Frontend",
    items: ["React", "TypeScript", "Tailwind CSS", "Shadcn UI"]
  },
  {
    icon: Database,
    title: "Backend",
    items: ["Express.js", "PostgreSQL", "Drizzle ORM", "Zod"]
  },
  {
    icon: Layers,
    title: "Extension",
    items: ["Manifest V3", "Chrome APIs", "Content Scripts"]
  }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 px-6 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Chrome className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold" data-testid="text-about-title">Segnie</h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Save anything, anywhere, instantly with our powerful browser extension. A comprehensive 
              platform for saving web content to Google Sheets, Notion, and PDF with just one click.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Developer</h2>
            <Card className="hover-elevate">
              <CardContent className="pt-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                    MB
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold">Mohammed Bahri</h3>
                      <p className="text-lg text-muted-foreground mt-1">
                        Full-Stack Developer & Creator of Segnie
                      </p>
                    </div>
                    <p className="text-muted-foreground">
                      A passionate developer focused on creating tools that enhance productivity and 
                      streamline workflows. Segnie showcases modern web development practices including 
                      full-stack TypeScript, React + Express integration, and browser extension development.
                    </p>
                    <a 
                      href="https://www.linkedin.com/in/bahrimeed/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" className="gap-2" data-testid="button-linkedin">
                        <Linkedin className="w-4 h-4" />
                        Connect on LinkedIn
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {techStack.map((stack, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <stack.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{stack.title}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {stack.items.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">About the Project</h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                Segnie is a comprehensive browser extension and web application designed to streamline 
                the process of saving web content. With just one click, users can save content to multiple 
                destinations including Google Sheets, Notion, and PDF.
              </p>
              <p>
                The project demonstrates modern full-stack development practices, featuring a React 
                frontend, Express.js backend, PostgreSQL database, and a Chrome Manifest V3 extension. 
                It showcases integration with third-party APIs, OAuth authentication, real-time data 
                synchronization, and thoughtful UI/UX design.
              </p>
              <p>
                Key features include one-click saves via context menu or extension popup, multi-app 
                support with Google Sheets and Notion integrations, smart content organization through 
                a unified dashboard, and support for multiple content types including text, articles, 
                quotes, links, and images.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
