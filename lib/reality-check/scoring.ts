export interface AgentRiskScore {
    name: string;
    score: number;
    weight: number;
}

export function calculateSuccessProbability(agentScores: AgentRiskScore[]): {
    probability: number;
    reasoning: string;
} {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    let maxRiskPenalty = 0;

    for (const agent of agentScores) {
        totalWeightedScore += agent.score * agent.weight;
        totalWeight += agent.weight;

        // Penalty for extremely high risk in any single area
        if (agent.score > 85) {
            maxRiskPenalty = Math.max(maxRiskPenalty, 15); // Hard penalty
        } else if (agent.score > 70) {
            maxRiskPenalty = Math.max(maxRiskPenalty, 10);
        }
    }

    if (totalWeight === 0) return { probability: 50, reasoning: "No valid scores" };

    const averageRisk = totalWeightedScore / totalWeight;

    // Base probability is inverse of risk
    let probability = 100 - averageRisk;

    // Apply penalties
    probability -= maxRiskPenalty;

    // Clamp to 5-90% range as per requirements
    probability = Math.max(5, Math.min(90, probability));

    return {
        probability: Math.round(probability),
        reasoning: `Base risk: ${Math.round(averageRisk)}%. Penalties: ${maxRiskPenalty}%. Final: ${Math.round(probability)}%`
    };
}
