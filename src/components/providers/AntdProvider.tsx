"use client";

import { App, ConfigProvider, theme as antdTheme } from "antd";
import esES from "antd/locale/es_ES";

const tokenColor = (name: string, alpha?: string) =>
  alpha ? `hsl(var(${name}) / ${alpha})` : `hsl(var(${name}))`;

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        cssVar: {},
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: tokenColor("--accent"),
          colorLink: tokenColor("--accent"),
          colorInfo: tokenColor("--accent"),
          colorSuccess: tokenColor("--state-success"),
          colorWarning: tokenColor("--state-warning"),
          colorError: tokenColor("--state-danger"),
          colorBgBase: tokenColor("--bg-surface"),
          colorBgLayout: tokenColor("--bg-app"),
          colorBgContainer: tokenColor("--bg-surface"),
          colorBgElevated: tokenColor("--bg-surface-strong"),
          colorBorder: tokenColor("--border-default"),
          colorBorderSecondary: tokenColor("--border-default", "0.72"),
          colorFillAlter: tokenColor("--bg-surface-muted"),
          colorFillSecondary: tokenColor("--accent-soft", "0.58"),
          colorFillTertiary: tokenColor("--accent-soft", "0.3"),
          colorSplit: tokenColor("--border-default", "0.82"),
          colorTextBase: tokenColor("--text-primary"),
          colorText: tokenColor("--text-primary"),
          colorTextSecondary: tokenColor("--text-secondary"),
          colorTextTertiary: tokenColor("--text-muted"),
          colorTextDescription: tokenColor("--text-muted"),
          controlItemBgActive: tokenColor("--accent-soft"),
          controlItemBgActiveHover: tokenColor("--accent-soft"),
          controlItemBgHover: tokenColor("--bg-surface-muted"),
          controlOutline: tokenColor("--accent", "0.16"),
          controlOutlineWidth: 0,
          lineWidth: 1,
          borderRadius: 20,
          borderRadiusSM: 14,
          borderRadiusLG: 28,
          borderRadiusXS: 10,
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          fontFamilyCode: "var(--font-display)",
          boxShadowSecondary: "var(--shadow-card)",
        },
        components: {
          Layout: {
            headerBg: "transparent",
            bodyBg: "transparent",
            siderBg: tokenColor("--bg-sidebar"),
            triggerBg: tokenColor("--bg-sidebar-elevated"),
          },
          Menu: {
            darkItemBg: tokenColor("--bg-sidebar"),
            darkSubMenuItemBg: "transparent",
            darkItemHoverBg: tokenColor("--bg-sidebar-elevated"),
            darkItemSelectedBg: tokenColor("--accent-soft", "0.14"),
            darkItemSelectedColor: tokenColor("--text-inverse"),
            darkItemColor: tokenColor("--text-inverse", "0.72"),
            itemBorderRadius: 14,
            itemMarginBlock: 6,
            itemMarginInline: 10,
            subMenuItemBorderRadius: 12,
          },
          Card: {
            colorBorderSecondary: tokenColor("--border-default"),
            headerBg: "transparent",
            borderRadiusLG: 24,
            bodyPadding: 20,
            bodyPaddingSM: 16,
          },
          Button: {
            controlHeight: 42,
            controlHeightLG: 48,
            borderRadius: 14,
            defaultBorderColor: tokenColor("--border-default"),
            defaultColor: tokenColor("--text-primary"),
            defaultBg: tokenColor("--bg-surface"),
            primaryShadow: "none",
          },
          Input: {
            activeBg: tokenColor("--bg-surface"),
            activeBorderColor: tokenColor("--accent"),
            hoverBorderColor: tokenColor("--accent", "0.48"),
            colorBgContainer: tokenColor("--bg-surface"),
          },
          InputNumber: {
            activeBg: tokenColor("--bg-surface"),
            activeBorderColor: tokenColor("--accent"),
            hoverBorderColor: tokenColor("--accent", "0.48"),
          },
          Select: {
            optionSelectedBg: tokenColor("--accent-soft"),
            optionActiveBg: tokenColor("--bg-surface-muted"),
            activeBorderColor: tokenColor("--accent"),
            hoverBorderColor: tokenColor("--accent", "0.48"),
          },
          Form: {
            labelColor: tokenColor("--text-secondary"),
            verticalLabelPadding: "0 0 10px",
          },
          Tag: {
            defaultBg: tokenColor("--bg-surface-muted"),
            defaultColor: tokenColor("--text-secondary"),
            borderRadiusSM: 999,
            fontWeightStrong: 700,
          },
          Alert: {
            borderRadiusLG: 20,
            withDescriptionPadding: "18px 18px 18px 16px",
          },
          Table: {
            borderColor: tokenColor("--border-default"),
            headerBg: tokenColor("--bg-surface-muted"),
            headerColor: tokenColor("--text-muted"),
            rowHoverBg: tokenColor("--bg-surface-muted", "0.76"),
            cellPaddingBlock: 15,
            cellPaddingInline: 16,
          },
          Statistic: {
            contentFontSize: 20,
          },
          Divider: {
            colorSplit: tokenColor("--border-default", "0.82"),
          },
          Avatar: {
            colorBgContainer: tokenColor("--accent-soft"),
            colorTextPlaceholder: tokenColor("--accent-strong"),
          },
          Breadcrumb: {
            itemColor: tokenColor("--text-muted"),
            lastItemColor: tokenColor("--text-secondary"),
            linkColor: tokenColor("--text-secondary"),
            separatorColor: tokenColor("--text-muted", "0.8"),
          },
          Tabs: {
            itemColor: tokenColor("--text-muted"),
            itemSelectedColor: tokenColor("--text-primary"),
            itemHoverColor: tokenColor("--text-primary"),
            inkBarColor: tokenColor("--accent"),
          },
          Drawer: {
            colorBgElevated: tokenColor("--bg-surface-strong"),
          },
          Modal: {
            contentBg: tokenColor("--bg-surface-strong"),
            headerBg: "transparent",
            titleColor: tokenColor("--text-primary"),
          },
          Popover: {
            colorBgElevated: tokenColor("--bg-surface-strong"),
          },
          Tooltip: {
            colorBgSpotlight: tokenColor("--bg-sidebar"),
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
