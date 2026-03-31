import { Alert, Button, Card, Col, Row, Tag } from "antd";
import {
  ArrowRight,
  Building2,
  CreditCard,
  FileText,
  Scissors,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
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

function getStatusLabel(status: string) {
  if (status === "ok") return "Operativo";
  if (status === "degraded") return "Con alerta";
  return "Sin conexion";
}

function getStatusStyles(status: string) {
  if (status === "ok") {
    return {
      background: "hsl(var(--status-success-bg))",
      color: "hsl(var(--status-success))",
    };
  }

  if (status === "degraded") {
    return {
      background: "hsl(var(--status-warning-bg))",
      color: "hsl(var(--status-warning))",
    };
  }

  return {
    background: "hsl(var(--status-error-bg))",
    color: "hsl(var(--status-error))",
  };
}

function getAccentStyles(accentVar: string) {
  return {
    color: `hsl(var(${accentVar}))`,
    background: `hsl(var(${accentVar}) / 0.12)`,
  };
}

export default async function OverviewV2() {
  const state = await loadOverview();
  const services = [
    {
      name: "DTE",
      label: "DTE",
      accentVar: "--section-dte",
      href: "/dte/dashboard",
      detailHref: "/dte/clientes",
      description: "Facturacion, clientes y vencimientos",
      dashboard: state.dteDashboard,
      health: state.dteHealth,
      planCounts: null as Record<string, number> | null,
      icon: <FileText size={18} />,
    },
    {
      name: "Barber Pro",
      label: "Barber Pro",
      accentVar: "--section-barber",
      href: "/barber/dashboard",
      detailHref: "/barber/tenants",
      description: "Operacion de barberias y tenants",
      dashboard: state.barberDashboard,
      health: state.barberHealth,
      planCounts:
        state.barberDashboard.status === "fulfilled" ? state.barberDashboard.value.por_plan : null,
      icon: <Scissors size={18} />,
    },
    {
      name: "ERP Full Pro",
      label: "ERP Full Pro",
      accentVar: "--section-erp",
      href: "/erp/dashboard",
      detailHref: "/erp/tenants",
      description: "Administracion, health y tenants",
      dashboard: state.erpDashboard,
      health: state.erpHealth,
      planCounts: state.erpDashboard.status === "fulfilled" ? state.erpDashboard.value.por_plan : null,
      icon: <Building2 size={18} />,
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
          ? Object.entries(service.planCounts)
              .filter(([, total]) => total > 0)
              .map(([plan, total]) => ({
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

  const dteAlerts =
    state.dteDashboard.status === "fulfilled"
      ? [
          ...state.dteDashboard.value.alertas_por_vencer.map((tenant) => ({
            key: `due-${tenant.id}`,
            cells: [
              <span key={`tenant-${tenant.id}`}>{tenant.nombre}</span>,
              <span key={`plan-${tenant.id}`}>{tenant.plan_nombre ?? "Sin plan"}</span>,
              <span key={`date-${tenant.id}`}>{tenant.fecha_pago}</span>,
              <Tag
                key={`status-${tenant.id}`}
                bordered={false}
                style={{
                  margin: 0,
                  borderRadius: 999,
                  background: "hsl(var(--status-warning-bg))",
                  color: "hsl(var(--status-warning))",
                  fontWeight: 700,
                }}
              >
                Por vencer
              </Tag>,
            ],
          })),
          ...state.dteDashboard.value.alertas_vencidos.map((tenant) => ({
            key: `overdue-${tenant.id}`,
            cells: [
              <span key={`tenant-overdue-${tenant.id}`}>{tenant.nombre}</span>,
              <span key={`plan-overdue-${tenant.id}`}>{tenant.plan_nombre ?? "Sin plan"}</span>,
              <span key={`date-overdue-${tenant.id}`}>{tenant.fecha_pago}</span>,
              <Tag
                key={`status-overdue-${tenant.id}`}
                bordered={false}
                style={{
                  margin: 0,
                  borderRadius: 999,
                  background: "hsl(var(--status-error-bg))",
                  color: "hsl(var(--status-error))",
                  fontWeight: 700,
                }}
              >
                Vencido
              </Tag>,
            ],
          })),
        ].slice(0, 6)
      : [];

  const planRows = services.flatMap((service) =>
    service.planRows.map((row) => ({
      key: row.key,
      cells: [
        <span
          key={`${row.key}-service`}
          style={{ color: `hsl(var(${service.accentVar}))`, fontWeight: 700 }}
        >
          {service.label}
        </span>,
        row.cells[0],
        row.cells[1],
      ],
    })),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Vista global del panel central"
        description="Operacion general de DTE, Barber Pro y ERP Full Pro con lectura rapida de salud, tenants y alertas."
        actions={
          <>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: 999,
                paddingInline: "0.85rem",
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
                borderRadius: 999,
                paddingInline: "0.85rem",
                background: "hsl(var(--bg-subtle))",
                color: "hsl(var(--text-secondary))",
                fontWeight: 700,
              }}
            >
              {connectedCount}/3 conectados
            </Tag>
          </>
        }
      />

      <Card
        className="surface-card border-0"
        styles={{
          body: {
            display: "grid",
            gap: "1.25rem",
            padding: "1.5rem",
            background:
              "linear-gradient(135deg, hsl(var(--bg-surface)) 0%, hsl(var(--bg-subtle)) 100%)",
          },
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "minmax(0, 1.45fr) minmax(280px, 0.85fr)",
            alignItems: "stretch",
          }}
        >
          <div style={{ display: "grid", gap: "0.9rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <Tag
                bordered={false}
                style={{
                  margin: 0,
                  borderRadius: 999,
                  paddingInline: "0.85rem",
                  background: "hsl(var(--section-overview) / 0.12)",
                  color: "hsl(var(--section-overview))",
                  fontWeight: 700,
                }}
              >
                Vista central
              </Tag>
              <span style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>
                BarberPro-inspired control shell
              </span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <h1
                style={{
                  margin: 0,
                  color: "hsl(var(--text-primary))",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                Un solo tablero para leer DTE, Barber Pro y ERP sin cambiar de contexto.
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: 760,
                  color: "hsl(var(--text-muted))",
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                La vista resume salud operativa, cobertura de tenants y alertas prioritarias con una
                densidad visual más limpia y más cercana al dashboard de BarberPro.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Button href="/dte/dashboard" type="primary">
                Abrir DTE
              </Button>
              <Button href="/barber/dashboard">Abrir Barber Pro</Button>
              <Button href="/erp/dashboard">Abrir ERP</Button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12, alignContent: "stretch" }}>
            <div
              style={{
                display: "grid",
                gap: 10,
                padding: "1rem 1.1rem",
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, marginBottom: 4 }}>
                    Salud general
                  </div>
                  <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                    {healthyCount}/3
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, marginBottom: 4 }}>
                    Conectados
                  </div>
                  <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                    {connectedCount}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <div style={{ borderRadius: 16, padding: "0.8rem 0.9rem", background: "hsl(var(--bg-subtle))" }}>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Operativos</div>
                  <div style={{ color: "hsl(var(--text-primary))", fontSize: 18, fontWeight: 800 }}>
                    {healthyCount}
                  </div>
                </div>
                <div style={{ borderRadius: 16, padding: "0.8rem 0.9rem", background: "hsl(var(--bg-subtle))" }}>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Con alerta</div>
                  <div style={{ color: "hsl(var(--text-primary))", fontSize: 18, fontWeight: 800 }}>
                    {degradedCount}
                  </div>
                </div>
                <div style={{ borderRadius: 16, padding: "0.8rem 0.9rem", background: "hsl(var(--bg-subtle))" }}>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Offline</div>
                  <div style={{ color: "hsl(var(--text-primary))", fontSize: 18, fontWeight: 800 }}>
                    {offlineCount}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                padding: "1rem 1.1rem",
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
              }}
            >
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>Cobertura global</div>
              <div style={{ color: "hsl(var(--text-primary))", fontSize: 26, fontWeight: 800 }}>
                {formatNumber(totalTenants)}
              </div>
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                {formatNumber(activeTenants)} tenants activos distribuidos entre DTE, Barber Pro y ERP.
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={8}>
          <MetricCard
            title="Servicios operativos"
            value={healthyCount}
            suffix="/ 3"
            accentVar="--section-overview"
            hint={`${degradedCount} con alerta y ${offlineCount} sin conexion`}
            icon={<ShieldCheck size={18} />}
          />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <MetricCard
            title="Tenants DTE"
            value={state.dteDashboard.status === "fulfilled" ? state.dteDashboard.value.total : "Sin conexion"}
            accentVar="--section-dte"
            hint={
              state.dteDashboard.status === "fulfilled"
                ? `${formatCurrency(state.dteDashboard.value.ingresos_mes)} este mes`
                : "Revisa la conexion DTE"
            }
            icon={<FileText size={18} />}
          />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <MetricCard
            title="Tenants Barber"
            value={state.barberDashboard.status === "fulfilled" ? state.barberDashboard.value.total : "Sin conexion"}
            accentVar="--section-barber"
            hint={
              state.barberDashboard.status === "fulfilled"
                ? `${formatNumber(state.barberDashboard.value.activos)} activos`
                : "Revisa la conexion Barber"
            }
            icon={<Scissors size={18} />}
          />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <MetricCard
            title="Tenants ERP"
            value={state.erpDashboard.status === "fulfilled" ? state.erpDashboard.value.total : "Pendiente"}
            accentVar="--section-erp"
            hint={
              state.erpDashboard.status === "fulfilled"
                ? `${formatNumber(state.erpDashboard.value.activos)} activos`
                : "Valida la API superadmin"
            }
            icon={<Building2 size={18} />}
          />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <MetricCard
            title="Tenants activos"
            value={activeTenants}
            accentVar="--section-overview"
            hint={`${formatNumber(totalTenants)} tenants totales en el ecosistema`}
            icon={<Users size={18} />}
          />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <MetricCard
            title="Alertas DTE"
            value={dteAlerts.length}
            accentVar={dteAlerts.length > 0 ? "--section-erp" : "--section-overview"}
            hint={
              state.dteDashboard.status === "fulfilled"
                ? `${formatNumber(state.dteDashboard.value.por_vencer)} por vencer y ${formatNumber(state.dteDashboard.value.vencidos)} vencidos`
                : "Sin datos de alertas"
            }
            icon={<TriangleAlert size={18} />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            className="surface-card border-0"
            title="Estado de servicios"
            styles={{
              body: {
                display: "grid",
                gap: "0.9rem",
              },
            }}
          >
            {services.map((service) => (
              <div
                key={service.name}
                style={{
                  display: "grid",
                  gap: "0.9rem",
                  gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr) auto",
                  alignItems: "center",
                  padding: "0.95rem 1rem",
                  borderRadius: "1rem",
                  border: "1px solid hsl(var(--border-default))",
                  background: "hsl(var(--bg-surface))",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      ...getAccentStyles(service.accentVar),
                      flexShrink: 0,
                    }}
                  >
                    {service.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{service.label}</div>
                    <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                      {service.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <Tag
                    bordered={false}
                    style={{
                      margin: 0,
                      borderRadius: 999,
                      ...getStatusStyles(service.health?.status ?? "error"),
                      fontWeight: 700,
                    }}
                  >
                    {getStatusLabel(service.health?.status ?? "error")}
                  </Tag>
                  <span style={{ color: "hsl(var(--text-secondary))", fontSize: 13 }}>
                    {service.health?.latencyMs ? `${formatNumber(service.health.latencyMs)} ms` : "Sin latencia"}
                  </span>
                  <span style={{ color: "hsl(var(--text-secondary))", fontSize: 13 }}>
                    {formatNumber(service.dashboard?.activos ?? 0)} activos
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Button href={service.detailHref} type="default">
                    Ver detalle
                  </Button>
                  <Button href={service.href} type="primary">
                    Abrir
                  </Button>
                </div>
              </div>
            ))}

            {services.some((service) => service.dashboardError || service.healthError) ? (
              <Alert
                type="warning"
                showIcon
                message="Hay integraciones con respuesta incompleta"
                description="El panel sigue operativo, pero conviene revisar health y credenciales de los servicios que no devolvieron datos."
                style={{ borderRadius: "1rem" }}
              />
            ) : null}
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            className="surface-card border-0"
            title="Accesos rapidos"
            styles={{
              body: {
                display: "grid",
                gap: "0.85rem",
              },
            }}
          >
            {services.map((service) => (
              <a
                key={`${service.name}-quick`}
                href={service.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  padding: "0.95rem 1rem",
                  borderRadius: "1rem",
                  border: "1px solid hsl(var(--border-default))",
                  background: "hsl(var(--bg-surface))",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      ...getAccentStyles(service.accentVar),
                      flexShrink: 0,
                    }}
                  >
                    {service.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{service.label}</div>
                    <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>
                      {service.dashboard ? "Dashboard y detalle listos" : "Pendiente de revisar"}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color={`hsl(var(${service.accentVar}))`} />
              </a>
            ))}

            <div
              style={{
                display: "grid",
                gap: 10,
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-subtle))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    ...getAccentStyles("--section-overview"),
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <div style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>Lectura central</div>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>
                    Este panel orquesta integraciones; no mezcla las bases de tus sistemas.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title="Distribucion por plan">
            <DataTable
              caption="Planes activos por sistema"
              columns={[
                { key: "service", title: "Sistema" },
                { key: "plan", title: "Plan" },
                { key: "total", title: "Total", align: "right" },
              ]}
              rows={planRows}
              emptyState="No hay planes reportados por las integraciones."
            />
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="surface-card border-0" title="Alertas DTE prioritarias">
            {state.dteDashboard.status === "fulfilled" ? (
              <DataTable
                columns={[
                  { key: "tenant", title: "Tenant" },
                  { key: "plan", title: "Plan" },
                  { key: "date", title: "Pago" },
                  { key: "status", title: "Estado", align: "right" },
                ]}
                rows={dteAlerts}
                emptyState="No hay alertas DTE pendientes."
              />
            ) : (
              <Alert
                type="warning"
                showIcon
                message="No se pudieron cargar alertas DTE"
                description="Revisa la conexion del servicio para ver vencimientos y cuentas por vencer."
                style={{ borderRadius: "1rem" }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
