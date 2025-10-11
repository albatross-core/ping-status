import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const pingResult = sqliteTable(
  "pingResult",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    monitorName: text("monitorName").notNull(),
    success: integer("success", { mode: "boolean" }).notNull(),
    message: text("message"),
    responseTime: integer("responseTime").notNull(),
    status: integer("status").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    incidentId: integer("incidentId").references(() => incident.id),
  },
  (table) => ({
    monitorNameIdx: index("pingResult_monitorName_idx").on(table.monitorName),
  })
);

export const pingResultSchema = createSelectSchema(pingResult);
export const insertPingResultSchema = pingResultSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertPingResult = z.infer<typeof insertPingResultSchema>;
export type PingResult = z.infer<typeof pingResultSchema>;

export const incident = sqliteTable(
  "incident",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    monitorName: text("monitorName").notNull(),
    openedAt: integer("openedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    closedAt: integer("closedAt", { mode: "timestamp" }),
  },
  (table) => ({
    monitorNameIdx: index("incident_monitorName_idx").on(table.monitorName),
  })
);

export const incidentSchema = createSelectSchema(incident);
export const insertIncidentSchema = incidentSchema.omit({
  id: true,
  openedAt: true,
  closedAt: true,
});

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = z.infer<typeof incidentSchema>;

export const incidentRelations = relations(incident, ({ many }) => ({
  pingResults: many(pingResult),
}));

export const pingResultRelations = relations(pingResult, ({ one }) => ({
  incident: one(incident, {
    fields: [pingResult.incidentId],
    references: [incident.id],
  }),
}));
