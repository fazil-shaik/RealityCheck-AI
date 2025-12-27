"use client";

import { motion } from "framer-motion";

export function ScannerAnimation() {
    return (
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center overflow-hidden bg-neutral-950 rounded-2xl border border-neutral-800">
            {/* Radar/Sonar Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[1, 2, 3].map((pulse, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1.5, 2] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "linear"
                        }}
                        className="absolute w-64 h-64 border border-purple-500/30 rounded-full"
                    />
                ))}
            </div>

            {/* Rotating Scan Line */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-[500px] h-[500px] bg-gradient-to-b from-transparent via-purple-500/10 to-transparent blur-3xl opacity-30"
            />

            {/* Center Core */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-purple-500/50 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-t-2 border-r-2 border-blue-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                        >
                            <span className="text-2xl">⚡️</span>
                        </motion.div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Running Reality Check
                    </h3>
                    <div className="flex flex-col gap-1 items-center">
                        <AgentTypingText text="Evaluating Market Fit..." delay={0} />
                        <AgentTypingText text="Analyzing Code Complexity..." delay={2} />
                        <AgentTypingText text="Identifying Hidden Risks..." delay={4} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AgentTypingText({ text, delay }: { text: string; delay: number }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
                duration: 4,
                times: [0, 0.1, 0.9, 1],
                delay: delay,
                repeat: Infinity,
                repeatDelay: 2
            }}
            className="text-sm font-mono text-neutral-400 block h-5"
        >
            {text}
        </motion.span>
    );
}
