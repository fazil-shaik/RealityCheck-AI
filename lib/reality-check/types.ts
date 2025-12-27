
import { z } from "zod";

// --- Agno-Style Agent Configuration ---

export interface AgentOptions {
    name: string;
    role: string;
    description: string;
    instructions: string[];
    // We strictly enforce JSON outputs for all agents
    outputSchema: z.ZodType<any>;
    schemaDescription?: string;
}

export interface AgentResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    rawOutput?: string;
}

// --- Specific Agent Schemas ---

// Standard Output Schema for the 5 Analysis Agents
export const AnalysisAgentSchema = z.object({
    risk_score: z.number().min(0).max(100).describe("A score from 0-100 indicating the risk level (higher is riskier)"),
    key_findings: z.array(z.string()).min(1).describe("List of critical findings"),
    hidden_risks: z.array(z.string()).describe("List of non-obvious risks identified"),
    confidence: z.number().min(0).max(100).describe("Confidence score (0-100) in this analysis")
});

export const AnalysisSchemaDescription = JSON.stringify({
    risk_score: "number (0-100)",
    key_findings: "array of strings",
    hidden_risks: "array of strings",
    confidence: "number (0-100)"
}, null, 2);

export type AnalysisAgentOutput = z.infer<typeof AnalysisAgentSchema>;

// Synthesis Agent Schema
export const SynthesisSchema = z.object({
    success_probability: z.number().min(5).max(90).describe("Realistic success probability (5-90%)"),
    verdict: z.enum(["KILL", "PIVOT", "PROCEED"]).describe("The final brutal verdict"),
    top_failure_modes: z.array(z.string()).max(3).describe("Top 3 reasons this will fail"),
    improvement_actions: z.array(z.string()).describe("Concrete, high-impact actions to fix the idea")
});

export const SynthesisSchemaDescription = JSON.stringify({
    success_probability: "number (5-90)",
    verdict: "string ('KILL', 'PIVOT', 'PROCEED')",
    top_failure_modes: "array of strings (max 3)",
    improvement_actions: "array of strings"
}, null, 2);

export type SynthesisOutput = z.infer<typeof SynthesisSchema>;
