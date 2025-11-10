import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveDemo from "@/components/LiveDemo";
import Features from "@/components/Features";
import InteractiveDemoSection from "@/components/InteractiveDemoSection";
import HowItWorks from "@/components/HowItWorks";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <SkipToContent />
      <Navbar />
      <main id="main-content">
        <Hero />
        <LiveDemo />
        <div id="features">
          <Features />
        </div>
        <InteractiveDemoSection />
        <HowItWorks />
        <div id="integrations">
          <Integrations />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
