import React, { useEffect, useRef, useState } from "react";
import "./index.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type PropertyType = "sale" | "rent";

interface LocalityDetails {
  schools: string[];
  hospitals: string[];
  metro: string[];
  parks: string[];
}

interface Property {
  id: string;
  type: PropertyType;
  bhk: number;
  sqft: number;
  sector: string;
  projectName: string;
  priceLakhs: number;
  priceDisplay: string;
  thumbnail: string;
  facing: string;
  amenities: string[];
  features: string[];
  mapQuery: string;
  localityDetails: LocalityDetails;
}

interface ParsedQuery {
  bhk: number | null;
  sector: string | null;
  maxPriceLakhs: number | null;
  preferences: string[];
  confidenceScore: number;
  conflictDetected: boolean;
  conflictReason: string | null;
  suggestedAlternatives: string[];
  followUpQuestion: string | null;
}

interface RankedProperty extends Property {
  matchScore: number;
  matchReasons: string[];
  matchBadge: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  parsedQuery?: ParsedQuery;
  results?: RankedProperty[];
  isLoading?: boolean;
}

// ─── Property Data ────────────────────────────────────────────────────────────
const gurgaonProperties: Property[] = [
  {
    id: "prop-1", type: "sale", bhk: 3, sqft: 2200, sector: "Sector 50",
    projectName: "Unitech Nirvana Country", priceLakhs: 240, priceDisplay: "₹2.40 Cr",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    facing: "East", amenities: ["Gated Security", "Clubhouse", "Swimming Pool", "Power Backup"],
    features: ["sunlight", "schools", "pool", "luxury", "family"],
    mapQuery: "Nirvana Country Sector 50 Gurugram",
    localityDetails: {
      schools: ["Delhi Public School (400m)", "St. Xavier's High School (1.1km)"],
      hospitals: ["Artemis Hospital (2.3km)", "Park Hospital (1.5km)"],
      metro: ["Sector 54 Rapid Metro (3.8km)"],
      parks: ["Nirvana Central Park (200m)"],
    },
  },
  {
    id: "prop-2", type: "sale", bhk: 2, sqft: 1350, sector: "Sector 50",
    projectName: "Emaar Marbella Villas Complex", priceLakhs: 85, priceDisplay: "₹85 Lakhs",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    facing: "North-East", amenities: ["Gym", "Reserved Parking", "Modular Kitchen", "Lift"],
    features: ["sunlight", "budget", "family", "schools"],
    mapQuery: "Emaar Marbella Sector 50 Gurugram",
    localityDetails: {
      schools: ["Amity International School (1.2km)"],
      hospitals: ["Artemis Hospital (2.5km)"],
      metro: ["Sector 53-54 Metro Station (4.0km)"],
      parks: ["Emaar Community Green Space (150m)"],
    },
  },
  {
    id: "prop-3", type: "sale", bhk: 4, sqft: 3600, sector: "Sector 43",
    projectName: "DLF The Gallops", priceLakhs: 480, priceDisplay: "₹4.80 Cr",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    facing: "South-East", amenities: ["Private Lift", "Infinity Pool", "Concierge", "VRV AC"],
    features: ["luxury", "metro", "pool", "sunlight", "high-rise"],
    mapQuery: "DLF Phase 4 Sector 43 Gurugram",
    localityDetails: {
      schools: ["The Shri Ram School (1.5km)", "Chiranjiv Bharati School (700m)"],
      hospitals: ["Max Super Speciality Hospital (800m)", "Fortis Memorial Research Institute (1.2km)"],
      metro: ["Sector 42-43 Metro Station (300m)", "HUDA City Centre (1.1km)"],
      parks: ["DLF Golf and Country Club (1.8km)", "Gallops Resident Park (100m)"],
    },
  },
  {
    id: "prop-4", type: "rent", bhk: 3, sqft: 2000, sector: "Sector 54",
    projectName: "Suncity Heights", priceLakhs: 65, priceDisplay: "₹65,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    facing: "West", amenities: ["Gas Pipeline", "Power Backup", "Tennis Court", "Lift"],
    features: ["rent", "metro", "schools", "market"],
    mapQuery: "Suncity Heights Sector 54 Gurugram",
    localityDetails: {
      schools: ["Suncity School (200m)", "Presidium School (1.4km)"],
      hospitals: ["Paras Hospital (2.0km)", "W Pratiksha Hospital (2.5km)"],
      metro: ["Sector 54 Chowk Rapid Metro (400m)"],
      parks: ["Suncity Central Park (300m)"],
    },
  },
  {
    id: "prop-5", type: "sale", bhk: 3, sqft: 1950, sector: "Sector 54",
    projectName: "DLF Park Place", priceLakhs: 310, priceDisplay: "₹3.10 Cr",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    facing: "North", amenities: ["Gymnasium", "Pet Park", "Multi-tier Security", "Spa"],
    features: ["luxury", "metro", "pool", "family"],
    mapQuery: "DLF Park Place Sector 54 Gurugram",
    localityDetails: {
      schools: ["Shiv Nadar School (2.8km)", "Suncity School (900m)"],
      hospitals: ["Fortis Hospital (3.5km)", "Paras Hospital (1.5km)"],
      metro: ["Sector 54 Chowk Metro Station (600m)"],
      parks: ["Aravalli Biodiversity Park (3.5km)", "DLF Horizon Linear Park (1.2km)"],
    },
  },
  {
    id: "prop-6", type: "sale", bhk: 2, sqft: 1150, sector: "Sector 57",
    projectName: "Ansal Florence Greens", priceLakhs: 72, priceDisplay: "₹72 Lakhs",
    thumbnail: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
    facing: "East", amenities: ["Reserved Parking", "Water Storage", "Independent Floor Layout"],
    features: ["budget", "sunlight", "schools", "low-rise"],
    mapQuery: "Hong Kong Bazaar Sector 57 Gurugram",
    localityDetails: {
      schools: ["Scottish High International School (1.0km)", "Boomerang Pre-School (300m)"],
      hospitals: ["W Pratiksha Hospital (900m)"],
      metro: ["Sector 56 Metro Station (2.1km)"],
      parks: ["Sector 57 HUDA Block Park (150m)"],
    },
  },
  {
    id: "prop-7", type: "rent", bhk: 2, sqft: 1250, sector: "Sector 57",
    projectName: "Sushant Lok 3 Builder Floors", priceLakhs: 32, priceDisplay: "₹32,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
    facing: "South", amenities: ["Balcony", "Lift", "Covered Parking"],
    features: ["sunlight", "quiet", "rent", "family"],
    mapQuery: "Sushant Lok 3 Sector 57 Gurugram",
    localityDetails: {
      schools: ["Manav Rachna International School (1.6km)"],
      hospitals: ["Columbia Asia Hospital (2.0km)"],
      metro: ["Sector 55-56 Metro Station (2.8km)"],
      parks: ["Sushant Lok Park (250m)"],
    },
  },
  {
    id: "prop-8", type: "sale", bhk: 1, sqft: 720, sector: "Sector 67",
    projectName: "M3M Marina", priceLakhs: 58, priceDisplay: "₹58 Lakhs",
    thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    facing: "North-East", amenities: ["Clubhouse", "Pool", "Gym", "Power Backup"],
    features: ["investment", "metro", "pool", "budget"],
    mapQuery: "M3M Marina Sector 67 Gurugram",
    localityDetails: {
      schools: ["St. Xavier's High School (2.2km)"],
      hospitals: ["Medanta Medicity (6.2km)"],
      metro: ["Sohna Road Connectivity Corridor"],
      parks: ["Central Park 67 (400m)"],
    },
  },
  {
    id: "prop-9", type: "sale", bhk: 3, sqft: 1750, sector: "Sector 82",
    projectName: "Mapsko Casa Bella", priceLakhs: 118, priceDisplay: "₹1.18 Cr",
    thumbnail: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1200&auto=format&fit=crop",
    facing: "East", amenities: ["Gym", "Garden", "Play Area", "Parking"],
    features: ["family", "green", "budget", "sunlight"],
    mapQuery: "Mapsko Casa Bella Sector 82 Gurugram",
    localityDetails: {
      schools: ["RPS International School (2.0km)", "DPS Sector 84 (3.5km)"],
      hospitals: ["Artemis Lite Clinic (4.1km)"],
      metro: ["Dwarka Expressway Upcoming Metro Corridor"],
      parks: ["Sector 82 Central Green (300m)"],
    },
  },
  {
    id: "prop-10", type: "rent", bhk: 1, sqft: 580, sector: "Sector 43",
    projectName: "Executive Studio Residences", priceLakhs: 48, priceDisplay: "₹48,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    facing: "North", amenities: ["Housekeeping", "Wi-Fi", "Security", "Elevator"],
    features: ["quiet", "commute", "investment", "metro"],
    mapQuery: "Executive Studio Residences Sector 43 Gurugram",
    localityDetails: {
      schools: ["The Shri Ram School (1.3km)"],
      hospitals: ["Fortis Memorial Research Institute (1.0km)"],
      metro: ["Sector 42-43 Metro Station (350m)"],
      parks: ["Neighbourhood Garden Pocket (180m)"],
    },
  },
  {
    id: "prop-11", type: "sale", bhk: 2, sqft: 1300, sector: "Sector 102",
    projectName: "Shapoorji Pallonji Joyville", priceLakhs: 115, priceDisplay: "₹1.15 Cr",
    thumbnail: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1200&auto=format&fit=crop",
    facing: "South-East", amenities: ["Air Purifiers", "Gym", "Aravalli Facing Deck", "AC Lounge"],
    features: ["sunlight", "gym", "family", "luxury"],
    mapQuery: "Joyville Shapoorji Sector 102 Gurugram",
    localityDetails: {
      schools: ["Doon Public School (1.1km)", "Imperial Heritage School (2.0km)"],
      hospitals: ["Signature Advanced Super Speciality Hospital (2.5km)"],
      metro: ["Dwarka Expressway Transit Hub (1.5km)"],
      parks: ["Joyville Central Pocket Park (200m)"],
    },
  },
  {
    id: "prop-12", type: "rent", bhk: 2, sqft: 1100, sector: "Sector 56",
    projectName: "Vipul Belmonte Floors", priceLakhs: 38, priceDisplay: "₹38,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
    facing: "East", amenities: ["24hr Security", "Power Backup", "Lift", "Parking"],
    features: ["rent", "sunlight", "metro", "budget", "schools"],
    mapQuery: "Vipul Belmonte Sector 56 Gurugram",
    localityDetails: {
      schools: ["GD Goenka World School (1.5km)", "Heritage Xperiential School (2km)"],
      hospitals: ["Paras Hospital Sohna Road (2.5km)"],
      metro: ["Sector 55-56 Metro Station (500m)"],
      parks: ["Sector 56 Green Belt Park (300m)"],
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

const getKey = () => {
  const m = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  return m.env?.VITE_OPENROUTER_API_KEY ?? "";
};

const callLLM = async (
  systemPrompt: string,
  userMsg: string,
  temperature = 0.15
): Promise<string> => {
  const key = getKey();
  if (!key) return "";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemma-3-27b-it:free",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMsg }],
      temperature,
    }),
  });
  if (!res.ok) return "";
  const d = await res.json();
  return (d?.choices?.[0]?.message?.content ?? "").trim();
};

