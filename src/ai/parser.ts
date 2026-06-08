import { PARSER_SYSTEM_PROMPT } from "./prompts";

export interface RawExtractedPayload {
  bhk: number | null;
  sector: string | null;
  maxPriceLakhs: number | null;
  preferences: string[];
  followUpQuestion?: string | null;
}
export const executeRawParse = async (query: string): Promise<RawExtractedPayload> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OpenRouter token validation.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          { role: "system", content: PARSER_SYSTEM_PROMPT },
          { role: "user", content: query }
        ],
        temperature: 0.0
      })
    });

    const data = await response.json();
    const cleanOutput = data.choices[0].message.content.trim().replace(/```json|```/g, "");
    return JSON.parse(cleanOutput) as RawExtractedPayload;
  } catch (error) {
    console.error("Stage 1 compilation failure:", error);
    return { bhk: null, sector: null, maxPriceLakhs: null, preferences: [] };
  }
};