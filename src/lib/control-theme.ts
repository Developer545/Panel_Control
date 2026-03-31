export const CONTROL_THEME_STORAGE_KEY = "speeddan-control-theme";

export type ControlThemePreset = {
  id: string;
  name: string;
  description: string;
  values: Record<string, string>;
};

export const CONTROL_THEME_VARIABLE_KEYS = [
  "--bg-app",
  "--bg-page",
  "--bg-surface",
  "--bg-surface-muted",
  "--bg-surface-strong",
  "--bg-surface-raised",
  "--bg-subtle",
  "--bg-sidebar",
  "--bg-sidebar-elevated",
  "--bg-inverse",
  "--bg-accent-soft",
  "--text-primary",
  "--text-secondary",
  "--text-muted",
  "--text-inverse",
  "--border-default",
  "--border-strong",
  "--accent",
  "--accent-strong",
  "--accent-soft",
  "--brand-primary",
  "--brand-primary-dark",
  "--brand-secondary",
  "--section-overview",
  "--section-dte",
  "--section-barber",
  "--section-erp",
  "--state-success",
  "--state-warning",
  "--state-danger",
  "--status-success",
  "--status-success-bg",
  "--status-warning",
  "--status-warning-bg",
  "--status-error",
  "--status-error-bg",
  "--radius-xs",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--sidebar-fg",
  "--sidebar-muted",
  "--sidebar-border",
  "--sidebar-hover-bg",
  "--sidebar-active-bg",
  "--sidebar-active-fg",
  "--shadow-color",
  "--shadow-sm",
  "--shadow-soft",
  "--shadow-card",
  "--shadow-lg",
  "--shadow-xl",
  "--gradient-brand",
  "--gradient-kpi-1",
  "--gradient-kpi-2",
  "--gradient-kpi-3",
  "--gradient-kpi-4",
] as const;

