"use client";

import { Tooltip } from "antd";
import { useServiceHealth } from "@/components/providers/HealthProvider";
import { formatNumber } from "@/lib/formatters";

type Service = "barber" | "dte" | "erp";

const STATUS_CONFIG = {
  ok:       { color: "hsl(var(--state-success))", label: "Operativo",    pulse: true  },
  degraded: { color: "hsl(var(--state-warning))", label: "Con alerta",   pulse: false },
  error:    { color: "hsl(var(--state-danger))",  label: "Sin conexión", pulse: false },
  unknown:  { color: "hsl(var(--text-muted))",    label: "Desconocido",  pulse: false },
} as const;

export function HealthDot({ service }: { service: Service }) {
  const health = useServiceHealth(service);

  if (!health) {
    return (
      <span
        style={{
          display: "inline-block",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "hsl(var(--text-muted))",
          flexShrink: 0,
          opacity: 0.5,
        }}
      />
    );
  }

  const cfg = STATUS_CONFIG[health.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unknown;
  const tooltip = health.latencyMs
    ? `${cfg.label} · ${formatNumber(health.latencyMs)} ms`
    : cfg.label;

  return (
    <Tooltip title={tooltip} placement="right">
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
        {cfg.pulse && (
          <span
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              background: cfg.color,
              opacity: 0.3,
              animation: "health-ping 1.8s ease-out infinite",
            }}
          />
        )}
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: cfg.color,
            flexShrink: 0,
          }}
        />
      </span>
    </Tooltip>
  );
}
