"use client";

import { useEffect } from "react";
import {
  CONTROL_THEME_STORAGE_KEY,
  DEFAULT_CONTROL_THEME_PRESET_ID,
  applyControlThemeValues,
  clearControlThemeValues,
  getControlThemePreset,
} from "@/lib/control-theme";

type StoredThemePayload = {
  id?: string;
  values?: Record<string, string>;
};

export function ThemeHydrator({
  defaultPresetId = DEFAULT_CONTROL_THEME_PRESET_ID,
}: {
  defaultPresetId?: string;
}) {
  useEffect(() => {
    const root = document.documentElement.style;
    let values = getControlThemePreset(defaultPresetId).values;
    const raw = window.localStorage.getItem(CONTROL_THEME_STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredThemePayload;
        const presetValues = getControlThemePreset(parsed.id ?? defaultPresetId).values;
        values = parsed.values ? { ...presetValues, ...parsed.values } : presetValues;
      } catch {
        window.localStorage.removeItem(CONTROL_THEME_STORAGE_KEY);
      }
    }

    applyControlThemeValues(root, values);

    return () => {
      clearControlThemeValues(root);
    };
  }, [defaultPresetId]);

  return null;
}
