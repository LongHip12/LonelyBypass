import { motion } from "framer-motion";
import { Zap, Shield, DollarSign, Globe } from "lucide-react";
import { Link } from "wouter";

const TAGS = ["Platoboost", "Linkvertise", "Lootlabs", "Admaven", "Rekonise", "Work.ink", "Shortfly", "Lockr.so"];

const CARDS = [
  {
    icon: DollarSign,
    title: "100% Free",
    desc: "No paywalls, no premium tiers. Bypass every supported service at no cost.",
    color: "from-primary/12 to-transparent",
    iconBg: "text-primary bg-primary/15",
  },
  {
    icon: Globe,
    title: "50+ Services",
    tags: TAGS,
    color: "from-violet-500/12 to-transparent",
    iconBg: "text-violet-400 bg-violet-500/15",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized pipeline delivers results in seconds across every supported service.",
    color: "from-fuchsia-500/12 to-transparent",
    iconBg: "text-fuchsia-400 bg-fuchsia-500/15",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "We don't store your links or track your activity. Everything stays private.",
    color: "from-blue-500/12 to-transparent",
    iconBg: "text-blue-400 bg-blue-500/15",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-36 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-4 block">Why Us</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why choose Lonely Hub?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">Built for speed, reliability, and privacy.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 max-w-5xl mx-auto">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.14, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, scale: 1.015 }}
                className="relative rounded-3xl border border-card-border bg-card p-8 overflow-hidden cursor-default transition-shadow hover:shadow-[0_0_40px_hsl(250_80%_80%_/_0.1)] hover:border-primary/30"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} pointer-events-none`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${card.iconBg}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  {card.desc && <p className="text-muted-foreground leading-relaxed">{card.desc}</p>}
                  {card.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {card.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                      <Link href="/supported" className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/30 hover:bg-primary/20 transition-colors active:scale-95">
                        See all →
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
