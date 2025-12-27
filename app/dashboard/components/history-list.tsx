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
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Recent Scans</h3>
            <div className="space-y-2">
                {history.map((item) => (
                    <Link
                        key={item.id}
                        href={`/analysis/${item.id}`}
                        className="block bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg p-3 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.verdict === "KILL" ? "bg-red-950/50 text-red-400 border border-red-900/30" :
                                    item.verdict === "PIVOT" ? "bg-yellow-950/50 text-yellow-400 border border-yellow-900/30" :
                                        "bg-green-950/50 text-green-400 border border-green-900/30"
                                }`}>
                                {item.verdict}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                                {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ""}
                            </span>
                        </div>
                        <p className="text-sm text-neutral-300 line-clamp-2 leading-snug group-hover:text-white">
                            {item.idea}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
