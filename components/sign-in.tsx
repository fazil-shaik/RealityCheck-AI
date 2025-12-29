"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (isSignUp) {
            await signUp.email({
                email,
                password,
                name,
            }, {
                onSuccess: () => {
                    router.push("/dashboard")
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                }
            });
        } else {
            await signIn.email({
                email,
                password,
            }, {
                onSuccess: () => {
                    router.push("/dashboard")
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                }
            });
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        }, {
            onSuccess: async () => {
                // If it returns a URL to redirect to (some adapters do), utilize it.
                // But typically social signin redirects automatically unless restricted.
            }
        });

        // Note: Better Auth's client might not return the URL easily if it auto-redirects.
        // If the above doesn't work, we rely on the server config in lib/auth.ts which should be correct now.
        // However, user reports issues.

        // Let's try to trust the server config, which has "prompt: consent select_account".
        // But if that fails, we might need a different approach.
        // For now, let's revert to standard call but keep the prompt param just in case updates fixed it,
        // and rely on the cookie clearing we added to UserMenu.

        // Actually, let's keep the prompt param with the ts-ignore as it might work for some versions.
        await signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
            // @ts-expect-error - Prompt param not typed in current version
            prompt: "consent select_account",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 py-12 relative transition-colors duration-300">
            {/* Theme Toggle in Corner */}
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-card rounded-xl border border-border shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {isSignUp ? "Sign up to get started" : "Sign in to continue"}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-input"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder-muted-foreground outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder-muted-foreground outline-none transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder-muted-foreground outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-4 py-3 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground font-medium rounded-lg hover:from-primary/90 hover:to-orange-500 transition-all shadow-lg shadow-primary/20"
                        >
                            {isSignUp ? "Create Account" : "Sign In"}
                        </button>
                    </form>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
