import { guardEnv } from "@/lib/panel-api";
import { fetchJson } from "@/lib/integrations/fetch-json";
import type { ServiceHealth } from "@/lib/integrations/types";

export type DteTenantEstado = "pruebas" | "activo" | "suspendido";

export type DteDashboardStats = {
  total: number;
  activos: number;
  en_pruebas: number;
  suspendidos: number;
  por_vencer: number;
  vencidos: number;
  nuevos_semana: number;
  nuevos_mes: number;
  mrr: number;
  ingresos_mes: number;
  ingresos_mes_anterior: number;
  alertas_por_vencer: Array<{
    id: number;
    nombre: string;
    slug: string;
    fecha_pago: string;
    plan_nombre: string | null;
  }>;
  alertas_vencidos: Array<{
    id: number;
    nombre: string;
    slug: string;
    fecha_pago: string;
    plan_nombre: string | null;
  }>;
};

export type DteTenantListItem = {
  id: number;
  nombre: string;
  slug: string;
  email_contacto: string | null;
  telefono: string | null;
  estado: DteTenantEstado;
  fecha_pago: string | null;
  fecha_suspension: string | null;
  plan_nombre: string | null;
  created_at: string;
  dias_para_vencer: number | null;
};

export type DteTenantDetail = DteTenantListItem & {
  notas: string | null;
  plan_id: number | null;
  max_sucursales: number | null;
  max_sucursales_override: number | null;
  plan_max_sucursales: number | null;
  max_puntos_venta: number | null;
  max_puntos_venta_override: number | null;
  plan_max_puntos_venta: number | null;
  max_usuarios: number | null;
  max_usuarios_override: number | null;
  plan_max_usuarios: number | null;
  api_ambiente: string | null;
  api_usuario: string | null;
  api_token_expira: string | null;
  firma_archivo: string | null;
  firma_nit: string | null;
  firma_vence: string | null;
  updated_at: string;
};

export type DtePlan = {
  id: number;
  nombre: string;
  max_sucursales: number;
  max_usuarios: number;
  precio: number;
  activo: boolean;
};

export type DteDepartamento = {
  id: number;
  codigo: string;
  nombre: string;
};

export type DteMunicipio = {
  id: number;
  codigo: string;
  nombre: string;
  departamento_id: number;
  departamento_nombre?: string;
};

export type DteTenantPago = {
  id: number;
  monto: number;
  fecha_pago: string | null;
  metodo: string | null;
  notas: string | null;
  nueva_fecha_vencimiento?: string | null;
  created_at?: string;
};

