"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

const emptySubscribe = () => () => {};

/**
 * Accessible light/dark toggle. `useSyncExternalStore` gives a hydration-safe
 * "mounted" flag (server snapshot false → client snapshot true) without
 * setState-in-effect, so SSR and first client render always match.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? t.common.toLightTheme : t.common.toDarkTheme}
      title={isDark ? t.common.toLightTheme : t.common.toDarkTheme}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-11 w-11 text-muted-foreground hover:text-foreground"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
        ) : (
          <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
        )
      ) : (
        <Sun className="h-[18px] w-[18px] opacity-0" aria-hidden="true" />
      )}
    </Button>
  );
}