export const CONTROL_THEME_PRESETS: ControlThemePreset[] = [
  {
    id: "arctic-teal",
    name: "Arctic Teal",
    description: "Preset base inspirado en BarberPro: sidebar slate, workspace crema y acento teal.",
    values: {
      "--bg-app": "69 16% 92%",
      "--bg-page": "69 16% 92%",
      "--bg-surface": "0 0% 100%",
      "--bg-surface-muted": "69 10% 96%",
      "--bg-surface-strong": "0 0% 100%",
      "--bg-surface-raised": "0 0% 100%",
      "--bg-subtle": "69 10% 96%",
      "--bg-sidebar": "222 18% 18%",
      "--bg-sidebar-elevated": "222 15% 24%",
      "--bg-inverse": "222 18% 18%",
      "--bg-accent-soft": "172 40% 90%",
      "--text-primary": "222 11% 41%",
      "--text-secondary": "222 8% 52%",
      "--text-muted": "246 6% 67%",
      "--text-inverse": "0 0% 100%",
      "--border-default": "246 8% 88%",
      "--border-strong": "246 6% 72%",
      "--accent": "172 78% 28%",
      "--accent-strong": "172 78% 20%",
      "--accent-soft": "172 40% 90%",
      "--brand-primary": "172 78% 28%",
      "--brand-primary-dark": "172 78% 20%",
      "--brand-secondary": "204 27% 64%",
      "--section-overview": "198 32% 54%",
      "--section-dte": "194 84% 43%",
      "--section-barber": "155 42% 44%",
      "--section-erp": "24 88% 54%",
      "--state-success": "142 71% 35%",
      "--state-warning": "38 92% 44%",
      "--state-danger": "358 64% 46%",
      "--status-success": "142 71% 35%",
      "--status-success-bg": "142 71% 94%",
      "--status-warning": "38 92% 44%",
      "--status-warning-bg": "38 92% 94%",
      "--status-error": "358 64% 46%",
      "--status-error-bg": "358 64% 94%",
      "--radius-xs": "4px",
      "--radius-sm": "8px",
      "--radius-md": "12px",
      "--radius-lg": "16px",
      "--sidebar-fg": "0 0% 92%",
      "--sidebar-muted": "246 6% 60%",
      "--sidebar-border": "222 12% 25%",
      "--sidebar-hover-bg": "172 78% 28% / 0.1",
      "--sidebar-active-bg": "172 78% 28% / 0.14",
      "--sidebar-active-fg": "0 0% 100%",
      "--shadow-color": "222 18% 18%",
      "--shadow-sm": "0 1px 2px hsl(var(--shadow-color) / 0.06)",
      "--shadow-soft": "0 18px 32px -22px hsl(var(--shadow-color) / 0.12)",
      "--shadow-card": "0 10px 20px -16px hsl(var(--shadow-color) / 0.12), 0 1px 3px hsl(var(--shadow-color) / 0.06)",
      "--shadow-lg": "0 20px 40px -28px hsl(var(--shadow-color) / 0.16)",
      "--shadow-xl": "0 28px 56px -34px hsl(var(--shadow-color) / 0.18)",
      "--gradient-brand": "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--brand-secondary)) 100%)",
      "--gradient-kpi-1": "linear-gradient(135deg, hsl(var(--bg-inverse)) 0%, hsl(var(--bg-sidebar-elevated)) 100%)",
      "--gradient-kpi-2": "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-strong)) 100%)",
      "--gradient-kpi-3": "linear-gradient(135deg, hsl(var(--brand-secondary)) 0%, hsl(var(--accent)) 100%)",
      "--gradient-kpi-4": "linear-gradient(135deg, hsl(var(--bg-inverse)) 0%, hsl(var(--accent)) 100%)",
    },
  },
  {
    id: "dark-steel",
    name: "Dark Steel",
    description: "Variante oscura inspirada en BarberPro para futuras expansiones del panel.",
    values: {
      "--bg-app": "222 18% 12%",
      "--bg-page": "222 18% 12%",
      "--bg-surface": "222 15% 18%",
      "--bg-surface-muted": "222 12% 22%",
      "--bg-surface-strong": "222 12% 22%",
      "--bg-surface-raised": "222 12% 22%",
      "--bg-subtle": "222 12% 22%",
      "--bg-sidebar": "222 20% 10%",
      "--bg-sidebar-elevated": "222 12% 15%",
      "--bg-inverse": "222 20% 10%",
      "--bg-accent-soft": "172 40% 16%",
      "--text-primary": "0 0% 98%",
      "--text-secondary": "246 6% 75%",
      "--text-muted": "246 6% 55%",
      "--text-inverse": "0 0% 100%",
      "--border-default": "222 12% 28%",
      "--border-strong": "222 10% 38%",
      "--accent": "172 78% 38%",
      "--accent-strong": "172 78% 26%",
      "--accent-soft": "172 40% 16%",
      "--brand-primary": "172 78% 38%",
      "--brand-primary-dark": "172 78% 26%",
      "--brand-secondary": "204 27% 50%",
      "--section-overview": "198 32% 58%",
      "--section-dte": "194 84% 48%",
      "--section-barber": "155 42% 48%",
      "--section-erp": "24 88% 60%",
      "--state-success": "142 71% 45%",
      "--state-warning": "38 92% 54%",
      "--state-danger": "358 64% 58%",
      "--status-success": "142 71% 45%",
      "--status-success-bg": "142 52% 16%",
      "--status-warning": "38 92% 54%",
      "--status-warning-bg": "38 52% 16%",
      "--status-error": "358 64% 58%",
      "--status-error-bg": "358 42% 16%",
      "--radius-xs": "4px",
      "--radius-sm": "8px",
      "--radius-md": "12px",
      "--radius-lg": "16px",
      "--sidebar-fg": "0 0% 88%",
      "--sidebar-muted": "246 6% 50%",
      "--sidebar-border": "222 12% 18%",
      "--sidebar-hover-bg": "172 78% 38% / 0.12",
      "--sidebar-active-bg": "172 78% 38% / 0.18",
      "--sidebar-active-fg": "0 0% 100%",
      "--shadow-color": "222 20% 5%",
      "--shadow-sm": "0 1px 2px hsl(var(--shadow-color) / 0.18)",
      "--shadow-soft": "0 22px 44px -26px hsl(var(--shadow-color) / 0.32)",
      "--shadow-card": "0 12px 28px -20px hsl(var(--shadow-color) / 0.22), 0 1px 3px hsl(var(--shadow-color) / 0.14)",
      "--shadow-lg": "0 24px 52px -28px hsl(var(--shadow-color) / 0.38)",
      "--shadow-xl": "0 30px 68px -34px hsl(var(--shadow-color) / 0.42)",
      "--gradient-brand": "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--brand-secondary)) 100%)",
      "--gradient-kpi-1": "linear-gradient(135deg, hsl(var(--bg-inverse)) 0%, hsl(var(--bg-sidebar-elevated)) 100%)",
      "--gradient-kpi-2": "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-strong)) 100%)",
      "--gradient-kpi-3": "linear-gradient(135deg, hsl(var(--bg-sidebar-elevated)) 0%, hsl(var(--accent)) 100%)",
      "--gradient-kpi-4": "linear-gradient(135deg, hsl(var(--bg-inverse)) 0%, hsl(var(--accent)) 100%)",
    },
  },
];

export const DEFAULT_CONTROL_THEME_PRESET_ID = CONTROL_THEME_PRESETS[0].id;

export function getControlThemePreset(id?: string | null) {
  return CONTROL_THEME_PRESETS.find((preset) => preset.id === id) ?? CONTROL_THEME_PRESETS[0];
}

export function serializeControlThemeValues(values: Record<string, string>) {
  return Object.entries(values)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}

export function applyControlThemeValues(
  root: Pick<CSSStyleDeclaration, "setProperty" | "removeProperty">,
  values: Record<string, string>,
) {
  for (const key of CONTROL_THEME_VARIABLE_KEYS) {
    const value = values[key];
    if (value) {
      root.setProperty(key, value);
    } else {
      root.removeProperty(key);
    }
  }
}

export function clearControlThemeValues(root: Pick<CSSStyleDeclaration, "removeProperty">) {
  for (const key of CONTROL_THEME_VARIABLE_KEYS) {
    root.removeProperty(key);
  }
}
