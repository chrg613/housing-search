import { RawExtractedPayload } from "./parser";
import { Property } from "../data/properties";

export interface PipelineContext {
  raw: RawExtractedPayload;
  validationErrors: string[];
  missingFields: string[];
  confidenceScore: number;
  reasoning: string[];
  conflictDetected: boolean;
  conflictReason: string | null;
  suggestedAlternatives: string[];
  followUpQuestion: string | null;
}

export const runPipelineEvaluation = (raw: RawExtractedPayload): PipelineContext => {
  const validationErrors: string[] = [];
  const missingFields: string[] = [];
  const reasoning: string[] = [];
  let confidenceScore = 100;
  let conflictDetected = false;
  let conflictReason: string | null = null;
  let suggestedAlternatives: string[] = [];

  // --- Stage 2: Runtime Validation ---
  if (raw.bhk && (raw.bhk < 1 || raw.bhk > 6)) {
    validationErrors.push("BHK specification out of bounds (1-6). Resetting parameter context.");
    raw.bhk = null;
  }
  if (raw.maxPriceLakhs && raw.maxPriceLakhs <= 0) {
    validationErrors.push("Negative or zero value pricing criteria filtered out.");
    raw.maxPriceLakhs = null;
  }

  // --- Stage 3: Assumption & Gap Metrics ---
  if (!raw.bhk) { missingFields.push("bhk"); confidenceScore -= 20; reasoning.push("BHK factor omitted."); }
  else { reasoning.push(`Configured for layout size: ${raw.bhk} BHK.`); }

  if (!raw.sector) { missingFields.push("sector"); confidenceScore -= 25; reasoning.push("Micro-market corridor sector omitted."); }
  else { reasoning.push(`Target area isolated: ${raw.sector}.`); }

  if (!raw.maxPriceLakhs) { missingFields.push("budget"); confidenceScore -= 20; reasoning.push("Financial limit unbound."); }
  else { reasoning.push(`Budget caps specified at ₹${raw.maxPriceLakhs} Lakhs.`); }

  if (raw.preferences.length > 0) { reasoning.push(`Extracted lifestyle preference tokens: ${raw.preferences.join(", ")}.`); }

  // --- Stage 5: Static Conflict Engine ---
  const premiumSectors = ["Sector 50", "Sector 54", "Sector 43"];
  if (raw.sector && raw.bhk && raw.maxPriceLakhs) {
    const isPremium = premiumSectors.some(s => raw.sector!.toLowerCase().includes(s.toLowerCase()));
    if (isPremium && raw.bhk >= 3 && raw.maxPriceLakhs < 120) {
      conflictDetected = true;
      conflictReason = `${raw.sector} is an elite zone corridor. 3BHK listings structurally market higher than ₹1.2 Cr.`;
      suggestedAlternatives = [
        `Increase threshold allocation to ₹1.6 Cr in ${raw.sector}`,
        `Downscale parameters to 2BHK footprint within ${raw.sector}`,
        `Pivot geography configuration to Sector 57 (Mid-market alternatives)`
      ];
    }
  }

  return {
    raw,
    validationErrors,
    missingFields,
    confidenceScore: Math.max(0, confidenceScore),
    reasoning,
    conflictDetected,
    conflictReason,
    suggestedAlternatives,
    followUpQuestion: raw.followUpQuestion ?? null
  };
};

// --- Stage 6: Deterministic Matrix Ranker ---
export interface RankedProperty extends Property {
  matchScore: number;
}

export const compileAndRankResults = (ctx: PipelineContext, items: Property[]): RankedProperty[] => {
  if (ctx.conflictDetected) return []; // Hold layout processing if negotiation loop fires

  return items
    .map((property) => {
      let score = 0;

      // 1. Sector Precision Weighting (40 pts)
      if (ctx.raw.sector) {
        if (property.sector.toLowerCase().includes(ctx.raw.sector.toLowerCase())) score += 40;
      } else {
        score += 20; // Blended attribution if sector unassigned
      }

      // 2. BHK Alignment Weighting (30 pts)
      if (ctx.raw.bhk) {
        if (property.bhk === ctx.raw.bhk) score += 30;
      } else {
        score += 15;
      }

      // 3. Financial Cap Verification (20 pts)
      if (ctx.raw.maxPriceLakhs) {
        if (property.priceLakhs <= ctx.raw.maxPriceLakhs) score += 20;
      } else {
        score += 10;
      }

      // 4. Keyword Preference Verification Loop (10 pts)
      if (ctx.raw.preferences.length > 0) {
        const matches = ctx.raw.preferences.filter(pref =>
          property.features.some(f => f.toLowerCase().includes(pref.toLowerCase()))
        );
        const ratio = matches.length / ctx.raw.preferences.length;
        score += Math.round(ratio * 10);
      } else {
        score += 10;
      }

      return { ...property, matchScore: score };
    })
    .filter(p => {
      // Dynamic fallback filter pass: If user specifies properties, hide blatant mismatches
      if (ctx.raw.bhk && p.bhk !== ctx.raw.bhk) return false;
      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};