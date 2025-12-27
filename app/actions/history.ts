"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/app/db/connect";
import { analyses, ideas } from "@/app/db/schema/schema";
import { eq, desc } from "drizzle-orm";

export async function getHistoryAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return [];
    }

    const userId = session.user.id;

    // Fetch analyses joined with ideas
    const history = await db.select({
        id: analyses.id,
        verdict: analyses.verdict,
        probability: analyses.probability,
        createdAt: analyses.createdAt,
        idea: ideas.content,
    })
        .from(analyses)
        .innerJoin(ideas, eq(analyses.ideaId, ideas.id))
        .where(eq(ideas.userId, userId))
        .orderBy(desc(analyses.createdAt))
        .limit(20); // Limit to last 20 for performance

    return history;
}
