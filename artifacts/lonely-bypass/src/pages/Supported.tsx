import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetStats } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  { name: "Linkvertise", domain: "linkvertise.com", category: "Ad-link" },
  { name: "Platoboost", domain: "platorelay.com", category: "Ad-link" },
  { name: "Lootlabs", domain: "loot-link.com", category: "Ad-link" },
  { name: "Work.ink", domain: "work.ink", category: "Ad-link" },
  { name: "Admaven", domain: "admaven.com", category: "Ad-link" },
  { name: "Rekonise", domain: "rekonise.com", category: "Ad-link" },
  { name: "Shortfly", domain: "shortfly.com", category: "Shortener" },
  { name: "Lockr.so", domain: "lockr.so", category: "Ad-link" },
  { name: "Sub2Unlock", domain: "sub2unlock.com", category: "Social-lock" },
  { name: "Social-unlock", domain: "social-unlock.com", category: "Social-lock" },
  { name: "Robloxscripts", domain: "robloxscripts.com", category: "Ad-link" },
  { name: "Boost.ink", domain: "boost.ink", category: "Ad-link" },
  { name: "Cpmlink", domain: "cpmlink.net", category: "Shortener" },
  { name: "Gplinks", domain: "gplinks.co", category: "Shortener" },
  { name: "Shrink.pe", domain: "shrink.pe", category: "Shortener" },
  { name: "Adf.ly", domain: "adf.ly", category: "Shortener" },
  { name: "Bc.vc", domain: "bc.vc", category: "Shortener" },
  { name: "Sh.st", domain: "sh.st", category: "Shortener" },
  { name: "Ouo.io", domain: "ouo.io", category: "Shortener" },
  { name: "Za.gl", domain: "za.gl", category: "Shortener" },
  { name: "Fc.lc", domain: "fc.lc", category: "Shortener" },
  { name: "Clk.sh", domain: "clk.sh", category: "Shortener" },
  { name: "Exe.io", domain: "exe.io", category: "Shortener" },
  { name: "Exey.io", domain: "exey.io", category: "Shortener" },
  { name: "Cutpaid.com", domain: "cutpaid.com", category: "Shortener" },
  { name: "Pastebin.com", domain: "pastebin.com", category: "Paste" },
  { name: "Paste.fo", domain: "paste.fo", category: "Paste" },
  { name: "Pasteio", domain: "paste.io", category: "Paste" },
  { name: "Ghostbin.co", domain: "ghostbin.co", category: "Paste" },
  { name: "Hastebin", domain: "hastebin.com", category: "Paste" },
  { name: "Rentry.co", domain: "rentry.co", category: "Paste" },
  { name: "Haste.ms", domain: "haste.ms", category: "Paste" },
  { name: "Sharetext.net", domain: "sharetext.net", category: "Paste" },
  { name: "Justpaste.it", domain: "justpaste.it", category: "Paste" },
  { name: "Linktr.ee", domain: "linktr.ee", category: "Social-lock" },
  { name: "Beacons.ai", domain: "beacons.ai", category: "Social-lock" },
  { name: "Mboost.me", domain: "mboost.me", category: "Social-lock" },
  { name: "Notm.at", domain: "notm.at", category: "Ad-link" },
  { name: "Intercelerate", domain: "intercelerate.com", category: "Ad-link" },
  { name: "LeadCooldown", domain: "leadcooldown.com", category: "Ad-link" },
  { name: "Fluxus", domain: "flux.li", category: "Key" },
  { name: "Delta", domain: "deltaexploits.com", category: "Key" },
  { name: "Codex", domain: "codex.lol", category: "Key" },
  { name: "Arceus X", domain: "arceus-x.com", category: "Key" },
  { name: "Hydrogen", domain: "hydrogen.sh", category: "Key" },
  { name: "Evon", domain: "evon.to", category: "Key" },
  { name: "Trigon", domain: "trigon.to", category: "Key" },
  { name: "Incognito", domain: "incognito.rip", category: "Key" },
  { name: "Vega X", domain: "vegax.dev", category: "Key" },
  { name: "Comet", domain: "comet.to", category: "Key" },
];

const CATEGORIES = ["All", "Ad-link", "Shortener", "Social-lock", "Paste", "Key"];
const CATEGORY_COLORS: Record<string, string> = {
  "Ad-link": "bg-primary/20 text-primary border-primary/30",
  "Shortener": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Social-lock": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Paste": "bg-green-500/20 text-green-400 border-green-500/30",
  "Key": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Supported() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: stats } = useGetStats();

  const filtered = SERVICES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.domain.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      <div className="absolute inset-0 bg-background/90 pointer-events-none z-[-1]" />
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
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
            <p className="text-muted-foreground text-lg mb-2">
              {stats ? `${stats.supportedServices}+` : "50+"} services supported and growing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search services..."
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
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all active:scale-95 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(167,139,250,0.4)]"
                    : "bg-card border-card-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
                data-testid={`filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((service, i) => (
              <motion.div
                key={service.domain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="bg-card border border-card-border rounded-2xl p-5 flex items-center justify-between group hover:border-primary/40 hover:shadow-[0_0_20px_rgba(167,139,250,0.1)] transition-all cursor-default"
                data-testid={`service-card-${i}`}
              >
                <div>
                  <div className="font-semibold text-foreground">{service.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{service.domain}</div>
                  <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[service.category]}`}>
                    {service.category}
                  </span>
                </div>
                <a
                  href={`https://${service.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary ml-2"
                  data-testid={`link-service-${i}`}
                >
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No services found.</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
