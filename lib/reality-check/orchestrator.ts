
import {
    marketRealityAgent,
    executionComplexityAgent,
    humanBehavioralRiskAgent,
    timingExternalRiskAgent,
    historicalPatternAgent
} from "./agents";
import { AnalysisAgentOutput } from "./types";

export interface FullAnalysisResult {
    market: AnalysisAgentOutput | null;
    execution: AnalysisAgentOutput | null;
    behavioral: AnalysisAgentOutput | null;
    timing: AnalysisAgentOutput | null;
    history: AnalysisAgentOutput | null;
    errors: string[];
    rawResults?: Record<string, unknown>; // For debugging and persistence
}

export async function orchestrateAnalysis(idea: string): Promise<FullAnalysisResult> {
    // Starting parallel analysis


    // Run all 5 agents in parallel, but stagger them slightly to avoid instant 429s
    const [market, execution, behavioral, timing, history] = await Promise.all([
        (async () => { await new Promise(r => setTimeout(r, 0)); return marketRealityAgent.run(idea); })(),
        (async () => { await new Promise(r => setTimeout(r, 2000)); return executionComplexityAgent.run(idea); })(),
        (async () => { await new Promise(r => setTimeout(r, 4000)); return humanBehavioralRiskAgent.run(idea); })(),
        (async () => { await new Promise(r => setTimeout(r, 6000)); return timingExternalRiskAgent.run(idea); })(),
        (async () => { await new Promise(r => setTimeout(r, 8000)); return historicalPatternAgent.run(idea); })()
    ]);

    const results: FullAnalysisResult = {
        market: market.data || null,
        execution: execution.data || null,
        behavioral: behavioral.data || null,
        timing: timing.data || null,
        history: history.data || null,
        errors: [],
        rawResults: {
            market, execution, behavioral, timing, history
        }
    };

    // Collect errors
    if (!market.success) results.errors.push(`Market Agent: ${market.error}`);
    if (!execution.success) results.errors.push(`Execution Agent: ${execution.error}`);
    if (!behavioral.success) results.errors.push(`Behavioral Agent: ${behavioral.error}`);
    if (!timing.success) results.errors.push(`Timing Agent: ${timing.error}`);
    if (!history.success) results.errors.push(`History Agent: ${history.error}`);

    return results;
}
