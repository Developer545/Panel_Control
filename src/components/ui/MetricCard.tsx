import { Card, Statistic, Tag } from "antd";

export function MetricCard({
  title,
  value,
  accentVar,
  suffix,
  hint,
}: {
  title: string;
  value: number | string;
  accentVar: string;
  suffix?: string;
  hint?: string;
}) {
  const isNumericValue = typeof value === "number";

  return (
    <Card
      className="surface-card border-0 h-full"
      styles={{
        body: {
          display: "flex",
          minHeight: "100%",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.35rem 1.4rem",
        },
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <Tag
          bordered={false}
          style={{
            margin: 0,
            background: `hsl(var(${accentVar}) / 0.14)`,
            color: `hsl(var(${accentVar}))`,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Tag>
        {hint ? (
          <span
            style={{
              textAlign: "right",
              fontSize: "0.82rem",
              lineHeight: 1.4,
              color: "hsl(var(--text-muted))",
            }}
          >
            {hint}
          </span>
        ) : null}
      </div>

      {isNumericValue ? (
        <Statistic
          value={value}
          suffix={suffix}
          valueStyle={{
            color: `hsl(var(${accentVar}))`,
            fontFamily: "var(--font-display)",
            fontSize: "2.15rem",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        />
      ) : (
        <div
          style={{
            color: `hsl(var(${accentVar}))`,
            fontFamily: "var(--font-display)",
            fontSize: "1.55rem",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          {value}
        </div>
      )}
    </Card>
  );
}
