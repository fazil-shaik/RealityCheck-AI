"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeIdeaAction } from "@/app/actions/analyze";
import { useRouter } from "next/navigation";
import { HistoryList } from "./components/history-list";
import { MobileNav } from "./components/mobile-nav";
import { UserMenu } from "./components/user-menu";
import { ScannerAnimation } from "./components/scanner-animation";
import { QueueAnimation } from "./components/queue-animation";
import { UsageProgress } from "./components/usage-progress";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function Dashboard() {
    const [idea, setIdea] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isQueued, setIsQueued] = useState(false);
    const [resetTime, setResetTime] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const router = useRouter();

    const handleAnalyze = async () => {
        if (!idea.trim() || idea.length < 10) {
            setError("Please enter a detailed idea (min 10 chars).");
            return;
        }

        setIsScanning(true);
        setError(null);

        try {
            const result = await analyzeIdeaAction(idea);

            if (!result.success) {
                if (result.error === "RATE_LIMIT" && (result as any).resetTime) {
                    setResetTime(new Date((result as any).resetTime));
                    setIsQueued(true);
                } else {
                    setError(result.error || "Analysis failed.");
                }
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
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col md:flex-row overflow-hidden transition-colors duration-300">
            {/* Mobile Nav */}
            <MobileNav />

            {/* Sidebar (Desktop) */}
            <motion.div
                animate={{ width: isSidebarCollapsed ? 80 : 320 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-r border-border bg-background/95 backdrop-blur-xl flex-col hidden md:flex z-20 h-screen sticky top-0 relative group"
            >
                {/* Collapse Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary z-50 shadow-sm transition-colors"
                >
                    {isSidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>

                <div className={`p-6 flex flex-col h-full ${isSidebarCollapsed ? 'px-2' : ''}`}>
                    <div className="mb-8 flex items-center justify-between">
                        {!isSidebarCollapsed && (
                            <div className="pl-2 border-l-2 border-primary overflow-hidden">
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xl font-bold font-heading bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent whitespace-nowrap"
                                >
                                    RealityCheck
                                </motion.h1>
                            </div>
                        )}
                        {/* Hide Toggle in collapsed mode or keep it compact? Let's hide text but keep icon if possible. ModeToggle is roughly 40px w. */}
                        <div className={isSidebarCollapsed ? "w-full flex justify-center" : ""}>
                            <ModeToggle />
                        </div>
                    </div>

                    <div className="mb-8 space-y-6">
                        {!isSidebarCollapsed && <UsageProgress />}
                        <UserMenu isCollapsed={isSidebarCollapsed} />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {!isSidebarCollapsed && <HistoryList />}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 relative flex flex-col h-screen overflow-y-auto bg-muted/20">
                {/* Background Ambience */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10 min-h-[calc(100vh-64px)] md:min-h-screen">
                    <div className="w-full max-w-3xl">
                        {/* Content same as before but ensured semantic classes */}
                        <AnimatePresence mode="wait">
                            {isQueued && resetTime ? (
                                <motion.div
                                    key="queue"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <QueueAnimation
                                        resetTime={resetTime}
                                        onCancel={() => { setIsQueued(false); setResetTime(null); }}
                                    />
                                </motion.div>
                            ) : !isScanning ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl shadow-black/5"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold font-heading text-card-foreground mb-2">Validate Your Reality</h2>
                                    <p className="text-muted-foreground mb-6 text-base md:text-lg">
                                        Describe your startup idea. Our AI agents will simulate market reception, technical execution, and risk.
                                    </p>

                                    <textarea
                                        value={idea}
                                        onChange={(e) => setIdea(e.target.value)}
                                        placeholder="E.g., A marketplace for renting high-end camera gear with AI-powered insurance..."
                                        className="w-full h-40 md:h-48 bg-secondary/50 border border-input rounded-xl p-4 md:p-6 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none mb-6 text-base md:text-lg placeholder:text-muted-foreground"
                                    />

                                    {error && (
                                        <div className="text-destructive text-sm mb-4 bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-center gap-2">
                                            <span>⚠️</span> {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!idea.trim()}
                                        className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-primary-foreground font-bold py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
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
