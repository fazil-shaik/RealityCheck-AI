
import { AgnoAgent } from "./agent-factory";
import { SynthesisSchema, SynthesisOutput, SynthesisSchemaDescription } from "./types";
import { FullAnalysisResult } from "./orchestrator";

const synthesisAgent = new AgnoAgent<SynthesisOutput>(
    {
        name: "Synthesis Agent",
        role: "Chief Decision Officer / VC Partner",
        description: "Synthesizes multiple expert reports into a final investment decision.",
        instructions: [
            "Review the findings from the 5 expert agents carefully.",
            "Your goal is to provide a balanced, realistic, but CONSTRUCTIVE verdict.",
            "Do NOT default to KILL unless the idea is fundamentally flawed (e.g., illegal, physically impossible, or solved perfectly by a monopoly with no room for niche).",
            "Be generous with 'PIVOT'. If an idea has potential but a bad approach, suggest a Pivot.",
            "Be open to 'VALIDATE'. If an idea is plausible but risky, encourage testing (Validate) rather than killing it.",
            "Only use 'PROCEED' for truly exceptional, low-risk, high-reward opportunities.",
            "Balance pessimism with opportunity. Don't be 'rude', be 'critical friend'."
        ],
        outputSchema: SynthesisSchema,
        schemaDescription: SynthesisSchemaDescription
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
        // Synthesis failed
        return null;
    }

    return result.data || null;
}