export type DteTenantUser = {
  id: number;
  nombre: string;
  username: string;
  rol: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type DteTenantDocumentConfig = {
  id: number;
  tipo_dte: string;
  prefijo: string;
  numero_actual: number;
  updated_at: string;
};

export type DteTenantPuntoVenta = {
  id: number;
  sucursal_id: number;
  nombre: string;
  codigo: string;
  codigo_mh: string | null;
  activo: boolean;
  sucursal_nombre?: string;
  prefijo?: string;
  updated_at: string;
};

export type DteTenantSucursal = {
  id: number;
  nombre: string;
  codigo: string;
  codigo_mh: string | null;
  direccion: string | null;
  departamento_id: number | null;
  municipio_id: number | null;
  telefono: string | null;
  correo: string | null;
  activo: boolean;
  departamento_nombre?: string | null;
  municipio_nombre?: string | null;
  updated_at: string;
  puntos_venta?: DteTenantPuntoVenta[];
};

export type DteTenantApiMh = {
  id: number;
  ambiente: string;
  url_auth: string;
  url_transmision: string;
  usuario_api: string | null;
  tiene_password: boolean;
  tiene_token: boolean;
  token_expira_en: string | null;
  updated_at: string;
};

export type DteTenantFirma = {
  id: number;
  certificado_path?: string | null;
  archivo_nombre?: string | null;
  tiene_certificado?: boolean;
  tiene_password?: boolean;
  nit_certificado: string | null;
  fecha_vencimiento: string | null;
  updated_at?: string;
};

export type DteTenantEmpresaConfig = {
  id: number;
  nombre_negocio: string;
  nit: string | null;
  ncr: string | null;
  direccion: string | null;
  giro: string | null;
  departamento: string | null;
  municipio: string | null;
  telefono: string | null;
  correo: string | null;
  logo_url: string | null;
  cod_actividad: string | null;
  desc_actividad: string | null;
  tipo_establecimiento: string | null;
  departamento_id: number | null;
  municipio_id: number | null;
  updated_at: string;
};

export type DteTenantTemaConfig = {
  id: number;
  accent: string;
  accent_text: string;
  page_bg: string;
  card_bg: string;
  sidebar_bg: string;
  glass_blur?: string;
  updated_at: string;
};

export type DteHealthDatabase = {
  status: "ok" | "error";
  latency_ms: number;
  version: string;
  server_time: string | null;
  pool: {
    total: number;
    idle: number;
    waiting: number;
    max: number;
  };
};

export type DteHealthMemory = {
  rss_mb: number;
  heap_used_mb: number;
  heap_total_mb: number;
  external_mb: number;
};

export type DteHealthProcess = {
  uptime_seconds: number;
  node_version: string;
  platform: string;
  arch: string;
  environment: string;
  pid: number;
  memory: DteHealthMemory;
};

export type DteHealthTenants = {
  total: number;
  activos: number;
  suspendidos: number;
  en_pruebas: number;
};

export type DteHealthDetail = {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  database: DteHealthDatabase;
  process: DteHealthProcess;
  tenants: DteHealthTenants;
};

export type DteAuditItem = {
  id: number;
  actor_id: number | null;
  actor_tipo: "superadmin" | "sistema";
  accion: string;
  tenant_id: number | null;
  detalle: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
  actor_nombre: string | null;
  actor_username: string | null;
  tenant_nombre: string | null;
  tenant_slug: string | null;
};

export type DteAuditResponse = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: DteAuditItem[];
};

export type DteAuditFilters = {
  page?: number;
  limit?: number;
  actor_tipo?: string;
  accion?: string;
  tenant_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
};

export type DteMapaDepartamento = {
  codigo: string;
  nombre: string;
  total: number;
  activos: number;
  suspendidos: number;
  en_pruebas: number;
};

export type DteMapData = {
  departamentos: DteMapaDepartamento[];
  sin_ubicacion: number;
  total_tenants: number;
};

export type DteAnalyticsSeriePunto = {
  mes: string;
  mes_label: string;
  ingresos: number;
  nuevos: number;
  activaciones: number;
  suspensiones: number;
};

export type DteAnalyticsPorPlan = {
  plan: string;
  total: number;
  activos: number;
  precio: number;
};

export type DteAnalyticsPorEstado = {
  estado: string;
  total: number;
};

export type DteAnalyticsKpis = {
  crecimiento_mom: number;
  ingreso_ytd: number;
  nuevos_mes: number;
  suspensiones_mes: number;
  activaciones_mes: number;
};

export type DteAnalyticsData = {
  serie: DteAnalyticsSeriePunto[];
  por_plan: DteAnalyticsPorPlan[];
  por_estado: DteAnalyticsPorEstado[];
  kpis: DteAnalyticsKpis;
};

export type DteBackupFile = {
  filename: string;
  type: "database" | "uploads";
  size_bytes: number;
  size_mb: string;
  created_at: string;
};

export type DteBackupStats = {
  total_backups: number;
  total_size_mb: string;
  last_backup_at: string | null;
  retention_days: number;
  backup_dir: string;
};

export type DteBackupListResponse = {
  stats: DteBackupStats;
  backups: DteBackupFile[];
};

function getBaseUrl() {
  const baseUrl = guardEnv("DTE_PANEL_URL");
  return baseUrl.replace(/\/$/, "");
}

type DteAuthHeaders =
  | { kind: "api-key"; headers: HeadersInit }
  | { kind: "cookie"; headers: HeadersInit };