// ─── Scoring ──────────────────────────────────────────────────────────────────
const scoreProperty = (p: Property, q: ParsedQuery): RankedProperty => {
  let score = 20;
  const reasons: string[] = [];
  const prefs = new Set(q.preferences.map(normalize));

  // BHK — exact +35, adjacent +12
  if (q.bhk != null) {
    if (p.bhk === q.bhk) { score += 35; reasons.push(`${p.bhk}BHK matches`); }
    else if (Math.abs(p.bhk - q.bhk) === 1) { score += 12; reasons.push(`Close to ${q.bhk}BHK`); }
    else { score -= 10; }
  } else { score += 8; }

  // Sector — exact +30
  if (q.sector) {
    if (normalize(p.sector).includes(normalize(q.sector))) { score += 30; reasons.push(`In ${p.sector}`); }
    else { score -= 8; }
  } else { score += 6; }

  // Budget — within +20, slight overshoot +4, large overshoot -15
  if (q.maxPriceLakhs != null) {
    const diff = p.priceLakhs - q.maxPriceLakhs;
    if (diff <= 0) { score += diff <= -20 ? 20 : 14; reasons.push("Within budget"); }
    else if (diff <= 15) { score += 4; reasons.push("Slightly above budget"); }
    else { score -= 15; }
  } else { score += 6; }

  // Preference token matching +6 each
  for (const f of p.features) {
    if (prefs.has(normalize(f))) { score += 6; }
  }
  // Amenity keyword matching
  for (const a of p.amenities) {
    const an = normalize(a);
    if (prefs.has("pool") && an.includes("pool")) score += 5;
    if (prefs.has("gym") && (an.includes("gym") || an.includes("gymnasium"))) score += 5;
  }
  // Sunlight + east facing
  if (prefs.has("sunlight") && normalize(p.facing).includes("east")) {
    score += 6; reasons.push("East-facing, great light");
  }
  // Metro pref
  if ((prefs.has("metro") || prefs.has("commute")) && p.features.includes("metro")) {
    score += 5; reasons.push("Metro nearby");
  }

  score = Math.max(10, Math.min(100, score));

  // Build badge
  const badgeParts: string[] = [];
  if (normalize(p.facing).includes("east") && prefs.has("sunlight")) badgeParts.push("☀ Great light");
  if ((prefs.has("school") || prefs.has("schools") || prefs.has("family")) && p.localityDetails.schools.length > 0) badgeParts.push("🏫 Near schools");
  if (q.maxPriceLakhs != null && p.priceLakhs <= q.maxPriceLakhs) badgeParts.push("✓ Budget fit");
  if ((prefs.has("metro") || prefs.has("commute")) && p.features.includes("metro")) badgeParts.push("🚇 Metro access");
  if (prefs.has("pool") && p.amenities.some(a => normalize(a).includes("pool"))) badgeParts.push("🏊 Pool");
  if (badgeParts.length === 0) badgeParts.push("Matched listing");

  return {
    ...p,
    matchScore: score,
    matchReasons: reasons.slice(0, 3).length > 0 ? reasons.slice(0, 3) : ["Gurgaon listing"],
    matchBadge: badgeParts.slice(0, 2).join(" · "),
  };
};

