
import { AgnoAgent } from "./agent-factory";
import { SynthesisSchema, SynthesisOutput } from "./types";
import { FullAnalysisResult } from "./orchestrator";

const synthesisAgent = new AgnoAgent<SynthesisOutput>(
    {
        name: "Synthesis Agent",
        role: "Chief Decision Officer / VC Partner",
        description: "Synthesizes multiple expert reports into a final investment decision.",
        instructions: [
            "Review the findings from the 5 expert agents.",
            "Weigh risks heavily. If any single risk is 'fatal', the verdict should be KILL.",
            "Do NOT be optimistic. Start from NO, and only move to PROCEED if the evidence is overwhelming.",
            "Calculate 'success_probability' conservatively. (Most startups fail, so default is low).",
            "For 'improvement_actions', provide specific pivots or fixes, not generic advice like 'do market research'.",
            "If the verdict is KILL, be brutally honest about why."
        ],
        outputSchema: SynthesisSchema
    },
    SynthesisSchema
);

export async function synthesizeResults(idea: string, analysis: FullAnalysisResult): Promise<SynthesisOutput | null> {
    // Format the inputs for the synthesis agent
    const inputs = `
Idea: "${idea}"

--- EXPERT REPORTS ---

[Market Reality]
Risk Score: ${analysis.market?.risk_score}
Findings: ${JSON.stringify(analysis.market?.key_findings)}
Hidden Risks: ${JSON.stringify(analysis.market?.hidden_risks)}

[Execution Complexity]
Risk Score: ${analysis.execution?.risk_score}
Findings: ${JSON.stringify(analysis.execution?.key_findings)}
Hidden Risks: ${JSON.stringify(analysis.execution?.hidden_risks)}

[Human & Behavioral]
Risk Score: ${analysis.behavioral?.risk_score}
Findings: ${JSON.stringify(analysis.behavioral?.key_findings)}
Hidden Risks: ${JSON.stringify(analysis.behavioral?.hidden_risks)}

[Timing & External]
Risk Score: ${analysis.timing?.risk_score}
Findings: ${JSON.stringify(analysis.timing?.key_findings)}
Hidden Risks: ${JSON.stringify(analysis.timing?.hidden_risks)}

[Historical Pattern]
Risk Score: ${analysis.history?.risk_score}
Findings: ${JSON.stringify(analysis.history?.key_findings)}
Hidden Risks: ${JSON.stringify(analysis.history?.hidden_risks)}

--- END REPORTS ---
  `;

    const result = await synthesisAgent.run(inputs);

    if (!result.success) {
        console.error("Synthesis failed:", result.error);
        return null;
    }

    return result.data || null;
}
