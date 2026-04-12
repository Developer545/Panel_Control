"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Divider, Layout, Menu, Space, Tag, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Scissors,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const { Sider } = Layout;
const { Text } = Typography;

type NavGroup = {
  key: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  colorVar: string;
  items?: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
  }>;
};

const NAV: NavGroup[] = [
  {
    key: "overview",
    label: "Vista Global",
    href: "/overview",
    icon: <LayoutDashboard size={16} />,
    colorVar: "--section-overview",
  },
  {
    key: "dte",
    label: "DTE",
    icon: <FileText size={16} />,
    colorVar: "--section-dte",
    items: [
      { key: "/dte/dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
      { key: "/dte/clientes", label: "Clientes", icon: <Users size={14} /> },
      { key: "/dte/planes", label: "Planes", icon: <CreditCard size={14} /> },
      { key: "/dte/health", label: "Health", icon: <Activity size={14} /> },
    ],
  },
  {
    key: "barber",
    label: "Barber Pro",
    icon: <Scissors size={16} />,
    colorVar: "--section-barber",
    items: [
      { key: "/barber/dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
      { key: "/barber/tenants", label: "Barberias", icon: <Store size={14} /> },
      { key: "/barber/health", label: "Health", icon: <Activity size={14} /> },
    ],
  },
  {
    key: "erp",
    label: "ERP Full Pro",
    icon: <Building2 size={16} />,
    colorVar: "--section-erp",
    items: [
      { key: "/erp/dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
      { key: "/erp/tenants", label: "Tenants", icon: <Building2 size={14} /> },
      { key: "/erp/health", label: "Health", icon: <ShieldCheck size={14} /> },
    ],
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

function getActiveGroup(pathname: string) {
  if (pathname.startsWith("/dte")) return NAV[1];
  if (pathname.startsWith("/barber")) return NAV[2];
  if (pathname.startsWith("/erp")) return NAV[3];
  return NAV[0];
}

function getSelectedKey(pathname: string) {
  const directMatch = NAV.flatMap((group) => group.items ?? []).find((item) => pathname.startsWith(item.key));
  if (directMatch) return directMatch.key;

  const rootMatch = NAV.find((group) => group.href && pathname.startsWith(group.href));
  return rootMatch?.href ?? "/overview";
}

function getOpenKeys(pathname: string) {
  return NAV.filter((group) => group.items?.some((item) => pathname.startsWith(item.key))).map(
    (group) => group.key
  );
}

function buildMenuItems(): MenuProps["items"] {
  return NAV.map((group) => {
    const label = (
      <span className="flex items-center gap-2">
        <span
          className="inline-flex h-2 w-2 rounded-full"
          style={{ background: `hsl(var(${group.colorVar}))` }}
        />
        <span>{group.label}</span>
      </span>
    );

    if (group.href) {
      return {
        key: group.href,
        icon: group.icon,
        label,
      };
    }

    return {
      key: group.key,
      icon: group.icon,
      label,
      children: group.items?.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      })),
    };
  });
}

/**
 * Sidebar principal del panel.
 * Mantiene navegación densa, legible y consistente con Ant Design.
 */
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, session } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = useMemo(() => buildMenuItems(), []);
  const activeGroup = getActiveGroup(pathname);
  const selectedKey = getSelectedKey(pathname);
  const openKeys = collapsed ? [] : getOpenKeys(pathname);

  return (
    <Sider
      theme="dark"
      width={280}
      collapsedWidth={84}
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
        borderRight: "1px solid hsl(var(--border-default) / 0.18)",
        background:
          "linear-gradient(180deg, hsl(var(--bg-inverse)) 0%, hsl(var(--bg-inverse) / 0.96) 100%)",
        boxShadow: "var(--shadow-xl)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          minHeight: 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: collapsed ? "20px 16px" : "20px 18px 18px",
          borderBottom: "1px solid hsl(var(--border-default) / 0.12)",
          background:
            "linear-gradient(180deg, hsl(var(--bg-inverse)) 0%, hsl(var(--bg-inverse) / 0.72) 100%)",
          flexShrink: 0,
        }}
      >
        <Space align="center" size={12}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              background:
                "linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-secondary)) 100%)",
              boxShadow: "0 12px 30px hsl(var(--brand-primary) / 0.28)",
              color: "hsl(var(--text-inverse))",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            S
          </div>

          {!collapsed ? (
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "hsl(var(--sidebar-muted))",
                }}
              >
                BOOKSTYLES CONTROL
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "hsl(var(--sidebar-fg))",
                }}
              >
                Panel central v3
              </p>
            </div>
          ) : null}
        </Space>

        <Tooltip title={collapsed ? "Expandir panel" : "Colapsar panel"} placement="right">
          <Button
            type="text"
            size="small"
            onClick={() => setCollapsed((value) => !value)}
            icon={collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            style={{
              color: "hsl(var(--sidebar-fg) / 0.82)",
            }}
          />
        </Tooltip>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "12px 10px 14px" }}>
        {!collapsed ? (
          <div style={{ padding: "4px 8px 10px" }}>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                background: "hsl(var(--brand-primary) / 0.12)",
                color: "hsl(var(--sidebar-fg))",
                borderRadius: 999,
                paddingInline: 10,
              }}
            >
              {activeGroup.label}
            </Tag>
            <div style={{ marginTop: 10 }}>
              <Text style={{ color: "hsl(var(--sidebar-muted))", fontSize: 12, lineHeight: 1.5 }}>
                Navegacion operativa para cambiar entre DTE, Barber y ERP sin perder contexto.
              </Text>
            </div>
          </div>
        ) : null}

        <Menu
          theme="dark"
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => {
            if (typeof key === "string" && key.startsWith("/")) {
              router.push(key);
            }
          }}
          style={{
            padding: 0,
            borderRight: 0,
            background: "transparent",
            color: "hsl(var(--sidebar-fg))",
          }}
        />
      </div>

      <div style={{ flexShrink: 0, padding: "0 12px 14px" }}>
        <Divider style={{ margin: "0 0 14px", borderColor: "hsl(var(--border-default) / 0.12)" }} />
        <div
          style={{
            padding: collapsed ? "12px 8px" : "12px",
            borderRadius: 18,
            border: "1px solid hsl(var(--border-default) / 0.12)",
            background: "hsl(var(--bg-surface) / 0.06)",
            boxShadow: "inset 0 1px 0 hsl(var(--text-inverse) / 0.04)",
          }}
        >
          <Space align="center" size={12} style={{ width: "100%" }}>
            <Avatar
              size={40}
              style={{
                background: "linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)))",
                color: "hsl(var(--text-inverse))",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {getInitials(session?.username)}
            </Avatar>

            {!collapsed ? (
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  strong
                  style={{
                    display: "block",
                    color: "hsl(var(--sidebar-fg))",
                    fontSize: 13,
                  }}
                >
                  {session?.username ?? "Superadmin"}
                </Text>
                <Text
                  style={{
                    display: "block",
                    color: "hsl(var(--sidebar-muted))",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Sesion segura central
                </Text>
              </div>
            ) : null}
          </Space>

          <Button
            type="text"
            block={!collapsed}
            icon={<LogOut size={15} />}
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
            style={{
              marginTop: 12,
              justifyContent: collapsed ? "center" : "flex-start",
              color: "hsl(var(--sidebar-fg))",
            }}
          >
            {!collapsed ? "Cerrar sesion" : null}
          </Button>
        </div>
      </div>
    </Sider>
  );
}
