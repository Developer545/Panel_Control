"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Divider, Form, Input, Space, Tag, Typography } from "antd";
import {
  ArrowRight,
  Database,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Server,
  User2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    router.prefetch("/overview");
  }, [router]);

  return (
    <main className="login-shell">
      <div className="login-grid">
        <section className="login-stage surface-card relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-16 top-10 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "hsl(var(--brand-primary) / 0.16)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-20 left-8 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "hsl(var(--brand-secondary) / 0.14)" }}
          />

          <Space size={12} wrap>
            <Tag
              bordered={false}
              className="section-badge"
              style={{
                background: "hsl(var(--brand-primary) / 0.12)",
                color: "hsl(var(--brand-primary))",
              }}
            >
              Speeddan Control V3
            </Tag>
            <Tag
              bordered={false}
              style={{
                background: "hsl(var(--bg-subtle))",
                color: "hsl(var(--text-secondary))",
                border: "1px solid hsl(var(--border-default))",
              }}
            >
              Panel central
            </Tag>
          </Space>

          <h1
            style={{
              margin: "1.1rem 0 0",
              maxWidth: 760,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 5vw, 4.9rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.05em",
              color: "hsl(var(--text-primary))",
            }}
          >
            Un panel para operar
            <span style={{ color: "hsl(var(--brand-primary))" }}> Barber Pro, DTE y ERP</span>
            <span style={{ color: "hsl(var(--text-secondary))" }}> sin mezclar sus bases.</span>
          </h1>

          <p
            style={{
              marginTop: "1rem",
              maxWidth: 660,
              fontSize: "1.02rem",
              lineHeight: 1.7,
              color: "hsl(var(--text-secondary))",
            }}
          >
            La sesion vive en el servidor, el acceso se firma con cookie segura y cada sistema
            mantiene su propio despliegue y su propia base.
          </p>

          <div
            className="mt-8 grid gap-3 sm:grid-cols-3"
            style={{ maxWidth: 760 }}
          >
            {[
              {
                icon: <ShieldCheck size={16} />,
                title: "Sesion segura",
                text: "Autenticacion central con cookie httpOnly.",
              },
              {
                icon: <Server size={16} />,
                title: "Servicios separados",
                text: "Barber, DTE y ERP siguen independientes.",
              },
              {
                icon: <Database size={16} />,
                title: "Datos aislados",
                text: "Cada sistema conserva su propia base.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid hsl(var(--border-default))",
                  background: "hsl(var(--bg-surface) / 0.8)",
                  padding: "1rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "9999px",
                    marginBottom: 12,
                    background: "hsl(var(--brand-primary) / 0.12)",
                    color: "hsl(var(--brand-primary))",
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>{item.title}</div>
                <div style={{ marginTop: 4, color: "hsl(var(--text-secondary))", fontSize: 14 }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <Divider
            style={{
              margin: "1.5rem 0",
              borderColor: "hsl(var(--border-default))",
            }}
          />

          <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--text-muted))]">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <LayoutDashboard size={14} />
              Vista global unificada
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ArrowRight size={14} />
              Acceso directo al overview
            </span>
          </div>
        </section>

        <Card className="login-card surface-card border-0" styles={{ body: { padding: 32 } }}>
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            <Tag
              bordered={false}
              style={{
                width: "fit-content",
                background: "hsl(var(--bg-subtle))",
                color: "hsl(var(--text-secondary))",
              }}
            >
              Acceso administrativo
            </Tag>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.03em",
              }}
            >
              Iniciar sesion
            </Typography.Title>
            <Typography.Paragraph style={{ marginBottom: 0, color: "hsl(var(--text-muted))" }}>
              La autenticacion se resuelve en servidor y te envia al dashboard central.
            </Typography.Paragraph>
          </Space>

          <div
            style={{
              marginTop: 20,
              borderRadius: "var(--radius-lg)",
              border: "1px solid hsl(var(--border-default))",
              background: "hsl(var(--bg-subtle))",
              padding: "0.9rem 1rem",
            }}
          >
            <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>Requisitos</div>
            <div style={{ marginTop: 4, color: "hsl(var(--text-secondary))", fontSize: 14 }}>
              Usa las credenciales del panel. No necesitas entrar a DTE, Barber ni ERP para este acceso.
            </div>
          </div>

          {error ? (
            <Alert
              type="error"
              message={error}
              showIcon
              className="mb-4"
              style={{ marginTop: 20 }}
            />
          ) : (
            <div style={{ height: 20 }} />
          )}

          <Form
            layout="vertical"
            requiredMark={false}
            onFinish={(values: { username: string; password: string }) => {
              setError(null);
              startTransition(async () => {
                try {
                  await login(values);
                  router.replace("/overview");
                  router.refresh();
                } catch (cause) {
                  setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesion");
                }
              });
            }}
          >
            <Form.Item
              label="Usuario"
              name="username"
              rules={[{ required: true, message: "Ingresa el usuario" }]}
            >
              <Input
                prefix={<User2 size={16} />}
                size="large"
                autoComplete="username"
                placeholder="admin"
              />
            </Form.Item>
            <Form.Item
              label="Clave"
              name="password"
              rules={[{ required: true, message: "Ingresa la clave" }]}
            >
              <Input.Password
                prefix={<LockKeyhole size={16} />}
                size="large"
                autoComplete="current-password"
                placeholder="Tu clave del panel"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              block
              icon={<ArrowRight size={16} />}
            >
              Entrar al panel
            </Button>
          </Form>

          <Divider style={{ margin: "24px 0", borderColor: "hsl(var(--border-default))" }} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div
              style={{
                borderRadius: "var(--radius-lg)",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
                padding: "0.85rem 1rem",
              }}
            >
              <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>Flujo</div>
              <div style={{ marginTop: 4, color: "hsl(var(--text-secondary))", fontSize: 14 }}>
                Login central, overview consolidado y saltos a cada sistema.
              </div>
            </div>
            <div
              style={{
                borderRadius: "var(--radius-lg)",
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
                padding: "0.85rem 1rem",
              }}
            >
              <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>Seguridad</div>
              <div style={{ marginTop: 4, color: "hsl(var(--text-secondary))", fontSize: 14 }}>
                Sesion firmada en servidor con cookie segura.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
