import { Alert, Card, Col, Descriptions, Row, Tag } from "antd";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate, formatNumber } from "@/lib/formatters";
import { getErpHealth } from "@/lib/integrations/erp";

async function loadErpHealth() {
  try {
    const health = await getErpHealth();
    return { health };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function ErpHealthPage() {
  const result = await loadErpHealth();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="ERP" title="Health ERP Full Pro" description="La vista esta lista, pero la API superadmin del ERP aun no responde." />
        <Alert type="warning" showIcon message="ERP aun no responde al contrato superadmin" description={result.error} />
      </div>
    );
  }

  const statusLabel = result.health.status === "ok" ? "Operativo" : result.health.status === "degraded" ? "Con alerta" : "Sin conexion";
  const statusBackground =
    result.health.status === "ok"
      ? "hsl(var(--status-success-bg))"
      : result.health.status === "degraded"
        ? "hsl(var(--status-warning-bg))"
        : "hsl(var(--status-error-bg))";
  const statusColor =
    result.health.status === "ok"
      ? "hsl(var(--status-success))"
      : result.health.status === "degraded"
        ? "hsl(var(--status-warning))"
        : "hsl(var(--status-error))";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ERP"
        title="Health ERP Full Pro"
        description="Estado operativo del backend ERP con lectura clara de latencia, timestamp y señal de servicio."
        actions={
          <Tag
            bordered={false}
            style={{
              margin: 0,
              borderRadius: 999,
              paddingInline: "0.85rem",
              background: statusBackground,
              color: statusColor,
              fontWeight: 700,
            }}
          >
            {statusLabel}
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <MetricCard
            title="Estado"
            value={statusLabel}
            accentVar="--section-erp"
            hint={`Servicio reportado como ${result.health.status}`}
          />
        </Col>
        <Col xs={24} md={8}>
          <MetricCard
            title="Latencia"
            value={result.health.latencyMs ? `${formatNumber(result.health.latencyMs)} ms` : "No reportada"}
            accentVar="--section-erp"
            hint="Respuesta observada en la ultima consulta"
          />
        </Col>
        <Col xs={24} md={8}>
          <MetricCard
            title="Timestamp"
            value={formatDate(result.health.timestamp)}
            accentVar="--section-erp"
            hint="Marca temporal de la verificacion"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title="Detalle de health">
            <Descriptions bordered={false} column={1}>
              <Descriptions.Item label="Estado">
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: statusBackground,
                    color: statusColor,
                    fontWeight: 700,
                  }}
                >
                  {result.health.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp">{formatDate(result.health.timestamp)}</Descriptions.Item>
              <Descriptions.Item label="Latencia">
                {result.health.latencyMs ? `${formatNumber(result.health.latencyMs)} ms` : "No reportada"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card
            className="surface-card border-0"
            title="Lectura rapida"
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
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>Señal del servicio</div>
              <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                {statusLabel}
              </div>
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                El backend ERP mantiene el mismo contrato superadmin, por lo que esta vista solo cambia
                su presentación visual y no altera la respuesta del servicio.
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
