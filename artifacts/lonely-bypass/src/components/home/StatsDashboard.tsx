import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGetStats } from "@workspace/api-client-react";
import { TrendingUp, Globe, Clock } from "lucide-react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2200;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

const STAT_CARDS = [
  {
    icon: TrendingUp,
    label: "Links Bypassed",
    testId: "stat-links",
    color: "from-primary/15 to-primary/5",
    iconColor: "text-primary bg-primary/15",
  },
  {
    icon: Globe,
    label: "Services Supported",
    testId: "stat-services",
    color: "from-violet-500/15 to-violet-500/5",
    iconColor: "text-violet-400 bg-violet-500/15",
  },
  {
    icon: Clock,
    label: "Months of Service",
    testId: "stat-months",
    color: "from-fuchsia-500/15 to-fuchsia-500/5",
    iconColor: "text-fuchsia-400 bg-fuchsia-500/15",
  },
];

export function StatsDashboard() {
  const { data: stats } = useGetStats();

  const values = [
    { value: stats?.linksTotal ?? 0, suffix: "" },
    { value: stats?.supportedServices ?? 50, suffix: "+" },
    { value: stats?.monthsOfService ?? 12, suffix: "" },
  ];

  return (
    <section id="stats" className="py-24 relative">
      <div className="absolute inset-0 border-y border-border bg-card/15 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STAT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="relative rounded-3xl border border-card-border bg-card p-8 flex flex-col items-center justify-center text-center overflow-hidden cursor-default transition-shadow hover:shadow-[0_0_30px_hsl(250_80%_80%_/_0.1)]"
                data-testid={card.testId}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-70 pointer-events-none`} />

                <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${card.iconColor}`}>
                  <Icon size={22} />
                </div>

                <div className="relative z-10 text-4xl md:text-5xl font-bold font-mono mb-2">
                  {stats
                    ? <AnimatedNumber value={values[i].value} suffix={values[i].suffix} />
                    : <span className="opacity-40">—</span>}
                </div>
                <div className="relative z-10 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  {card.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
