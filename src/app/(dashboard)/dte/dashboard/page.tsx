import Link from "next/link";
import { Alert, Card, Col, Row, Tag } from "antd";
import { ArrowRight, CreditCard, FileText, LifeBuoy, ShieldCheck, Users } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatCurrency, formatDateOnly, formatNumber } from "@/lib/formatters";
import { getDteDashboard } from "@/lib/integrations/dte";

async function loadDteDashboard() {
  try {
    const dashboard = await getDteDashboard();
    return { dashboard };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function DteDashboardPage() {
  const result = await loadDteDashboard();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="DTE"
          title="Dashboard DTE"
          description="No se pudo cargar el dashboard de DTE desde el servidor."
        />
        <Alert
          type="error"
          showIcon
          message="Fallo la integracion DTE"
          description={result.error}
        />
      </div>
    );
  }

  const { dashboard } = result;
  const alertas = [
    ...dashboard.alertas_por_vencer.map((item) => ({ ...item, tipo: "Por vencer" })),
    ...dashboard.alertas_vencidos.map((item) => ({ ...item, tipo: "Vencido" })),
  ];
  const monthlyDelta = dashboard.ingresos_mes - dashboard.ingresos_mes_anterior;
  const monthlyDeltaPct = dashboard.ingresos_mes_anterior
    ? Math.round((monthlyDelta / dashboard.ingresos_mes_anterior) * 100)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Dashboard DTE"
        description="Vista operativa del superadmin DTE con foco en ingresos, renovaciones y salud de la cartera."
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
              {formatNumber(dashboard.activos)} activos
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
              {formatNumber(dashboard.total)} tenants
            </Tag>
          </>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="MRR"
            value={formatCurrency(dashboard.mrr)}
            accentVar="--section-dte"
            hint="Ingreso recurrente mensual proyectado"
            icon={<CreditCard size={18} />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Cobrado este mes"
            value={formatCurrency(dashboard.ingresos_mes)}
            accentVar="--section-dte"
            hint={
              monthlyDeltaPct === null
                ? "Sin comparativa previa"
                : `${monthlyDeltaPct >= 0 ? "+" : ""}${monthlyDeltaPct}% vs mes anterior`
            }
            icon={<ShieldCheck size={18} />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Activos"
            value={dashboard.activos}
            accentVar="--section-dte"
            hint={`${formatNumber(dashboard.en_pruebas)} en pruebas`}
            icon={<Users size={18} />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Vencimientos"
            value={dashboard.por_vencer + dashboard.vencidos}
            accentVar="--section-dte"
            hint={`${formatNumber(dashboard.vencidos)} vencidos y ${formatNumber(dashboard.por_vencer)} por vencer`}
            icon={<LifeBuoy size={18} />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Total" value={dashboard.total} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Pruebas" value={dashboard.en_pruebas} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Suspendidos" value={dashboard.suspendidos} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Por vencer" value={dashboard.por_vencer} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Vencidos" value={dashboard.vencidos} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Nuevos semana" value={dashboard.nuevos_semana} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard title="Nuevos mes" value={dashboard.nuevos_mes} accentVar="--section-dte" />
        </Col>
        <Col xs={24} md={12} xl={3}>
          <MetricCard
            title="Mes anterior"
            value={formatCurrency(dashboard.ingresos_mes_anterior)}
            accentVar="--section-dte"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card className="surface-card border-0">
            <DataTable
              columns={[
                { key: "tenant", title: "Tenant" },
                { key: "plan", title: "Plan" },
                { key: "estado", title: "Estado" },
                { key: "fechaPago", title: "Fecha pago" },
              ]}
              rows={alertas.map((item) => ({
                key: `${item.tipo}-${item.id}`,
                cells: [
                  <Link key={`tenant-${item.id}`} href={`/dte/clientes/${item.id}`}>
                    {item.nombre}
                  </Link>,
                  item.plan_nombre ?? "Sin plan",
                  <Tag key={`tag-${item.id}`} color={item.tipo === "Vencido" ? "error" : "warning"}>
                    {item.tipo}
                  </Tag>,
                  formatDateOnly(item.fecha_pago),
                ],
              }))}
              caption="Alertas de renovacion"
              emptyState="No hay alertas de renovacion activas."
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card className="surface-card border-0">
            <DataTable
              columns={[
                { key: "indicador", title: "Indicador" },
                { key: "valor", title: "Valor", align: "right" },
              ]}
              rows={[
                { key: "pruebas", cells: ["En pruebas", formatNumber(dashboard.en_pruebas)] },
                { key: "suspendidos", cells: ["Suspendidos", formatNumber(dashboard.suspendidos)] },
                { key: "por-vencer", cells: ["Por vencer", formatNumber(dashboard.por_vencer)] },
                { key: "vencidos", cells: ["Vencidos", formatNumber(dashboard.vencidos)] },
                { key: "nuevos-semana", cells: ["Nuevos semana", formatNumber(dashboard.nuevos_semana)] },
                { key: "nuevos-mes", cells: ["Nuevos mes", formatNumber(dashboard.nuevos_mes)] },
                { key: "ingreso-mes", cells: ["Ingreso mes", formatCurrency(dashboard.ingresos_mes)] },
                {
                  key: "delta-mes",
                  cells: [
                    "Delta mensual",
                    `${monthlyDelta >= 0 ? "+" : ""}${formatCurrency(monthlyDelta)}`,
                  ],
                },
              ]}
              caption="Resumen de cartera"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card
            className="surface-card border-0"
            title="Accesos rapidos"
            styles={{ body: { display: "grid", gap: "0.85rem" } }}
          >
            {[
              { href: "/dte/clientes", label: "Ir a clientes DTE", helper: "Listado maestro de tenants", icon: <Users size={16} /> },
              { href: "/dte/planes", label: "Revisar planes DTE", helper: "Catalogo y precios", icon: <CreditCard size={16} /> },
              { href: "/dte/auditoria", label: "Abrir auditoria", helper: "Eventos y acciones del sistema", icon: <ShieldCheck size={16} /> },
              { href: "/dte/analytics", label: "Ver analytics", helper: "KPIs historicos del SaaS", icon: <FileText size={16} /> },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      color: "hsl(var(--section-dte))",
                      background: "hsl(var(--section-dte) / 0.12)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{item.label}</div>
                    <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>{item.helper}</div>
                  </div>
                </div>
                <ArrowRight size={16} color="hsl(var(--section-dte))" />
              </Link>
            ))}
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card
            className="surface-card border-0"
            title="Lectura del mes"
            styles={{ body: { display: "grid", gap: "0.85rem" } }}
          >
            <div
              style={{
                display: "grid",
                gap: "0.85rem",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  border: "1px solid hsl(var(--border-default))",
                  background: "hsl(var(--bg-subtle))",
                }}
              >
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Renovacion activa</div>
                <div style={{ marginTop: 6, color: "hsl(var(--text-primary))", fontWeight: 700, fontSize: 22 }}>
                  {formatNumber(dashboard.total - dashboard.suspendidos)}
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  border: "1px solid hsl(var(--border-default))",
                  background: "hsl(var(--bg-subtle))",
                }}
              >
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Alertas abiertas</div>
                <div style={{ marginTop: 6, color: "hsl(var(--text-primary))", fontWeight: 700, fontSize: 22 }}>
                  {formatNumber(alertas.length)}
                </div>
              </div>
            </div>

            <Alert
              type={dashboard.vencidos > 0 ? "warning" : "success"}
              showIcon
              message={
                dashboard.vencidos > 0
                  ? "Hay cuentas DTE vencidas que requieren seguimiento"
                  : "No hay cuentas vencidas al corte actual"
              }
              description={
                dashboard.vencidos > 0
                  ? `${formatNumber(dashboard.vencidos)} tenants vencidos y ${formatNumber(dashboard.por_vencer)} por vencer.`
                  : "La cartera actual se mantiene operativa."
              }
              style={{ borderRadius: "1rem" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
