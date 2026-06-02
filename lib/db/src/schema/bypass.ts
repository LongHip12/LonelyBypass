import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bypassStatsTable = pgTable("bypass_stats", {
  id: serial("id").primaryKey(),
  totalBypassed: integer("total_bypassed").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bypassLogsTable = pgTable("bypass_logs", {
  id: serial("id").primaryKey(),
  originalUrl: text("original_url").notNull(),
  bypassedUrl: text("bypassed_url"),
  captchaType: text("captcha_type").notNull(),
  success: integer("success").notNull().default(0),
  timeTaken: integer("time_taken"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBypassLogSchema = createInsertSchema(bypassLogsTable).omit({ id: true, createdAt: true });
export type InsertBypassLog = z.infer<typeof insertBypassLogSchema>;
export type BypassLog = typeof bypassLogsTable.$inferSelect;
export type BypassStats = typeof bypassStatsTable.$inferSelect;
