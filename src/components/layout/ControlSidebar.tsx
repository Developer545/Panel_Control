"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Avatar, Button, Divider, Layout, Tag, Tooltip } from "antd";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  MapPinned,
  FileText,
  LayoutDashboard,
  LogOut,
  Scissors,
  ShieldCheck,
  Store,
  Users,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const { Sider } = Layout;

type NavItem = {
  key: string;
  label: string;
  icon: ReactNode;
  colorVar: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "General",
    items: [
      {
        key: "/overview",
        label: "Vista global",
        icon: <LayoutDashboard size={18} />,
        colorVar: "--section-overview",
      },
    ],
  },
  {
    title: "DTE Operacion",
    items: [
      {
        key: "/dte/dashboard",
        label: "Dashboard",
        icon: <FileText size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/clientes",
        label: "Clientes",
        icon: <Users size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/planes",
        label: "Planes",
        icon: <CreditCard size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/health",
        label: "Health",
        icon: <Activity size={18} />,
        colorVar: "--section-dte",
      },
    ],
  },
  {
    title: "DTE Gobierno",
    items: [
      {
        key: "/dte/auditoria",
        label: "Auditoria",
        icon: <ShieldCheck size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/analytics",
        label: "Analytics",
        icon: <BarChart3 size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/mapa",
        label: "Mapa",
        icon: <MapPinned size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/backups",
        label: "Backups",
        icon: <Database size={18} />,
        colorVar: "--section-dte",
      },
    ],
  },
  {
    title: "DTE Catalogos",
    items: [
      {
        key: "/dte/departamentos",
        label: "Departamentos",
        icon: <Building2 size={18} />,
        colorVar: "--section-dte",
      },
      {
        key: "/dte/municipios",
        label: "Municipios",
        icon: <Building2 size={18} />,
        colorVar: "--section-dte",
      },
    ],
  },
  {
    title: "DTE Sistema",
    items: [
      {
        key: "/dte/tema",
        label: "Tema",
        icon: <ShieldCheck size={18} />,
        colorVar: "--section-dte",
      },
    ],
  },
  {
    title: "Barber Pro",
    items: [
      {
        key: "/barber/dashboard",
        label: "Dashboard",
        icon: <Scissors size={18} />,
        colorVar: "--section-barber",
      },
      {
        key: "/barber/tenants",
        label: "Barberias",
        icon: <Store size={18} />,
        colorVar: "--section-barber",
      },
      {
        key: "/barber/health",
        label: "Health",
        icon: <Activity size={18} />,
        colorVar: "--section-barber",
      },
    ],
  },
  {
    title: "ERP Full Pro",
    items: [
      {
        key: "/erp/dashboard",
        label: "Dashboard",
        icon: <Building2 size={18} />,
        colorVar: "--section-erp",
      },
      {
        key: "/erp/tenants",
        label: "Tenants",
        icon: <Building2 size={18} />,
        colorVar: "--section-erp",
      },
      {
        key: "/erp/health",
        label: "Health",
        icon: <ShieldCheck size={18} />,
        colorVar: "--section-erp",
      },
    ],
  },
];

