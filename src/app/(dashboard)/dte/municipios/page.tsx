import Link from "next/link";
import { Alert, Button, Card, Col, Input, Row, Tag } from "antd";
import { MapPinned, Search, ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/error-message";
import { getDteDepartamentos, getDteMunicipios } from "@/lib/integrations/dte";

type SearchParams = Record<string, string | string[] | undefined>;

async function loadMunicipios(departamentoId?: number) {
  try {
    const [departamentos, municipios] = await Promise.all([getDteDepartamentos(), getDteMunicipios(departamentoId)]);
    return { departamentos, municipios };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function buildHref(departamentoId: number | "all", search: string) {
  const params = new URLSearchParams();
  if (departamentoId !== "all") params.set("departamento_id", String(departamentoId));
  if (search.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `/dte/municipios?${query}` : "/dte/municipios";
}

export default async function DteMunicipiosPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const departamentoIdRaw = readParam(params.departamento_id);
  const departamentoId = departamentoIdRaw && departamentoIdRaw !== "all" ? Number(departamentoIdRaw) : undefined;
  const result = await loadMunicipios(departamentoId);

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Municipios" description="Catalogo territorial del ecosistema DTE." />
        <Alert type="error" showIcon message="No se pudo cargar el catalogo de municipios" description={result.error} />
      </div>
    );
  }

  const query = readParam(params.q).trim().toLowerCase();
  const departamentos = result.departamentos;
  const municipios = result.municipios.filter((item) => {
    const dep = item.departamento_nombre ?? departamentos.find((row) => row.id === item.departamento_id)?.nombre ?? "";
    return !query || item.codigo.toLowerCase().includes(query) || item.nombre.toLowerCase().includes(query) || dep.toLowerCase().includes(query);
  });
  const selectedDepartment = departamentoId ? departamentos.find((item) => item.id === departamentoId) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Municipios"
        description="Catalogo CAT-013 con filtro por departamento y lectura territorial del ecosistema."
        actions={<Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--accent-soft))", color: "hsl(var(--accent-strong))", fontWeight: 700 }}>CAT-013</Tag>}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Catalogo" value={result.municipios.length} accentVar="--section-dte" icon={<MapPinned size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Filtrados" value={municipios.length} accentVar="--section-dte" icon={<Search size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <MetricCard title="Departamentos" value={departamentos.length} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={9}>
          <Card className="surface-card border-0" title="Filtros territoriales">
            <form action="/dte/municipios" method="get" style={{ display: "grid", gap: 12 }}>
              <Input
                allowClear
                prefix={<Search size={16} />}
                placeholder="Buscar municipio o departamento"
                defaultValue={readParam(params.q)}
                name="q"
              />
              <input type="hidden" name="departamento_id" value={departamentoIdRaw || "all"} />
              <Button htmlType="submit" type="primary">
                Aplicar filtro
              </Button>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Link href={buildHref("all", readParam(params.q))} style={{ textDecoration: "none" }}>
                  <Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: !departamentoId ? "hsl(var(--section-dte))" : "hsl(var(--bg-subtle))", color: !departamentoId ? "hsl(var(--text-inverse))" : "hsl(var(--text-secondary))", fontWeight: 700 }}>
                    Todos
                  </Tag>
                </Link>
                {departamentos.map((item) => (
                  <Link key={item.id} href={buildHref(item.id, readParam(params.q))} style={{ textDecoration: "none" }}>
                    <Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: departamentoId === item.id ? "hsl(var(--section-dte))" : "hsl(var(--bg-subtle))", color: departamentoId === item.id ? "hsl(var(--text-inverse))" : "hsl(var(--text-secondary))", fontWeight: 700 }}>
                      {item.nombre}
                    </Tag>
                  </Link>
                ))}
              </div>

              <div style={{ color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.7 }}>
                {selectedDepartment ? (
                  <>
                    Estás viendo los municipios del departamento <strong>{selectedDepartment.nombre}</strong>. Este filtro recupera la lógica territorial del panel original y te deja listo el puente con el detalle del cliente.
                  </>
                ) : (
                  <>
                    Usa el filtro por departamento para recorrer el territorio sin perder contexto. La relación real con tenants se sigue resolviendo en el detalle del cliente.
                  </>
                )}
              </div>
            </form>
          </Card>
        </Col>

        <Col xs={24} xl={15}>
          <Card className="surface-card border-0">
            <DataTable
              columns={[
                { key: "codigo", title: "Codigo" },
                { key: "municipio", title: "Municipio" },
                { key: "departamento", title: "Departamento" },
              ]}
              rows={municipios.map((item) => ({
                key: String(item.id),
                cells: [
                  <Tag key={`code-${item.id}`} bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--bg-subtle))", fontWeight: 700 }}>
                    {item.codigo}
                  </Tag>,
                  item.nombre,
                  item.departamento_nombre ?? departamentos.find((row) => row.id === item.departamento_id)?.nombre ?? "Sin dato",
                ],
              }))}
              caption={query || departamentoId ? "Municipios filtrados" : "Catalogo territorial"}
              emptyState="No hay municipios para mostrar."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
