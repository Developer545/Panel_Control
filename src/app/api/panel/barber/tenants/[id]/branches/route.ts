/**
 * GET /api/panel/barber/tenants/[id]/branches
 * Proxy → barber-pro GET /api/superadmin/tenants/:id/branches
 */

import type { NextRequest } from "next/server";
import { getPanelSession } from "@/lib/panel-route";
import { ok, fail } from "@/lib/panel-api";
import { getErrorMessage } from "@/lib/error-message";
import { getBarberTenantBranches } from "@/lib/integrations/barber";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  const { id } = await params;
  try {
    const branches = await getBarberTenantBranches(Number(id));
    return ok(branches);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}
