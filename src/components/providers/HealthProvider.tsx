"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ServiceHealth } from "@/lib/integrations/types";

export type HealthSnapshot = {
  barber:    ServiceHealth;
  dte:       ServiceHealth;
  erp:       ServiceHealth;
  checkedAt: string;
};

type HealthContextValue = {
  snapshot:   HealthSnapshot | null;
  loading:    boolean;
  refresh:    () => void;
};

const HealthContext = createContext<HealthContextValue>({
  snapshot: null,
  loading:  true,
  refresh:  () => {},
});

const POLL_INTERVAL = 60_000; // 60 segundos

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);
  const [loading, setLoading]   = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res  = await fetch("/api/health", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as HealthSnapshot;
      setSnapshot(data);
    } catch (err) {
      console.error("[HealthProvider] error fetching health:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    timerRef.current = setInterval(fetchHealth, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchHealth]);

  return (
    <HealthContext.Provider value={{ snapshot, loading, refresh: fetchHealth }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  return useContext(HealthContext);
}

/** Devuelve el status de un servicio específico desde el snapshot */
export function useServiceHealth(service: "barber" | "dte" | "erp"): ServiceHealth | null {
  const { snapshot } = useHealth();
  return snapshot?.[service] ?? null;
}
