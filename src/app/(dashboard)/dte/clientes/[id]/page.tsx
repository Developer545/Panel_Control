import { Alert, Button, Tag } from "antd";
import { DteTenantWorkspace } from "@/components/dte/DteTenantWorkspace";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { getDteTenant } from "@/lib/integrations/dte";

async function loadDteTenant(id: string) {
  const tenantId = Number(id);

  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    return { error: "El id del tenant no es valido." };
  }

  try {
    const tenant = await getDteTenant(tenantId);
    return { tenant };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function DteClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadDteTenant(id);

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Detalle DTE" description={`No se pudo abrir el tenant ${id}.`} />
        <Alert type="error" showIcon message="Fallo la integracion" description={result.error} />
      </div>
    );
  }

  const { tenant } = result;

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
      <DteTenantWorkspace tenant={tenant} />
    </div>
  );
}
