// db/schema.ts
import { pgTable, text, uuid, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

// We are replacing the old 'users' table with the one from 'auth-schema'.
// The 'ideas' table needs to reference the new 'user' table.
// note: user.id is text, so we change userId to text to match.
export const ideas = pgTable("ideas", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  ideaId: uuid("idea_id").references(() => ideas.id),
  probability: integer("probability").notNull(),
  verdict: text("verdict").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agentOutputs = pgTable("agent_outputs", {
  id: uuid("id").defaultRandom().primaryKey(),
  analysisId: uuid("analysis_id").references(() => analyses.id),
  agent: text("agent").notNull(),
  riskScore: integer("risk_score").notNull(),
  findings: jsonb("findings").notNull(),
});
