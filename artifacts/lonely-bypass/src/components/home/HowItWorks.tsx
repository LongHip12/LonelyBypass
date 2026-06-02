import { motion } from "framer-motion";
import { Link2, ShieldCheck, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Link2,
    title: "Paste your link",
    desc: "Drop any Linkvertise, Platoboost, Loot-Link, or supported URL into the input field.",
    color: "from-primary/20 to-primary/5",
    glow: "hover:shadow-[0_0_40px_hsl(250_80%_80%_/_0.15)]",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Verify captcha",
    desc: "Complete a quick Cloudflare Turnstile or hCaptcha check to prevent automated abuse.",
    color: "from-violet-500/20 to-violet-500/5",
    glow: "hover:shadow-[0_0_40px_hsl(270_80%_80%_/_0.15)]",
  },
  {
    num: "03",
    icon: Zap,
    title: "Get results",
    desc: "Receive your bypassed link instantly — copy or open it with one click.",
    color: "from-fuchsia-500/20 to-fuchsia-500/5",
    glow: "hover:shadow-[0_0_40px_hsl(290_80%_80%_/_0.15)]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-36 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-4 block">Getting Started</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">Three simple steps. Zero friction.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.18, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative rounded-3xl border border-card-border bg-card p-8 flex flex-col gap-5 cursor-default transition-shadow duration-500 ${step.glow}`}
                data-testid={`step-${step.num}`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-60 pointer-events-none`} />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-background/60 backdrop-blur border border-border flex items-center justify-center text-primary shadow-sm">
                    <Icon size={24} />
                  </div>
                  <span className="text-5xl font-black font-mono text-foreground/8 select-none leading-none">
                    {step.num}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
