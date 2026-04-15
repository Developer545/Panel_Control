import { NextRequest } from "next/server";
import { getPanelSession } from "@/lib/panel-route";
import { ok, fail } from "@/lib/panel-api";
import { getErrorMessage } from "@/lib/error-message";
import { getBarberPlanConfigs, createBarberPlanConfig } from "@/lib/integrations/barber";
import type { CreateBarberPlanConfigInput } from "@/lib/integrations/barber";

export async function GET() {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  try {
    const plans = await getBarberPlanConfigs();
    return ok(plans);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}

export async function POST(req: NextRequest) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  try {
    const body = await req.json() as CreateBarberPlanConfigInput;
    const result = await createBarberPlanConfig(body);
    return ok(result);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}
