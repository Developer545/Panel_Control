import { NextRequest } from "next/server";
import { getPanelSession } from "@/lib/panel-route";
import { ok, fail } from "@/lib/panel-api";
import { getErrorMessage } from "@/lib/error-message";
import { getBarberTenantBranches } from "@/lib/integrations/barber";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
