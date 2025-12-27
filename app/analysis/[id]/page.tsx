import { notFound } from "next/navigation";
import { db } from "@/app/db/connect";
import { analyses, agentOutputs, ideas } from "@/app/db/schema/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";


// Force dynamic rendering as this depends on DB data
export const dynamic = "force-dynamic";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Analysis with related data
    const analysis = await db.query.analyses.findFirst({
        where: eq(analyses.id, id),
        with: {
            // Drizzle doesn't support nested include easily without defining relations, 
            // so we might fetch separately if relations aren't set up in schema.ts
        }
    });

    if (!analysis) return notFound();

    // Fetch related data manually since relations might not be fully configured in schema for `query` API
    const idea = await db.query.ideas.findFirst({
        where: eq(ideas.id, analysis.ideaId || "")
    });

    const outputs = await db.query.agentOutputs.findMany({
        where: eq(agentOutputs.analysisId, analysis.id)
    });

    const isKill = analysis.verdict === "KILL";
    const statusColor = isKill ? "text-red-500" : analysis.verdict === "PIVOT" ? "text-yellow-500" : "text-green-500";
    const borderColor = isKill ? "border-red-500/50" : analysis.verdict === "PIVOT" ? "border-yellow-500/50" : "border-green-500/50";
    const bgGradient = isKill ? "from-red-950/50 to-neutral-950" : analysis.verdict === "PIVOT" ? "from-yellow-950/50 to-neutral-950" : "from-green-950/50 to-neutral-950";

    return (
        <div className={`min-h-screen bg-gradient-to-br ${bgGradient} text-neutral-100 p-6 md:p-12`}>
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="space-y-6">
                    <Link href="/dashboard" className="text-neutral-500 hover:text-white transition-colors">
                        ← Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">Analysis Results</h1>
                            <p className="text-xl text-neutral-400 font-light truncate max-w-2xl">
                                {idea?.content}
                            </p>
                        </div>

                        <div className={`flex flex-col items-end ${statusColor}`}>
                            <span className="text-sm font-mono opacity-70 uppercase tracking-widest">Verdict</span>
                            <span className="text-6xl font-black tracking-tighter">{analysis.verdict}</span>
                        </div>
                    </div>
                </div>

                {/* Main Score Card */}
                <div className={`bg-neutral-900/50 backdrop-blur-xl border ${borderColor} rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />

                    <div className="grid md:grid-cols-2 gap-12 relative z-10">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">Probability of Success</h3>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-7xl font-mono font-bold ${statusColor}`}>
                                    {analysis.probability}%
                                </span>
                                <span className="text-neutral-500 text-lg">Conservative Estimate</span>
                            </div>
                            <p className="text-neutral-300 leading-relaxed text-lg">
                                {analysis.summary}
                            </p>
                        </div>

                        <div className="space-y-4 border-l border-neutral-800 pl-0 md:pl-12">
                            <h3 className="text-lg font-bold text-neutral-300 uppercase tracking-wide">Key Findings</h3>
                            <ul className="space-y-3">
                                {/* We can extract top findings from Synthesis output if stored, or just use agent highlights */}
                                {/* Since we just persisted synthesis reasoning into 'summary', we'll rely on Agent details below for specific findings */}
                                <li className="flex items-start gap-3 text-neutral-400">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-500 flex-shrink-0" />
                                    See detailed agent breakdown below for specific risk factors.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Agent Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outputs.map((output) => (
                        <AgentCard key={output.id} output={output} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function AgentCard({ output }: { output: any }) {
    // Safely cast findings since it's JSONB
    const findings = output.findings as any;
    const isHighRisk = output.riskScore > 70;
    const isMediumRisk = output.riskScore > 40 && output.riskScore <= 70;
    const riskColor = isHighRisk ? "text-red-400" : isMediumRisk ? "text-yellow-400" : "text-green-400";
    const borderColor = isHighRisk ? "border-red-900/30" : isMediumRisk ? "border-yellow-900/30" : "border-green-900/30";

    return (
        <div className={`bg-neutral-900 border ${borderColor} rounded-xl p-6 hover:bg-neutral-800/80 transition-all group`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-neutral-200">{output.agent}</h3>
                <span className={`font-mono text-xl font-bold ${riskColor}`}>
                    {output.riskScore}<span className="text-xs opacity-50">% Risk</span>
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Findings</span>
                    <ul className="mt-2 space-y-2">
                        {findings.key_findings?.slice(0, 2).map((finding: string, i: number) => (
                            <li key={i} className="text-sm text-neutral-400 leading-snug">
                                • {finding}
                            </li>
                        ))}
                    </ul>
                </div>

                {findings.hidden_risks && findings.hidden_risks.length > 0 && (
                    <div className="pt-4 border-t border-neutral-800">
                        <span className="text-xs uppercase tracking-wider text-red-500/70 font-semibold group-hover:text-red-400 transition-colors">
                            ⚠️ Hidden Risk
                        </span>
                        <p className="mt-1 text-sm text-neutral-400">
                            {findings.hidden_risks[0]}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
