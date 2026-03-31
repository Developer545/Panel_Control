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
  "--sidebar-muted",
  "--sidebar-border",
  "--sidebar-hover-bg",
  "--sidebar-active-bg",
  "--sidebar-active-fg",
  "--shadow-color",
] as const;

export const CONTROL_THEME_PRESETS: ControlThemePreset[] = [
  {
    id: "speeddan-noir",
    name: "Speeddan Noir",
    description: "Cascara oscura, superficies limpias y acento acero para una lectura mas sobria.",
    values: {
      "--bg-app": "210 24% 97%",
      "--bg-page": "210 24% 97%",
      "--bg-surface": "0 0% 100%",
      "--bg-surface-muted": "210 32% 96%",
      "--bg-surface-strong": "0 0% 100%",
      "--bg-surface-raised": "0 0% 100%",
      "--bg-subtle": "210 24% 95%",
      "--bg-sidebar": "214 26% 11%",
      "--bg-sidebar-elevated": "214 24% 15%",
      "--bg-inverse": "214 28% 10%",
      "--bg-accent-soft": "202 67% 94%",
      "--text-primary": "222 39% 12%",
      "--text-secondary": "219 22% 28%",
      "--text-muted": "217 14% 46%",
      "--text-inverse": "0 0% 100%",
      "--border-default": "214 26% 88%",
      "--border-strong": "214 24% 80%",
      "--accent": "202 56% 64%",
      "--accent-strong": "202 58% 54%",
      "--accent-soft": "202 67% 94%",
      "--brand-primary": "202 56% 64%",
      "--brand-primary-dark": "202 58% 54%",
      "--brand-secondary": "202 56% 64%",
      "--sidebar-muted": "214 18% 73%",
      "--sidebar-border": "214 18% 24%",
      "--sidebar-hover-bg": "0 0% 100% / 0.05",
      "--sidebar-active-bg": "202 56% 64% / 0.18",
      "--sidebar-active-fg": "0 0% 100%",
      "--shadow-color": "214 34% 7%",
    },
  },
  {
    id: "barber-slate",
    name: "Barber Slate",
    description: "Inspirado en Barber Pro: fondo humo, vidrio oscuro y acento azul frio.",
    values: {
      "--bg-app": "196 20% 96%",
      "--bg-page": "196 20% 96%",
      "--bg-surface": "0 0% 100%",
      "--bg-surface-muted": "196 25% 95%",
      "--bg-surface-strong": "0 0% 100%",
      "--bg-surface-raised": "0 0% 100%",
      "--bg-subtle": "196 23% 94%",
      "--bg-sidebar": "173 28% 10%",
      "--bg-sidebar-elevated": "176 26% 14%",
      "--bg-inverse": "173 32% 9%",
      "--bg-accent-soft": "202 73% 93%",
      "--text-primary": "220 39% 12%",
      "--text-secondary": "216 19% 30%",
      "--text-muted": "214 12% 48%",
      "--text-inverse": "0 0% 100%",
      "--border-default": "196 21% 87%",
      "--border-strong": "196 18% 79%",
      "--accent": "203 53% 67%",
      "--accent-strong": "202 49% 58%",
      "--accent-soft": "202 73% 93%",
      "--brand-primary": "203 53% 67%",
      "--brand-primary-dark": "202 49% 58%",
      "--brand-secondary": "149 63% 42%",
      "--sidebar-muted": "175 10% 73%",
      "--sidebar-border": "175 14% 22%",
      "--sidebar-hover-bg": "0 0% 100% / 0.05",
      "--sidebar-active-bg": "203 53% 67% / 0.18",
      "--sidebar-active-fg": "0 0% 100%",
      "--shadow-color": "175 32% 6%",
    },
  },
  {
    id: "dte-cyan",
    name: "DTE Cyan",
    description: "Panel limpio con acento electronico y contraste alto para operacion y auditoria.",
    values: {
      "--bg-app": "198 44% 97%",
      "--bg-page": "198 44% 97%",
      "--bg-surface": "0 0% 100%",
      "--bg-surface-muted": "198 45% 95%",
      "--bg-surface-strong": "0 0% 100%",
      "--bg-surface-raised": "0 0% 100%",
      "--bg-subtle": "198 41% 94%",
      "--bg-sidebar": "214 32% 11%",
      "--bg-sidebar-elevated": "214 28% 15%",
      "--bg-inverse": "214 34% 10%",
      "--bg-accent-soft": "192 82% 93%",
      "--text-primary": "222 39% 12%",
      "--text-secondary": "216 18% 28%",
      "--text-muted": "214 12% 47%",
      "--text-inverse": "0 0% 100%",
      "--border-default": "197 30% 87%",
      "--border-strong": "197 28% 79%",
      "--accent": "194 84% 43%",
      "--accent-strong": "194 81% 35%",
      "--accent-soft": "192 82% 93%",
      "--brand-primary": "194 84% 43%",
      "--brand-primary-dark": "194 81% 35%",
      "--brand-secondary": "194 84% 43%",
      "--sidebar-muted": "214 16% 73%",
      "--sidebar-border": "214 20% 22%",
      "--sidebar-hover-bg": "0 0% 100% / 0.05",
      "--sidebar-active-bg": "194 84% 43% / 0.18",
      "--sidebar-active-fg": "0 0% 100%",
      "--shadow-color": "214 34% 7%",
    },
  },
  {
    id: "night-executive",
    name: "Night Executive",
    description: "Version mas densa, con superficies profundas y acento lavanda discreto.",
    values: {
      "--bg-app": "225 18% 15%",
      "--bg-page": "225 18% 15%",
      "--bg-surface": "225 16% 18%",
      "--bg-surface-muted": "226 16% 22%",
      "--bg-surface-strong": "226 18% 20%",
      "--bg-surface-raised": "226 18% 20%",
      "--bg-subtle": "226 14% 23%",
      "--bg-sidebar": "228 27% 10%",
      "--bg-sidebar-elevated": "228 22% 13%",
      "--bg-inverse": "228 29% 8%",
      "--bg-accent-soft": "267 58% 22%",
      "--text-primary": "0 0% 98%",
      "--text-secondary": "227 14% 82%",
      "--text-muted": "226 11% 66%",
      "--text-inverse": "0 0% 100%",
      "--border-default": "227 15% 27%",
      "--border-strong": "227 15% 33%",
      "--accent": "267 74% 70%",
      "--accent-strong": "267 70% 63%",
      "--accent-soft": "267 42% 22%",
      "--brand-primary": "267 74% 70%",
      "--brand-primary-dark": "267 70% 63%",
      "--brand-secondary": "267 74% 70%",
      "--sidebar-muted": "228 12% 72%",
      "--sidebar-border": "228 16% 20%",
      "--sidebar-hover-bg": "0 0% 100% / 0.06",
      "--sidebar-active-bg": "267 74% 70% / 0.18",
      "--sidebar-active-fg": "0 0% 100%",
      "--shadow-color": "228 35% 3%",
    },
  },
];

export const DEFAULT_CONTROL_THEME_PRESET_ID = CONTROL_THEME_PRESETS[0].id;

export function getControlThemePreset(id?: string | null) {
  return CONTROL_THEME_PRESETS.find((preset) => preset.id === id) ?? CONTROL_THEME_PRESETS[0];
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
