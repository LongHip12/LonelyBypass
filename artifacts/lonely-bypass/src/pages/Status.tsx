import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetSystemStatus } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Clock, Wifi, Database, Shield, Zap, Globe } from "lucide-react";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Bypass API": Zap,
  "Linkvertise Bypass": Globe,
  "Platoboost Bypass": Globe,
  "Lootlabs Bypass": Globe,
  "Work.ink Bypass": Globe,
  "Admaven Bypass": Globe,
  "Rekonise Bypass": Globe,
  "hCaptcha Service": Shield,
  "Cloudflare Turnstile": Shield,
  "Database": Database,
};

const STATUS_CFG = {
  operational: {
    label: "Operational",
    color: "text-emerald-400",
    bg: "bg-emerald-500/12",
    border: "border-emerald-500/25",
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.3)]",
    icon: CheckCircle2,
    barColor: "bg-emerald-400",
    headline: "All Systems Operational",
    headlineBg: "from-emerald-500/15 to-emerald-500/5",
    headlineBorder: "border-emerald-500/20",
  },
  degraded: {
    label: "Degraded",
    color: "text-amber-400",
    bg: "bg-amber-500/12",
    border: "border-amber-500/25",
    dot: "bg-amber-400",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.3)]",
    icon: AlertTriangle,
    barColor: "bg-amber-400",
    headline: "Partial Degradation",
    headlineBg: "from-amber-500/15 to-amber-500/5",
    headlineBorder: "border-amber-500/20",
  },
  outage: {
    label: "Outage",
    color: "text-red-400",
    bg: "bg-red-500/12",
    border: "border-red-500/25",
    dot: "bg-red-400",
    glow: "shadow-[0_0_12px_rgba(248,113,113,0.3)]",
    icon: XCircle,
    barColor: "bg-red-400",
    headline: "Major Outage",
    headlineBg: "from-red-500/15 to-red-500/5",
    headlineBorder: "border-red-500/20",
  },
};

function UptimeBar({ uptime, color }: { uptime: number; color: string }) {
  const bars = 30;
  const filledBars = Math.round((uptime / 100) * bars);
  return (
    <div className="flex items-center gap-[3px]" title={`${uptime}% uptime`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`h-6 w-[6px] rounded-sm transition-all ${i < filledBars ? color : "bg-border/60"}`}
          style={{ opacity: i < filledBars ? 0.7 + (i / filledBars) * 0.3 : 1 }}
        />
      ))}
    </div>
  );
}

function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${color}`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

export default function Status() {
  const { data: status, isLoading } = useGetSystemStatus();
  const overall = status?.overall ?? "operational";
  const cfg = STATUS_CFG[overall] ?? STATUS_CFG.operational;
  const HeadlineIcon = cfg.icon;

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      <div className="absolute inset-0 bg-background/90 pointer-events-none z-[-1]" />
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b ${cfg.headlineBg} blur-[100px] pointer-events-none opacity-60`} />

      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className={`relative rounded-3xl border ${cfg.headlineBorder} bg-gradient-to-br ${cfg.headlineBg} p-8 md:p-10 overflow-hidden`} data-testid="status-overall">
              <div className="absolute inset-0 bg-grid-pattern opacity-30 rounded-3xl" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center ${cfg.glow} shrink-0`}>
                  {isLoading
                    ? <Wifi className="w-7 h-7 text-muted-foreground animate-pulse" />
                    : <HeadlineIcon className={`w-7 h-7 ${cfg.color}`} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {!isLoading && <PulseDot color={cfg.dot} />}
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {isLoading ? "Checking status…" : cfg.headline}
                    </h1>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {status ? `Last updated ${new Date(status.updatedAt).toLocaleString()}` : "Loading…"}
                  </p>
                </div>

                {/* quick stats */}
                {status && (
                  <div className="flex gap-6 shrink-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono text-emerald-400">
                        {status.services.filter(s => s.status === "operational").length}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">Online</div>
                    </div>
                    {status.services.some(s => s.status === "degraded") && (
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono text-amber-400">
                          {status.services.filter(s => s.status === "degraded").length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Degraded</div>
                      </div>
                    )}
                    {status.services.some(s => s.status === "outage") && (
                      <div className="text-center">
                        <div className="text-2xl font-bold font-mono text-red-400">
                          {status.services.filter(s => s.status === "outage").length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Down</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Services list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-card-border bg-card overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-lg">Services</h2>
              <span className="text-xs text-muted-foreground font-mono">{status?.services.length ?? "—"} monitored</span>
            </div>

            <div className="divide-y divide-border/60">
              {isLoading
                ? Array(6).fill(0).map((_, i) => (
                  <div key={i} className="px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-secondary/60 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-secondary/60 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-secondary/40 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-6 w-32 rounded bg-secondary/60 animate-pulse hidden sm:block" />
                    <div className="h-6 w-24 rounded-full bg-secondary/60 animate-pulse" />
                  </div>
                ))
                : status?.services.map((service, i) => {
                  const sc = STATUS_CFG[service.status] ?? STATUS_CFG.operational;
                  const Icon = SERVICE_ICONS[service.name] ?? Globe;
                  return (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}
                      className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-secondary/20 transition-colors group"
                      data-testid={`status-service-${i}`}
                    >
                      {/* icon + name */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${sc.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{service.name}</div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            <span>{service.uptime}% uptime</span>
                            {service.latency != null && (
                              <span className="flex items-center gap-1">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${service.latency < 200 ? "bg-emerald-400" : service.latency < 500 ? "bg-amber-400" : "bg-red-400"}`} />
                                {service.latency}ms
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* uptime bar */}
                      <div className="hidden md:block">
                        <UptimeBar uptime={service.uptime} color={sc.barColor} />
                      </div>

                      {/* status pill */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.color} ${sc.border} shrink-0`}>
                        <PulseDot color={sc.dot} />
                        {sc.label}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center text-xs text-muted-foreground mt-8"
          >
            Status updates every 30 seconds. Incidents are resolved within 24 hours.
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