// ─── Core: parse + rank + cap ─────────────────────────────────────────────────
const parseAndRank = async (
  query: string,
  conversationContext: string
): Promise<{ parsed: ParsedQuery; results: RankedProperty[] }> => {
  const PARSE_SYSTEM = `You are a real estate search parser for Gurgaon properties. Extract parameters from natural language.

Return ONLY raw JSON with this exact structure:
{
  "bhk": number | null,
  "sector": "Sector NN" | null,
  "maxPriceLakhs": number | null,
  "preferences": string[],
  "confidenceScore": number,
  "conflictDetected": boolean,
  "conflictReason": string | null,
  "suggestedAlternatives": string[],
  "followUpQuestion": string | null
}

Rules:
- Convert crore to lakhs (1 cr = 100 L). "1.5 cr" → 150, "80 lakhs" → 80
- Extract features into preferences: sunlight, schools, metro, pool, gym, quiet, family, luxury, investment, green, balcony, low-rise, high-rise, commute, pet
- confidenceScore: 0-100 based on how many hard filters (bhk, sector, budget) are present
- conflictDetected: true if premium sector (43,50,54) + 3BHK+ + budget under 120L
- suggestedAlternatives: 3 specific actionable query rewrites when conflict detected
- followUpQuestion: ONE helpful clarifying question if confidence < 60 and no conflict
- NO markdown, NO backticks, raw JSON only
${conversationContext ? `\nConversation context so far: ${conversationContext}` : ""}`;

  let parsed: ParsedQuery;

  // Try LLM first, fall back to local parse
  try {
    const raw = await callLLM(PARSE_SYSTEM, query, 0.0);
    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      const obj = JSON.parse(clean.slice(start, end + 1));
      parsed = {
        bhk: typeof obj.bhk === "number" ? obj.bhk : null,
        sector: typeof obj.sector === "string" ? obj.sector : null,
        maxPriceLakhs: typeof obj.maxPriceLakhs === "number" ? obj.maxPriceLakhs : null,
        preferences: Array.isArray(obj.preferences) ? obj.preferences.map(String) : [],
        confidenceScore: typeof obj.confidenceScore === "number" ? Math.max(0, Math.min(100, obj.confidenceScore)) : 40,
        conflictDetected: Boolean(obj.conflictDetected),
        conflictReason: typeof obj.conflictReason === "string" ? obj.conflictReason : null,
        suggestedAlternatives: Array.isArray(obj.suggestedAlternatives) ? obj.suggestedAlternatives.map(String) : [],
        followUpQuestion: typeof obj.followUpQuestion === "string" ? obj.followUpQuestion : null,
      };
    } else throw new Error("no JSON");
  } catch {
    // Local fallback parser
    parsed = localParse(query);
  }

  if (parsed.conflictDetected) {
    return { parsed, results: [] };
  }

  // Score all properties
  const allScored = gurgaonProperties
    .map(p => scoreProperty(p, parsed))
    .sort((a, b) => b.matchScore - a.matchScore);

  // Determine cutoff based on confidence
  const conf = parsed.confidenceScore;
  let maxResults: number;
  let scoreCutoff: number;

  if (conf >= 75) {
    maxResults = 6; scoreCutoff = 40;
  } else if (conf >= 55) {
    maxResults = 4; scoreCutoff = 35;
  } else {
    maxResults = 2; scoreCutoff = 30;
  }

  // If we have real hard filters, also hard-filter by BHK and budget
  let filtered = allScored;
  if (parsed.bhk != null) {
    // allow exact + adjacent
    filtered = filtered.filter(p => Math.abs(p.bhk - parsed.bhk!) <= 1);
  }
  if (parsed.maxPriceLakhs != null) {
    // allow up to 15% over budget
    filtered = filtered.filter(p => p.priceLakhs <= parsed.maxPriceLakhs! * 1.15);
  }
  if (parsed.sector) {
    // If sector given, prefer sector-matched but don't hard-exclude
    const sectorMatch = filtered.filter(p => normalize(p.sector).includes(normalize(parsed.sector!)));
    if (sectorMatch.length >= 1) filtered = sectorMatch;
  }

  const results = filtered
    .filter(p => p.matchScore >= scoreCutoff)
    .slice(0, maxResults);

  return { parsed, results };
};

