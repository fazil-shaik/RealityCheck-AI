"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/app/db/connect";
import { ideas } from "@/app/db/schema/schema";
import { eq, and, gt, asc } from "drizzle-orm";

export async function getRateLimitStatus() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { used: 0, total: 5, resetTime: null };
    }

    const userId = session.user.id;
    const RATE_LIMIT_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
    const MAX_REQUESTS = 5;
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

    const recentIdeas = await db.select({
        createdAt: ideas.createdAt
    })
        .from(ideas)
        .where(and(
            eq(ideas.userId, userId),
            gt(ideas.createdAt, windowStart)
        ))
        .orderBy(asc(ideas.createdAt));

    let resetTime: Date | null = null;
    if (recentIdeas.length > 0) {
        resetTime = new Date(recentIdeas[0].createdAt!.getTime() + RATE_LIMIT_WINDOW_MS);
    }

    return {
        used: recentIdeas.length,
        total: MAX_REQUESTS,
        resetTime: resetTime
    };
}
