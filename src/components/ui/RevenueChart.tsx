"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DteAnalyticsSeriePunto } from "@/lib/integrations/dte";

interface RevenueChartProps {
  serie: DteAnalyticsSeriePunto[];
  momGrowth?: number;
}

function formatYAxis(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
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
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "hsl(var(--text-secondary))" }}>
        Ingresos:{" "}
        <strong style={{ color: "#22c55e" }}>
          ${Number(payload[0].value).toLocaleString("es-SV", { minimumFractionDigits: 2 })}
        </strong>
      </div>
    </div>
  );
}

export function RevenueChart({ serie, momGrowth }: RevenueChartProps) {
  const data = serie.slice(-6).map((p) => ({
    mes: p.mes_label,
    Ingresos: p.ingresos,
  }));

  if (!data.length) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: "hsl(var(--text-muted))", fontSize: 13 }}>
        Sin datos de ingresos
      </div>
    );
  }

  const isPositive = (momGrowth ?? 0) >= 0;

  return (
    <div>
      {momGrowth !== undefined && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "hsl(var(--text-primary))" }}>
            ${Number(data[data.length - 1]?.Ingresos ?? 0).toLocaleString("es-SV", { minimumFractionDigits: 2 })}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: isPositive ? "#22c55e" : "#ef4444",
              background: isPositive ? "hsl(142 71% 45% / 0.12)" : "hsl(0 84% 60% / 0.12)",
              padding: "2px 7px",
              borderRadius: 999,
            }}
          >
            {isPositive ? "+" : ""}{momGrowth.toFixed(1)}% MoM
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border-default))" strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: "hsl(var(--text-muted))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: "hsl(var(--text-muted))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border-default))", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="Ingresos"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={{ fill: "#22c55e", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "#22c55e" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
