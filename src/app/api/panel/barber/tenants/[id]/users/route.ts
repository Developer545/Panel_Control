import { NextRequest } from "next/server";
import { getPanelSession } from "@/lib/panel-route";
import { ok, fail } from "@/lib/panel-api";
import { getErrorMessage } from "@/lib/error-message";
import {
  getBarberTenantTeam,
  createBarberTenantUser,
  type CreateBarberTeamUserInput,
} from "@/lib/integrations/barber";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  const { id } = await params;
  try {
    const team = await getBarberTenantTeam(Number(id));
    return ok(team);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  const { id } = await params;
  const body = await req.json() as CreateBarberTeamUserInput;

  try {
    const user = await createBarberTenantUser(Number(id), body);
    return ok(user);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}
