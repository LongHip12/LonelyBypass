import { Router } from "express";

const router = Router();

let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

router.get("/", async (req, res) => {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    res.json(cache.data);
    return;
  }

  try {
    const r = await fetch("https://api.bypass.vip/supported", {
      headers: { "User-Agent": "LonelyBypass/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    const raw = (await r.json()) as {
      status: string;
      result: {
        "ad-links": string[];
        socials: string[];
        pastes: string[];
        shorteners: string[];
        roblox: string[];
      };
    };

    const data = {
      adLinks: raw.result["ad-links"] ?? [],
      socials: raw.result.socials ?? [],
      pastes: raw.result.pastes ?? [],
      shorteners: raw.result.shorteners ?? [],
      roblox: raw.result.roblox ?? [],
    };

    cache = { data, ts: Date.now() };
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch supported services from bypass.vip");
    res.status(502).json({ error: "Failed to fetch supported services" });
  }
});

export default router;
