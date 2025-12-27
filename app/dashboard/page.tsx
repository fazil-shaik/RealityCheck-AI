"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeIdeaAction } from "@/app/actions/analyze";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [idea, setIdea] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {!isScanning ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl"
                        >
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                Reality Check AI
                            </h1>
                            <p className="text-neutral-400 mb-6">
                                Validate your SaaS idea with 5 AI agents before you build.
                            </p>

                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Describe your SaaS idea in detail... (e.g., 'Uber for Dog Walking but with AI-generated routes...')"
                                className="w-full h-32 bg-neutral-950/50 border border-neutral-800 rounded-xl p-4 text-neutral-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all resize-none mb-4"
                            />

                            {error && (
                                <p className="text-red-400 text-sm mb-4 bg-red-950/20 border border-red-900/50 p-2 rounded">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={isScanning || !idea.trim()}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Run Reality Check
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="relative w-24 h-24 mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl">🧠</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">
                                Analyzing your idea...
                            </h2>

                            <div className="space-y-3 w-full max-w-sm">
                                <AgentStatus name="Market Reality Agent" delay={0} />
                                <AgentStatus name="Execution Complexity Agent" delay={1.5} />
                                <AgentStatus name="Human & Behavioral Agent" delay={3} />
                                <AgentStatus name="Timing Risk Agent" delay={4.5} />
                                <AgentStatus name="Historical Pattern Agent" delay={6} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function AgentStatus({ name, delay }: { name: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg"
        >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-neutral-300">{name} is thinking...</span>
        </motion.div>
    );
}
