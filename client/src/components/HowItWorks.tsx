import step1 from "@assets/generated_images/Step_1_right-click_illustration_6ef32249.png";
import step2 from "@assets/generated_images/Step_2_select_apps_illustration_57bb8e01.png";
import step3 from "@assets/generated_images/Step_3_save_illustration_f70e4138.png";
import step4 from "@assets/generated_images/Step_4_access_illustration_e378f4bd.png";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Install Extension",
    description: "Add Segnie to your Chrome browser in seconds. No configuration needed.",
    image: step1,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    number: "02",
    title: "Select Content",
    description: "Right-click any text, image, or webpage to see save options.",
    image: step2,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    number: "03",
    title: "Choose Destination",
    description: "Pick where to save: Google Sheets, Notion, or PDF.",
    image: step3,
    gradient: "from-amber-500 to-orange-500"
  },
  {
    number: "04",
    title: "Access Anywhere",
    description: "View and manage all saved content from your dashboard.",
    image: step4,
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full glass-strong text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="text-5xl font-bold tracking-tight" data-testid="text-how-it-works-title">
            Get Started in
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-subtitle">
            Setup takes less than a minute, no technical knowledge required
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group" data-testid={`card-step-${index}`}>
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-full aspect-square rounded-2xl glass overflow-hidden border-0 p-8 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={step.image} 
                      alt={`Step ${step.number}: ${step.title} - ${step.description}`} 
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className={`absolute -top-4 -left-4 w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center text-xl font-bold shadow-lg`}>
                    {step.number}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold" data-testid={`text-step-title-${index}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-description-${index}`}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/4 -right-3 items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
