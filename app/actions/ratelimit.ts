"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/app/db/connect";
import { ideas } from "@/app/db/schema/schema";
import { eq, asc } from "drizzle-orm";

export async function getRateLimitStatus() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { used: 0, total: 5, resetTime: null };
    }

    const userId = session.user.id;
    const MAX_REQUESTS = 2;

    const allIdeas = await db.select({
        createdAt: ideas.createdAt
    })
        .from(ideas)
        .where(eq(ideas.userId, userId))
        .orderBy(asc(ideas.createdAt));

    return {
        used: allIdeas.length,
        total: MAX_REQUESTS,
        resetTime: null
    };
}
