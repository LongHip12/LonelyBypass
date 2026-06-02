import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is it really free?", a: "Yes, 100% free. No hidden fees or premium tiers, ever." },
  { q: "Which services are supported?", a: "50+ services including Linkvertise, Platoboost, Lootlabs, Work.ink, and many more. Visit the Supported page for the full list." },
  { q: "Do you store my links?", a: "No. Links are processed in real-time and immediately discarded. We only count the total number of bypasses for our stats." },
  { q: "Why do I need to solve a captcha?", a: "Captchas prevent automated abuse of the service. Without them, bots would exhaust rate limits and degrade performance for everyone." },
  { q: "How fast is the bypass?", a: "Usually under 3–5 seconds for most services. Heavily rate-limited services may take slightly longer." },
];

export function Faq() {
  return (
    <section id="faq" className="py-36">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-4 block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-card-border bg-card overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/6 to-transparent pointer-events-none" />
          <div className="relative z-10 p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/60 last:border-0">
                  <AccordionTrigger
                    className="text-left font-semibold hover:text-primary transition-colors text-base py-5 [&>svg]:text-muted-foreground hover:[&>svg]:text-primary"
                    data-testid={`faq-q-${i}`}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5" data-testid={`faq-a-${i}`}>
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
