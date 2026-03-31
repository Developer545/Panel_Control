import { Alert, Card, Col, Descriptions, Row, Tag } from "antd";
import { Database, ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate, formatNumber } from "@/lib/formatters";
import { getErrorMessage } from "@/lib/error-message";
import { getDteBackups } from "@/lib/integrations/dte";

async function loadBackups() {
  try {
    const backups = await getDteBackups();
    return { backups };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function DteBackupsPage() {
  const result = await loadBackups();

  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="DTE" title="Backups" description="Inventario de respaldos del sistema." />
        <Alert type="error" showIcon message="No se pudieron cargar los backups" description={result.error} />
      </div>
    );
  }

  const { backups } = result;

  const rows = backups.backups.map((item) => ({
    key: item.filename,
    cells: [
      item.filename,
      <Tag key={`${item.filename}-type`} bordered={false} color={item.type === "database" ? "blue" : "gold"}>
        {item.type}
      </Tag>,
      item.size_mb,
      formatDate(item.created_at),
    ],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DTE"
        title="Backups"
        description="Inventario real de respaldos y retencion del sistema."
        actions={
          <Tag
            bordered={false}
            style={{
              margin: 0,
              borderRadius: 999,
              background: "hsl(var(--accent-soft))",
              color: "hsl(var(--accent-strong))",
              fontWeight: 700,
            }}
          >
            {backups.stats.total_backups} archivos
          </Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Backups" value={backups.stats.total_backups} accentVar="--section-dte" icon={<Database size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Tamano total" value={`${backups.stats.total_size_mb} MB`} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Retencion" value={`${backups.stats.retention_days} dias`} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard title="Ultimo backup" value={formatDate(backups.stats.last_backup_at)} accentVar="--section-dte" icon={<ShieldCheck size={18} />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card className="surface-card border-0" title="Respaldos disponibles">
            <DataTable
              caption="Backups del sistema"
              columns={[
                { key: "archivo", title: "Archivo" },
                { key: "tipo", title: "Tipo" },
                { key: "tamano", title: "Tamano", align: "right" },
                { key: "fecha", title: "Fecha" },
              ]}
              rows={rows}
              emptyState="No hay respaldos disponibles."
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card className="surface-card border-0" title="Lectura operativa">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Directorio">{backups.stats.backup_dir}</Descriptions.Item>
              <Descriptions.Item label="Ultimo backup">{formatDate(backups.stats.last_backup_at)}</Descriptions.Item>
              <Descriptions.Item label="Total archivos">{formatNumber(backups.stats.total_backups)}</Descriptions.Item>
              <Descriptions.Item label="Retencion">{backups.stats.retention_days} dias</Descriptions.Item>
            </Descriptions>

            <div
              style={{
                marginTop: 16,
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-subtle))",
                color: "hsl(var(--text-muted))",
                lineHeight: 1.7,
              }}
            >
              Esta pantalla ahora consume el inventario real del backend. El disparo manual no se inventa hasta que exista un endpoint de ejecucion expuesto por el superadmin.
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