function getInitials(name?: string | null) {
  if (!name) return "S";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

function getSectionLabel(pathname: string) {
  if (pathname.startsWith("/dte")) return "DTE";
  if (pathname.startsWith("/barber")) return "Barber Pro";
  if (pathname.startsWith("/erp")) return "ERP Full Pro";
  return "Vista global";
}

export function ControlSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, session } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const initials = getInitials(session?.username);
  const activeSection = getSectionLabel(pathname);

  return (
    <Sider
      width={270}
      collapsedWidth={76}
      collapsed={collapsed}
      trigger={null}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
        background: "hsl(var(--bg-sidebar))",
        borderRight: "1px solid hsl(var(--sidebar-border))",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          background:
            "linear-gradient(180deg, hsl(var(--bg-sidebar)) 0%, hsl(var(--bg-sidebar)) 72%, hsl(var(--text-inverse) / 0.02) 100%)",
        }}
      >
        <div
          style={{
            minHeight: 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: collapsed ? "18px 12px" : "18px 16px",
            borderBottom: "1px solid hsl(var(--sidebar-border))",
          }}
        >
          <div style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-primary-dark)) 100%)",
                color: "hsl(var(--text-inverse))",
                flexShrink: 0,
                boxShadow: "0 10px 20px hsl(var(--shadow-color) / 0.24)",
              }}
            >
              <ShieldCheck size={16} />
            </div>
            {!collapsed ? (
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "hsl(var(--sidebar-fg))", fontSize: 14, fontWeight: 700, lineHeight: 1.15 }}>
                  Speeddan Control
                </div>
                <div
                  style={{
                    marginTop: 3,
                    color: "hsl(var(--sidebar-muted))",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Panel multi-sistema
                </div>
              </div>
            ) : null}
          </div>

          <Tooltip title={collapsed ? "Expandir menu" : "Colapsar menu"} placement="right">
            <Button
              type="text"
              size="small"
              onClick={() => setCollapsed((value) => !value)}
              icon={collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              style={{
                color: "hsl(var(--sidebar-muted))",
                border: "1px solid hsl(var(--sidebar-border))",
                background: "hsl(var(--text-inverse) / 0.02)",
              }}
            />
          </Tooltip>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "10px 0 8px" }}>
          {!collapsed ? (
            <div style={{ padding: "0 16px 12px" }}>
              <div
                style={{
                  color: "hsl(var(--sidebar-muted))",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {activeSection}
              </div>
              <div style={{ marginTop: 8, color: "hsl(var(--sidebar-muted))", fontSize: 12, lineHeight: 1.45 }}>
                Navegacion operativa para DTE, Barber Pro y ERP Full Pro.
              </div>
            </div>
          ) : null}

          <nav style={{ display: "flex", flexDirection: "column", gap: collapsed ? 4 : 10 }}>
            {NAV_GROUPS.map((group) => (
              <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {!collapsed ? (
                  <div
                    style={{
                      padding: "6px 16px 2px",
                      color: "hsl(var(--sidebar-muted))",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {group.title}
                  </div>
                ) : null}

                {group.items.map((item) => {
                  const isActive = pathname === item.key || pathname.startsWith(`${item.key}/`);
                  return (
                    <Link
                      key={item.key}
                      href={item.key}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: "flex",
                        minHeight: collapsed ? 44 : 46,
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-start",
                        gap: collapsed ? 0 : 12,
                        padding: collapsed ? "12px 0" : "10px 16px",
                        marginInline: collapsed ? 10 : 8,
                        color: isActive ? `hsl(var(${item.colorVar}))` : "hsl(var(--sidebar-fg))",
                        background: isActive ? `hsl(var(${item.colorVar}) / 0.12)` : "transparent",
                        borderLeft: isActive ? `3px solid hsl(var(${item.colorVar}))` : "3px solid transparent",
                        borderRadius: 14,
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 500,
                        transition: "background 0.15s ease, color 0.15s ease, transform 0.15s ease",
                        boxShadow: isActive ? `inset 0 0 0 1px hsl(var(${item.colorVar}) / 0.18)` : "none",
                      }}
                    >
                      <span style={{ flexShrink: 0 }}>{item.icon}</span>
                      {!collapsed ? <span>{item.label}</span> : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div style={{ padding: collapsed ? "12px 10px 14px" : "12px 16px 16px" }}>
          <Divider style={{ margin: "0 0 12px", borderColor: "hsl(var(--sidebar-border))" }} />
          <div
            style={{
              borderRadius: 16,
              padding: collapsed ? "10px 8px" : "12px",
              background: "hsl(var(--text-inverse) / 0.03)",
              border: "1px solid hsl(var(--sidebar-border))",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar
                size={34}
                style={{
                  background: "linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-primary-dark)) 100%)",
                  color: "hsl(var(--text-inverse))",
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              {!collapsed ? (
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ color: "hsl(var(--sidebar-fg))", fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                    {session?.username ?? "Superadmin"}
                  </div>
                  <div style={{ marginTop: 3, color: "hsl(var(--sidebar-muted))", fontSize: 11 }}>
                    Sesion central segura
                  </div>
                </div>
              ) : null}
            </div>

            {!collapsed ? (
              <Tag
                bordered={false}
                style={{
                  marginTop: 10,
                  background: "hsl(var(--text-inverse) / 0.04)",
                  color: "hsl(var(--sidebar-muted))",
                  borderRadius: 999,
                  paddingInline: 10,
                  lineHeight: "24px",
                }}
              >
                Online
              </Tag>
            ) : null}

            <Button
              type="text"
              block={!collapsed}
              icon={<LogOut size={15} />}
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
              style={{
                marginTop: collapsed ? 10 : 12,
                justifyContent: collapsed ? "center" : "flex-start",
                color: "hsl(var(--sidebar-muted))",
                paddingInline: collapsed ? 0 : 4,
              }}
            >
              {!collapsed ? "Cerrar sesion" : null}
            </Button>
          </div>
        </div>
      </div>
    </Sider>
  );
}
