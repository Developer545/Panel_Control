import Link from "next/link";
import { Alert, Card, Col, Row, Tag } from "antd";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { formatDateOnly } from "@/lib/formatters";
import { getErpTenants } from "@/lib/integrations/erp";

async function loadErpTenants() {
  try {
    const tenants = await getErpTenants();
    return { tenants };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function ErpTenantsPage() {
  const result = await loadErpTenants();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="ERP" title="Tenants ERP Full Pro" description="El listado quedara disponible cuando ERP exponga `/api/superadmin/tenants`." />
        <Alert type="warning" showIcon message="ERP aun no responde al contrato superadmin" description={result.error} />
      </div>
    );
  }

  const total = result.tenants.items.length;
  const active = result.tenants.items.filter((row) => row.status === "ACTIVE").length;
  const trial = result.tenants.items.filter((row) => row.status === "TRIAL").length;
  const suspended = result.tenants.items.filter((row) => row.status !== "ACTIVE" && row.status !== "TRIAL").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ERP"
        title="Tenants ERP Full Pro"
        description="Listado multi-tenant centralizado del ERP con lectura de estado y vencimiento."
        actions={
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
            {total} tenants
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Total" value={total} accentVar="--section-erp" hint="Tenants registrados en ERP" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Activos" value={active} accentVar="--section-erp" tone="success" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Trial" value={trial} accentVar="--section-erp" tone="warning" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Suspendidos" value={suspended} accentVar="--section-erp" tone="danger" />
        </Col>
      </Row>

      <Card className="surface-card border-0">
        <DataTable
          caption="Registro multi-tenant ERP"
          columns={[
            { key: "empresa", title: "Empresa" },
            { key: "slug", title: "Slug" },
            { key: "plan", title: "Plan" },
            { key: "estado", title: "Estado" },
            { key: "trial", title: "Trial" },
          ]}
          rows={result.tenants.items.map((row) => {
            const stateBackground =
              row.status === "ACTIVE"
                ? "hsl(var(--status-success-bg))"
                : row.status === "TRIAL"
                  ? "hsl(var(--status-warning-bg))"
                  : "hsl(var(--status-error-bg))";
            const stateColor =
              row.status === "ACTIVE"
                ? "hsl(var(--status-success))"
                : row.status === "TRIAL"
                  ? "hsl(var(--status-warning))"
                  : "hsl(var(--status-error))";

            return {
              key: String(row.id),
              cells: [
                <Link
                  key={`link-${row.id}`}
                  href={`/erp/tenants/${row.id}`}
                  style={{ color: "hsl(var(--section-erp))", fontWeight: 700 }}
                >
                  {row.name}
                </Link>,
                row.slug,
                row.plan,
                <Tag
                  key={`status-${row.id}`}
                  bordered={false}
                  style={{
                    margin: 0,
                    borderRadius: 999,
                    background: stateBackground,
                    color: stateColor,
                    fontWeight: 700,
                  }}
                >
                  {row.status}
                </Tag>,
                formatDateOnly(row.trialEndsAt),
              ],
            };
          })}
        />
      </Card>
    </div>
  );
}
