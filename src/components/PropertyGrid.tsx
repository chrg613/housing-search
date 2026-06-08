import React from "react";
import { RankedProperty } from "../ai/validator";

interface PropertyGridProps {
  properties: RankedProperty[];
  onSelectProperty: (property: RankedProperty) => void;
  loading: boolean;
  hasSearched: boolean;
}

const SkeletonCard = () => (
  <div style={{
    background: "var(--ink-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
  }}>
    <div className="animate-shimmer" style={{ height: 220, width: "100%" }} />
    <div style={{ padding: "22px 22px 24px" }}>
      <div className="animate-shimmer" style={{ height: 10, width: "40%", borderRadius: 4, marginBottom: 12 }} />
      <div className="animate-shimmer" style={{ height: 18, width: "75%", borderRadius: 4, marginBottom: 8 }} />
      <div className="animate-shimmer" style={{ height: 13, width: "55%", borderRadius: 4 }} />
    </div>
  </div>
);

const TypeBadge: React.FC<{ type: string }> = ({ type }) => (
  <span style={{
    background: type === "rent" ? "rgba(82,183,136,0.15)" : "rgba(201,168,76,0.12)",
    border: `1px solid ${type === "rent" ? "rgba(82,183,136,0.3)" : "rgba(201,168,76,0.25)"}`,
    color: type === "rent" ? "var(--emerald-light)" : "var(--gold)",
    fontSize: "10px", fontWeight: 500,
    letterSpacing: "0.12em", textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: "50px",
  }}>
    {type === "rent" ? "For Rent" : "For Sale"}
  </span>
);

const MatchBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 80 ? "#52b788" : score >= 60 ? "var(--gold)" : "var(--text-muted)";
  return (
    <span style={{
      background: "rgba(14,14,13,0.85)",
      backdropFilter: "blur(8px)",
      border: `1px solid ${color}44`,
      color,
      fontSize: "10px", fontWeight: 500,
      letterSpacing: "0.1em",
      padding: "5px 10px",
      borderRadius: "50px",
      display: "flex", alignItems: "center", gap: "5px"
    }}>
      <span style={{ fontSize: 8, opacity: 0.8 }}>●</span>
      {score}% match
    </span>
  );
};

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  onSelectProperty,
  loading,
  hasSearched,
}) => {
  if (loading) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
      </div>
    );
  }

  if (hasSearched && properties.length === 0) {
    return (
      <div style={{
        background: "var(--ink-2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "64px 32px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "32px", marginBottom: "16px", opacity: 0.4 }}>◻</div>
        <p style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, color: "var(--text-secondary)", marginBottom: 8 }}>
          No listings match these parameters.
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 300 }}>
          Try adjusting your budget or location filters above.
        </p>
      </div>
    );
  }

  if (!hasSearched) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    }}>
      {properties.map((item, idx) => (
        <PropertyCard
          key={item.id}
          item={item}
          idx={idx}
          hasSearched={hasSearched}
          onSelect={onSelectProperty}
        />
      ))}
    </div>
  );
};

const PropertyCard: React.FC<{
  item: RankedProperty;
  idx: number;
  hasSearched: boolean;
  onSelect: (p: RankedProperty) => void;
}> = ({ item, idx, hasSearched, onSelect }) => {
  const [hovered, setHovered] = React.useState(false);

  const delayClass = `delay-${Math.min(idx + 1, 6)}` as string;

  return (
    <div
      className={`animate-fadeUp ${delayClass}`}
      onClick={() => onSelect(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--ink-2)",
        border: `1px solid ${hovered ? "var(--border-strong)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.25s, box-shadow 0.25s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img
          src={item.thumbnail}
          alt={item.projectName}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            filter: "brightness(0.85)",
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(14,14,13,0.1) 0%, rgba(14,14,13,0.7) 100%)",
        }} />

        {/* Top badges */}
        <div style={{
          position: "absolute", top: 14, left: 14, right: 14,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start"
        }}>
          <TypeBadge type={item.type} />
          {hasSearched && <MatchBadge score={item.matchScore} />}
        </div>

        {/* Price bottom */}
        <div style={{ position: "absolute", bottom: 14, left: 16 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "24px", fontWeight: 500,
            color: "#fff",
            letterSpacing: "-0.01em",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)"
          }}>
            {item.priceDisplay}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px 22px" }}>
        {/* Meta row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "10px"
        }}>
          <span style={{
            fontSize: "11px", fontWeight: 500,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
            background: "var(--ink-3)",
            padding: "4px 10px", borderRadius: "50px",
          }}>
            {item.bhk} BHK · {item.sqft.toLocaleString()} sqft
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 300 }}>
            {item.facing} facing
          </span>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "18px", fontWeight: 500,
          color: "var(--text-primary)",
          letterSpacing: "0.01em",
          marginBottom: "4px",
          lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {item.projectName}
        </h3>

        {/* Location */}
        <p style={{
          fontSize: "12px", color: "var(--text-muted)",
          fontWeight: 300, display: "flex", alignItems: "center", gap: "5px"
        }}>
          <span style={{ fontSize: 10, color: "var(--gold)", opacity: 0.7 }}>◈</span>
          {item.sector}, Gurugram
        </p>

        {/* Feature tags */}
        {item.features.slice(0, 3).length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "5px",
            marginTop: "14px", paddingTop: "14px",
            borderTop: "1px solid var(--border)"
          }}>
            {item.features.slice(0, 3).map((f, i) => (
              <span key={i} style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                fontWeight: 400,
                letterSpacing: "0.05em",
                textTransform: "capitalize",
              }}>
                {i > 0 && <span style={{ margin: "0 4px", opacity: 0.3 }}>·</span>}
                {f}
              </span>
            ))}
          </div>
        )}

        {/* CTA hint */}
        <div style={{
          marginTop: "14px",
          display: "flex", alignItems: "center", gap: "6px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}>
          <span style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 400 }}>
            View details
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </div>
  );
};
