"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "切换到浅色主题" : "切换到深色主题";

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={mounted ? label : "切换颜色主题"}
      title={mounted ? label : "切换颜色主题"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />
      ) : (
        <span className="theme-placeholder" aria-hidden="true" />
      )}
    </button>
  );
}
