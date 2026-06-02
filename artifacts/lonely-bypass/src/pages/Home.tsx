import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBypass } from "@/components/home/HeroBypass";
import { StatsDashboard } from "@/components/home/StatsDashboard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyUs } from "@/components/home/WhyUs";
import { Faq } from "@/components/home/Faq";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      {/* Subtle overlay to dim the grid pattern */}
      <div className="absolute inset-0 bg-background/90 pointer-events-none z-[-1]"></div>
      
      <Navbar />
      
      <main className="flex-1">
        <HeroBypass />
        <StatsDashboard />
        <HowItWorks />
        <WhyUs />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}