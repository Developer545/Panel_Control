/**
 * GET /api/health
 * Agrega el health de los 3 servicios para polling del cliente.
 * No requiere auth — solo devuelve estado público de las integraciones.
 */
import { NextResponse } from "next/server";
import { getBarberHealth } from "@/lib/integrations/barber";
import { getDteHealth }    from "@/lib/integrations/dte";
import { getErpHealth }    from "@/lib/integrations/erp";
import type { ServiceHealth } from "@/lib/integrations/types";

function settled(result: PromiseSettledResult<ServiceHealth>): ServiceHealth {
  if (result.status === "fulfilled") return result.value;
  return { status: "error", timestamp: new Date().toISOString(), detail: String(result.reason) };
}

export async function GET() {
  const start = Date.now();
  const [barber, dte, erp] = await Promise.allSettled([
    getBarberHealth(),
    getDteHealth(),
    getErpHealth(),
  ]);

  const payload = {
    barber:    settled(barber),
    dte:       settled(dte),
    erp:       settled(erp),
    checkedAt: new Date().toISOString(),
  };

  const errorCount = [barber, dte, erp].filter(r => r.status === "rejected").length;
  if (errorCount > 0) {
    console.error(`[health] ${errorCount}/3 integraciones fallaron en ${Date.now() - start}ms`);
  } else {
    console.log(`[health] ok en ${Date.now() - start}ms — barber:${payload.barber.status} dte:${payload.dte.status} erp:${payload.erp.status}`);
  }

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
