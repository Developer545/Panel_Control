import { NextRequest } from "next/server";
import { getPanelSession } from "@/lib/panel-route";
import { ok, fail } from "@/lib/panel-api";
import { getErrorMessage } from "@/lib/error-message";
import { updateBarberPlanConfig, deleteBarberPlanConfig } from "@/lib/integrations/barber";
import type { UpdateBarberPlanConfigInput } from "@/lib/integrations/barber";

type Params = { params: Promise<{ plan: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  const { plan: slug } = await params;

  try {
    const body = await req.json() as UpdateBarberPlanConfigInput;
    const result = await updateBarberPlanConfig(slug, body);
    return ok(result);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  const { plan: slug } = await params;

  try {
    const result = await deleteBarberPlanConfig(slug);
    return ok(result);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}
