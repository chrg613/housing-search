import React, { useRef, useEffect } from "react";
import { PipelineContext } from "../ai/validator";

interface SearchBarProps {
  inputQuery: string;
  setInputQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  pipelineCtx: PipelineContext | null;
}

const PLACEHOLDERS = [
  "3BHK in Sector 54 under ₹1.5 Cr, near good schools…",
  "2BHK in Sector 50, great sunlight, metro access…",
  "Luxury apartment Sector 43, pool, east facing…",
  "Budget 2BHK Sector 57, under 80 lakhs…",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  inputQuery,
  setInputQuery,
  onSearchSubmit,
  loading,
  pipelineCtx,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholderIdx, setPlaceholderIdx] = React.useState(0);

  useEffect(() => {
    if (!inputQuery) {
      const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 3200);
      return () => clearInterval(id);
    }
  }, [inputQuery]);

  const chips = [
    { icon: "🛏️", label: pipelineCtx?.raw.bhk ? `${pipelineCtx.raw.bhk} BHK` : null },
    { icon: "📍", label: pipelineCtx?.raw.sector ?? null },
    { icon: "💰", label: pipelineCtx?.raw.maxPriceLakhs ? `Under ₹${pipelineCtx.raw.maxPriceLakhs}L` : null },
  ].filter(c => c.label !== null);

  const prefChips = pipelineCtx?.raw.preferences ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--gold)", flexShrink: 0
        }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px", fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--text-muted)"
        }}>
          Natural Language Search
        </span>
      </div>

      {/* Input */}
      <form
        onSubmit={onSearchSubmit}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "var(--ink-2)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "6px 6px 6px 22px",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: "0 0 0 0 transparent",
        }}
        onFocus={() => {}}
        className="search-form"
      >
        {/* Search icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginRight: "14px" }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          disabled={loading}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "15px",
            color: "var(--text-primary)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.01em",
            lineHeight: 1.5,
            padding: "10px 0",
            opacity: loading ? 0.4 : 1,
          }}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          style={{
            background: loading ? "var(--ink-3)" : "var(--gold)",
            color: loading ? "var(--text-muted)" : "#1a1200",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "12px 28px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.04em",
            cursor: loading || !inputQuery.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s, opacity 0.2s, transform 0.1s",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: !inputQuery.trim() && !loading ? 0.4 : 1,
          }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"; }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path d="M4 12a8 8 0 018-8" />
              </svg>
              Parsing
            </>
          ) : (
            <>Search</>
          )}
        </button>
      </form>

      {/* Extracted filter chips */}
      {pipelineCtx && !loading && (chips.length > 0 || prefChips.length > 0) && (
        <div
          className="animate-fadeIn"
          style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          <span style={{
            fontSize: "11px", color: "var(--text-muted)",
            fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
            alignSelf: "center", marginRight: "4px"
          }}>Parsed →</span>

          {chips.map((c, i) => (
            <span key={i} style={{
              background: "var(--ink-2)",
              border: "1px solid var(--border-strong)",
              borderRadius: "50px",
              padding: "5px 14px",
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontWeight: 400,
              letterSpacing: "0.01em",
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              {c.icon} {c.label}
            </span>
          ))}

          {prefChips.map((p, i) => (
            <span key={i} style={{
              background: "rgba(82, 183, 136, 0.1)",
              border: "1px solid rgba(82, 183, 136, 0.25)",
              borderRadius: "50px",
              padding: "5px 14px",
              fontSize: "12px",
              color: "var(--emerald-light)",
              fontWeight: 400,
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              ✦ {p}
            </span>
          ))}
          {pipelineCtx?.followUpQuestion && (
            <div
              style={{
                marginTop: "14px",
                padding: "12px 14px",
                border: "1px solid rgba(201,168,76,0.18)",
                background: "rgba(201,168,76,0.05)",
                borderRadius: "12px",
                color: "var(--gold)",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              💬 {pipelineCtx.followUpQuestion}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
