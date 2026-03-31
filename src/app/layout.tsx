import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AntdProvider } from "@/components/providers/AntdProvider";
import { ThemeHydrator } from "@/components/providers/ThemeHydrator";
import { AuthProvider } from "@/context/AuthContext";
import { verifyPanelSessionToken } from "@/lib/panel-session";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Speeddan Control V3",
  description: "Panel central para Barber Pro, ERP Full Pro y DTE",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("speeddan_control_v3_session")?.value;
  const session = sessionToken ? verifyPanelSessionToken(sessionToken) : null;

  return (
    <html lang="es" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AntdProvider>
          <ThemeHydrator />
          <AuthProvider initialSession={session}>{children}</AuthProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
