
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // Optional if on same domain
});

export const { signIn, signUp, useSession, signOut } = authClient;
