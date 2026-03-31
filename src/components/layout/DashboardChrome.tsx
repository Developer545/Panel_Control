"use client";

import { Avatar, Button, Layout, Space, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ControlSidebar } from "@/components/layout/ControlSidebar";
import { useAuth } from "@/context/AuthContext";

const { Header, Content } = Layout;

type SectionMeta = {
  matcher: (pathname: string) => boolean;
  label: string;
  description: string;
  accent: string;
};

const SECTION_META: SectionMeta[] = [
  {
    matcher: (pathname: string) => pathname.startsWith("/dte"),
    label: "DTE",
    description: "Clientes, planes y salud operativa",
    accent: "--section-dte",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/barber"),
    label: "Barber Pro",
    description: "Tenants y operacion de barberias",
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
    label: "Vista global",
    description: "Resumen operativo del ecosistema Speeddan",
    accent: "--section-overview",
  },
];

function getInitials(name?: string | null) {
  if (!name) return "S";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

export function DashboardChrome({ children }: { children: ReactNode }) {
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
        background: "hsl(var(--bg-page))",
      }}
    >
      <ControlSidebar />

      <Layout style={{ background: "transparent" }}>
        <Header
          style={{
            height: "auto",
            lineHeight: 1,
            padding: "20px 24px 12px",
            background: "transparent",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              paddingBottom: 14,
              borderBottom: "1px solid hsl(var(--border-default))",
            }}
          >
            <div style={{ minWidth: 0, flex: "1 1 360px" }}>
              <Space size={8} wrap>
                <Tag
                  bordered={false}
                  style={{
                    margin: 0,
                    background: `hsl(var(${active.accent}) / 0.12)`,
                    color: `hsl(var(${active.accent}))`,
                    borderRadius: 999,
                    paddingInline: 10,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {active.label}
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
                  {pathname}
                </Tag>
              </Space>

              <h1
                style={{
                  margin: "12px 0 4px",
                  fontSize: "clamp(1.4rem, 2.1vw, 1.9rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.04em",
                  color: "hsl(var(--text-primary))",
                }}
              >
                Panel central Speeddan
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "hsl(var(--text-muted))",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {active.description}
              </p>
            </div>

            <Space size={10} wrap style={{ justifyContent: "flex-end" }}>
              {!onOverview ? (
                <Button type="default" onClick={() => router.push("/overview")}>
                  Ir al overview
                </Button>
              ) : null}

              <Tag
                bordered={false}
                style={{
                  margin: 0,
                  background: "hsl(var(--bg-surface))",
                  color: "hsl(var(--text-secondary))",
                  borderRadius: 999,
                  paddingInline: 10,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Operativo
              </Tag>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px 6px 6px",
                  borderRadius: 999,
                  border: "1px solid hsl(var(--border-default))",
                  background: "hsl(var(--bg-surface))",
                }}
              >
                <Avatar
                  size={32}
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-primary-dark)) 100%)",
                    color: "hsl(var(--text-inverse))",
                    fontWeight: 700,
                  }}
                >
                  {sessionInitial}
                </Avatar>
                <div>
                  <div style={{ color: "hsl(var(--text-primary))", fontSize: 13, fontWeight: 700 }}>
                    {sessionLabel}
                  </div>
                  <div style={{ color: "hsl(var(--text-muted))", fontSize: 11 }}>Superadmin</div>
                </div>
              </div>
            </Space>
          </div>
        </Header>

        <Content
          style={{
            padding: "0 24px 28px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
