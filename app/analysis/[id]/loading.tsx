"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Central Logo Spinner */}
                <div className="relative w-32 h-32">
                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-2 border-dashed border-orange-500/30 rounded-full"
                    />

                    {/* Logo Pulse */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center p-6"
                    >
                        <div className="relative w-16 h-16">
                            <Image src="/logo.svg" alt="Loading..." fill className="object-contain" />
                        </div>
                    </motion.div>
                </div>

                {/* Text Animation */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent animate-pulse">
                        Accessing Secure Archives
                    </h2>
                    <div className="h-6 overflow-hidden">
                        <LoadingText />
                    </div>
                </div>
            </div>
        </div>
    );
}


function LoadingText() {
    const texts = [
        "Decrypting Analysis...",
        "Validating Signatures...",
        "Retrieving Expert Verdicts...",
        "Compiling Metrics...",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center h-6 relative w-full">
            <AnimatePresence mode="wait">
                <motion.span
                    key={texts[index]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-mono text-muted-foreground absolute w-full text-center"
                >
                    {texts[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