async function getDteAuthHeaders(): Promise<DteAuthHeaders> {
  const apiKey = process.env.DTE_PANEL_API_KEY;
  if (apiKey) {
    return {
      kind: "api-key",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    };
  }

  const username = guardEnv("DTE_SUPERADMIN_USER");
  const password = guardEnv("DTE_SUPERADMIN_PASS");

  const response = await fetch(`${getBaseUrl()}/superadmin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as { requires2FA?: boolean; message?: string }) : {};

  if (!response.ok) {
    throw new Error(payload.message ?? "No se pudo autenticar contra DTE");
  }

  if (payload.requires2FA) {
    throw new Error(
      "DTE requiere 2FA para el login superadmin. Configura DTE_PANEL_API_KEY para usar el panel v3.",
    );
  }

  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("DTE no devolvio cookie de sesion para superadmin");
  }

  const cookie = setCookie.split(",").map((chunk) => chunk.trim()).find((chunk) => chunk.startsWith("erp_superadmin_token="));
  if (!cookie) {
    throw new Error("No se pudo resolver la cookie erp_superadmin_token de DTE");
  }

  return {
    kind: "cookie",
    headers: {
      Cookie: cookie.split(";")[0],
    },
  };
}

async function dteFetch<T>(path: string): Promise<T> {
  const auth = await getDteAuthHeaders();
  return fetchJson<T>(`${getBaseUrl()}/superadmin${path}`, {
    headers: auth.headers,
  });
}

function buildQuery(params?: Record<string, string | number | undefined>) {
  if (!params) return "";

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getDteDashboard() {
  return dteFetch<DteDashboardStats>("/dashboard");
}

export async function getDteTenants() {
  return dteFetch<DteTenantListItem[]>("/tenants");
}

export async function getDteTenant(id: number) {
  return dteFetch<DteTenantDetail>(`/tenants/${id}`);
}

export async function getDtePlans() {
  return dteFetch<DtePlan[]>("/planes");
}

export async function getDteHealth(): Promise<ServiceHealth> {
  const data = await getDteHealthDetail();

  return {
    status: data.status,
    timestamp: data.timestamp,
    latencyMs: data.database.latency_ms,
  };
}

export async function getDteDepartamentos() {
  return dteFetch<DteDepartamento[]>("/departamentos");
}

export async function getDteMunicipios(departamentoId?: number) {
  return dteFetch<DteMunicipio[]>(`/municipios${buildQuery({ departamentoId })}`);
}

export async function getDteHealthDetail() {
  return dteFetch<DteHealthDetail>("/health");
}

export async function getDteAudit(filters?: DteAuditFilters) {
  return dteFetch<DteAuditResponse>(
    `/audit${buildQuery(filters as Record<string, string | number | undefined>)}`,
  );
}

export async function getDteMap() {
  return dteFetch<DteMapData>("/mapa");
}

export async function getDteAnalytics() {
  return dteFetch<DteAnalyticsData>("/analytics");
}

export async function getDteBackups() {
  return dteFetch<DteBackupListResponse>("/system/backups");
}

export async function getDteTenantPagos(id: number) {
  return dteFetch<DteTenantPago[]>(`/tenants/${id}/pagos`);
}

export async function getDteTenantUsuarios(id: number) {
  return dteFetch<DteTenantUser[]>(`/tenants/${id}/usuarios`);
}

export async function getDteTenantDte(id: number) {
  return dteFetch<DteTenantDocumentConfig[]>(`/tenants/${id}/dte`);
}

export async function getDteTenantSucursales(id: number) {
  return dteFetch<DteTenantSucursal[]>(`/tenants/${id}/sucursales`);
}

export async function getDteTenantPuntosVenta(id: number, sucursalId: number) {
  return dteFetch<DteTenantPuntoVenta[]>(`/tenants/${id}/sucursales/${sucursalId}/puntos-venta`);
}

export async function getDteTenantApiMh(id: number) {
  return dteFetch<DteTenantApiMh>(`/tenants/${id}/api-mh`);
}

export async function getDteTenantFirma(id: number) {
  return dteFetch<DteTenantFirma>(`/tenants/${id}/firma`);
}

export async function getDteTenantEmpresaConfig(id: number) {
  return dteFetch<DteTenantEmpresaConfig>(`/tenants/${id}/config/empresa`);
}

export async function getDteTenantTemaConfig(id: number) {
  return dteFetch<DteTenantTemaConfig>(`/tenants/${id}/config/tema`);
}
