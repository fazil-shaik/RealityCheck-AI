"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistoryAction } from "@/app/actions/history";
import { formatDistanceToNow } from "date-fns";

type HistoryItem = {
    id: string;
    verdict: string;
    probability: number;
    createdAt: Date | null;
    idea: string;
};

export function HistoryList() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHistoryAction().then((data) => {
            setHistory(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-neutral-500 text-sm animate-pulse">Loading history...</div>;
    if (history.length === 0) return <div className="text-neutral-500 text-sm">No scans yet.</div>;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Recent Scans</h3>
            <div className="space-y-2">
                {history.map((item) => (
                    <Link
                        key={item.id}
                        href={`/analysis/${item.id}`}
                        className="block bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-lg p-3 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.verdict === "KILL" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                                item.verdict === "PIVOT" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                                    "bg-green-500/10 text-green-500 border border-green-500/20"
                                }`}>
                                {item.verdict}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ""}
                            </span>
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {item.idea}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
