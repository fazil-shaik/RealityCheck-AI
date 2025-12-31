"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFReport } from "./pdf-report";
import { type Analysis, type AgentOutput } from "@/app/db/schema/schema";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DownloadPDFButtonProps {
    ideaContent: string;
    analysis: Analysis;
    agentOutputs: AgentOutput[];
}

export function DownloadPDFButton({ ideaContent, analysis, agentOutputs }: DownloadPDFButtonProps) {
    // Fix: Ensure PDF generation only happens on client to avoid hydration mismatch
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-neutral-500 rounded-lg text-sm font-medium border border-neutral-700 cursor-wait"
            >
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing...
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<PDFReport ideaContent={ideaContent} analysis={analysis} agentOutputs={agentOutputs} />}
            fileName={`reality-check-analysis-${analysis.id.slice(0, 8)}.pdf`}
            className="inline-flex"
        >
            {({ loading }) => (
                <div
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm font-medium transition-colors border border-neutral-700 cursor-pointer"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {loading ? "Preparing PDF..." : "Download Report"}
                </div>
            )}
        </PDFDownloadLink>
    );
}
