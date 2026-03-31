"use client";

import { useEffect } from "react";
import {
  CONTROL_THEME_STORAGE_KEY,
  applyControlThemeValues,
} from "@/lib/control-theme";

export function ThemeHydrator() {
  useEffect(() => {
    const raw = window.localStorage.getItem(CONTROL_THEME_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { values?: Record<string, string> };
      if (parsed.values) {
        applyControlThemeValues(document.documentElement.style, parsed.values);
      }
    } catch {
      window.localStorage.removeItem(CONTROL_THEME_STORAGE_KEY);
    }
  }, []);

  return null;
}
