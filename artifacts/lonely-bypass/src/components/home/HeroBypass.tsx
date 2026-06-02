import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaptchaModal } from "../CaptchaModal";
import { useBypassLink } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const TYPING_SERVICES = ["Linkvertise", "Platoboost", "Lootlabs", "Work.ink", "Admaven", "Lockr.so", "Shortfly", "Rekonise"];

function TypewriterServices() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = TYPING_SERVICES[idx % TYPING_SERVICES.length];
    if (!deleting && text === current) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx(i => i + 1);
    } else {
      timeoutRef.current = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, deleting ? 60 : 90);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [text, deleting, idx]);

  return (
    <span className="text-primary font-semibold">
      {text}
      <span className="cursor-blink inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle" />
    </span>
  );
}

const BADGE_WORDS = ["50+ SERVICES", "·", "FREE", "·", "NO CAPTCHA WALLS"];

export function HeroBypass() {
  const [url, setUrl] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [bypassedResult, setBypassedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const bypassMutation = useBypassLink();

  const handleBypassClick = () => {
    if (!url.trim()) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }
    setBypassedResult(null);
    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = (token: string, type: "turnstile" | "hcaptcha") => {
    bypassMutation.mutate({ data: { url, captchaToken: token, captchaType: type } }, {
      onSuccess: (data) => {
        if (data.success && data.bypassedUrl) {
          setBypassedResult(data.bypassedUrl);
          toast({ title: "Bypass successful", description: `Done in ${data.timeTaken || 0}ms` });
        } else {
          toast({ title: "Bypass failed", description: data.error || "Unknown error", variant: "destructive" });
        }
      },
      onError: (err) => {
        toast({ title: "Bypass failed", description: err?.error?.error || "Failed to bypass link", variant: "destructive" });
      }
    });
  };

  const copyToClipboard = () => {
    if (bypassedResult) {
      navigator.clipboard.writeText(bypassedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied to clipboard" });
    }
  };

  return (
    <section id="bypass" className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[130px] pointer-events-none float-slow" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 backdrop-blur-sm"
            data-testid="badge-hero"
          >
            {BADGE_WORDS.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className={`text-xs font-mono tracking-widest ${w === "·" ? "text-primary/40" : "text-primary"}`}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-foreground leading-tight">
            Lonely{" "}
            <span className="text-primary relative">
              Bypass.
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-primary/40 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-2">
            Paste a link. Solve the captcha. Get the destination.
          </p>
          <p className="text-base text-muted-foreground">
            Works on <TypewriterServices /> and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-xl border border-card-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent pointer-events-none rounded-3xl" />

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://linkvertise.com/..."
                    className="h-14 bg-background/60 border-input text-base pl-4 pr-10 rounded-2xl focus-visible:ring-primary placeholder:text-muted-foreground/50 transition-all"
                    data-testid="input-url"
                    onKeyDown={e => e.key === "Enter" && handleBypassClick()}
                  />
                  {url && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                    >
                      <ShieldCheck size={20} />
                    </motion.div>
                  )}
                </div>
                <Button
                  onClick={handleBypassClick}
                  disabled={bypassMutation.isPending}
                  className="h-14 px-8 text-base font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_hsl(250_80%_80%_/_0.3)] hover:shadow-[0_0_36px_hsl(250_80%_80%_/_0.5)] transition-all active:scale-95"
                  data-testid="button-bypass"
                >
                  {bypassMutation.isPending ? "Bypassing..." : "Bypass"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground items-center justify-center sm:justify-start">
                <span className="font-semibold text-foreground/60 uppercase tracking-wider">Popular:</span>
                {["Linkvertise", "Lootlabs", "Work.ink", "Platoboost"].map((s, i) => (
                  <span key={s} className="flex items-center gap-2">
                    <span
                      className="hover:text-primary cursor-pointer transition-colors"
                      onClick={() => setUrl(`https://${s.toLowerCase().replace(/\./g, "")}.com/`)}
                    >
                      {s}
                    </span>
                    {i < 3 && <span className="text-border">·</span>}
                  </span>
                ))}
                <a href="/supported" className="text-primary hover:underline ml-1 transition-colors">See all →</a>
              </div>
            </div>

            <AnimatePresence>
              {(bypassMutation.isPending || bypassedResult) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden relative z-10"
                >
                  <div className="pt-6 border-t border-border/50">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-widest">Result</h3>
                    {bypassMutation.isPending ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Skeleton className="h-12 flex-1 rounded-2xl bg-primary/5" />
                        <div className="flex gap-2">
                          <Skeleton className="h-12 w-28 rounded-2xl bg-primary/5" />
                          <Skeleton className="h-12 w-12 rounded-2xl bg-primary/5" />
                        </div>
                      </div>
                    ) : bypassedResult ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        <Input
                          readOnly
                          value={bypassedResult}
                          className="h-12 bg-primary/8 border-primary/25 text-primary font-mono text-sm rounded-2xl"
                          data-testid="input-result"
                        />
                        <div className="flex gap-2 shrink-0">
                          <Button
                            className="h-12 px-5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
                            onClick={() => window.open(bypassedResult, "_blank")}
                            data-testid="button-open"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Open
                          </Button>
                          <Button
                            variant="outline"
                            className="h-12 w-12 p-0 rounded-2xl border-primary/25 text-primary hover:bg-primary/10 active:scale-95 transition-all"
                            onClick={copyToClipboard}
                            data-testid="button-copy"
                          >
                            <AnimatePresence mode="wait">
                              {copied ? (
                                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-xs font-bold">✓</motion.span>
                              ) : (
                                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Copy className="h-4 w-4" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Button>
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <CaptchaModal open={showCaptcha} onOpenChange={setShowCaptcha} onSuccess={handleCaptchaSuccess} />
    </section>
  );
}
