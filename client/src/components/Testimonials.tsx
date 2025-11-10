import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "I used to copy-paste between tabs like a maniac. Now I right-click and boom, it's in my Notion database. Legitimately saves me 30+ minutes a day on market research.",
    author: "Alex Kumar",
    role: "Marketing Analyst",
    initials: "AK"
  },
  {
    quote: "Been using this for 3 months while writing my thesis. Having all my research sources automatically organized in Google Sheets with proper citations is a lifesaver. Wish I had this in undergrad.",
    author: "Jessica Martinez",
    role: "PhD Candidate",
    initials: "JM"
  },
  {
    quote: "The fact that I can save a client's website screenshot AND details to both our project management tool and tracking sheet simultaneously... that alone is worth it. Super clean extension, no bugs so far.",
    author: "David Park",
    role: "Freelance Designer",
    initials: "DP"
  }
];

const metrics = [
  { value: "50,000+", label: "Content Saves" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 2min", label: "Setup Time" }
];

export default function Testimonials() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-semibold" data-testid="text-testimonials-title">
            Loved by Thousands of Users
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-subtitle">
            See what our community has to say
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} data-testid={`card-testimonial-${index}`}>
              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-testimonial-quote-${index}`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium" data-testid={`text-testimonial-author-${index}`}>
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center space-y-2" data-testid={`card-metric-${index}`}>
              <p className="text-4xl font-bold text-primary" data-testid={`text-metric-value-${index}`}>
                {metric.value}
              </p>
              <p className="text-muted-foreground" data-testid={`text-metric-label-${index}`}>
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
