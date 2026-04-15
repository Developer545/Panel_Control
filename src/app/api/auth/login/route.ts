import { timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { fail, ok } from "@/lib/panel-api";
import {
  PANEL_SESSION_COOKIE,
  createPanelSession,
  encodePanelSession,
  getPanelSessionCookieOptions,
} from "@/lib/panel-session";

// ── Rate limiting en memoria (panel de uso único — tráfico mínimo) ─────────
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

type IpRecord = { count: number; windowStart: number };
const ipAttempts = new Map<string, IpRecord>();

function getClientIp(headerStore: Awaited<ReturnType<typeof headers>>): string {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipAttempts.get(ip);
  if (!record || now - record.windowStart > WINDOW_MS) {
    ipAttempts.set(ip, { count: 1, windowStart: now });
    return true;
  }
  record.count += 1;
  return record.count <= MAX_ATTEMPTS;
}

function resetRateLimit(ip: string) {
  ipAttempts.delete(ip);
}

// ── Comparación segura en tiempo constante ─────────────────────────────────
function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const headerStore = await headers();
    const ip = getClientIp(headerStore);

    if (!checkRateLimit(ip)) {
      return fail("Demasiados intentos. Espera 15 minutos.", 429);
    }

    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return fail("Usuario y clave son requeridos", 422);
    }

    const expectedUser = (process.env.CONTROL_ADMIN_USER ?? "").trim();
    const expectedPass = (process.env.CONTROL_ADMIN_PASS ?? "").trim();

    if (!expectedUser || !expectedPass) {
      return fail("Las credenciales del panel no estan configuradas", 500);
    }

    // Comparación en tiempo constante — previene timing attacks
    const userOk = safeEquals(username.trim(), expectedUser);
    const passOk = safeEquals(password.trim(), expectedPass);

    if (!userOk || !passOk) {
      return fail("Credenciales invalidas", 401);
    }

    resetRateLimit(ip);

    const session = createPanelSession(username);
    const token = encodePanelSession(session);
    const cookieStore = await cookies();

    cookieStore.set(PANEL_SESSION_COOKIE, token, getPanelSessionCookieOptions());

    return ok({ session });
  } catch {
    return fail("No se pudo iniciar sesion", 500);
  }
}
