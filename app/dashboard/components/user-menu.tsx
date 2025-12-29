"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

export function UserMenu({ isCollapsed }: { isCollapsed?: boolean }) {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        localStorage.clear();
        sessionStorage.clear();

        // Brute-force clear cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        router.push("/");
    };

    if (!session?.user) return <div className="animate-pulse h-10 w-full bg-secondary rounded-lg"></div>;

    if (isCollapsed) {
        return (
            <div className="flex flex-col gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer" title={session.user.name || "User"}>
                    {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <Link href="/dashboard/settings" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 flex justify-center text-muted-foreground hover:text-primary transition-colors">
                        <Settings className="w-4 h-4" />
                    </Link>
                    <button onClick={handleLogout} className="p-2 rounded-lg bg-secondary hover:bg-destructive/10 flex justify-center text-muted-foreground hover:text-destructive transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                    {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 hover:border-primary/30 transition-all text-xs font-medium text-muted-foreground hover:text-primary group"
                >
                    <Settings className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary border border-border hover:bg-destructive/10 hover:border-destructive/30 transition-all text-xs font-medium text-muted-foreground hover:text-destructive"
                >
                    <LogOut className="w-3 h-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
