import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, Users, Rocket, Coffee, Heart, Zap } from "lucide-react";

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Build and scale our core platform. Work with React, Node.js, and PostgreSQL to create features used by 100K+ users daily."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Shape the future of our product experience. Create beautiful, intuitive interfaces that delight our users."
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain our cloud infrastructure. Ensure 99.9% uptime and optimize for scale."
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Help our enterprise customers succeed. Build relationships and ensure they get maximum value from Segnie."
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Tell our story through compelling content. Create blog posts, guides, and campaigns that resonate with our audience."
  },
  {
    title: "Engineering Intern",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Internship",
    description: "Summer internship program for students passionate about building great products. Work on real features alongside our team."
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance for you and your family"
  },
  {
    icon: Rocket,
    title: "Growth & Learning",
    description: "$2,000 annual learning budget for courses, conferences, and books"
  },
  {
    icon: Coffee,
    title: "Flexible Schedule",
    description: "Work when you're most productive. We trust you to manage your time"
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Regular team events, offsites, and opportunities to connect"
  },
  {
    icon: Zap,
    title: "Equity",
    description: "Competitive equity package so you share in our success"
  },
  {
    icon: MapPin,
    title: "Remote-First",
    description: "Work from anywhere. We have team members across 15+ countries"
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 px-6 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">Join Our Team</h1>
            <p className="text-xl text-muted-foreground">
              Help us build the future of productivity. We're looking for talented, 
              passionate people who want to make a real impact.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Join Segnie?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="pt-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <p className="text-muted-foreground">
                Find your next opportunity and apply today
              </p>
            </div>

            <div className="space-y-4">
              {openings.map((job, index) => (
                <Card key={index} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-2">
                        <CardTitle className="text-xl" data-testid={`job-title-${index}`}>
                          {job.title}
                        </CardTitle>
                        <CardDescription>{job.description}</CardDescription>
                      </div>
                      <Button data-testid={`button-apply-${index}`}>
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="gap-1" data-testid={`badge-department-${index}`}>
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </Badge>
                      <Badge variant="outline" className="gap-1" data-testid={`badge-location-${index}`}>
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline" className="gap-1" data-testid={`badge-type-${index}`}>
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8 pb-8 text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Don't See a Perfect Fit?</h2>
                  <p className="text-muted-foreground">
                    We're always looking for exceptional talent. Send us your resume and 
                    tell us why you'd be a great addition to the team.
                  </p>
                </div>
                <Button size="lg" data-testid="button-general-application">
                  Submit General Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-6 bg-muted/20">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">Our Hiring Process</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <h3 className="font-semibold">Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your application and resume
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <h3 className="font-semibold">Recruiter Call</h3>
                <p className="text-sm text-muted-foreground">
                  30-minute chat about your background
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <h3 className="font-semibold">Team Interviews</h3>
                <p className="text-sm text-muted-foreground">
                  Meet the team and dive deeper
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                  4
                </div>
                <h3 className="font-semibold">Offer</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome to the team!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
