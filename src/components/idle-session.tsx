"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { idleLogoutAction } from "@/lib/actions/auth";

const IDLE_MS = 5 * 60 * 1000;
const CHECK_MS = 10 * 1000;
const ACTIVITY_KEY = "fcu.lastActivity";
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "scroll",
  "wheel",
  "touchstart",
  "focus",
];

export function IdleSessionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const guarded =
      pathname.startsWith("/banking") ||
      (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login"));
    if (!guarded) return;

    let lastActivity = Date.now();
    let lastStoredAt = lastActivity;
    let signingOut = false;

    function markActivity() {
      const current = Date.now();
      lastActivity = current;
      if (current - lastStoredAt < 3000) return;
      lastStoredAt = current;
      try {
        window.localStorage.setItem(ACTIVITY_KEY, String(current));
      } catch {
        // Private browsing can block storage; in-memory tracking still works.
      }
    }

    function syncOtherTabs(event: StorageEvent) {
      if (event.key !== ACTIVITY_KEY || !event.newValue) return;
      const value = Number(event.newValue);
      if (Number.isFinite(value) && value > lastActivity) lastActivity = value;
    }

    async function checkIdle() {
      if (signingOut) return;
      try {
        const stored = Number(window.localStorage.getItem(ACTIVITY_KEY));
        if (Number.isFinite(stored) && stored > lastActivity) {
          lastActivity = stored;
        }
      } catch {
        // Ignore unavailable storage.
      }
      if (Date.now() - lastActivity < IDLE_MS) return;

      signingOut = true;
      try {
        await idleLogoutAction();
      } catch {
        // Even if the call fails, leave the app so the stale session is not used.
      }
      const destination = window.location.pathname.startsWith("/admin")
        ? "/admin/login?reason=idle"
        : "/login?reason=idle";
      window.location.replace(destination);
    }

    function onVisibilityChange() {
      if (!document.hidden) void checkIdle();
    }

    markActivity();
    for (const name of ACTIVITY_EVENTS) {
      window.addEventListener(name, markActivity, { passive: true });
    }
    window.addEventListener("storage", syncOtherTabs);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const timer = window.setInterval(() => void checkIdle(), CHECK_MS);

    return () => {
      window.clearInterval(timer);
      for (const name of ACTIVITY_EVENTS) {
        window.removeEventListener(name, markActivity);
      }
      window.removeEventListener("storage", syncOtherTabs);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  return null;
}
