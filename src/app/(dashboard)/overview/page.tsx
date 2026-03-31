import { Alert, Button, Card, Col, Row, Tag } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getBarberDashboard, getBarberHealth } from "@/lib/integrations/barber";
import { getDteDashboard, getDteHealth } from "@/lib/integrations/dte";
import { getErpDashboard, getErpHealth } from "@/lib/integrations/erp";

async function loadOverview() {
  const [dteDashboard, dteHealth, barberDashboard, barberHealth, erpDashboard, erpHealth] =
    await Promise.allSettled([
      getDteDashboard(),
      getDteHealth(),
      getBarberDashboard(),
      getBarberHealth(),
      getErpDashboard(),
      getErpHealth(),
    ]);

  return {
    dteDashboard,
    dteHealth,
    barberDashboard,
    barberHealth,
    erpDashboard,
    erpHealth,
  };
}

function getStatusTone(status: string) {
  if (status === "ok") return "success";
  if (status === "degraded") return "warning";
  return "error";
}

function getStatusLabel(status: string) {
  if (status === "ok") return "Operativo";
  if (status === "degraded") return "Con degradacion";
  return "Sin conexion";
}

export default async function OverviewPage() {
  const state = await loadOverview();
  const services = [
    {
      name: "DTE",
      label: "DTE",
      accentVar: "--section-dte",
      href: "/dte/dashboard",
      description: "Facturacion y clientes",
      dashboard: state.dteDashboard,
      health: state.dteHealth,
      planCounts: null as Record<string, number> | null,
    },
    {
      name: "Barber Pro",
      label: "Barber Pro",
      accentVar: "--section-barber",
      href: "/barber/dashboard",
      description: "Operacion de barberias",
      dashboard: state.barberDashboard,
      health: state.barberHealth,
      planCounts:
        state.barberDashboard.status === "fulfilled" ? state.barberDashboard.value.por_plan : null,
    },
    {
      name: "ERP Full Pro",
      label: "ERP Full Pro",
      accentVar: "--section-erp",
      href: "/erp/dashboard",
      description: "Finanzas y administracion",
      dashboard: state.erpDashboard,
      health: state.erpHealth,
      planCounts:
        state.erpDashboard.status === "fulfilled" ? state.erpDashboard.value.por_plan : null,
    },
  ].map((service) => {
    const dashboard = service.dashboard.status === "fulfilled" ? service.dashboard.value : null;
    const health = service.health.status === "fulfilled" ? service.health.value : null;

    return {
      ...service,
      dashboardError: service.dashboard.status === "rejected" ? service.dashboard.reason : null,
      healthError: service.health.status === "rejected" ? service.health.reason : null,
      dashboard,
      health,
      planRows:
        dashboard && service.planCounts
          ? Object.entries(service.planCounts).map(([plan, total]) => ({
              key: `${service.name}-${plan}`,
              cells: [
                <span key={`${service.name}-${plan}-label`}>{plan}</span>,
                <strong key={`${service.name}-${plan}-total`}>{formatNumber(total)}</strong>,
              ],
            }))
          : [],
    };
  });

  const healthyCount = services.filter((service) => service.health?.status === "ok").length;
  const degradedCount = services.filter((service) => service.health?.status === "degraded").length;
  const offlineCount = services.length - healthyCount - degradedCount;
  const connectedCount = services.filter((service) => service.dashboard).length;
  const totalTenants = services.reduce((sum, service) => sum + (service.dashboard?.total ?? 0), 0);
  const activeTenants = services.reduce((sum, service) => sum + (service.dashboard?.activos ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Vista global del ecosistema"
        description="Resumen ejecutivo del estado de los tres sistemas conectados al panel central."
        actions={
          <>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: "9999px",
                paddingInline: "0.9rem",
                background: "hsl(var(--status-success-bg))",
                color: "hsl(var(--status-success))",
                fontWeight: 700,
              }}
            >
              {healthyCount} operativos
            </Tag>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: "9999px",
                paddingInline: "0.9rem",
                background: "hsl(var(--status-warning-bg))",
                color: "hsl(var(--status-warning))",
                fontWeight: 700,
              }}
            >
              {degradedCount} con alerta
            </Tag>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: "9999px",
                paddingInline: "0.9rem",
                background: "hsl(var(--status-error-bg))",
                color: "hsl(var(--status-error))",
                fontWeight: 700,
              }}
            >
              {offlineCount} sin conexion
            </Tag>
          </>
        }
      />

      <Card
        className="surface-card border-0 overflow-hidden"
        styles={{
          body: {
            display: "grid",
            gap: "1.25rem",
            padding: "1.4rem",
          },
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            alignItems: "center",
          }}
        >
          <div>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: "9999px",
                background: "hsl(var(--accent-soft) / 0.72)",
                color: "hsl(var(--accent-strong))",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Monitoreo central
            </Tag>
            <h3
              style={{
                margin: "0.9rem 0 0.45rem 0",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Un solo plano para operar DTE, Barber Pro y ERP Full Pro.
            </h3>
            <p style={{ margin: 0, maxWidth: 720, color: "hsl(var(--text-muted))", lineHeight: 1.6 }}>
              El panel central agrupa estado, volumen y salud de cada sistema sin mezclar sus bases
              de datos. La vista prioriza lectura operativa y acceso rapido al modulo correcto.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(8.5rem, 1fr))",
            }}
          >
            <div
              style={{
                borderRadius: "1rem",
                padding: "0.95rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-subtle))",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "hsl(var(--text-muted))" }}>Conectados</div>
              <strong
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                }}
              >
                {connectedCount}
              </strong>
            </div>
            <div
              style={{
                borderRadius: "1rem",
                padding: "0.95rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-subtle))",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "hsl(var(--text-muted))" }}>Activos</div>
              <strong
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                }}
              >
                {formatNumber(activeTenants)}
              </strong>
            </div>
            <div
              style={{
                borderRadius: "1rem",
                padding: "0.95rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-subtle))",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "hsl(var(--text-muted))" }}>Totales</div>
              <strong
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                }}
              >
                {formatNumber(totalTenants)}
              </strong>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={8}>
          <MetricCard
            title="Tenants DTE"
            value={
              state.dteDashboard.status === "fulfilled"
                ? formatNumber(state.dteDashboard.value.total)
                : "Sin conexion"
            }
            accentVar="--section-dte"
            hint={
              state.dteDashboard.status === "fulfilled"
                ? `${formatCurrency(state.dteDashboard.value.ingresos_mes)} este mes`
                : "Revisa credenciales DTE"
            }
          />
        </Col>
        <Col xs={24} md={12} xl={8}>
          <MetricCard
            title="Tenants Barber"
            value={
              state.barberDashboard.status === "fulfilled"
                ? formatNumber(state.barberDashboard.value.total)
                : "Sin conexion"
            }
            accentVar="--section-barber"
            hint={
              state.barberDashboard.status === "fulfilled"
                ? `${formatNumber(state.barberDashboard.value.activos)} activos`
                : "Revisa credenciales Barber"
            }
          />
        </Col>
        <Col xs={24} md={12} xl={8}>
          <MetricCard
            title="Tenants ERP"
            value={
              state.erpDashboard.status === "fulfilled"
                ? formatNumber(state.erpDashboard.value.total)
                : "Pendiente"
            }
            accentVar="--section-erp"
            hint={
              state.erpDashboard.status === "fulfilled"
                ? `${formatNumber(state.erpDashboard.value.activos)} activos`
                : "Falta API superadmin en ERP"
            }
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col key={service.name} xs={24} xl={8}>
            <Card
              className="surface-card border-0 h-full"
              styles={{
                body: {
                  display: "flex",
                  minHeight: "100%",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.4rem",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <Tag
                    bordered={false}
                    style={{
                      margin: 0,
                      borderRadius: "9999px",
                      background: `hsl(var(${service.accentVar}) / 0.14)`,
                      color: `hsl(var(${service.accentVar}))`,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {service.label}
                  </Tag>
                  <h3
                    style={{
                      margin: "0.9rem 0 0.35rem 0",
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      lineHeight: 1.1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Estado del servicio
                  </h3>
                  <p style={{ margin: 0, color: "hsl(var(--text-muted))", lineHeight: 1.55 }}>
                    {service.description}
                  </p>
                </div>
                <Button href={service.href} type="default">
                  Abrir modulo
                </Button>
              </div>

              {service.health ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    borderRadius: "1rem",
                    border: "1px solid hsl(var(--border-default))",
                    background: "hsl(var(--bg-subtle))",
                    padding: "0.9rem 1rem",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem" }}>
                    <Tag
                      bordered={false}
                      style={{
                        margin: 0,
                        borderRadius: "9999px",
                        background: `hsl(var(--status-${getStatusTone(service.health.status)}-bg))`,
                        color: `hsl(var(--status-${getStatusTone(service.health.status)}))`,
                        fontWeight: 700,
                      }}
                    >
                      {getStatusLabel(service.health.status)}
                    </Tag>
                    <span style={{ color: "hsl(var(--text-secondary))", fontWeight: 600 }}>
                      Health: {service.health.status}
                    </span>
                  </div>
                  <span style={{ color: "hsl(var(--text-muted))", fontSize: "0.9rem" }}>
                    {service.health.latencyMs
                      ? `${formatNumber(service.health.latencyMs)} ms`
                      : "Sin latencia reportada"}
                  </span>
                </div>
              ) : (
                <Alert
                  type="error"
                  showIcon
                  message="Sin conexion"
                  description={
                    service.healthError instanceof Error
                      ? service.healthError.message
                      : "No disponible"
                  }
                  style={{ borderRadius: "1rem" }}
                />
              )}

              <div style={{ display: "grid", gap: "0.85rem" }}>
                {service.dashboard ? (
                  service.planRows.length ? (
                    <DataTable
                      caption="Distribucion por plan"
                      columns={[
                        { key: "plan", title: "Plan" },
                        { key: "total", title: "Total", align: "right" },
                      ]}
                      rows={service.planRows}
                    />
                  ) : (
                    <div
                      style={{
                        borderRadius: "1rem",
                        border: "1px dashed hsl(var(--border-default))",
                        padding: "1.2rem 1rem",
                        color: "hsl(var(--text-muted))",
                        textAlign: "center",
                        background: "hsl(var(--bg-subtle))",
                      }}
                    >
                      Sin planes cargados
                    </div>
                  )
                ) : (
                  <Alert
                    type="warning"
                    showIcon
                    message="No se pudo cargar el dashboard"
                    description={
                      service.dashboardError instanceof Error
                        ? service.dashboardError.message
                        : "Servicio no disponible"
                    }
                    style={{ borderRadius: "1rem" }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderTop: "1px solid hsl(var(--border-default))",
                    paddingTop: "0.9rem",
                    color: "hsl(var(--text-secondary))",
                  }}
                >
                  <span>Activos</span>
                  <strong>{formatNumber(service.dashboard?.activos ?? 0)}</strong>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
