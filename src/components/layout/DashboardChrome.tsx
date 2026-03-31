"use client";

import { Avatar, Button, Layout, Space, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/context/AuthContext";

const { Header, Content } = Layout;

const SECTION_META = [
  {
    matcher: (pathname: string) => pathname.startsWith("/dte"),
    label: "DTE",
    description: "Operacion, clientes y planes",
    accent: "--section-dte",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/barber"),
    label: "Barber Pro",
    description: "Tenants y salud del servicio",
    accent: "--section-barber",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/erp"),
    label: "ERP Full Pro",
    description: "Tenants, contabilidad y health",
    accent: "--section-erp",
  },
  {
    matcher: () => true,
    label: "Vista Global",
    description: "Resumen ejecutivo de todo el ecosistema",
    accent: "--section-overview",
  },
];

function getInitials(name?: string | null) {
  if (!name) return "S";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useAuth();
  const active = SECTION_META.find((item) => item.matcher(pathname)) ?? SECTION_META[SECTION_META.length - 1];
  const sessionLabel = session?.username ?? "Superadmin";
  const sessionInitial = getInitials(session?.username);
  const onOverview = pathname === "/overview";

  return (
    <Layout
      hasSider
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, hsl(var(--brand-primary) / 0.08), transparent 28%), linear-gradient(180deg, hsl(var(--bg-page)) 0%, hsl(var(--bg-page)) 100%)",
      }}
    >
      <AppSidebar />
      <Layout style={{ background: "transparent" }}>
        <Header
          style={{
            height: "auto",
            lineHeight: 1,
            padding: "20px 24px 10px",
            background: "transparent",
          }}
        >
          <div
            style={{
              borderRadius: 28,
              border: "1px solid hsl(var(--border-default) / 0.14)",
              background:
                "linear-gradient(180deg, hsl(var(--bg-surface)) 0%, hsl(var(--bg-surface-raised)) 100%)",
              boxShadow: "var(--shadow-lg)",
              padding: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0, flex: "1 1 520px" }}>
                <Space size={8} wrap>
                  <Tag
                    bordered={false}
                    style={{
                      margin: 0,
                      background: `hsl(var(${active.accent}) / 0.12)`,
                      color: `hsl(var(${active.accent}))`,
                      borderRadius: 999,
                      paddingInline: 10,
                    }}
                  >
                    {active.label}
                  </Tag>
                  <Tag
                    bordered={false}
                    style={{
                      margin: 0,
                      background: "hsl(var(--brand-primary) / 0.10)",
                      color: "hsl(var(--text-primary))",
                      borderRadius: 999,
                      paddingInline: 10,
                    }}
                  >
                    Sesion segura
                  </Tag>
                  <Tag
                    bordered={false}
                    style={{
                      margin: 0,
                      background: "hsl(var(--bg-subtle))",
                      color: "hsl(var(--text-secondary))",
                      borderRadius: 999,
                      paddingInline: 10,
                    }}
                  >
                    Next.js App Router
                  </Tag>
                </Space>

                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: 12,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "hsl(var(--text-muted))",
                  }}
                >
                  Panel central unificado
                </p>

                <h1
                  style={{
                    margin: "10px 0 0",
                    maxWidth: 760,
                    fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Operacion central para DTE, Barber Pro y ERP Full Pro
                </h1>

                <p
                  style={{
                    margin: "12px 0 0",
                    maxWidth: 760,
                    color: "hsl(var(--text-muted))",
                    fontSize: 15,
                    lineHeight: 1.65,
                  }}
                >
                  Un punto de control unico para navegar el ecosistema, revisar estado y operar
                  sin perder contexto entre sistemas.
                </p>

                <Space size={10} wrap style={{ marginTop: 18 }}>
                  {!onOverview ? (
                    <Button type="primary" onClick={() => router.push("/overview")}>
                      Ir a overview
                    </Button>
                  ) : null}
                  <Tag
                    bordered={false}
                    style={{
                      margin: 0,
                      background: "hsl(var(--bg-subtle))",
                      color: "hsl(var(--text-secondary))",
                      borderRadius: 999,
                      paddingInline: 12,
                      height: 32,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {active.description}
                  </Tag>
                </Space>
              </div>

              <div
                style={{
                  minWidth: 280,
                  flex: "0 0 320px",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    borderRadius: 22,
                    border: "1px solid hsl(var(--border-default) / 0.12)",
                    background: "hsl(var(--bg-page))",
                    padding: 16,
                  }}
                >
                  <Space align="center" size={12}>
                    <Avatar
                      size={44}
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)))",
                        color: "hsl(var(--text-inverse))",
                        fontWeight: 700,
                      }}
                    >
                      {sessionInitial}
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, color: "hsl(var(--text-muted))", fontSize: 12 }}>
                        Sesion activa
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "hsl(var(--text-primary))",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {sessionLabel}
                      </p>
                    </div>
                  </Space>
                </div>

                <div
                  style={{
                    borderRadius: 22,
                    border: "1px solid hsl(var(--border-default) / 0.12)",
                    background: "hsl(var(--bg-page))",
                    padding: 16,
                  }}
                >
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <span style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Ruta</span>
                      <span style={{ color: "hsl(var(--text-primary))", fontSize: 12, fontWeight: 600 }}>
                        {pathname}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <span style={{ color: "hsl(var(--text-muted))", fontSize: 12 }}>Estado</span>
                      <span style={{ color: "hsl(var(--text-primary))", fontSize: 12, fontWeight: 600 }}>
                        Conectado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Header>
        <Content style={{ padding: "0 24px 32px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
