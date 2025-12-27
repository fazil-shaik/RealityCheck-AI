
import { analyzeIdea } from "../lib/reality-check/index";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env" });

async function main() {
    const idea = process.argv[2];
    if (!idea) {
        console.error("Please provide an idea as a command line argument.");
        console.log('Usage: npx tsx scripts/test-reality-check.ts "My Idea"');
        process.exit(1);
    }

    if (!process.env.GROQ_API_KEY) {
        console.error("Error: GROQ_API_KEY is not set in .env");
        process.exit(1);
    }

    console.log("===========================================");
    console.log("REALITY CHECK AI - MVP");
    console.log("===========================================");
    console.log(`Analyzing: "${idea}"`);

    const start = Date.now();
    const result = await analyzeIdea(idea);
    const duration = (Date.now() - start) / 1000;

    console.log(`\nAnalysis completed in ${duration.toFixed(2)}s`);
    console.log("===========================================");

    if (result.verdict) {
        console.log(`VERDICT: ${result.verdict.verdict}`);
        console.log(`Success Probability: ${result.verdict.success_probability}%`);
        console.log("\nTop Failure Modes:");
        result.verdict.top_failure_modes.forEach(m => console.log(`- ${m}`));

        console.log("\nImprovement Actions:");
        result.verdict.improvement_actions.forEach(a => console.log(`- ${a}`));
    } else {
        console.error("Failed to generate verdict.");
    }

    console.log("\n--- Detail ---");
    console.log(`Market Risk: ${result.analysis.market?.risk_score ?? "N/A"}`);
    console.log(`Execution Risk: ${result.analysis.execution?.risk_score ?? "N/A"}`);
}

main();
