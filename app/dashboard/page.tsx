"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-stone-900/50 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        RealityCheck
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {["Overview", "Analyses", "Reports", "Settings"].map((item) => (
                        <button
                            key={item}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item === "Overview"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {session?.user?.name}
                            </p>
                            <p className="text-xs text-stone-500 truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-white">Dashboard Overview</h1>
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-stone-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Analyses", value: "12", trend: "+2 this week" },
                            { label: "Risk Detections", value: "3", trend: "Low Severity" },
                            { label: "Verification Rate", value: "98.2%", trend: "+1.2%" },
                            { label: "Processing Time", value: "1.4s", trend: "-0.2s" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl bg-stone-900/50 border border-white/5 hover:border-amber-500/20 transition-colors"
                            >
                                <div className="text-stone-400 text-sm font-medium mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-2xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-emerald-400 font-medium bg-emerald-900/20 inline-block px-2 py-0.5 rounded">
                                    {stat.trend}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl bg-stone-900/50 border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h2 className="text-lg font-medium text-white">Recent Analyses</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {[1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white">
                                                Analysis Report #{202400 + i}
                                            </h4>
                                            <p className="text-xs text-stone-500">
                                                Generated 2 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            Processing
                                        </span>
                                        <button className="text-stone-400 hover:text-white">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
