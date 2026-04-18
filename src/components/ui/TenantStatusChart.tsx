"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TenantStatusRow {
  sistema: string;
  Activos: number;
  Trial: number;
  Suspendidos: number;
  Cancelados: number;
}

interface TenantStatusChartProps {
  data: TenantStatusRow[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(var(--bg-surface))",
        border: "1px solid hsl(var(--border-default))",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
        color: "hsl(var(--text-primary))",
        minWidth: 130,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 2 }}>
          <span style={{ color: p.fill }}>{p.name}</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: { payload?: { value: string; color: string }[] }) {
  if (!payload) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", justifyContent: "center", marginTop: 4 }}>
      {payload.map((entry) => (
        <span key={entry.value} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "hsl(var(--text-muted))" }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.color, flexShrink: 0 }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export function TenantStatusChart({ data }: TenantStatusChartProps) {
  if (!data.length) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220, color: "hsl(var(--text-muted))", fontSize: 13 }}>
        Sin datos de tenants
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid vertical={false} stroke="hsl(var(--border-default))" strokeDasharray="3 3" />
        <XAxis
          dataKey="sistema"
          tick={{ fontSize: 11, fill: "hsl(var(--text-muted))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--text-muted))" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--border-default) / 0.3)" }} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="Activos"    fill="#22c55e" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Trial"      fill="#f59e0b" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Suspendidos" fill="#ef4444" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Cancelados" fill="#6b7280" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
