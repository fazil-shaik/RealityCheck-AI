"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeIdeaAction } from "@/app/actions/analyze";
import { useRouter } from "next/navigation";
import { HistoryList } from "./components/history-list";
import { MobileNav } from "./components/mobile-nav";
import { UserMenu } from "./components/user-menu";
import { ScannerAnimation } from "./components/scanner-animation";

export default function Dashboard() {
    // ... (keep state)
    const [idea, setIdea] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAnalyze = async () => {
        // ... (keep logic)
        if (!idea.trim() || idea.length < 10) {
            setError("Please enter a detailed idea (min 10 chars).");
            return;
        }

        setIsScanning(true);
        setError(null);

        try {
            const result = await analyzeIdeaAction(idea);

            if (!result.success) {
                setError(result.error || "Analysis failed.");
                setIsScanning(false);
                return;
            }

            if (result.analysisId) {
                router.push(`/analysis/${result.analysisId}`);
            }
        } catch (e) {
            setError("An unexpected error occurred.");
            setIsScanning(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 flex flex-col md:flex-row overflow-hidden">
            {/* Mobile Nav */}
            <MobileNav />

            {/* Sidebar (Desktop) */}
            <div className="w-80 border-r border-white/10 bg-black/50 backdrop-blur-xl p-6 flex-col hidden md:flex z-20 h-screen sticky top-0">
                <div className="mb-8 pl-2 border-l-2 border-amber-500">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        RealityCheck
                    </h1>
                </div>

                <div className="mb-8">
                    <UserMenu />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <HistoryList />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative flex flex-col h-screen overflow-y-auto">
                {/* Background Ambience */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[120px]" />
                </div>

                <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10 min-h-[calc(100vh-64px)] md:min-h-screen">
                    <div className="w-full max-w-3xl">
                        <AnimatePresence mode="wait">
                            {!isScanning ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-stone-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Validate Your Reality</h2>
                                    <p className="text-stone-400 mb-6 text-base md:text-lg">
                                        Describe your startup idea. Our AI agents will simulate market reception, technical execution, and risk.
                                    </p>

                                    <textarea
                                        value={idea}
                                        onChange={(e) => setIdea(e.target.value)}
                                        placeholder="E.g., A marketplace for renting high-end camera gear with AI-powered insurance..."
                                        className="w-full h-40 md:h-48 bg-black/50 border border-white/10 rounded-xl p-4 md:p-6 text-stone-200 focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all resize-none mb-6 text-base md:text-lg placeholder:text-stone-600"
                                    />

                                    {error && (
                                        <div className="text-red-400 text-sm mb-4 bg-red-950/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-2">
                                            <span>⚠️</span> {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!idea.trim()}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
                                    >
                                        Run Simulation
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full"
                                >
                                    <ScannerAnimation />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
