import Groq from "groq-sdk";
import { z } from "zod";
import { AgentOptions, AgentResult } from "./types";

export class AgnoAgent<T> {
    private options: AgentOptions;
    private schema: z.ZodType<T>;
    // Remove direct model property, use a getter or local variable

    constructor(options: AgentOptions, schema: z.ZodType<T>) {
        this.options = options;
        this.schema = schema;
    }

    private getClient() {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not set in environment variables");
        }
        return new Groq({ apiKey });
    }

    /**
     * Run the agent statelessly on a given input.
     * Includes one retry if strict JSON validation fails.
     */
    async run(input: string, retries = 1): Promise<AgentResult<T>> {
        try {
            // Construct the prompt
            const systemPrompt = `
You are the ${this.options.name}.
**Role**: ${this.options.role}
**Description**: ${this.options.description}

**Instructions**:
${this.options.instructions.map((i) => `- ${i}`).join("\n")}

**Output Format**:
You must respond with valid JSON matching this schema. Do not output markdown code blocks, just the raw JSON.
${this.options.schemaDescription ? `Schema Structure:\n${this.options.schemaDescription}` : ""}
      `.trim();

            const userPrompt = `Analyze this idea: "${input}"`;

            const result = await this.generateWithRetry(systemPrompt, userPrompt, retries);
            return result;

        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Unknown error during agent execution",
            };
        }
    }

    private async generateWithRetry(systemPrompt: string, userPrompt: string, retriesLeft: number): Promise<AgentResult<T>> {
        let rawText = ""; // Declare rawText outside try block to be accessible in catch
        try {
            const groq = this.getClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                response_format: { type: "json_object" },
            });

            rawText = completion.choices[0]?.message?.content || "";

            // Clean up markdown code blocks if present (Groq/Llama sometimes adds ```json ... ```)
            const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

            const parsedData = JSON.parse(cleanJson);

            // Validate with Zod
            const validatedData = this.schema.parse(parsedData);

            return {
                success: true,
                data: validatedData,
                rawOutput: rawText
            };

        } catch (error: any) {
            if (retriesLeft > 0) {
                // Handle Rate Limits (429) specifically
                if (error.message?.includes("429") || error.toString().includes("429")) {
                    console.warn(`[${this.options.name}] Hit rate limit (429). Waiting 10s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    return this.generateWithRetry(systemPrompt, userPrompt, retriesLeft); // Don't decrement retries for rate limit
                }

                console.warn(`[${this.options.name}] validation failed. Retrying... Error: ${error.message}`);
                console.warn(`[${this.options.name}] Raw Output: ${rawText}`);
                // Simple retry: try again.
                // In a more complex system, we might feed the error back to the model.
                // For now, we just retry the generation.
                return this.generateWithRetry(systemPrompt, userPrompt, retriesLeft - 1);
            }

            return {
                success: false,
                error: `Validation failed: ${error.message}`,
                rawOutput: rawText // Use the rawText captured before parsing/validation failed
            };
        }
    }
}