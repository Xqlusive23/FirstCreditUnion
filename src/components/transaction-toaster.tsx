"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { NotificationItem } from "@/lib/types";

type Payload = {
  userId: string | null;
  notifications: NotificationItem[];
};

const STORAGE_PREFIX = "fcu.seenNotifications:";
const POLL_MS = 5000;
const MAX_SEEN = 200;

function readSeen(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string")
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

function writeSeen(key: string, ids: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify([...ids].slice(-MAX_SEEN)));
  } catch {
    // Storage may be unavailable in private browsing; in-memory dedupe still works.
  }
}

export function TransactionToaster() {
  const seenRef = useRef<Set<string> | null>(null);
  const keyRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    async function poll() {
      if (cancelled || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        if (!response.ok || cancelled) return;
        const payload = (await response.json()) as Payload;
        if (!payload.userId || cancelled) return;

        const key = `${STORAGE_PREFIX}${payload.userId}`;
        if (keyRef.current !== key) {
          keyRef.current = key;
          seenRef.current = readSeen(key);
          // Seed on first sight so old notifications don't all pop at once.
          if (seenRef.current.size === 0) {
            for (const item of payload.notifications) {
              seenRef.current.add(item.id);
            }
            writeSeen(key, seenRef.current);
            return;
          }
        }

        const seen = seenRef.current;
        if (!seen) return;
        let changed = false;
        for (const item of payload.notifications) {
          if (seen.has(item.id)) continue;
          seen.add(item.id);
          changed = true;
          toast(item.title, {
            description: item.message,
            icon:
              item.tone === "credit"
                ? "↓"
                : item.tone === "debit"
                  ? "↑"
                  : item.tone === "alert"
                    ? "!"
                    : "i",
          });
        }
        if (changed) writeSeen(key, seen);
      } catch {
        // Polling is best-effort; the notification center stays the source of truth.
      } finally {
        inFlight = false;
      }
    }

    void poll();
    const timer = window.setInterval(() => void poll(), POLL_MS);
    const onFocus = () => void poll();
    const onVisibility = () => {
      if (!document.hidden) void poll();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
