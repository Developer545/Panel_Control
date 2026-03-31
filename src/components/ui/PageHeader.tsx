import type { ReactNode } from "react";
import { Tag } from "antd";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 28rem" }}>
        <Tag
          bordered={false}
          style={{
            margin: 0,
            background: "hsl(var(--accent-soft) / 0.6)",
            color: "hsl(var(--accent-strong))",
            borderRadius: 999,
            paddingInline: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontSize: 11,
            lineHeight: "22px",
          }}
        >
          {eyebrow}
        </Tag>

        <h2
          style={{
            margin: "0.85rem 0 0.35rem",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.65rem, 2.6vw, 2.2rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "hsl(var(--text-primary))",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 760,
            color: "hsl(var(--text-muted))",
          }}
        >
          {description}
        </p>
      </div>

      {actions && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "flex-end" }}>
          {actions}
        </div>
      )}
    </div>
  );
}
