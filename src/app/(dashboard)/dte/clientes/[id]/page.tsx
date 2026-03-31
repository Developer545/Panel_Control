import { Alert, Button, Col, Row, Tag } from "antd";
import { Building2, FileSpreadsheet, Receipt, Users } from "lucide-react";
import type { ReactNode } from "react";
import { DteTenantWorkspace } from "@/components/dte/DteTenantWorkspace";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import {
  getDteTenant,
  getDteTenantApiMh,
  getDteTenantDte,
  getDteTenantEmpresaConfig,
  getDteTenantFirma,
  getDteTenantPagos,
  getDteTenantSucursales,
  getDteTenantTemaConfig,
  getDteTenantUsuarios,
} from "@/lib/integrations/dte";

function settledValue<T>(result: PromiseSettledResult<T>) {
  return result.status === "fulfilled" ? result.value : null;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--text-secondary))" }}>{children}</span>;
}

async function loadDteTenantWorkspace(id: string) {
  const tenantId = Number(id);

  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    return { error: "El id del tenant no es valido." };
  }

  const results = await Promise.allSettled([
    getDteTenant(tenantId),
    getDteTenantPagos(tenantId),
    getDteTenantUsuarios(tenantId),
    getDteTenantDte(tenantId),
    getDteTenantSucursales(tenantId),
    getDteTenantApiMh(tenantId),
    getDteTenantFirma(tenantId),
    getDteTenantEmpresaConfig(tenantId),
    getDteTenantTemaConfig(tenantId),
  ] as const);

  const [tenantResult, pagosResult, usuariosResult, dteResult, sucursalesResult, apiMhResult, firmaResult, empresaConfigResult, temaConfigResult] = results;

  if (tenantResult.status === "rejected") {
    return { error: getErrorMessage(tenantResult.reason) };
  }

  const warnings: string[] = [];
  if (pagosResult.status === "rejected") warnings.push("Pagos");
  if (usuariosResult.status === "rejected") warnings.push("Usuarios");
  if (dteResult.status === "rejected") warnings.push("DTE");
  if (sucursalesResult.status === "rejected") warnings.push("Sucursales");
  if (apiMhResult.status === "rejected") warnings.push("API Hacienda");
  if (firmaResult.status === "rejected") warnings.push("Firma");
  if (empresaConfigResult.status === "rejected") warnings.push("Empresa");
  if (temaConfigResult.status === "rejected") warnings.push("Tema");

  return {
    tenant: tenantResult.value,
    pagos: settledValue(pagosResult),
    usuarios: settledValue(usuariosResult),
    dte: settledValue(dteResult),
    sucursales: settledValue(sucursalesResult),
    apiMh: settledValue(apiMhResult),
    firma: settledValue(firmaResult),
    empresaConfig: settledValue(empresaConfigResult),
    temaConfig: settledValue(temaConfigResult),
    warnings,
  };
}

export default async function DteClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadDteTenantWorkspace(id);

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Detalle DTE" description={`No se pudo abrir el tenant ${id}.`} />
        <Alert type="error" showIcon message="Fallo la integracion" description={result.error} />
      </div>
    );
  }

  const { tenant, warnings, ...workspaceData } = result;
  const pagosCount = workspaceData.pagos?.length ?? 0;
  const usuariosCount = workspaceData.usuarios?.length ?? 0;
  const sucursalesCount = workspaceData.sucursales?.length ?? 0;
  const seriesCount = workspaceData.dte?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title={tenant.nombre}
        description="Workspace profundo del tenant DTE con cuenta, empresa, pagos, usuarios, DTE, sucursales, API Hacienda y firma."
        actions={
          <>
            <Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--bg-subtle))", color: "hsl(var(--text-secondary))" }}>
              Solo lectura
            </Tag>
            <Button href="/dte/clientes" type="default">
              Volver a clientes
            </Button>
          </>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Usuarios" value={usuariosCount} accentVar="--section-dte" icon={<Users size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Pagos" value={pagosCount} accentVar="--section-dte" icon={<Receipt size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Sucursales" value={sucursalesCount} accentVar="--section-dte" icon={<Building2 size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Series DTE" value={seriesCount} accentVar="--section-dte" icon={<FileSpreadsheet size={18} />} />
        </Col>
      </Row>

      <div
        className="surface-card border-0"
        style={{
          borderRadius: 20,
          border: "1px solid hsl(var(--border-default))",
          background: "hsl(var(--bg-surface))",
          padding: "1rem 1.1rem",
        }}
      >
        <SectionLabel>Workspace operativo</SectionLabel>
        <div style={{ marginTop: 8, color: "hsl(var(--text-muted))", lineHeight: 1.7 }}>
          Este panel consolida la cuenta, configuracion y telemetria del tenant seleccionado. La edicion sigue deshabilitada para conservar el flujo actual.
        </div>
      </div>

      <DteTenantWorkspace tenant={tenant} warnings={warnings} {...workspaceData} />
    </div>
  );
}