// ─── Simple local fallback parser ─────────────────────────────────────────────
const localParse = (query: string): ParsedQuery => {
  const text = normalize(query);
  const bhkMatch = text.match(/(\d)\s*bhk/);
  const bhk = bhkMatch ? Number(bhkMatch[1]) : null;
  const sectorMatch = text.match(/sector\s*(\d{1,3})/i);
  const sector = sectorMatch ? `Sector ${sectorMatch[1]}` : null;
  let maxPriceLakhs: number | null = null;
  const crMatch = text.match(/(\d+(?:\.\d+)?)\s*(cr|crore)/i);
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(lakh|l\b)/i);
  if (crMatch) maxPriceLakhs = Math.round(Number(crMatch[1]) * 100);
  else if (lakhMatch) maxPriceLakhs = Math.round(Number(lakhMatch[1]));

  const prefTokens = ["sunlight","school","schools","metro","park","parks","pool","gym","family","luxury","quiet","investment","green","balcony","low-rise","high-rise","commute","pet"];
  const preferences = prefTokens.filter(t => text.includes(t));
  const filled = [bhk, sector, maxPriceLakhs].filter(Boolean).length;
  const confidenceScore = Math.min(95, 25 + filled * 20 + Math.min(10, preferences.length * 3));

  const isPremium = sector && ["sector 43","sector 50","sector 54"].some(s => normalize(sector).includes(s));
  const conflictDetected = Boolean(isPremium && bhk && bhk >= 3 && maxPriceLakhs && maxPriceLakhs < 120);
  const conflictReason = conflictDetected
    ? `${sector} is a premium zone. A ${bhk}BHK there typically starts above ₹1.2 Cr.`
    : null;
  const suggestedAlternatives = conflictDetected
    ? [`Keep ${sector}, switch to 2BHK`, `Keep ${bhk}BHK, try Sector 57`, `Raise budget to ₹1.5 Cr in ${sector}`]
    : [];

  let followUpQuestion: string | null = null;
  if (!conflictDetected && filled < 2) {
    if (!bhk && !maxPriceLakhs) followUpQuestion = "Which BHK size and budget range are you looking at?";
    else if (!sector) followUpQuestion = "Do you have a preferred sector in Gurgaon?";
    else if (!maxPriceLakhs) followUpQuestion = "What's your target budget?";
  }

  return { bhk, sector, maxPriceLakhs, preferences, confidenceScore, conflictDetected, conflictReason, suggestedAlternatives, followUpQuestion };
};

