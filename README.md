# AI-Powered Property Discovery

An AI-powered property discovery prototype built for the 360 Ghar Software Developer Intern assignment.

> Live Url : https://housing-search.vercel.app

The application allows users to search for properties using natural language, automatically extracts structured filters using an LLM, ranks matching Gurgaon properties, and generates personalized AI explanations for each recommendation.

---

## Features

### Natural Language Search

Users can describe requirements in plain English:

> "2BHK in Sector 50 Gurgaon under 80 lakhs, good sunlight, near schools"

The query is parsed into structured filters using OpenRouter.

---

### AI Query Pipeline

The search experience follows a multi-stage AI pipeline:

1. Intent Parsing
   - Extracts BHK, location, budget, and preferences.

2. Validation
   - Handles invalid or incomplete inputs.

3. Confidence Analysis
   - Estimates confidence based on information completeness.

4. Conflict Detection
   - Detects unrealistic combinations and suggests alternatives.

5. Property Ranking
   - Uses deterministic scoring to rank matching properties.

---

### Property Cards

Each property card displays:

- BHK and area
- Sector / location
- Price
- Match score
- Match reason badge

---

### AI Property Summary

Selecting a property generates a live AI explanation describing why the property matches the user's original search intent.

---

## Bonus Feature – AI Property Consultant

Instead of simply returning no results, the system identifies unrealistic search constraints and provides intelligent alternatives.

Example:

> "3BHK in Sector 50 under ₹80L"

The assistant explains the market mismatch and suggests nearby alternatives or adjusted budgets.

---

## Locality Insights

Each property includes AI-generated locality intelligence using nearby:

- Schools
- Hospitals
- Parks
- Metro connectivity

to help users evaluate the neighborhood beyond the property itself.

---

## Tech Stack

- React
- TypeScript
- Vite
- OpenRouter API


## Model Choice

> Model: google/gemma-3-27b-it:free

## Reasons:

- Reliable JSON generation
- Strong instruction following
- Fast enough for real-time prototype interactions
- Available on OpenRouter free tier

---

## Prompt Design Notes

### Query Parsing

The parsing prompt forces the model to return only structured JSON.

This improves reliability and prevents UI-breaking responses.

### What Didn't Work

Initial prompts occasionally returned explanations along with JSON.

Adding:

"Return ONLY valid JSON."

significantly improved consistency.

### Why This Design

The goal was to make the AI behave like a real estate consultant rather than a traditional filter system.

The LLM is responsible for understanding user intent and generating explanations, while validation, conflict detection, and ranking remain deterministic.
