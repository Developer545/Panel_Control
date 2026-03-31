import { Alert, Card, Col, Input, Row, Tag } from "antd";
import { Building2, Search, ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { getDteDepartamentos } from "@/lib/integrations/dte";

type SearchParams = Record<string, string | string[] | undefined>;

async function loadDepartamentos() {
  try {
    const departamentos = await getDteDepartamentos();
    return { departamentos };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function DteDepartamentosPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const result = await loadDepartamentos();
  const params = (await searchParams) ?? {};

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Departamentos" description="Catalogo territorial del ecosistema DTE." />
        <Alert type="error" showIcon message="No se pudo cargar el catalogo de departamentos" description={result.error} />
      </div>
    );
  }

  const query = readParam(params.q).trim().toLowerCase();
  const departamentos = result.departamentos.filter((item) => !query || item.codigo.toLowerCase().includes(query) || item.nombre.toLowerCase().includes(query));
  const firstCode = result.departamentos[0]?.codigo ?? "-";
  const lastCode = result.departamentos.at(-1)?.codigo ?? "-";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Departamentos"
        description="Catalogo CAT-012 para la distribucion territorial del ecosistema y soporte de ubicacion en clientes."
        actions={<Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--accent-soft))", color: "hsl(var(--accent-strong))", fontWeight: 700 }}>CAT-012</Tag>}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Catalogo" value={result.departamentos.length} accentVar="--section-dte" icon={<Building2 size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Filtrados" value={departamentos.length} accentVar="--section-dte" icon={<Search size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Primer codigo" value={firstCode} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Ultimo codigo" value={lastCode} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={9}>
          <Card className="surface-card border-0" title="Filtro rapido">
            <form action="/dte/departamentos" method="get" style={{ display: "grid", gap: 12 }}>
              <Input
                name="q"
                defaultValue={readParam(params.q)}
                allowClear
                prefix={<Search size={16} />}
                placeholder="Buscar departamento o codigo"
              />
              <button
                type="submit"
                style={{
                  border: "none",
                  borderRadius: "1rem",
                  padding: "0.9rem 1rem",
                  background: "hsl(var(--section-dte))",
                  color: "hsl(var(--text-inverse))",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Aplicar filtro
              </button>
            </form>
            <div style={{ marginTop: 16, color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.7 }}>
              Este catalogo alimenta la configuracion de ubicaciones del cliente y los filtros de municipios. La informacion de uso real queda en el detalle del tenant, por eso esta pantalla es deliberadamente liviana y ordenada.
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={15}>
          <Card className="surface-card border-0">
            <DataTable
              columns={[
                { key: "codigo", title: "Codigo" },
                { key: "nombre", title: "Departamento" },
              ]}
              rows={departamentos.map((item) => ({
                key: String(item.id),
                cells: [
                  <Tag key={`code-${item.id}`} bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--bg-subtle))", fontWeight: 700 }}>
                    {item.codigo}
                  </Tag>,
                  item.nombre,
                ],
              }))}
              caption={query ? `Resultados para "${readParam(params.q)}"` : "Catalogo territorial"}
              emptyState="No hay departamentos para mostrar."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
