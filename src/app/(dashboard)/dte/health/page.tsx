import { Alert, Card, Col, Descriptions, Progress, Row, Tag } from "antd";
import { Activity, Cpu, Database, Gauge, Server, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate, formatNumber } from "@/lib/formatters";
import { getDteHealthDetail } from "@/lib/integrations/dte";

async function loadDteHealth() {
  try {
    const health = await getDteHealthDetail();
    return { health };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

function getStatusTone(status: string) {
  if (status === "ok") return "success";
  if (status === "degraded") return "warning";
  return "error";
}

function formatUptime(seconds: number) {
  const totalHours = Math.floor(seconds / 3600);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--text-secondary))" }}>{children}</span>;
}

export default async function DteHealthPage() {
  const result = await loadDteHealth();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Health DTE" description="Estado operativo del backend de facturacion electronica." />
        <Alert type="error" showIcon message="Fallo la integracion DTE" description={result.error} />
      </div>
    );
  }

  const { health } = result;
  const latency = health.database.latency_ms ?? 0;
  const statusPercent = health.status === "ok" ? 100 : health.status === "degraded" ? 68 : 24;
  const poolPercent = health.database.pool.max > 0 ? Math.round((health.database.pool.total / health.database.pool.max) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Health DTE"
        description="Lectura operativa del backend superadmin: base de datos, proceso, pool y estado de tenants."
        actions={
          <Tag
            bordered={false}
            style={{
              margin: 0,
              borderRadius: 999,
              background: `hsl(var(--status-${getStatusTone(health.status)}-bg))`,
              color: `hsl(var(--status-${getStatusTone(health.status)}))`,
              fontWeight: 700,
            }}
          >
            {health.status}
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Estado" value={health.status.toUpperCase()} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Latencia" value={`${formatNumber(latency)} ms`} accentVar="--section-dte" icon={<Gauge size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Pool usado" value={`${poolPercent}%`} accentVar="--section-dte" icon={<Database size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Uptime" value={formatUptime(health.process.uptime_seconds)} accentVar="--section-dte" icon={<Cpu size={18} />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title={<SectionLabel>Base de datos</SectionLabel>}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Estado">
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: `hsl(var(--status-${getStatusTone(health.status)}-bg))`,
                    color: `hsl(var(--status-${getStatusTone(health.status)}))`,
                    fontWeight: 700,
                  }}
                >
                  {health.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Version">{health.database.version}</Descriptions.Item>
              <Descriptions.Item label="Latencia">{formatNumber(latency)} ms</Descriptions.Item>
              <Descriptions.Item label="Server time">{formatDate(health.database.server_time)}</Descriptions.Item>
              <Descriptions.Item label="Pool total">{formatNumber(health.database.pool.total)}</Descriptions.Item>
              <Descriptions.Item label="Pool idle">{formatNumber(health.database.pool.idle)}</Descriptions.Item>
              <Descriptions.Item label="Pool waiting">{formatNumber(health.database.pool.waiting)}</Descriptions.Item>
              <Descriptions.Item label="Pool max">{formatNumber(health.database.pool.max)}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "hsl(var(--text-secondary))", fontWeight: 600 }}>Uso de pool</span>
                <span style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{poolPercent}%</span>
              </div>
              <Progress percent={poolPercent} showInfo={false} strokeColor="hsl(var(--section-dte))" />
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="surface-card border-0" title={<SectionLabel>Proceso y memoria</SectionLabel>}>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 16, display: "grid", placeItems: "center", background: "hsl(var(--section-dte) / 0.12)", color: "hsl(var(--section-dte))" }}>
                  <Server size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>{health.process.environment}</div>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>{health.process.node_version} - {health.process.platform} / {health.process.arch}</div>
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
                type={health.status === "ok" ? "success" : health.status === "degraded" ? "warning" : "error"}
                showIcon
                message={health.status === "ok" ? "Servicio estable" : "Requiere revision"}
                description="Usa esta vista como semaforo rapido antes de entrar a clientes, planes o auditoria."
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card className="surface-card border-0" title={<SectionLabel>Tenants del contrato</SectionLabel>}>
            <div style={{ display: "grid", gap: 12 }}>
              <MetricCard title="Total" value={health.tenants.total} accentVar="--section-dte" icon={<Activity size={18} />} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                <MetricCard title="Activos" value={health.tenants.activos} accentVar="--section-dte" />
                <MetricCard title="Pruebas" value={health.tenants.en_pruebas} accentVar="--section-dte" />
                <MetricCard title="Suspendidos" value={health.tenants.suspendidos} accentVar="--section-dte" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title={<SectionLabel>Lectura operativa</SectionLabel>}>
            <div
              style={{
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-subtle))",
                padding: "1rem",
                color: "hsl(var(--text-muted))",
                lineHeight: 1.7,
              }}
            >
              Este modulo replica la lectura que tenia el superadmin original: estado del servicio, carga de base, memoria del proceso y volumen de tenants. Cuando entre la telemetria extendida, aqui se pueden sumar version del backend, latencia por endpoint y alertas de pool.
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "hsl(var(--text-secondary))", fontWeight: 600 }}>Salud general</span>
                <span style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{health.status}</span>
              </div>
              <Progress percent={statusPercent} showInfo={false} strokeColor="hsl(var(--section-dte))" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
