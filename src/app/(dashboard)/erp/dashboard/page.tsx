import { Alert, Card, Col, Descriptions, Row, Tag } from "antd";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatNumber } from "@/lib/formatters";
import { getErpDashboard } from "@/lib/integrations/erp";

async function loadErpDashboard() {
  try {
    const dashboard = await getErpDashboard();
    return { dashboard };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function ErpDashboardPage() {
  const result = await loadErpDashboard();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="ERP"
          title="Dashboard ERP Full Pro"
          description="La UI de ERP ya esta lista en el panel, pero la API superadmin aun debe habilitarse en Erp-full-web."
        />
        <Alert
          type="warning"
          showIcon
          message="ERP aun no responde al contrato superadmin"
          description={result.error}
        />
      </div>
    );
  }

  const total = result.dashboard.total;
  const activos = result.dashboard.activos;
  const enTrial = result.dashboard.en_trial;
  const suspendidos = result.dashboard.suspendidos;
  const coverage = total > 0 ? Math.round((activos / total) * 100) : 0;
  const planRows = Object.entries(result.dashboard.por_plan).map(([plan, total]) => ({ plan, total }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ERP"
        title="Dashboard ERP Full Pro"
        description="Resumen central del estado multi-tenant del ERP con lectura rapida de cobertura, plan y salud operativa."
        actions={
          <>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: 999,
                paddingInline: "0.85rem",
                background: "hsl(var(--section-erp) / 0.12)",
                color: "hsl(var(--section-erp))",
                fontWeight: 700,
              }}
            >
              API superadmin
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
              {formatNumber(total)} tenants
            </Tag>
          </>
        }
      />

      <Card
        className="surface-card border-0"
        styles={{
          body: {
            display: "grid",
            gap: "1rem",
            padding: "1.4rem",
            background:
              "linear-gradient(135deg, hsl(var(--bg-surface)) 0%, hsl(var(--bg-subtle)) 100%)",
          },
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "minmax(0, 1.45fr) minmax(280px, 0.85fr)",
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                width: "fit-content",
                borderRadius: 999,
                paddingInline: "0.85rem",
                background: "hsl(var(--section-erp) / 0.12)",
                color: "hsl(var(--section-erp))",
                fontWeight: 700,
              }}
            >
              Salud ERP
            </Tag>
            <h1
              style={{
                margin: 0,
                color: "hsl(var(--text-primary))",
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Cobertura operativa, estado del plan y actividad multi-tenant en una sola lectura.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 720,
                color: "hsl(var(--text-muted))",
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              Esta vista prioriza la lectura de negocio sin perder densidad visual: los números quedan
              arriba y la tabla de planes debajo con el mismo lenguaje que el dashboard principal.
            </p>
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
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
              <div>
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, marginBottom: 4 }}>
                  Cobertura activa
                </div>
                <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                  {coverage}%
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, marginBottom: 4 }}>
                  Estado general
                </div>
                <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                  {activos > 0 ? "Activo" : "Sin actividad"}
                </div>
              </div>
            </div>
            <Descriptions bordered={false} column={1} size="small">
              <Descriptions.Item label="Tenants activos">{formatNumber(activos)}</Descriptions.Item>
              <Descriptions.Item label="En trial">{formatNumber(enTrial)}</Descriptions.Item>
              <Descriptions.Item label="Suspendidos">{formatNumber(suspendidos)}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <MetricCard title="Total" value={formatNumber(total)} accentVar="--section-erp" tone="section" />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard title="Activos" value={formatNumber(activos)} accentVar="--section-erp" tone="success" />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard title="En trial" value={formatNumber(enTrial)} accentVar="--section-erp" tone="warning" />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard title="Suspendidos" value={formatNumber(suspendidos)} accentVar="--section-erp" tone="danger" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <Card className="surface-card border-0" title="Distribucion por plan">
            <DataTable
              caption="Planes activos por segmento ERP"
              columns={[
                { key: "plan", title: "Plan" },
                { key: "total", title: "Total", align: "right" },
              ]}
              rows={planRows.map((row) => ({
                key: row.plan,
                cells: [row.plan, formatNumber(row.total)],
              }))}
              emptyState="No hay planes reportados por el ERP."
            />
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card
            className="surface-card border-0"
            title="Lectura operativa"
            styles={{
              body: {
                display: "grid",
                gap: 12,
              },
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 10,
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
              }}
            >
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>Cobertura activa</div>
              <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                {coverage}%
              </div>
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                {formatNumber(activos)} tenants activos sobre {formatNumber(total)} totales.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
              }}
            >
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>Segmentacion</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: "hsl(var(--status-success-bg))",
                    color: "hsl(var(--status-success))",
                    fontWeight: 700,
                  }}
                >
                  {formatNumber(activos)} activos
                </Tag>
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: "hsl(var(--status-warning-bg))",
                    color: "hsl(var(--status-warning))",
                    fontWeight: 700,
                  }}
                >
                  {formatNumber(enTrial)} trial
                </Tag>
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: "hsl(var(--status-error-bg))",
                    color: "hsl(var(--status-error))",
                    fontWeight: 700,
                  }}
                >
                  {formatNumber(suspendidos)} suspendidos
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
