import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    turnstile?: any;
    hcaptcha?: any;
  }
}

interface CaptchaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (token: string, type: "turnstile" | "hcaptcha") => void;
}

export function CaptchaModal({ open, onOpenChange, onSuccess }: CaptchaModalProps) {
  const [captchaType, setCaptchaType] = useState<"turnstile" | "hcaptcha">("turnstile");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<any>(null);

  useEffect(() => {
    if (!open) {
      if (widgetIdRef.current !== null) {
        if (captchaType === "turnstile" && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        } else if (captchaType === "hcaptcha" && window.hcaptcha) {
          window.hcaptcha.remove(widgetIdRef.current);
        }
        widgetIdRef.current = null;
      }
      return;
    }

    const loadCaptcha = () => {
      if (!containerRef.current) return;
      
      // Clean up previous
      if (widgetIdRef.current !== null) {
        if (captchaType === "turnstile" && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        } else if (captchaType === "hcaptcha" && window.hcaptcha) {
          window.hcaptcha.remove(widgetIdRef.current);
        }
        widgetIdRef.current = null;
      }

      if (captchaType === "turnstile") {
        const scriptId = "turnstile-script";
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        
        const renderWidget = () => {
          if (window.turnstile && containerRef.current) {
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
              sitekey: import.meta.env.VITE_CLOUDFLARE_SITEKEY,
              theme: "dark",
              callback: (token: string) => {
                onSuccess(token, "turnstile");
                onOpenChange(false);
              }
            });
          }
        };

        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            setTimeout(renderWidget, 100);
          };
          document.head.appendChild(script);
        } else {
          setTimeout(renderWidget, 100);
        }
      } else {
        const scriptId = "hcaptcha-script";
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        
        const renderWidget = () => {
          if (window.hcaptcha && containerRef.current) {
            widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
              sitekey: import.meta.env.VITE_HCAPTCHA_SITEKEY,
              theme: "dark",
              callback: (token: string) => {
                onSuccess(token, "hcaptcha");
                onOpenChange(false);
              }
            });
          }
        };

        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            setTimeout(renderWidget, 100);
          };
          document.head.appendChild(script);
        } else {
          setTimeout(renderWidget, 100);
        }
      }
    };

    const timer = setTimeout(loadCaptcha, 100);
    return () => clearTimeout(timer);
  }, [open, captchaType, onSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-card-border" data-testid="modal-captcha">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Verify you're human</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Complete the challenge below to bypass the link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 min-h-[100px]">
          <div ref={containerRef} className="empty:animate-pulse empty:bg-muted empty:w-[300px] empty:h-[65px] empty:rounded-md"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Secured by {captchaType === "turnstile" ? "Cloudflare Turnstile" : "hCaptcha"}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            data-testid="button-switch-captcha"
            onClick={() => setCaptchaType(prev => prev === "turnstile" ? "hcaptcha" : "turnstile")}
          >
            Switch to {captchaType === "turnstile" ? "hCaptcha" : "Turnstile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}