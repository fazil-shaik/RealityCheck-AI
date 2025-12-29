import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Code2, ShieldAlert, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function ScannerAnimation() {
    const [step, setStep] = useState(0);

    const steps = [
        { text: "Evaluating Market Fit...", icon: TrendingUp, color: "text-blue-400" },
        { text: "Analyzing Code Complexity...", icon: Code2, color: "text-purple-400" },
        { text: "Identifying Hidden Risks...", icon: ShieldAlert, color: "text-red-400" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % steps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = steps[step].icon;

    return (
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center overflow-hidden bg-background rounded-2xl border border-border">
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
                        className="absolute w-64 h-64 border border-primary/30 rounded-full"
                    />
                ))}
            </div>

            {/* Rotating Scan Line */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-[500px] h-[500px] bg-gradient-to-b from-transparent via-primary/10 to-transparent blur-3xl opacity-30"
            />

            {/* Center Core */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-t-2 border-r-2 border-orange-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.5)] z-20"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CurrentIcon className="w-8 h-8 text-white" />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold font-heading bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                        Running Reality Check
                    </h3>
                    <div className="h-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={step}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className={`text-sm font-mono ${steps[step].color}`}
                            >
                                {steps[step].text}
                            </motion.span>
                        </AnimatePresence>
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
