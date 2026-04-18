"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PlanDonutChartProps {
  data: { name: string; value: number; color: string }[];
  total: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div
      style={{
        background: "hsl(var(--bg-surface))",
        border: "1px solid hsl(var(--border-default))",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
      }}
    >
      <span style={{ color: p.color, fontWeight: 700 }}>{name}</span>
      <span style={{ color: "hsl(var(--text-secondary))", marginLeft: 6 }}>{value} tenants</span>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: { value: string; color: string }[] }) {
  if (!payload) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", marginTop: 6 }}>
      {payload.map((entry) => (
        <span key={entry.value} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "hsl(var(--text-muted))" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export function PlanDonutChart({ data, total }: PlanDonutChartProps) {
  if (!data.length || total === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "hsl(var(--text-muted))", fontSize: 13 }}>
        Sin datos de planes
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Centro del donut */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(var(--text-primary))", lineHeight: 1 }}>
          {total}
        </div>
        <div style={{ fontSize: 10, color: "hsl(var(--text-muted))", marginTop: 2 }}>total</div>
      </div>
    </div>
  );
}
