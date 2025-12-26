
import { orchestrateAnalysis } from "./orchestrator";
import { synthesizeResults } from "./synthesis";

export async function analyzeIdea(idea: string) {
    // 1. Run parallel analysis
    const analysisResults = await orchestrateAnalysis(idea);

    // 2. Synthesize final verdict
    const finalVerdict = await synthesizeResults(idea, analysisResults);

    return {
        idea,
        analysis: analysisResults,
        verdict: finalVerdict
    };
}
