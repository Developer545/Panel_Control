import { Alert, Card, Col, Descriptions, Progress, Row, Tag } from "antd";
import { Server } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate, formatNumber } from "@/lib/formatters";
import { getBarberHealthDetail } from "@/lib/integrations/barber";

async function loadBarberHealth() {
  try {
    const health = await getBarberHealthDetail();
    return { health };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

function getStatusTone(status: string) {
  if (status === "ok") return "success";
  return "error";
}

function formatUptime(seconds: number) {
  const totalHours = Math.floor(seconds / 3600);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--text-secondary))" }}>
      {children}
    </span>
  );
}

function CompactStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ borderRadius: 14, border: "1px solid hsl(var(--border-default))", background: "hsl(var(--bg-surface))", padding: "0.8rem 0.9rem", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ color: "hsl(var(--text-muted))", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ marginTop: 6, color: "hsl(var(--text-primary))", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, lineHeight: 1.05 }}>{value}</div>
    </div>
  );
}

export default async function BarberHealthPage() {
  const result = await loadBarberHealth();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Barber" title="Health Barber Pro" description="Estado operativo del backend de Barber Pro." />
        <Alert type="error" showIcon message="Fallo la integración Barber Pro" description={result.error} />
      </div>
    );
  }

  const { health } = result;
  const latency = health.database.latency_ms ?? 0;
  const tone = getStatusTone(health.status);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Barber"
        title="Health Barber Pro"
        description="Semáforo técnico del backend Barber Pro en una vista corta."
        actions={
          <Tag
            bordered={false}
            style={{
              margin: 0,
              borderRadius: 999,
              background: `hsl(var(--status-${tone}-bg))`,
              color: `hsl(var(--status-${tone}))`,
              fontWeight: 700,
            }}
          >
            {health.status}
          </Tag>
        }
      />

      {/* KPIs superiores */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <CompactStat label="Estado" value={health.status.toUpperCase()} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <CompactStat label="Latencia BD" value={`${formatNumber(latency)} ms`} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <CompactStat label="Uptime" value={formatUptime(health.process.uptime_seconds)} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <CompactStat label="Tenants totales" value={health.tenants.total} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Base de datos */}
        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title={<SectionLabel>Base de datos</SectionLabel>}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Estado">
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: `hsl(var(--status-${tone}-bg))`,
                    color: `hsl(var(--status-${tone}))`,
                    fontWeight: 700,
                  }}
                >
                  {health.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Versión">{health.database.version || "—"}</Descriptions.Item>
              <Descriptions.Item label="Latencia">{formatNumber(latency)} ms</Descriptions.Item>
              <Descriptions.Item label="Server time">{formatDate(health.database.server_time ?? undefined)}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "hsl(var(--text-secondary))", fontWeight: 600 }}>Latencia relativa</span>
                <span style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>
                  {latency < 100 ? "Óptima" : latency < 300 ? "Normal" : "Alta"}
                </span>
              </div>
              <Progress
                percent={Math.min(100, Math.round((latency / 500) * 100))}
                showInfo={false}
                strokeColor={latency < 100 ? "hsl(var(--status-success))" : latency < 300 ? "hsl(var(--section-barber))" : "hsl(var(--status-warning))"}
              />
            </div>
          </Card>
        </Col>

        {/* Proceso y memoria */}
        <Col xs={24} xl={10}>
          <Card className="surface-card border-0" title={<SectionLabel>Proceso y memoria</SectionLabel>}>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 16, display: "grid", placeItems: "center", background: "hsl(var(--section-barber) / 0.12)", color: "hsl(var(--section-barber))" }}>
                  <Server size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>{health.process.environment}</div>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>
                    {health.process.node_version} — {health.process.platform}/{health.process.arch}
                  </div>
                </div>
              </div>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="PID">{formatNumber(health.process.pid)}</Descriptions.Item>
                <Descriptions.Item label="Uptime">{formatUptime(health.process.uptime_seconds)}</Descriptions.Item>
                <Descriptions.Item label="RSS">{formatNumber(health.process.memory.rss_mb)} MB</Descriptions.Item>
                <Descriptions.Item label="Heap usado">{formatNumber(health.process.memory.heap_used_mb)} MB</Descriptions.Item>
                <Descriptions.Item label="Heap total">{formatNumber(health.process.memory.heap_total_mb)} MB</Descriptions.Item>
                <Descriptions.Item label="External">{formatNumber(health.process.memory.external_mb)} MB</Descriptions.Item>
              </Descriptions>

              <Alert
                type={health.status === "ok" ? "success" : "error"}
                showIcon
                message={health.status === "ok" ? "Servicio estable" : "Requiere revisión"}
                description="Lectura rápida antes de abrir tenants, planes o equipo."
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tenants */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card className="surface-card border-0" title={<SectionLabel>Tenants por estado</SectionLabel>}>
            <div style={{ display: "grid", gap: 10 }}>
              <CompactStat label="Total" value={health.tenants.total} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <CompactStat label="Activos" value={health.tenants.activos} />
                <CompactStat label="Trial" value={health.tenants.en_trial} />
                <CompactStat label="Suspendidos" value={health.tenants.suspendidos} />
                <CompactStat label="Cancelados" value={health.tenants.cancelados} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title={<SectionLabel>Detalle técnico</SectionLabel>}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Timestamp">{formatDate(health.timestamp)}</Descriptions.Item>
              <Descriptions.Item label="Node">{health.process.node_version}</Descriptions.Item>
              <Descriptions.Item label="Plataforma">{health.process.platform} / {health.process.arch}</Descriptions.Item>
              <Descriptions.Item label="Entorno">{health.process.environment}</Descriptions.Item>
              <Descriptions.Item label="PID">{formatNumber(health.process.pid)}</Descriptions.Item>
              <Descriptions.Item label="Versión BD">{health.database.version || "—"}</Descriptions.Item>
              <Descriptions.Item label="Latencia BD">{formatNumber(latency)} ms</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
