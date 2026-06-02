import { Link, useLocation } from "wouter";
import { Zap, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const isHome = window.location.pathname === "/" || window.location.pathname === import.meta.env.BASE_URL;
    if (!isHome) {
      setLocation("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Bypass", action: () => scrollTo("bypass") },
    { label: "How it Works", action: () => scrollTo("how-it-works") },
    { label: "Why Us", action: () => scrollTo("why-us") },
    { label: "FAQ", action: () => scrollTo("faq") },
    { label: "Status", action: () => { setMenuOpen(false); setLocation("/status"); } },
    { label: "Supported", action: () => { setMenuOpen(false); setLocation("/supported"); }, highlight: true },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-home">
          <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
            <Zap size={17} />
          </div>
          <span className="font-bold text-lg tracking-tight">Lonely Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={link.action}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                link.highlight
                  ? "text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
              data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary/60 transition-all active:scale-95"
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95"
            onClick={() => setMenuOpen(o => !o)}
            data-testid="button-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={link.action}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                link.highlight
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
