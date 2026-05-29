"use client";

import { useEffect, useState } from "react";

// Chrome'un yakaladığı install prompt event tipi
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "cev_install_dismissed_at";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 gün gizle

export default function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Zaten standalone modda açıldıysa banner göstermeye gerek yok
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari standalone check
      (window.navigator as { standalone?: boolean }).standalone === true
    ) {
      return;
    }

    // Kullanıcı son 14 gün içinde "şimdi değil" dediyse gizle
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt,
      );
  }, []);

  async function onInstall() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      setVisible(false);
    }
  }

  function onDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible || !deferred) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 rounded-[14px] bg-white border border-ink-200 shadow-[0_12px_32px_-12px_rgba(15,17,16,0.25)] p-4 flex items-center gap-3">
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-ink-900 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-ink-50" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-ink-900">
          Çevrende&apos;yi ana ekrana ekle
        </div>
        <div className="text-[12.5px] text-ink-500 mt-0.5 leading-snug">
          Tarayıcı açmadan uygulama gibi kullan.
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 h-9 text-[13px] text-ink-500 hover:text-ink-900 transition bg-transparent border-0 cursor-pointer"
          aria-label="Kapat"
        >
          Sonra
        </button>
        <button
          type="button"
          onClick={onInstall}
          className="px-3.5 h-9 rounded-full bg-ink-900 text-white text-[13px] font-medium hover:bg-accent-600 transition border-0 cursor-pointer"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
