import { Router } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import { bypassLogsTable, bypassStatsTable } from "@workspace/db";
import { BypassLinkBody, VerifyCaptchaBody } from "@workspace/api-zod";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

async function verifyCaptchaToken(token: string, type: "hcaptcha" | "turnstile"): Promise<boolean> {
  try {
    if (type === "turnstile") {
      const secret = process.env.CLOUDFLARE_SECRET;
      if (!secret) {
        logger.warn("CLOUDFLARE_SECRET not set");
        return false;
      }
      const formData = new URLSearchParams();
      formData.append("secret", secret);
      formData.append("response", token);
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = (await res.json()) as { success: boolean };
      return data.success === true;
    } else {
      const secret = process.env.HCAPTCHA_SECRET;
      if (!secret) {
        logger.warn("HCAPTCHA_SECRET not set");
        return false;
      }
      const formData = new URLSearchParams();
      formData.append("secret", secret);
      formData.append("response", token);
      const res = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = (await res.json()) as { success: boolean };
      return data.success === true;
    }
  } catch (err) {
    logger.error({ err }, "Captcha verification error");
    return false;
  }
}

async function performBypass(url: string): Promise<{ bypassedUrl: string; timeTaken: number } | null> {
  const start = Date.now();
  try {
    const encodedUrl = encodeURIComponent(url);
    const res = await fetch(`https://bypass.vip/api?url=${encodedUrl}`, {
      headers: { "User-Agent": "LonelyBypass/1.0" },
      signal: AbortSignal.timeout(30000),
    });
    const timeTaken = Date.now() - start;
    if (!res.ok) return null;
    const data = (await res.json()) as { success?: boolean; result?: string; destination?: string; url?: string };
    const bypassedUrl = data.result || data.destination || data.url;
    if (!bypassedUrl) return null;
    return { bypassedUrl, timeTaken };
  } catch (err) {
    logger.error({ err }, "Bypass request failed");
    return null;
  }
}

router.post("/bypass", async (req, res) => {
  const parsed = BypassLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { url, captchaToken, captchaType } = parsed.data;

  const captchaValid = await verifyCaptchaToken(captchaToken, captchaType as "hcaptcha" | "turnstile");
  if (!captchaValid) {
    res.status(422).json({ error: "Captcha verification failed" });
    return;
  }

  const result = await performBypass(url);

  if (result) {
    await db.insert(bypassLogsTable).values({
      originalUrl: url,
      bypassedUrl: result.bypassedUrl,
      captchaType,
      success: 1,
      timeTaken: result.timeTaken,
    }).catch((err: unknown) => logger.error({ err }, "Failed to log bypass"));

    await db.execute(sql`
      INSERT INTO bypass_stats (id, total_bypassed, updated_at)
      VALUES (1, 1, NOW())
      ON CONFLICT (id) DO UPDATE
      SET total_bypassed = bypass_stats.total_bypassed + 1, updated_at = NOW()
    `).catch((err: unknown) => logger.error({ err }, "Failed to update stats"));

    res.json({
      success: true,
      bypassedUrl: result.bypassedUrl,
      originalUrl: url,
      timeTaken: result.timeTaken,
      error: null,
    });
  } else {
    await db.insert(bypassLogsTable).values({
      originalUrl: url,
      bypassedUrl: null,
      captchaType,
      success: 0,
      timeTaken: null,
    }).catch((err: unknown) => logger.error({ err }, "Failed to log bypass failure"));

    res.json({
      success: false,
      bypassedUrl: null,
      originalUrl: url,
      timeTaken: null,
      error: "Bypass failed. The link may not be supported or the service is temporarily unavailable.",
    });
  }
});

router.post("/bypass/verify-captcha", async (req, res) => {
  const parsed = VerifyCaptchaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { token, type } = parsed.data;
  const valid = await verifyCaptchaToken(token, type as "hcaptcha" | "turnstile");
  res.json({ success: valid, error: valid ? null : "Verification failed" });
});

export default router;
