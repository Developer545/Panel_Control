import { Alert, Card, Col, Progress, Row, Tag } from "antd";
import { BarChart3, Coins, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getErrorMessage } from "@/lib/error-message";
import { getDteAnalytics } from "@/lib/integrations/dte";

async function loadAnalytics() {
  try {
    const analytics = await getDteAnalytics();
    return { analytics };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

function formatSignedPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatNumber(Math.abs(value))}%`;
}

export default async function DteAnalyticsPage() {
  const result = await loadAnalytics();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Analytics" description="Lectura historica del ecosistema DTE." />
        <Alert type="error" showIcon message="No se pudieron cargar los datos analiticos" description={result.error} />
      </div>
    );
  }

  const { analytics } = result;
  const totalStates = analytics.por_estado.reduce((sum, item) => sum + item.total, 0);
  const activeState = analytics.por_estado.find((item) => item.estado === "activo")?.total ?? 0;
  const activeRate = totalStates > 0 ? Math.round((activeState / totalStates) * 100) : 0;
  const topPlan = analytics.por_plan[0] ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Analytics"
        description="Ingreso, crecimiento, activaciones y distribucion por plan del panel DTE."
        actions={
          <Tag
            bordered={false}
            style={{
              margin: 0,
              borderRadius: 999,
              background: "hsl(var(--accent-soft))",
              color: "hsl(var(--accent-strong))",
              fontWeight: 700,
            }}
          >
            MoM {formatSignedPercent(analytics.kpis.crecimiento_mom)}
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Ingreso YTD" value={formatCurrency(analytics.kpis.ingreso_ytd)} accentVar="--section-dte" icon={<Coins size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Nuevos mes" value={formatNumber(analytics.kpis.nuevos_mes)} accentVar="--section-dte" icon={<Users size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Activaciones" value={formatNumber(analytics.kpis.activaciones_mes)} accentVar="--section-dte" icon={<TrendingUp size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Suspensiones" value={formatNumber(analytics.kpis.suspensiones_mes)} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title="Serie mensual">
            <DataTable
              caption="Comportamiento economico"
              columns={[
                { key: "mes", title: "Mes" },
                { key: "ingresos", title: "Ingresos", align: "right" },
                { key: "nuevos", title: "Nuevos", align: "right" },
                { key: "altas", title: "Altas", align: "right" },
                { key: "bajas", title: "Bajas", align: "right" },
              ]}
              rows={analytics.serie.map((item) => ({
                key: item.mes,
                cells: [
                  item.mes_label,
                  formatCurrency(item.ingresos),
                  formatNumber(item.nuevos),
                  formatNumber(item.activaciones),
                  formatNumber(item.suspensiones),
                ],
              }))}
              emptyState="No hay serie historica disponible."
            />
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="surface-card border-0" title="Lectura del negocio">
            <div className="space-y-4">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "hsl(var(--text-secondary))", fontWeight: 600 }}>Activos</span>
                  <span style={{ color: "hsl(var(--text-primary))", fontWeight: 700 }}>{activeRate}%</span>
                </div>
                <Progress percent={activeRate} strokeColor="hsl(var(--section-dte))" showInfo={false} />
              </div>

              <div
                style={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: "hsl(var(--bg-subtle))",
                  border: "1px solid hsl(var(--border-default))",
                  lineHeight: 1.7,
                  color: "hsl(var(--text-muted))",
                }}
              >
                La lectura analitica original mostraba el pulso economico del superadmin: crecimiento, activaciones y salud del portafolio. Aqui ya se consume el contrato real para que el panel deje de depender de calculos simulados.
              </div>

              <Alert
                type={analytics.kpis.crecimiento_mom >= 0 ? "success" : "warning"}
                showIcon
                message={analytics.kpis.crecimiento_mom >= 0 ? "Crecimiento positivo" : "Crecimiento bajo"}
                description={`Movimiento MoM: ${formatSignedPercent(analytics.kpis.crecimiento_mom)}`}
              />

              {topPlan ? (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    border: "1px solid hsl(var(--border-default))",
                    background: "hsl(var(--bg-surface))",
                  }}
                >
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Plan dominante
                  </div>
                  <div style={{ marginTop: 8, color: "hsl(var(--text-primary))", fontSize: 18, fontWeight: 700 }}>
                    {topPlan.plan}
                  </div>
                  <div style={{ marginTop: 4, color: "hsl(var(--text-muted))", fontSize: 13 }}>
                    {formatNumber(topPlan.total)} tenants, {formatNumber(topPlan.activos)} activos, {formatCurrency(topPlan.precio)}
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="surface-card border-0" title="Distribucion por plan">
            <DataTable
              caption="Mix comercial"
              columns={[
                { key: "plan", title: "Plan" },
                { key: "total", title: "Total", align: "right" },
                { key: "activos", title: "Activos", align: "right" },
                { key: "precio", title: "Precio", align: "right" },
              ]}
              rows={analytics.por_plan.map((item) => ({
                key: item.plan,
                cells: [
                  item.plan,
                  formatNumber(item.total),
                  formatNumber(item.activos),
                  formatCurrency(item.precio),
                ],
              }))}
              emptyState="No hay distribucion por plan."
            />
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="surface-card border-0" title="Estados del portafolio">
            <DataTable
              caption="Salud de cartera"
              columns={[
                { key: "estado", title: "Estado" },
                { key: "total", title: "Total", align: "right" },
                { key: "share", title: "Participacion", align: "right" },
              ]}
              rows={analytics.por_estado.map((item) => {
                const share = totalStates > 0 ? Math.round((item.total / totalStates) * 100) : 0;

                return {
                  key: item.estado,
                  cells: [
                    <Tag key={`${item.estado}-tag`} bordered={false} color={item.estado === "activo" ? "success" : item.estado === "pruebas" ? "warning" : "error"}>
                      {item.estado}
                    </Tag>,
                    formatNumber(item.total),
                    `${share}%`,
                  ],
                };
              })}
              emptyState="No hay estados disponibles."
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="surface-card border-0">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <BarChart3 size={18} color="hsl(var(--section-dte))" />
              <div>
                <div style={{ color: "hsl(var(--text-primary))", fontSize: 16, fontWeight: 700 }}>Lectura operativa</div>
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>Resumen rapido para decidir sin entrar a cada tenant.</div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
                gap: 12,
              }}
            >
              {[
                ["Ingreso anual", formatCurrency(analytics.kpis.ingreso_ytd)],
                ["Nuevos del mes", formatNumber(analytics.kpis.nuevos_mes)],
                ["Activaciones", formatNumber(analytics.kpis.activaciones_mes)],
                ["Suspensiones", formatNumber(analytics.kpis.suspensiones_mes)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    borderRadius: "1rem",
                    border: "1px solid hsl(var(--border-default))",
                    background: "hsl(var(--bg-subtle))",
                    padding: "1rem",
                  }}
                >
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {label}
                  </div>
                  <div style={{ marginTop: 8, color: "hsl(var(--text-primary))", fontSize: 22, fontWeight: 800 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
