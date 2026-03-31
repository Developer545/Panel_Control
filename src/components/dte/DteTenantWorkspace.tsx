"use client";

import type { ReactNode } from "react";
import { Alert, Card, Descriptions, Empty, Space, Table, Tag, Tabs, Timeline, type TabsProps } from "antd";
import {
  Building2,
  CalendarClock,
  FileSpreadsheet,
  KeyRound,
  MapPinned,
  Palette,
  Receipt,
  ShieldCheck,
  Signature,
  Users,
  PlugZap,
} from "lucide-react";
import type {
  DteTenantApiMh,
  DteTenantDetail,
  DteTenantDocumentConfig,
  DteTenantEmpresaConfig,
  DteTenantFirma,
  DteTenantPago,
  DteTenantSucursal,
  DteTenantTemaConfig,
  DteTenantUser,
} from "@/lib/integrations/dte";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import { DteTenantSummaryCards } from "@/components/dte/DteTenantSummaryCards";

export type DteTenantWorkspaceProps = {
  tenant: DteTenantDetail;
  pagos: DteTenantPago[] | null;
  usuarios: DteTenantUser[] | null;
  dte: DteTenantDocumentConfig[] | null;
  sucursales: DteTenantSucursal[] | null;
  apiMh: DteTenantApiMh | null;
  firma: DteTenantFirma | null;
  empresaConfig: DteTenantEmpresaConfig | null;
  temaConfig: DteTenantTemaConfig | null;
  warnings?: string[];
};

type StatusTone = "success" | "warning" | "error" | "neutral";

function statusTone(estado: DteTenantDetail["estado"] | string | null | undefined): StatusTone {
  if (estado === "activo") return "success";
  if (estado === "pruebas") return "warning";
  if (estado === "suspendido") return "error";
  return "neutral";
}

function pillStyle(tone: StatusTone) {
  if (tone === "success") {
    return {
      background: "hsl(var(--status-success-bg))",
      color: "hsl(var(--status-success))",
    };
  }

  if (tone === "warning") {
    return {
      background: "hsl(var(--status-warning-bg))",
      color: "hsl(var(--status-warning))",
    };
  }

  if (tone === "error") {
    return {
      background: "hsl(var(--status-error-bg))",
      color: "hsl(var(--status-error))",
    };
  }

  return {
    background: "hsl(var(--bg-subtle))",
    color: "hsl(var(--text-secondary))",
  };
}

function toTime(value: string | null | undefined) {
  if (!value) return Number.NEGATIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

function latestByDate<T extends { created_at?: string; updated_at?: string; fecha_pago?: string | null }>(items: T[] | null) {
  if (!items?.length) return null;

  return [...items].sort((a, b) => {
    const timeA = toTime(a.fecha_pago ?? a.created_at ?? a.updated_at);
    const timeB = toTime(b.fecha_pago ?? b.created_at ?? b.updated_at);
    return timeB - timeA;
  })[0];
}

function countPoints(sucursales: DteTenantSucursal[] | null) {
  if (!sucursales?.length) return 0;
  return sucursales.reduce((total, sucursal) => total + (sucursal.puntos_venta?.length ?? 0), 0);
}

function isExpired(date: string | null | undefined) {
  if (!date) return false;
  const time = new Date(date).getTime();
  return Number.isFinite(time) ? time < Date.now() : false;
}

function display(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Sin dato";
  return String(value);
}

function SectionCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card
      className="surface-card border-0"
      styles={{
        body: {
          display: "grid",
          gap: "1rem",
        },
      }}
    >
      <div>
        <div style={{ color: "hsl(var(--text-primary))", fontSize: 16, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 4, color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>{description}</div>
      </div>
      {children}
    </Card>
  );
}

function EmptySurface({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        border: "1px dashed hsl(var(--border-default))",
        padding: "1rem",
        background: "hsl(var(--bg-subtle))",
      }}
    >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} />
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <div style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 4, color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  );
}

function HeroStat({ label, value, helper, accentVar }: { label: string; value: string | number; helper: string; accentVar: string }) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        border: "1px solid hsl(var(--border-default) / 0.35)",
        background: "hsl(var(--bg-surface) / 0.08)",
        padding: "0.9rem 1rem",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ color: "hsl(var(--text-muted))", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ marginTop: 8, color: `hsl(var(${accentVar}))`, fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1, letterSpacing: "-0.04em" }}>
        {value}
      </div>
      <div style={{ marginTop: 6, color: "hsl(var(--text-inverse) / 0.7)", fontSize: 13, lineHeight: 1.4 }}>{helper}</div>
    </div>
  );
}

function heroBadgeStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "0.42rem 0.85rem",
    background: "hsl(var(--accent-soft) / 0.78)",
    color: "hsl(var(--accent-strong))",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
  };
}
