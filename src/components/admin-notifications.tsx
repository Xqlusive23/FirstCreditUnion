"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminMarkNotificationsReadAction } from "@/lib/actions/admin";
import { formatInboxDate } from "@/lib/member-inbox";
import type { NotificationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE_DOT: Record<NotificationItem["tone"], string> = {
  credit: "bg-emerald-400",
  debit: "bg-[#c4a574]",
  alert: "bg-red-400",
  info: "bg-sky-400",
};

export function AdminNotificationsBell({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const unread = notifications.filter((item) => item.unread);
  const unreadCount = unread.length;

  function mark(ids: string[]) {
    startTransition(async () => {
      await adminMarkNotificationsReadAction(ids);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread transaction notifications`
            : "Notifications"
        }
      >
        <Bell className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-[#c4a574] px-1 text-[10px] font-bold leading-4 text-[#0B2340]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-md gap-0 border-l-white/10 bg-[#0B2340] p-0 text-white"
        >
          <SheetHeader className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-3 pr-8">
              <div>
                <SheetTitle className="text-lg text-white">
                  Notifications
                </SheetTitle>
                <p className="mt-0.5 text-xs text-white/55">
                  Posted transactions and membership activity
                </p>
              </div>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => mark(unread.map((item) => item.id))}
                  className="shrink-0 text-sm font-medium text-[#c4a574] disabled:opacity-50"
                >
                  Mark all read
                </button>
              ) : null}
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-5 py-2">
            {notifications.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/60">
                No notifications yet. Posted transactions will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-white/10">
                {notifications.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (item.unread) mark([item.id]);
                          setOpen(false);
                        }}
                        className="min-w-0 flex-1"
                      >
                        <p className="flex items-center gap-2 font-semibold">
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              item.unread ? TONE_DOT[item.tone] : "bg-white/20",
                            )}
                          />
                          {item.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-white/60">
                          {item.message}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {formatInboxDate(item.createdAt)}
                        </p>
                      </Link>
                      {item.unread ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => mark([item.id])}
                          className="shrink-0 text-xs font-medium text-[#c4a574] disabled:opacity-50"
                        >
                          Mark read
                        </button>
                      ) : (
                        <span className="shrink-0 text-xs text-white/35">
                          Read
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
