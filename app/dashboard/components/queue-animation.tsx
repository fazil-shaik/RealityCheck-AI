"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";


interface QueueAnimationProps {
    resetTime: Date;
    onCancel: () => void;
}

export function QueueAnimation({ resetTime, onCancel }: QueueAnimationProps) {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            if (now >= resetTime) {
                setTimeLeft("Ready!");
                return;
            }
            // Simple countdown formatting
            const diff = resetTime.getTime() - now.getTime();
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [resetTime]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full bg-stone-900/50 backdrop-blur-2xl border border-amber-500/20 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Animated Icon */}
                <div className="mb-8 relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-4 border-stone-800 border-t-amber-500"
                    />
                    <motion.div
                        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <span className="text-2xl">⏳</span>
                    </motion.div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    High Traffic: You are in Queue
                </h2>

                <p className="text-stone-400 mb-8 max-w-md mx-auto text-lg">
                    To ensure high-quality analysis for everyone, we limit rapid requests.
                    Your slot is reserved.
                </p>

                <div className="bg-stone-900/80 border border-white/10 rounded-xl px-6 py-4 mb-8 min-w-[200px]">
                    <span className="text-sm text-stone-500 uppercase tracking-widest block mb-1">
                        Review Available In
                    </span>
                    <span className="text-2xl font-mono font-bold text-amber-500">
                        {timeLeft}
                    </span>
                </div>

                <button
                    onClick={onCancel}
                    className="text-stone-500 hover:text-stone-300 transition-colors text-sm underline underline-offset-4"
                >
                    Cancel and return to input
                </button>
            </div>
        </motion.div>
    );
}
