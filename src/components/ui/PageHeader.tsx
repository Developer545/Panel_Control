import type { ReactNode } from "react";

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
    <section
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
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            borderRadius: "9999px",
            padding: "0.4rem 0.75rem",
            background: "hsl(var(--accent-soft) / 0.6)",
            color: "hsl(var(--accent-strong))",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <h2
          style={{
            margin: "0.95rem 0 0.4rem 0",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.85rem, 2.8vw, 2.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "hsl(var(--text-primary))",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: 760,
            color: "hsl(var(--text-muted))",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {actions ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "flex-end" }}>
          {actions}
        </div>
      ) : null}
    </section>
  );
}
