import React, { useState, useEffect } from "react";
import { RankedProperty } from "../ai/validator";
import { generateMatchExplanation, generateLocalityInsight } from "../ai/pipeline";

interface PropertyModalProps {
  property: RankedProperty | null;
  onClose: () => void;
  originalQuery: string;
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontSize: "10px", fontWeight: 500,
    letterSpacing: "0.18em", textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "12px"
  }}>
    {children}
  </p>
);

const LocalityRow: React.FC<{ icon: string; label: string; items: string[] }> = ({ icon, label, items }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)"
  }}>
    <span style={{ fontSize: "15px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
    <div>
      <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</p>
      {items.map((item, i) => (
        <p key={i} style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7 }}>{item}</p>
      ))}
    </div>
  </div>
);

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  originalQuery,
}) => {
  const [explanation, setExplanation] = useState<string>("");
  const [localitySummary, setLocalitySummary] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  useEffect(() => {
    if (!property) return;
    setExplanation("");
    setLocalitySummary("");

    const fetchAIExtensions = async () => {
      setLoadingAI(true);
      try {
        const [expResult, locResult] = await Promise.all([
          generateMatchExplanation(originalQuery, property, property.matchScore),
          generateLocalityInsight(property.sector, property.localityDetails),
        ]);
        setExplanation(expResult);
        setLocalitySummary(locResult);
      } catch (err) {
        console.error("Modal AI fetch failure:", err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAIExtensions();
  }, [property, originalQuery]);

  if (!property) return null;

  const scoreColor = property.matchScore >= 80 ? "#52b788"
    : property.matchScore >= 60 ? "var(--gold)"
    : "var(--text-muted)";

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-fadeIn"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(5,5,4,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <div
        className="animate-slideLeft"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(480px, 100vw)",
          background: "var(--ink-2)",
          borderLeft: "1px solid var(--border-strong)",
          zIndex: 50,
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Image header */}
        <div style={{ position: "relative", height: 220, flexShrink: 0 }}>
          <img
            src={property.thumbnail}
            alt={property.projectName}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(14,14,13,0.3) 0%, rgba(14,14,13,0.85) 100%)"
          }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(14,14,13,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border-strong)",
              borderRadius: "8px",
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "16px",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
          >
            ✕
          </button>

          {/* Score badge */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            background: "rgba(14,14,13,0.7)", backdropFilter: "blur(8px)",
            border: `1px solid ${scoreColor}55`,
            borderRadius: "50px", padding: "5px 12px",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: scoreColor, display: "block" }} />
            <span style={{ fontSize: "11px", color: scoreColor, fontWeight: 500, letterSpacing: "0.08em" }}>
              {property.matchScore}% match
            </span>
          </div>

          {/* Title at bottom */}
          <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px", fontWeight: 500,
              color: "#fff", lineHeight: 1.25,
              marginBottom: "4px"
            }}>
              {property.projectName}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
              {property.bhk} BHK · {property.sqft.toLocaleString()} sq.ft · {property.facing} facing
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* Price & type */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 18px",
            background: "var(--ink-3)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)"
          }}>
            <div>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "4px" }}>
                {property.type === "rent" ? "Monthly Rent" : "Sale Price"}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "26px", fontWeight: 500,
                color: "var(--gold)",
              }}>
                {property.priceDisplay}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "4px" }}>Sector</p>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 400 }}>
                {property.sector}
              </p>
            </div>
          </div>

          {/* AI Match Explanation */}
          <div>
            <SectionLabel>Why this matches your search</SectionLabel>
            {loadingAI ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[100, 90, 70].map((w, i) => (
                  <div key={i} className="animate-shimmer" style={{ height: 12, width: `${w}%`, borderRadius: 4 }} />
                ))}
              </div>
            ) : (
              <div style={{
                background: "var(--ink-3)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "16px 18px",
                borderLeft: "2px solid var(--gold)",
              }}>
                <p style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  fontWeight: 300,
                }}>
                  "{explanation || "Analyzing match parameters…"}"
                </p>
              </div>
            )}
          </div>

          {/* Locality Insight */}
          <div>
            <SectionLabel>Locality overview</SectionLabel>
            {loadingAI ? (
              <div className="animate-shimmer" style={{ height: 40, borderRadius: 8 }} />
            ) : (
              <p style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                fontWeight: 300,
                marginBottom: "16px"
              }}>
                {localitySummary}
              </p>
            )}

            <div style={{ borderTop: "1px solid var(--border)" }}>
              <LocalityRow icon="🏫" label="Schools" items={property.localityDetails.schools} />
              <LocalityRow icon="🏥" label="Healthcare" items={property.localityDetails.hospitals} />
              <LocalityRow icon="🚇" label="Transit" items={property.localityDetails.metro} />
              <LocalityRow icon="🌳" label="Parks" items={property.localityDetails.parks} />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <SectionLabel>Amenities</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {property.amenities.map((a, i) => (
                <span key={i} style={{
                  background: "var(--ink-3)",
                  border: "1px solid var(--border)",
                  borderRadius: "50px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  fontWeight: 400,
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Maps CTA */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.mapQuery)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "var(--gold)",
              color: "#1a1200",
              borderRadius: "var(--radius-md)",
              padding: "14px 24px",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "opacity 0.15s, transform 0.1s",
              marginTop: "4px",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            <span>🧭</span>
            Explore on Google Maps
          </a>
        </div>
      </div>
    </>
  );
};
