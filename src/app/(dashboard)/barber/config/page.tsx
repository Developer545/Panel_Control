import { Alert } from "antd";
import { getErrorMessage } from "@/lib/error-message";
import { getBarberConfig } from "@/lib/integrations/barber";
import { BarberConfigForm } from "@/components/barber/BarberConfigForm";

async function loadConfig() {
  try {
    const config = await getBarberConfig();
    return { config };
  } catch (cause) {
    return { error: getErrorMessage(cause) };
  }
}

export default async function BarberConfigPage() {
  const result = await loadConfig();

  return (
    <div className="space-y-4">
      <div>
        <div style={{ color: "hsl(var(--section-barber))", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Barber
        </div>
        <h1 style={{ margin: "0.2rem 0 0", color: "hsl(var(--text-primary))", fontSize: "clamp(1.25rem, 2vw, 1.6rem)", lineHeight: 1.1 }}>
          Configuración de Barber Pro
        </h1>
        <p style={{ margin: "0.3rem 0 0", color: "hsl(var(--text-muted))", fontSize: 13 }}>
          Edita el branding que aparece en el panel izquierdo del login.
        </p>
      </div>

      {"error" in result ? (
        <Alert type="error" showIcon message="No se pudo cargar la configuración" description={result.error} />
      ) : (
        <BarberConfigForm initialConfig={result.config} />
      )}
    </div>
  );
}
