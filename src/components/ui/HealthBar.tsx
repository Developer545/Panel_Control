"use client";

import { Button, Tooltip } from "antd";
import { RefreshCw } from "lucide-react";
import { useHealth } from "@/components/providers/HealthProvider";

const SERVICE_LABELS: Record<string, string> = {
  barber: "Barber Pro",
  dte: "DTE",
  erp: "ERP Full Pro",
};

const STATUS_CONFIG = {
  ok:       { color: "#22c55e", label: "Operativo",    bg: "hsl(142 71% 45% / 0.12)" },
  degraded: { color: "#f59e0b", label: "Con alerta",   bg: "hsl(38 92% 50% / 0.12)"  },
  error:    { color: "#ef4444", label: "Sin conexion", bg: "hsl(0 84% 60% / 0.12)"   },
  unknown:  { color: "#6b7280", label: "Desconocido",  bg: "hsl(220 9% 46% / 0.12)"  },
} as const;

function formatCheckedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function HealthBar() {
  const { snapshot, loading, refresh } = useHealth();

  const services = (["barber", "dte", "erp"] as const).map((key) => {
    const health = snapshot?.[key];
    const status = (health?.status ?? "unknown") as keyof typeof STATUS_CONFIG;
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
    return { key, label: SERVICE_LABELS[key], cfg, latencyMs: health?.latencyMs ?? null };
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 14,
        border: "1px solid hsl(var(--border-default))",
        background: "hsl(var(--bg-surface))",
        fontSize: 12,
      }}
    >
      {/* Badges */}
      {services.map(({ key, label, cfg, latencyMs }) => (
        <Tooltip
          key={key}
          title={latencyMs ? `${cfg.label} · ${latencyMs} ms` : cfg.label}
          placement="bottom"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              borderRadius: 999,
              background: cfg.bg,
              border: `1px solid ${cfg.color}22`,
              cursor: "default",
            }}
          >
            {/* dot */}
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: cfg.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{label}</span>
            <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
          </span>
        </Tooltip>
      ))}

      {/* Spacer */}
      <span style={{ flex: 1 }} />

      {/* Last check */}
      {snapshot && (
        <span style={{ color: "hsl(var(--text-muted))", fontSize: 11 }}>
          Último chequeo: {formatCheckedAt(snapshot.checkedAt)}
        </span>
      )}

      {/* Refresh button */}
      <Tooltip title="Refrescar estado ahora" placement="left">
        <Button
          type="text"
          size="small"
          loading={loading}
          icon={<RefreshCw size={13} />}
          onClick={refresh}
          style={{ color: "hsl(var(--text-muted))" }}
        />
      </Tooltip>
    </div>
  );
}
