"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRateLimitStatus } from "@/app/actions/ratelimit";

export function UsageProgress() {
    const [status, setStatus] = useState<{ used: number; total: number; resetTime: Date | null } | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            const data = await getRateLimitStatus();
            setStatus(data);
        };
        fetchStatus();
    }, []);

    if (!status) return null;

    const percentage = (status.used / status.total) * 100;
    const isCrisis = percentage >= 80;

    return (
        <div className="w-full bg-card rounded-lg p-3 border border-border mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    Daily Credits
                </span>
                <span className={`text-xs font-bold font-mono ${isCrisis ? 'text-primary' : 'text-foreground'}`}>
                    {status.used} / {status.total}
                </span>
            </div>

            <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className={`h-full rounded-full ${isCrisis ? 'bg-primary' : 'bg-primary/50'}`}
                />
            </div>

            {status.resetTime && status.used >= status.total && (
                <p className="text-[10px] text-primary/80 mt-2 text-right">
                    Resets in {Math.ceil((new Date(status.resetTime).getTime() - Date.now()) / (1000 * 60))}m
                </p>
            )}
        </div>
    );
}
