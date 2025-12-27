"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";

export function UserMenu() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    if (!session?.user) return <div className="animate-pulse h-10 w-full bg-stone-900 rounded-lg"></div>;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-900/50 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-orange-900/20">
                    {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-stone-200 truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-stone-500 truncate">{session.user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-stone-900/30 border border-white/5 hover:bg-stone-800 hover:border-amber-500/30 transition-all text-xs font-medium text-stone-400 hover:text-amber-400 group"
                >
                    <Settings className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-stone-900/30 border border-white/5 hover:bg-red-950/30 hover:border-red-500/30 transition-all text-xs font-medium text-stone-400 hover:text-red-400"
                >
                    <LogOut className="w-3 h-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
