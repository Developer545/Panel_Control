import Link from "next/link";
import { Alert, Card, Col, Row, Tag } from "antd";
import { Clock3, CreditCard, LifeBuoy, ShieldCheck, Users } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDateOnly, formatNumber } from "@/lib/formatters";
import { getDteTenants } from "@/lib/integrations/dte";

async function loadDteTenantsPage() {
  try {
    const tenants = await getDteTenants();
    return { tenants };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function DteClientesPage() {
  const result = await loadDteTenantsPage();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Clientes DTE" description="No se pudo consultar la lista de clientes." />
        <Alert type="error" showIcon message="Fallo la integracion" description={result.error} />
      </div>
    );
  }

  const tenants = result.tenants;
  const activos = tenants.filter((row) => row.estado === "activo").length;
  const pruebas = tenants.filter((row) => row.estado === "pruebas").length;
  const suspendidos = tenants.filter((row) => row.estado === "suspendido").length;
  const porVencer = tenants.filter(
    (row) => row.dias_para_vencer !== null && row.dias_para_vencer >= 0 && row.dias_para_vencer <= 7,
  ).length;
  const vencidos = tenants.filter(
    (row) => row.dias_para_vencer !== null && row.dias_para_vencer < 0,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Clientes DTE"
        description="Listado maestro de tenants DTE con foco en estado, plan, vencimiento y acceso al detalle operativo."
        actions={
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
            {formatNumber(tenants.length)} registros
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Total" value={tenants.length} accentVar="--section-dte" icon={<Users size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Activos" value={activos} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Pruebas" value={pruebas} accentVar="--section-dte" icon={<CreditCard size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Suspendidos" value={suspendidos} accentVar="--section-dte" icon={<LifeBuoy size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Por vencer" value={porVencer} accentVar="--section-dte" icon={<Clock3 size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Vencidos" value={vencidos} accentVar="--section-dte" icon={<Clock3 size={18} />} />
        </Col>
      </Row>

      <Card className="surface-card border-0">
        <DataTable
          columns={[
            { key: "cliente", title: "Cliente" },
            { key: "slug", title: "Slug" },
            { key: "contacto", title: "Contacto" },
            { key: "plan", title: "Plan" },
            { key: "estado", title: "Estado" },
            { key: "vence", title: "Vence" },
            { key: "dias", title: "Dias", align: "right" },
          ]}
          rows={tenants.map((row) => ({
            key: String(row.id),
            cells: [
              <Link key={`link-${row.id}`} href={`/dte/clientes/${row.id}`}>
                {row.nombre}
              </Link>,
              row.slug,
              row.email_contacto ?? row.telefono ?? "Sin dato",
              row.plan_nombre ?? "Sin plan",
              <Tag
                key={`status-${row.id}`}
                color={row.estado === "activo" ? "success" : row.estado === "pruebas" ? "processing" : "error"}
              >
                {row.estado}
              </Tag>,
              formatDateOnly(row.fecha_pago),
              row.dias_para_vencer ?? "N/A",
            ],
          }))}
          caption="Tenants DTE"
          emptyState="No hay tenants DTE disponibles."
        />
      </Card>
    </div>
  );
}
