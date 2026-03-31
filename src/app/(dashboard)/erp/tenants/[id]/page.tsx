import { Alert, Card, Col, Descriptions, Row, Tag } from "antd";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate, formatNumber } from "@/lib/formatters";
import { getErpTenant } from "@/lib/integrations/erp";

async function loadErpTenant(id: string) {
  try {
    const tenant = await getErpTenant(id);
    return { tenant };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

function getStatusLabel(status: string) {
  if (status === "ACTIVE") return "Activo";
  if (status === "TRIAL") return "Trial";
  return "Suspendido";
}

function getStatusStyles(status: string) {
  if (status === "ACTIVE") {
    return {
      background: "hsl(var(--status-success-bg))",
      color: "hsl(var(--status-success))",
    };
  }

  if (status === "TRIAL") {
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

export default async function ErpTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadErpTenant(id);

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="ERP" title="Detalle ERP Full Pro" description={`No se pudo abrir el tenant ${id}.`} />
        <Alert type="warning" showIcon message="ERP aun no responde al contrato superadmin" description={result.error} />
      </div>
    );
  }

  const { tenant } = result;
  const statusStyles = getStatusStyles(tenant.status);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ERP"
        title={tenant.name}
        description="Detalle operativo del tenant ERP Full Pro."
        actions={
          <Tag
            bordered={false}
            style={{
              margin: 0,
              borderRadius: 999,
              paddingInline: "0.85rem",
              ...statusStyles,
              fontWeight: 700,
            }}
          >
            {getStatusLabel(tenant.status)}
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="Usuarios"
            value={formatNumber(tenant._count.users)}
            accentVar="--section-erp"
            hint="Usuarios creados en el tenant"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="Productos"
            value={formatNumber(tenant._count.products)}
            accentVar="--section-erp"
            hint="Productos registrados en el tenant"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="Límite usuarios"
            value={formatNumber(tenant.maxUsers)}
            accentVar="--section-erp"
            hint="Capacidad disponible por plan"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="Facturas / mes"
            value={formatNumber(tenant.maxInvoicesPerMonth)}
            accentVar="--section-erp"
            hint="Tope mensual del tenant"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card className="surface-card border-0" title="Ficha del tenant">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Slug">{tenant.slug}</Descriptions.Item>
              <Descriptions.Item label="Plan">{tenant.plan}</Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    ...statusStyles,
                    fontWeight: 700,
                  }}
                >
                  {tenant.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trial">{formatDate(tenant.trialEndsAt)}</Descriptions.Item>
              <Descriptions.Item label="Creado">{formatDate(tenant.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Actualizado">{formatDate(tenant.updatedAt)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card
            className="surface-card border-0"
            title="Capacidad y uso"
            styles={{
              body: {
                display: "grid",
                gap: 12,
              },
            }}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Max usuarios">{tenant.maxUsers}</Descriptions.Item>
              <Descriptions.Item label="Max productos">{tenant.maxProducts}</Descriptions.Item>
              <Descriptions.Item label="Max facturas mes">{tenant.maxInvoicesPerMonth}</Descriptions.Item>
              <Descriptions.Item label="Usuarios">{tenant._count.users}</Descriptions.Item>
              <Descriptions.Item label="Productos">{tenant._count.products}</Descriptions.Item>
            </Descriptions>
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
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13 }}>Lectura operativa</div>
              <div style={{ color: "hsl(var(--text-primary))", fontSize: 24, fontWeight: 800 }}>
                {getStatusLabel(tenant.status)}
              </div>
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                La ficha conserva la misma información de contrato, pero la jerarquiza con el estilo del
                dashboard central para que el estado quede visible de inmediato.
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
