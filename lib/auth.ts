
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/db/connect"; // Adjust path if needed
import { user, session, account, verification } from "@/app/db/schema/schema";
// Note: schema.ts now exports everything from auth-schema

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent select_account",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            // @ts-expect-error - Try top-level as well for safety
            prompt: "consent select_account",
            access_type: "offline",
        },
    },
});
