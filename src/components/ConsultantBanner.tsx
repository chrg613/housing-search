import React from "react";
import { PipelineContext } from "../ai/validator";

interface ConsultantBannerProps {
  pipelineCtx: PipelineContext;
  onSelectAlternative: (alternativeQuery: string) => void;
}

export const ConsultantBanner: React.FC<ConsultantBannerProps> = ({
  pipelineCtx,
  onSelectAlternative,
}) => {
  if (!pipelineCtx.conflictDetected) return null;

  return (
    <div
      className="animate-fadeUp"
      style={{
        background: "rgba(201, 168, 76, 0.06)",
        border: "1px solid rgba(201, 168, 76, 0.25)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "10px",
          background: "rgba(201, 168, 76, 0.12)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0
        }}>
          ⚡
        </div>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px", fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "6px"
          }}>
            Market Intelligence Alert
          </p>
          <p style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            fontWeight: 300,
          }}>
            {pipelineCtx.conflictReason}
          </p>
        </div>
      </div>

      {/* Alternatives */}
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: "18px" }}>
        <p style={{
          fontSize: "11px", fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "12px"
        }}>
          Suggested adjustments
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {pipelineCtx.suggestedAlternatives.map((alt, index) => (
            <button
              key={index}
              onClick={() => onSelectAlternative(alt)}
              style={{
                background: "var(--ink-2)",
                border: "1px solid rgba(201, 168, 76, 0.2)",
                borderRadius: "var(--radius-md)",
                padding: "10px 18px",
                fontSize: "12px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                textAlign: "left",
                letterSpacing: "0.01em",
                lineHeight: 1.4,
              }}
              onMouseEnter={e => {
                const t = e.currentTarget;
                t.style.background = "rgba(201,168,76,0.08)";
                t.style.borderColor = "rgba(201,168,76,0.4)";
                t.style.color = "var(--gold-light)";
              }}
              onMouseLeave={e => {
                const t = e.currentTarget;
                t.style.background = "var(--ink-2)";
                t.style.borderColor = "rgba(201,168,76,0.2)";
                t.style.color = "var(--text-secondary)";
              }}
            >
              {alt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
