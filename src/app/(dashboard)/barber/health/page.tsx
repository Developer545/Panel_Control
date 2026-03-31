import { Alert, Card, Col, Descriptions, Row } from "antd";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate, formatNumber } from "@/lib/formatters";
import { getBarberHealth } from "@/lib/integrations/barber";

async function loadBarberHealth() {
  try {
    const health = await getBarberHealth();
    return { health };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function BarberHealthPage() {
  const result = await loadBarberHealth();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Barber" title="Health Barber Pro" description="No se pudo consultar el estado del servicio." />
        <Alert type="error" showIcon message="Fallo la integracion" description={result.error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Barber" title="Health Barber Pro" description="Estado de salud del backend de Barber Pro." />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <MetricCard
            title="Estado"
            value={result.health.status === "ok" ? "Operativo" : "Atencion"}
            accentVar="--section-barber"
            tone={result.health.status === "ok" ? "success" : "warning"}
            hint={result.health.status.toUpperCase()}
          />
        </Col>
        <Col xs={24} md={8}>
          <MetricCard
            title="Latencia"
            value={result.health.latencyMs ?? "Sin dato"}
            accentVar="--section-barber"
            tone={result.health.latencyMs && result.health.latencyMs > 300 ? "warning" : "section"}
            suffix={result.health.latencyMs ? " ms" : undefined}
            hint="Tiempo de respuesta del health endpoint"
          />
        </Col>
        <Col xs={24} md={8}>
          <MetricCard
            title="Ultima lectura"
            value={formatDate(result.health.timestamp)}
            accentVar="--section-barber"
            tone="neutral"
            hint="Timestamp reportado por el backend"
          />
        </Col>
      </Row>
      <Card
        className="surface-card border-0"
        title={<span className="text-sm font-semibold text-[hsl(var(--text-secondary))]">Detalle tecnico</span>}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Estado">{result.health.status}</Descriptions.Item>
          <Descriptions.Item label="Timestamp">{formatDate(result.health.timestamp)}</Descriptions.Item>
          <Descriptions.Item label="Latencia">{result.health.latencyMs ? `${formatNumber(result.health.latencyMs)} ms` : "No reportada"}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
