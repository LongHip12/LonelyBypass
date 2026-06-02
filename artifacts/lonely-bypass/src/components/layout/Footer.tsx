import { Zap } from "lucide-react";
import { SiDiscord, SiGithub, SiGmail } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="font-bold text-lg tracking-tight flex items-center justify-center md:justify-start gap-2">
            <div className="w-7 h-7 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Zap size={15} />
            </div>
            Lonely Hub
          </span>
          <p className="text-sm text-muted-foreground mt-1.5">© 2026 Lonely Hub. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-3">
          {[
            { href: "https://dsc.gg/lonelyhub", icon: SiDiscord, label: "Discord" },
            { href: "https://github.com/LongHip12", icon: SiGithub, label: "GitHub" },
            { href: "mailto:longhip2012@gmail.com", icon: SiGmail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noreferrer"}
              className="w-10 h-10 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all active:scale-95"
              data-testid={`link-${label.toLowerCase()}`}
              aria-label={label}
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
