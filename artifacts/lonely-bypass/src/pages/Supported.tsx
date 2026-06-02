import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetSupportedServices } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ExternalLink, Search, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

const CATEGORY_CFG: Record<string, { label: string; color: string; emoji: string }> = {
  adLinks:    { label: "Ad-link",    color: "bg-primary/20 text-primary border-primary/30",            emoji: "🔗" },
  socials:    { label: "Social-lock",color: "bg-orange-500/20 text-orange-400 border-orange-500/30",   emoji: "👥" },
  pastes:     { label: "Paste",      color: "bg-green-500/20 text-green-400 border-green-500/30",      emoji: "📋" },
  shorteners: { label: "Shortener",  color: "bg-blue-500/20 text-blue-400 border-blue-500/30",        emoji: "✂️" },
  roblox:     { label: "Roblox Key", color: "bg-purple-500/20 text-purple-400 border-purple-500/30",  emoji: "🎮" },
};

type CategoryKey = keyof typeof CATEGORY_CFG;
const FILTER_OPTIONS = ["All", ...Object.keys(CATEGORY_CFG)] as const;

function domainFromEntry(entry: string): string {
  const clean = entry.replace(/\s*\(.*?\)\s*/g, "").trim();
  return clean.split(" ")[0] ?? clean;
}

function nameFromEntry(entry: string): string {
  const domain = domainFromEntry(entry);
  const base = domain.split(".")[0] ?? domain;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function Supported() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { data, isLoading, isError } = useGetSupportedServices();

  const allServices = useMemo(() => {
    if (!data) return [];
    const entries: { entry: string; category: CategoryKey; domain: string; name: string }[] = [];
    for (const cat of Object.keys(CATEGORY_CFG) as CategoryKey[]) {
      for (const entry of (data[cat] ?? [])) {
        entries.push({
          entry,
          category: cat,
          domain: domainFromEntry(entry),
          name: nameFromEntry(entry),
        });
      }
    }
    return entries;
  }, [data]);

  const filtered = useMemo(() => {
    return allServices.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.domain.toLowerCase().includes(search.toLowerCase()) ||
        s.entry.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [allServices, search, activeCategory]);

  const totalCount = allServices.length;

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      <div className="absolute inset-0 bg-background/90 pointer-events-none z-[-1]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/8 blur-[120px] pointer-events-none" />
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Supported <span className="text-primary">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {isLoading ? "Loading…" : `${totalCount} services supported and growing`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search services…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-card-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                data-testid="input-search"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {FILTER_OPTIONS.map(cat => {
              const cfg = cat !== "All" ? CATEGORY_CFG[cat as CategoryKey] : null;
              const count = cat === "All" ? totalCount : (data?.[cat as CategoryKey]?.length ?? 0);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all active:scale-95 flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-card-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                  data-testid={`filter-${cat}`}
                >
                  {cfg?.emoji && <span>{cfg.emoji}</span>}
                  {cfg?.label ?? "All"}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeCategory === cat ? "bg-white/20" : "bg-secondary text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {isLoading && (
            <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Fetching supported services…</span>
            </div>
          )}

          {isError && (
            <div className="text-center py-20 text-muted-foreground">
              Failed to load services. Please try again later.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((service, i) => {
                const cfg = CATEGORY_CFG[service.category];
                return (
                  <motion.div
                    key={`${service.category}-${service.entry}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.5) }}
                    className="bg-card border border-card-border rounded-2xl p-5 flex items-center justify-between group hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] transition-all cursor-default"
                    data-testid={`service-card-${i}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground truncate">{service.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{service.domain}</div>
                      <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                        {cfg.emoji} {cfg.label}
                      </span>
                    </div>
                    <a
                      href={`https://${service.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary ml-3 shrink-0"
                      data-testid={`link-service-${i}`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No services found.</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
