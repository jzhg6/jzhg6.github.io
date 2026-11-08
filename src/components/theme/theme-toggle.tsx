"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { t, type Locale } from "@/config/i18n";

const subscribe = () => () => undefined;

export function ThemeToggle({ locale }: { locale: Locale }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = resolvedTheme === "dark";
  const label = mounted
    ? isDark ? t(locale).themeLight : t(locale).themeDark
    : t(locale).themeDefault;

  return (
    <button type="button" className="icon-button theme-toggle" aria-label={label} title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />) :
        <span className="theme-placeholder" aria-hidden="true" />}
    </button>
  );
}
