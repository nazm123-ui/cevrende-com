"use client";

import { useEffect } from "react";

type Props = { unreadCount: number };

// Okunmamış sayısını ana ekrandaki uygulama ikonunda badge olarak gösterir.
// Sayı 0 ise badge temizlenir. Browser destek vermiyorsa sessizce no-op.
export default function BadgeSync({ unreadCount }: Props) {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const nav = navigator as Navigator & {
      setAppBadge?: (count?: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };
    if (!nav.setAppBadge) return;

    if (unreadCount > 0) {
      nav.setAppBadge(unreadCount).catch(() => {});
    } else {
      nav.clearAppBadge?.().catch(() => {});
    }
  }, [unreadCount]);

  return null;
}