// ─── AI summary + locality ────────────────────────────────────────────────────
const fetchPropertyInsights = async (
  originalQuery: string,
  property: Property,
  matchScore: number
): Promise<{ summary: string; locality: string }> => {
  const fallbackSummary = `This ${property.bhk}BHK in ${property.sector} aligns with your search on location and pricing, and brings ${property.amenities.slice(0,2).join(" and ")} to the table.`;
  const fallbackLocality = `${property.sector} is a well-connected residential corridor with good access to schools, healthcare, and daily conveniences.`;
  try {
    const [summary, locality] = await Promise.all([
      callLLM(
        "Write a 2-sentence property match explanation. Reference the user's original query. Be specific and warm. No markdown.",
        `Query: "${originalQuery}"\nProperty: ${property.bhk}BHK in ${property.sector}, ${property.priceDisplay}, ${property.sqft}sqft, facing ${property.facing}. Match score: ${matchScore}%.`,
        0.25
      ),
      callLLM(
        "Write a 2-sentence neighborhood summary for a Gurgaon home-buyer. Focus on daily life: schools, commute, parks. No markdown.",
        `Sector: ${property.sector}\nSchools: ${property.localityDetails.schools.join(", ")}\nMetro: ${property.localityDetails.metro.join(", ")}\nParks: ${property.localityDetails.parks.join(", ")}`,
        0.2
      ),
    ]);
    return {
      summary: summary || fallbackSummary,
      locality: locality || fallbackLocality,
    };
  } catch {
    return { summary: fallbackSummary, locality: fallbackLocality };
  }
};

// ─── Negotiation AI response ───────────────────────────────────────────────────
const getNegotiationResponse = async (
  userMessage: string,
  conflict: ParsedQuery,
  chatHistory: string
): Promise<string> => {
  const NEGOTIATION_SYSTEM = `You are a sharp, friendly real estate consultant negotiating with a buyer in Gurgaon, India.
The buyer has a search constraint conflict. Help them find a workable compromise.
Be conversational, direct, and brief (2-3 sentences max). Offer ONE concrete alternative path, not a list.
If they agree to a compromise, confirm it warmly and say you'll search now.
Do NOT use markdown, bullet points, or lists. Plain text only.

Conflict: ${conflict.conflictReason}
Chat history: ${chatHistory}`;

  const response = await callLLM(NEGOTIATION_SYSTEM, userMessage, 0.35);
  return response || "I understand. Let me suggest a path forward — would you like to try a nearby sector with similar character but a better price-to-size ratio?";
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const ConfidencePill: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 75 ? "#52b788" : score >= 55 ? "#c9a84c" : "#e76f51";
  const label = score >= 75 ? "High confidence" : score >= 55 ? "Medium confidence" : "Low confidence";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 50, padding: "3px 10px",
      fontSize: 11, fontWeight: 500, color, letterSpacing: "0.06em"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "block" }} />
      {label} · {score}%
    </span>
  );
};

const FilterChips: React.FC<{ parsed: ParsedQuery }> = ({ parsed }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
    {parsed.bhk != null && <Chip>🛏 {parsed.bhk} BHK</Chip>}
    {parsed.sector && <Chip>📍 {parsed.sector}</Chip>}
    {parsed.maxPriceLakhs != null && <Chip>💰 Up to {parsed.maxPriceLakhs >= 100 ? `₹${(parsed.maxPriceLakhs/100).toFixed(1)}Cr` : `₹${parsed.maxPriceLakhs}L`}</Chip>}
    {parsed.preferences.map(p => <Chip key={p} emerald>✦ {p}</Chip>)}
  </div>
);

