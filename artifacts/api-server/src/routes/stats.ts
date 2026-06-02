import { Router } from "express";
import { db } from "@workspace/db";
import { bypassStatsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

const SERVICE_START_DATE = new Date("2024-06-01");

router.get("/stats", async (req, res) => {
  try {
    const rows = await db.select().from(bypassStatsTable).limit(1);
    const totalBypassed = rows[0]?.totalBypassed ?? 0;

    const now = new Date();
    const monthsOfService = Math.max(
      1,
      (now.getFullYear() - SERVICE_START_DATE.getFullYear()) * 12 +
        (now.getMonth() - SERVICE_START_DATE.getMonth())
    );

    res.json({
      linksTotal: totalBypassed,
      supportedServices: 50,
      monthsOfService,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.json({ linksTotal: 0, supportedServices: 50, monthsOfService: 12 });
  }
});

export default router;
