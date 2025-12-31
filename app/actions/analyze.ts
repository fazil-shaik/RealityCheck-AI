"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/app/db/connect";
import { ideas, analyses, agentOutputs } from "@/app/db/schema/schema";
import { analyzeIdea } from "@/lib/reality-check/index";
import { calculateSuccessProbability, AgentRiskScore } from "@/lib/reality-check/scoring";
import { eq, asc } from "drizzle-orm";

const analyzeSchema = z.object({
    idea: z.string().min(10, "Idea must be at least 10 characters long").max(1000, "Idea too long"),
});

const MAX_REQUESTS = 2;

export async function getRateLimitStatus(userId: string) {
    // Count all ideas for this user (Lifetime Limit)
    const allIdeas = await db.select({
        createdAt: ideas.createdAt
    })
        .from(ideas)
        .where(eq(ideas.userId, userId))
        .orderBy(asc(ideas.createdAt));

    const currentRequests = allIdeas.length;
    const limited = currentRequests >= MAX_REQUESTS;

    return {
        limited,
        resetTime: null,
        currentRequests,
        maxRequests: MAX_REQUESTS,
        windowMs: 0 // No window for lifetime limit
    };
}

export async function analyzeIdeaAction(ideaContent: string) {
    // Analyze Action Started

    // 1. Validate Auth
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // 2. Rate Limiting Check
    const rateLimitStatus = await getRateLimitStatus(userId);

    if (rateLimitStatus.limited) {
        return {
            success: false,
            error: "RATE_LIMIT",
            resetTime: rateLimitStatus.resetTime
        };
    }

    // 3. Validate Input
    const validation = analyzeSchema.safeParse({ idea: ideaContent });
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }
    const safeIdea = validation.data.idea;

    try {
        // 3. Persist Idea
        const [insertedIdea] = await db.insert(ideas).values({
            userId: userId,
            content: safeIdea,
        }).returning();

        if (!insertedIdea) throw new Error("Failed to save idea");

        // 4. Run Analysis Pipeline (Day-2 Code)
        const analysisResult = await analyzeIdea(safeIdea);
        const { analysis, verdict } = analysisResult;

        // 5. Scoring Engine
        const agentScores: AgentRiskScore[] = [
            { name: "Market", score: analysis.market?.risk_score || 0, weight: 1.2 },
            { name: "Execution", score: analysis.execution?.risk_score || 0, weight: 1.0 },
            { name: "Behavioral", score: analysis.behavioral?.risk_score || 0, weight: 1.0 },
            { name: "Timing", score: analysis.timing?.risk_score || 0, weight: 0.8 },
            { name: "History", score: analysis.history?.risk_score || 0, weight: 0.8 },
        ];

        const { probability, reasoning } = calculateSuccessProbability(agentScores);

        // 6. Persist Analysis
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [insertedAnalysis] = await db.insert(analyses).values({
            ideaId: insertedIdea.id,
            probability: probability,
            verdict: verdict?.verdict || "PIVOT",
            summary: reasoning, // Using reasoning as summary for now
        }).returning();

        // 7. Persist Agent Outputs
        const agentsToPersist = [
            { name: "Market Reality", result: analysis.market },
            { name: "Execution Complexity", result: analysis.execution },
            { name: "Human Behavioral", result: analysis.behavioral },
            { name: "Timing Risk", result: analysis.timing },
            { name: "Historical Pattern", result: analysis.history },
        ];

        for (const agent of agentsToPersist) {
            if (agent.result) {
                await db.insert(agentOutputs).values({
                    analysisId: insertedAnalysis.id,
                    agent: agent.name,
                    riskScore: agent.result.risk_score,
                    findings: agent.result // Store full JSON
                });
            }
        }

        return { success: true, analysisId: insertedAnalysis.id };

    } catch (error) {
        // Analysis Failed
        return { success: false, error: (error as Error).message || "Something went wrong" };
    }
}
