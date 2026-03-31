"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Divider, Form, Input, Tag, Typography } from "antd";
import { ArrowRight, Building2, FileText, LockKeyhole, Scissors, ShieldCheck, User2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const FEATURE_CARDS = [
  {
    title: "Barber Pro",
    copy: "Citas, caja y clientes con separacion operativa.",
    status: "Conectado",
    icon: <Scissors size={18} />,
    accentVar: "--section-barber",
  },
  {
    title: "DTE",
    copy: "Tenants, planes y seguimiento del servicio.",
    status: "Conectado",
    icon: <FileText size={18} />,
    accentVar: "--section-dte",
  },
  {
    title: "ERP Full Pro",
    copy: "Salud del backend y monitoreo administrativo.",
    status: "Conectado",
    icon: <Building2 size={18} />,
    accentVar: "--section-erp",
  },
];

const OPERATING_POINTS = [
  "Auth server-side",
  "Bases separadas por sistema",
  "Vista global para superadmin",
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    router.prefetch("/overview");
  }, [router]);

  return (
    <main style={{ minHeight: "100vh", background: "hsl(var(--bg-page))" }}>
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section
          className="relative hidden overflow-hidden lg:flex"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--bg-inverse)) 0%, hsl(var(--bg-sidebar-elevated)) 100%)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(135deg, hsl(var(--bg-inverse) / 0.78), hsl(var(--bg-sidebar-elevated) / 0.76)),
                url("https://images.unsplash.com/photo-1512690459411-b0fd1c86b8f8?auto=format&fit=crop&w=1400&q=80")
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.9)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(45deg, hsl(var(--text-inverse) / 0.03) 0px, hsl(var(--text-inverse) / 0.03) 1px, transparent 1px, transparent 48px),
                repeating-linear-gradient(-45deg, hsl(var(--text-inverse) / 0.02) 0px, hsl(var(--text-inverse) / 0.02) 1px, transparent 1px, transparent 48px)
              `,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -140,
              right: -90,
              width: 360,
              height: 360,
              borderRadius: "999px",
              background: "radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: -70,
              bottom: -70,
              width: 260,
              height: 260,
              borderRadius: "999px",
              background: "radial-gradient(circle, hsl(var(--text-inverse) / 0.08) 0%, transparent 72%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              padding: "56px 48px",
            }}
          >
            <div style={{ maxWidth: 430, margin: "0 auto", width: "100%" }}>
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 20,
                  display: "grid",
                  placeItems: "center",
                  background: "hsl(var(--text-inverse) / 0.12)",
                  border: "1px solid hsl(var(--text-inverse) / 0.2)",
                  boxShadow: "0 10px 32px hsl(var(--shadow-color) / 0.28)",
                }}
              >
                <ShieldCheck size={34} color="white" />
              </div>

              <h1
                style={{
                  margin: "28px 0 0",
                  color: "hsl(var(--text-inverse))",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 4vw, 4.4rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.06em",
                }}
              >
                Speeddan Control
              </h1>
              <p
                style={{
                  margin: "12px 0 0",
                  color: "hsl(var(--text-inverse) / 0.7)",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                Sesion central para operar Barber Pro, DTE y ERP Full Pro sin mezclar credenciales,
                sesiones ni bases de datos.
              </p>

              <div style={{ display: "grid", gap: 14, marginTop: 38 }}>
                {FEATURE_CARDS.map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 18px",
                    borderRadius: 18,
                    background: "hsl(var(--text-inverse) / 0.11)",
                    border: `1px solid hsl(var(${item.accentVar}) / 0.22)`,
                    borderLeft: `4px solid hsl(var(${item.accentVar}))`,
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    boxShadow: "0 12px 34px hsl(var(--shadow-color) / 0.16)",
                  }}
                >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        display: "grid",
                        placeItems: "center",
                        color: "hsl(var(--text-inverse))",
                        background: "hsl(var(--text-inverse) / 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "hsl(var(--text-inverse))", fontWeight: 700, fontSize: 15 }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          color: "hsl(var(--text-inverse) / 0.66)",
                          fontSize: 13,
                          lineHeight: 1.45,
                        }}
                      >
                        {item.copy}
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                        borderRadius: 999,
                        padding: "5px 10px",
                        background: `hsl(var(${item.accentVar}) / 0.18)`,
                        border: `1px solid hsl(var(${item.accentVar}) / 0.28)`,
                        color: `hsl(var(${item.accentVar}))`,
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 28 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    padding: "8px 18px",
                    background: "hsl(var(--text-inverse) / 0.08)",
                    border: "1px solid hsl(var(--text-inverse) / 0.12)",
                    color: "hsl(var(--text-inverse) / 0.72)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "999px",
                      background: "hsl(var(--state-success))",
                      boxShadow: "0 0 10px hsl(var(--state-success))",
                    }}
                  />
                  Superadmin multi-sistema
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                {OPERATING_POINTS.map((item) => (
                  <span
                    key={item}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "hsl(var(--text-inverse) / 0.08)",
                      border: "1px solid hsl(var(--text-inverse) / 0.12)",
                      color: "hsl(var(--text-inverse) / 0.72)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: "hsl(var(--state-success))",
                      }}
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="flex items-center justify-center px-6 py-10 sm:px-10"
          style={{ background: "hsl(var(--bg-surface))" }}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <Tag
              bordered={false}
              style={{
                margin: 0,
                borderRadius: 999,
                paddingInline: 12,
                background: "hsl(var(--accent-soft))",
                color: "hsl(var(--accent-strong))",
                fontWeight: 700,
              }}
            >
              Panel central
            </Tag>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              <Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--bg-subtle))", color: "hsl(var(--text-secondary))", border: "1px solid hsl(var(--border-default))" }}>
                Server auth
              </Tag>
              <Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--bg-subtle))", color: "hsl(var(--text-secondary))", border: "1px solid hsl(var(--border-default))" }}>
                Tenants separados
              </Tag>
              <Tag bordered={false} style={{ margin: 0, borderRadius: 999, background: "hsl(var(--bg-subtle))", color: "hsl(var(--text-secondary))", border: "1px solid hsl(var(--border-default))" }}>
                Overview global
              </Tag>
            </div>

            <Typography.Title
              level={1}
              style={{
                margin: "18px 0 8px",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.05em",
                lineHeight: 0.98,
              }}
            >
              Inicia sesion como superadmin
            </Typography.Title>
            <Typography.Paragraph
              style={{
                marginBottom: 0,
                color: "hsl(var(--text-muted))",
                fontSize: 16,
                lineHeight: 1.6,
              }}
            >
              El acceso del panel se valida en servidor y abre la vista global del ecosistema.
            </Typography.Paragraph>

            <div
              style={{
                marginTop: 28,
                padding: "18px 20px",
                borderRadius: 18,
                border: "1px solid hsl(var(--border-default))",
                background: "hsl(var(--bg-surface))",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: "hsl(var(--bg-subtle))",
                    color: "hsl(var(--text-primary))",
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>Acceso del superadmin</div>
                  <div style={{ fontSize: 13, color: "hsl(var(--text-muted))" }}>
                    Login central y redireccion al overview
                  </div>
                </div>
              </div>

              {error ? (
                <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
              ) : null}

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
                  style={{
                    height: 54,
                    marginTop: 6,
                    borderRadius: 14,
                    fontWeight: 700,
                  }}
                >
                  Continuar al panel
                </Button>
              </Form>
            </div>

            <Divider style={{ margin: "26px 0 20px", borderColor: "hsl(var(--border-default))" }} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid hsl(var(--border-default))",
                  padding: "14px 16px",
                  background: "hsl(var(--bg-subtle))",
                }}
              >
                <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>Seguridad</div>
                <div style={{ marginTop: 4, color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                  Cookie firmada, validacion server-side y sin exponer credenciales de sistemas.
                </div>
              </div>
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid hsl(var(--border-default))",
                  padding: "14px 16px",
                  background: "hsl(var(--bg-subtle))",
                }}
              >
                <div style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>Operativa</div>
                <div style={{ marginTop: 4, color: "hsl(var(--text-muted))", fontSize: 13, lineHeight: 1.5 }}>
                  Vista global, monitoreo de servicios y acceso rapido a cada modulo.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
