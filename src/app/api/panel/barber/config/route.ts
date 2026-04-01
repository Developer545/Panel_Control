import { NextRequest } from "next/server";
import { getPanelSession } from "@/lib/panel-route";
import { ok, fail } from "@/lib/panel-api";
import { getErrorMessage } from "@/lib/error-message";
import { getBarberConfig, updateBarberConfig } from "@/lib/integrations/barber";

export async function GET() {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  try {
    const config = await getBarberConfig();
    return ok(config);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getPanelSession();
  if (!session) return fail("No autorizado", 401);

  const body = await req.json();

  try {
    const config = await updateBarberConfig(body);
    return ok(config);
  } catch (cause) {
    return fail(getErrorMessage(cause), 502);
  }
}
