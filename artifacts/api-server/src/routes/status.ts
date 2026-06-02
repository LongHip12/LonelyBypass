import { Router } from "express";

const router = Router();

router.get("/status", async (_req, res) => {
  const services = [
    { name: "Bypass API", status: "operational" as const, uptime: 99.9, latency: 142 },
    { name: "Linkvertise Bypass", status: "operational" as const, uptime: 99.7, latency: 320 },
    { name: "Platoboost Bypass", status: "operational" as const, uptime: 99.5, latency: 280 },
    { name: "Lootlabs Bypass", status: "operational" as const, uptime: 99.8, latency: 195 },
    { name: "Work.ink Bypass", status: "operational" as const, uptime: 98.9, latency: 410 },
    { name: "Admaven Bypass", status: "operational" as const, uptime: 99.2, latency: 360 },
    { name: "Rekonise Bypass", status: "operational" as const, uptime: 99.6, latency: 220 },
    { name: "hCaptcha Service", status: "operational" as const, uptime: 100, latency: 85 },
    { name: "Cloudflare Turnstile", status: "operational" as const, uptime: 100, latency: 72 },
    { name: "Database", status: "operational" as const, uptime: 99.99, latency: 8 },
  ];

  const hasOutage = services.some((s) => s.status === "outage");
  const hasDegraded = services.some((s) => s.status === "degraded");
  const overall = hasOutage ? "outage" : hasDegraded ? "degraded" : "operational";

  res.json({
    overall,
    services,
    updatedAt: new Date().toISOString(),
  });
});

export default router;
