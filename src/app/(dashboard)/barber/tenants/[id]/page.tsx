import { Alert, Card, Col, Descriptions, Row, Tag } from "antd";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate } from "@/lib/formatters";
import { getBarberTenant } from "@/lib/integrations/barber";
import { BarberTenantActions } from "@/components/barber/BarberTenantActions";

async function loadBarberTenant(id: string) {
  try {
    const tenant = await getBarberTenant(Number(id));
    return { tenant };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function BarberTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadBarberTenant(id);

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Barber" title="Detalle Barber Pro" description={`No se pudo abrir el tenant ${id}.`} />
        <Alert type="error" showIcon message="Fallo la integracion" description={result.error} />
      </div>
    );
  }

  const { tenant } = result;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Barber"
        title={tenant.name}
        description="Detalle del tenant Barber Pro con capacidad operativa y consumo base."
        actions={<BarberTenantActions tenantId={tenant.id} status={tenant.status} />}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Estado"
            value={tenant.status}
            accentVar="--section-barber"
            tone={tenant.status === "ACTIVE" ? "success" : tenant.status === "TRIAL" ? "warning" : "danger"}
            hint="Estado operativo actual"
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Plan"
            value={tenant.plan}
            accentVar="--section-barber"
            tone="section"
            hint="Suscripcion asignada al tenant"
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Max barberos"
            value={tenant.maxBarbers}
            accentVar="--section-barber"
            tone="neutral"
            hint="Capacidad configurada para el tenant"
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <MetricCard
            title="Actividad"
            value={tenant._count.users + tenant._count.barbers + tenant._count.appointments}
            accentVar="--section-barber"
            tone="section"
            hint={`${tenant._count.users} usuarios, ${tenant._count.barbers} barberos y ${tenant._count.appointments} citas`}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card
            className="surface-card border-0"
            title={<span className="text-sm font-semibold text-[hsl(var(--text-secondary))]">Perfil operativo</span>}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Slug">{tenant.slug}</Descriptions.Item>
              <Descriptions.Item label="Plan">{tenant.plan}</Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag color={tenant.status === "ACTIVE" ? "success" : tenant.status === "TRIAL" ? "processing" : "error"}>{tenant.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email">{tenant.email ?? "Sin dato"}</Descriptions.Item>
              <Descriptions.Item label="Telefono">{tenant.phone ?? "Sin dato"}</Descriptions.Item>
              <Descriptions.Item label="Ciudad">{tenant.city ?? "Sin dato"}</Descriptions.Item>
              <Descriptions.Item label="Pais">{tenant.country ?? "Sin dato"}</Descriptions.Item>
              <Descriptions.Item label="Pago hasta">{formatDate(tenant.paidUntil)}</Descriptions.Item>
              <Descriptions.Item label="Trial hasta">{formatDate(tenant.trialEndsAt)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card
            className="surface-card border-0"
            title={<span className="text-sm font-semibold text-[hsl(var(--text-secondary))]">Consumo y sistema</span>}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Max barberos">{tenant.maxBarbers}</Descriptions.Item>
              <Descriptions.Item label="Usuarios">{tenant._count.users}</Descriptions.Item>
              <Descriptions.Item label="Barberos">{tenant._count.barbers}</Descriptions.Item>
              <Descriptions.Item label="Citas">{tenant._count.appointments}</Descriptions.Item>
              <Descriptions.Item label="Creado">{formatDate(tenant.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Actualizado">{formatDate(tenant.updatedAt)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
