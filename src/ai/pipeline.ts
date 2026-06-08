import { executeRawParse } from "./parser";
import { runPipelineEvaluation, compileAndRankResults, PipelineContext, RankedProperty } from "./validator";
import { gurgaonProperties, Property } from "../data/properties";

export interface CompletePipelineResult {
  context: PipelineContext;
  rankedResults: RankedProperty[];
}

/**
 * Stage 7: Real-time Contextual Explanation Generator
 * Fulfills core requirement #3: Explains personalized property-to-query alignment.
 */
export const generateMatchExplanation = async (
  originalQuery: string,
  property: Property,
  matchScore: number
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return "Highly matched options based on your structural criteria filters.";

  const explanationPrompt = `
    You are an elite real estate property matching consultant.
    Analyze the user's original query and explain elegantly why this specific property matches it.
    
    User Request: "${originalQuery}"
    Property Layout: ${property.bhk} BHK in ${property.sector}, priced at ${property.priceDisplay}, facing ${property.facing}.
    Algorithmic Match Engine Certainty Score: ${matchScore}%
    
    Rules:
    - Keep the output strict, concise, and under 3 lines total.
    - Explicitly call out how the budget, location, or highlighted preferences match up.
    - Do not output markdown code blocks or wrapper wrappers. Speak directly to the client.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [{ role: "user", content: explanationPrompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Stage 7 Explanation breakdown:", error);
    return `Excellent match with a score of ${matchScore}%. This asset meets your baseline spatial requirements within ${property.sector} under current market valuations.`;
  }
};

/**
 * Stage 8: AI Locality Insight Generator (Bonus Feature Option)
 * Generates an analytical micro-market neighborhood breakdown for a chosen area.
 */
export const generateLocalityInsight = async (sector: string, details: any): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return "A mature, family-friendly urban residential pocket with strong local connectivity assets.";

  const localityPrompt = `
    You are a localized urban planner focusing on Gurgaon micro-markets.
    Synthesize an analytical, 2-line lifestyle summary for a home-buyer assessing ${sector}.
    
    Infrastructure Matrix:
    - Schools: ${details.schools.join(", ")}
    - Hospitals: ${details.hospitals.join(", ")}
    - Transit Nodes: ${details.metro.join(", ")}
    
    Rules:
    - Focus strictly on liveability factors: traffic rhythm, family safety, or daily convenience.
    - Keep it strictly under 2 sentences. No filler text, no markdown backticks.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [{ role: "user", content: localityPrompt }],
        temperature: 0.2
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Stage 8 Locality analysis failure:", error);
    return "This sector displays high liveability metrics, offering seamless access to primary commercial pathways, educational infrastructure, and healthcare centers.";
  }
};

/**
 * Top-Level Unified Pipeline Runner
 * Orchestrates Stages 1 through 6 sequentially like a true structural app compiler.
 */
export const runSearchCompilationPipeline = async (userQuery: string): Promise<CompletePipelineResult> => {
  // Stage 1: Intent Extraction (LLM Call)
  const rawPayload = await executeRawParse(userQuery);

  // Stage 2 to 5: Validation, Assumption Parsing, Confidence Analysis, & Conflict Detection
  const context = runPipelineEvaluation(rawPayload);

  // Stage 6: Algorithmic Matrix Ranking
  const rankedResults = compileAndRankResults(context, gurgaonProperties);

  return {
    context,
    rankedResults
  };
};