const Chip: React.FC<React.PropsWithChildren<{ emerald?: boolean }>> = ({ children, emerald }) => (
  <span style={{
    background: emerald ? "rgba(82,183,136,0.1)" : "var(--ink-3)",
    border: `1px solid ${emerald ? "rgba(82,183,136,0.25)" : "var(--border)"}`,
    borderRadius: 50, padding: "4px 12px",
    fontSize: 11, color: emerald ? "var(--emerald-light)" : "var(--text-secondary)",
    fontWeight: 400
  }}>
    {children}
  </span>
);

const ResultsGrid: React.FC<{ results: RankedProperty[]; onSelect: (p: RankedProperty) => void }> = ({ results, onSelect }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginTop: 10 }}>
      {results.map((p, i) => (
        <div
          key={p.id}
          onClick={() => onSelect(p)}
          onMouseEnter={() => setHovered(p.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: "var(--ink-3)", border: `1px solid ${hovered === p.id ? "var(--border-strong)" : "var(--border)"}`,
            borderRadius: 16, overflow: "hidden", cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
            transform: hovered === p.id ? "translateY(-2px)" : "none",
            boxShadow: hovered === p.id ? "0 12px 32px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.2)",
            animationDelay: `${i * 0.06}s`
          }}
          className="animate-fadeUp"
        >
          <div style={{ position: "relative", height: 160 }}>
            <img src={p.thumbnail} alt={p.projectName} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(14,14,13,0.75) 100%)" }} />
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <span style={{ background: "rgba(14,14,13,0.75)", backdropFilter: "blur(4px)", border: "1px solid var(--border-strong)", borderRadius: 50, padding: "3px 9px", fontSize: 10, color: "var(--text-secondary)", fontWeight: 500 }}>
                {p.type === "rent" ? "Rent" : "Sale"}
              </span>
            </div>
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <span style={{
                background: p.matchScore >= 75 ? "rgba(82,183,136,0.85)" : p.matchScore >= 55 ? "rgba(201,168,76,0.85)" : "rgba(100,100,100,0.7)",
                borderRadius: 50, padding: "3px 9px", fontSize: 10, color: "#fff", fontWeight: 600, backdropFilter: "blur(4px)"
              }}>
                {p.matchScore}%
              </span>
            </div>
            <div style={{ position: "absolute", bottom: 8, left: 10 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {p.priceDisplay}
              </p>
            </div>
          </div>
          <div style={{ padding: "12px 14px 14px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 500, color: "var(--text-primary)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.projectName}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
              {p.bhk} BHK · {p.sqft.toLocaleString()} sqft · {p.sector}
            </p>
            <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 400, letterSpacing: "0.03em" }}>
              {p.matchBadge}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PropertyDrawer: React.FC<{
  property: RankedProperty; onClose: () => void; originalQuery: string;
}> = ({ property, onClose, originalQuery }) => {
  const [summary, setSummary] = useState("");
  const [locality, setLocality] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyInsights(originalQuery, property, property.matchScore).then(({ summary, locality }) => {
      setSummary(summary); setLocality(locality); setLoading(false);
    });
  }, [property.id]);

  const scoreColor = property.matchScore >= 75 ? "#52b788" : property.matchScore >= 55 ? "var(--gold)" : "#888";

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(5,5,4,0.65)", backdropFilter: "blur(4px)", zIndex: 40 }} className="animate-fadeIn" />
      <div className="animate-slideLeft" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(460px, 100vw)", background: "var(--ink-2)", borderLeft: "1px solid var(--border-strong)", zIndex: 50, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
          <img src={property.thumbnail} alt={property.projectName} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,14,13,0.2), rgba(14,14,13,0.85))" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "rgba(14,14,13,0.7)", backdropFilter: "blur(6px)", border: "1px solid var(--border-strong)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ position: "absolute", bottom: 14, left: 18 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#fff", marginBottom: 3 }}>{property.projectName}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{property.bhk}BHK · {property.sqft.toLocaleString()} sqft · {property.facing} facing</p>
          </div>
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(14,14,13,0.7)", backdropFilter: "blur(6px)", border: `1px solid ${scoreColor}55`, borderRadius: 50, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: scoreColor, display: "block" }} />
            <span style={{ fontSize: 11, color: scoreColor, fontWeight: 500 }}>{property.matchScore}%</span>
          </div>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", background: "var(--ink-3)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>{property.type === "rent" ? "Monthly Rent" : "Sale Price"}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "var(--gold)" }}>{property.priceDisplay}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Location</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{property.sector}</p>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Why this matches</p>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[100, 88, 70].map((w, i) => <div key={i} className="animate-shimmer" style={{ height: 11, width: `${w}%`, borderRadius: 4 }} />)}
              </div>
            ) : (
              <div style={{ background: "var(--ink-3)", borderLeft: "2px solid var(--gold)", borderRadius: "0 10px 10px 0", padding: "12px 16px" }}>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, fontStyle: "italic", fontWeight: 300 }}>"{summary}"</p>
              </div>
            )}
          </div>

          <div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Neighbourhood</p>
            {loading ? <div className="animate-shimmer" style={{ height: 36, borderRadius: 8 }} /> : (
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300, marginBottom: 14 }}>{locality}</p>
            )}
            {[
              { icon: "🏫", label: "Schools", items: property.localityDetails.schools },
              { icon: "🏥", label: "Healthcare", items: property.localityDetails.hospitals },
              { icon: "🚇", label: "Transit", items: property.localityDetails.metro },
              { icon: "🌳", label: "Parks", items: property.localityDetails.parks },
            ].map(({ icon, label, items }) => (
              <div key={label} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{label}</p>
                  {items.map(item => <p key={item} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65, fontWeight: 300 }}>{item}</p>)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {property.amenities.map(a => (
              <span key={a} style={{ background: "var(--ink-3)", border: "1px solid var(--border)", borderRadius: 50, padding: "4px 11px", fontSize: 11, color: "var(--text-muted)" }}>{a}</span>
            ))}
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.mapQuery)}`}
            target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--gold)", color: "#1a1200", borderRadius: 12, padding: "13px 22px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textDecoration: "none" }}
          >
            🧭 Open on Google Maps
          </a>
        </div>
      </div>
    </>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    text: "Welcome to AI-Powered Property Discovery. Tell me what you're looking for — be as specific or vague as you like. I'll parse your intent, flag any conflicts, and find the best matching homes in Gurgaon.",
  }]);
  const [input, setInput] = useState("2BHK in Sector 50 under 80 lakhs, good sunlight, near a school");
  const [busy, setBusy] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RankedProperty | null>(null);
  const [originalQuery, setOriginalQuery] = useState("");

  // Track the active conflict for negotiation
  const [activeConflict, setActiveConflict] = useState<ParsedQuery | null>(null);
  const [negotiating, setNegotiating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Build context string from last few messages for the LLM
  const buildContext = () =>
    messages
      .filter(m => m.text)
      .slice(-6)
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || busy) return;
    setInput("");
    setBusy(true);

    const userMsg: ChatMessage = { role: "user", text: userText };
    const loadingMsg: ChatMessage = { role: "assistant", text: "", isLoading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);

    // If we're in negotiation mode, handle conversation
    if (negotiating && activeConflict) {
      const lowerText = userText.toLowerCase();
      const isAgreeing = /yes|ok|sure|let.?s|sounds|alright|go ahead|do it|try|show|search|proceed|fine|works/i.test(lowerText);

      if (isAgreeing) {
        // User agreed — extract the alternative they chose and run a real search
        // Find if they referenced one of the alternatives
        let newQuery = activeConflict.suggestedAlternatives[0] || userText;
        for (const alt of activeConflict.suggestedAlternatives) {
          if (lowerText.includes("sector 57") || lowerText.includes("57")) newQuery = activeConflict.suggestedAlternatives.find(a => a.includes("57")) || alt;
          if (lowerText.includes("2bhk") || lowerText.includes("2 bhk")) newQuery = activeConflict.suggestedAlternatives.find(a => a.includes("2BHK")) || alt;
          if (lowerText.includes("budget") || lowerText.includes("raise") || lowerText.includes("1.5")) newQuery = activeConflict.suggestedAlternatives.find(a => a.includes("budget") || a.includes("Cr")) || alt;
        }

        setNegotiating(false);
        setActiveConflict(null);

        const { parsed, results } = await parseAndRank(newQuery, buildContext());
        const confirmText = `Perfect — running that search now. I found ${results.length} propert${results.length === 1 ? "y" : "ies"} matching the adjusted criteria.`;

        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: "assistant", text: confirmText, parsedQuery: parsed, results }
        ]);
        if (results.length > 0 && !parsed.followUpQuestion) setOriginalQuery(newQuery);
      } else {
        // Continue negotiating
        const aiReply = await getNegotiationResponse(userText, activeConflict, buildContext());
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", text: aiReply }]);
      }
      setBusy(false);
      return;
    }

    // Normal search
    try {
      const { parsed, results } = await parseAndRank(userText, buildContext());
      let replyText = "";

      if (parsed.conflictDetected) {
        replyText = parsed.conflictReason || "There's a constraint conflict with your search.";
        setActiveConflict(parsed);
        setNegotiating(true);
      } else if (results.length === 0) {
        replyText = "No listings match those exact parameters right now. Try broadening your budget or area.";
        if (parsed.followUpQuestion) replyText += ` ${parsed.followUpQuestion}`;
      } else {
        const conf = parsed.confidenceScore;
        if (conf >= 75) {
          replyText = `I found ${results.length} strong match${results.length === 1 ? "" : "es"} for your search.`;
        } else if (conf >= 55) {
          replyText = `I found ${results.length} likely match${results.length === 1 ? "" : "es"} — ${parsed.followUpQuestion ?? "you can narrow this down further."}`;
        } else {
          replyText = `Here are ${results.length} possible match${results.length === 1 ? "" : "es"} based on what I could extract. ${parsed.followUpQuestion ?? "More details would help me refine these."}`;
        }
        setOriginalQuery(userText);
      }

      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", text: replyText, parsedQuery: parsed, results: parsed.conflictDetected ? [] : results }
      ]);
    } catch {
      setMessages(prev => [...prev.slice(0, -1), {
        role: "assistant",
        text: "Something went wrong. Please try again."
      }]);
    }

    setBusy(false);
  };

  const handleAlternative = (alt: string) => {
    setInput(alt);
    sendMessage(alt);
  };

  const SUGGESTIONS = [
    "2BHK Sector 50 under 80 lakhs, east facing",
    "3BHK rent Sector 54 with metro access",
    "Luxury flat Sector 43 with pool",
    "Budget 2BHK Sector 57 under 75 lakhs",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(14,14,13,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", padding: "0 28px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="30" height="30" viewBox="0 0 72 72" fill="none"><polygon points="36,10 66,26 66,54 36,70 6,54 6,26" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.25)" strokeWidth="1.2"/><polygon points="36,10 66,26 36,42 6,26" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.22)" strokeWidth="1"/><line x1="36" y1="10" x2="36" y2="42" stroke="rgba(201,168,76,0.35)" strokeWidth="1"/></svg>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.04em" }}>AI-Powered Property Discovery</span>
          <span style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.75 }}>AI Search</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald-light)", display: "block" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Gurugram, NCR</span>
        </div>
      </nav>

      {/* Layout: chat left, nothing right (drawer handles detail) */}
      <div style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "24px 20px 0", display: "flex", flexDirection: "column" }}>
        {/* Chat thread */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, paddingBottom: 120 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }} className="animate-fadeUp">
              {/* Bubble */}
              <div style={{
                maxWidth: "82%",
                background: msg.role === "user" ? "var(--ink-3)" : "var(--ink-2)",
                border: `1px solid ${msg.role === "user" ? "var(--border-strong)" : "var(--border)"}`,
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 16px",
              }}>
                {msg.isLoading ? (
                  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className="animate-pulse-gold" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", animationDelay: `${i * 0.18}s` }} />
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{msg.text}</p>
                )}
              </div>

              {/* Parsed state pills (assistant only) */}
              {msg.role === "assistant" && msg.parsedQuery && !msg.isLoading && (
                <div style={{ maxWidth: "82%", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <ConfidencePill score={msg.parsedQuery.confidenceScore} />
                    <FilterChips parsed={msg.parsedQuery} />
                  </div>
                </div>
              )}

              {/* Conflict alternatives */}
              {msg.role === "assistant" && msg.parsedQuery?.conflictDetected && !msg.isLoading && (
                <div style={{ maxWidth: "82%", marginTop: 10, background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 14, padding: "14px 16px" }}>
                  <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                    Suggested adjustments — reply with one or type your preference:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {msg.parsedQuery.suggestedAlternatives.map((alt, i) => (
                      <button key={i} onClick={() => handleAlternative(alt)} style={{
                        background: "var(--ink-2)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 10,
                        padding: "8px 14px", fontSize: 12, color: "var(--text-secondary)", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "background 0.15s",
                        textAlign: "left"
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold-light)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink-2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results grid */}
              {msg.role === "assistant" && msg.results && msg.results.length > 0 && !msg.isLoading && (
                <div style={{ width: "100%", marginTop: 10 }}>
                  <ResultsGrid results={msg.results} onSelect={setSelectedProperty} />
                </div>
              )}

              {/* Role label */}
              <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {msg.role === "user" ? "You" : "AI-Powered Property Discovery AI"}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion chips (only when thread is short) */}
        {messages.length <= 2 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, paddingBottom: 4 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => { setInput(s); sendMessage(s); }} style={{
                background: "transparent", border: "1px solid var(--border)", borderRadius: 50,
                padding: "7px 16px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.15s, color 0.15s"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input bar — sticky at bottom */}
        <div style={{ position: "sticky", bottom: 0, paddingBottom: 24, paddingTop: 10, background: "linear-gradient(to bottom, transparent, var(--ink) 40%)" }}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} style={{
            display: "flex", gap: 10, background: "var(--ink-2)", border: "1px solid var(--border-strong)",
            borderRadius: 20, padding: "6px 6px 6px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={busy}
              placeholder={negotiating ? "Reply to continue negotiating…" : "Describe what you're looking for…"}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 14, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300, padding: "10px 0", opacity: busy ? 0.5 : 1
              }}
            />
            <button type="submit" disabled={busy || !input.trim()} style={{
              background: busy ? "var(--ink-3)" : "var(--gold)", color: busy ? "var(--text-muted)" : "#1a1200",
              border: "none", borderRadius: 14, padding: "10px 22px", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: busy || !input.trim() ? "not-allowed" : "pointer",
              opacity: !input.trim() && !busy ? 0.4 : 1, transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 7, flexShrink: 0
            }}>
              {busy ? (
                <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M4 12a8 8 0 018-8"/></svg>Thinking</>
              ) : "Send"}
            </button>
          </form>
        </div>
      </div>

      {/* Property detail drawer */}
      {selectedProperty && (
        <PropertyDrawer property={selectedProperty} onClose={() => setSelectedProperty(null)} originalQuery={originalQuery} />
      )}
    </div>
  );
};

export default App;
