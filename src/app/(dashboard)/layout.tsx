import { DashboardChrome } from "@/components/layout/DashboardChrome";
import { AntdProvider } from "@/components/providers/AntdProvider";
import { ThemeHydrator } from "@/components/providers/ThemeHydrator";
import { HealthProvider } from "@/components/providers/HealthProvider";
import {
  DEFAULT_CONTROL_THEME_PRESET_ID,
  getControlThemePreset,
  serializeControlThemeValues,
} from "@/lib/control-theme";
import { getRequiredPanelSession } from "@/lib/panel-route";

const dashboardThemePreset = getControlThemePreset(DEFAULT_CONTROL_THEME_PRESET_ID);
const dashboardThemeCssText = serializeControlThemeValues(dashboardThemePreset.values);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredPanelSession();

  return (
    <>
      <style>{`:root { ${dashboardThemeCssText} }`}</style>
      <AntdProvider variant="dashboard" withApp={false}>
        <ThemeHydrator defaultPresetId={DEFAULT_CONTROL_THEME_PRESET_ID} />
        <HealthProvider>
          <DashboardChrome>{children}</DashboardChrome>
        </HealthProvider>
      </AntdProvider>
    </>
  );
}
