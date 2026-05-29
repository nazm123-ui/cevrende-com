"use client";

import { useEffect, useState } from "react";

// Chrome'un yakaladığı install prompt event tipi
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "cev_install_dismissed_at";
const IOS_DISMISS_KEY = "cev_ios_install_dismissed_at";
const VIEW_COUNT_KEY = "cev_install_view_count";
const IOS_VIEW_COUNT_KEY = "cev_ios_install_view_count";
const LAST_SHOWN_KEY = "cev_install_last_shown_at";
const IOS_LAST_SHOWN_KEY = "cev_ios_install_last_shown_at";

const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 gün gizle
const COOLDOWN_BETWEEN_SHOWS_MS = 4 * 60 * 60 * 1000; // 4 saat aralık
const MAX_VIEWS_BEFORE_AUTO_DISMISS = 3; // 3 kez gösterilince 14 gün sustur

// Kullanıcı action almadan banner'ı kapatırsa banner ne sıklıkla gösterilsin?
// - Son gösterim 4 saatten yeniyse: bu session'da tekrar gösterme
// - Toplam 3 kez gösterildiyse: 14 gün sustur
// - Kullanıcı "Sonra" derse: 14 gün sustur, sayaç sıfırla
function checkAndMarkShow(
  dismissKey: string,
  viewCountKey: string,
  lastShownKey: string,
): boolean {
  const dismissedAt = Number(localStorage.getItem(dismissKey) || 0);
  if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return false;

  const lastShownAt = Number(localStorage.getItem(lastShownKey) || 0);
  if (Date.now() - lastShownAt < COOLDOWN_BETWEEN_SHOWS_MS) return false;

  const viewCount = Number(localStorage.getItem(viewCountKey) || 0);
  if (viewCount >= MAX_VIEWS_BEFORE_AUTO_DISMISS) {
    // Yeterince gördü, susturalım
    localStorage.setItem(dismissKey, String(Date.now()));
    localStorage.removeItem(viewCountKey);
    return false;
  }

  localStorage.setItem(lastShownKey, String(Date.now()));
  localStorage.setItem(viewCountKey, String(viewCount + 1));
  return true;
}

type Mode = "hidden" | "android" | "ios";

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIosUA = /iPhone|iPad|iPod/.test(ua);
  // iPad Safari masaüstü UA gönderiyor, touch ile teyit et
  const isIpadDesktopMode =
    /Macintosh/.test(ua) && "ontouchend" in document;
  return isIosUA || isIpadDesktopMode;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export default function PwaInstallBanner() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (isStandalone()) return;

    // iOS (Safari/Chrome/Firefox hepsi): beforeinstallprompt yok, manuel rehber.
    if (detectIOS()) {
      if (
        checkAndMarkShow(
          IOS_DISMISS_KEY,
          IOS_VIEW_COUNT_KEY,
          IOS_LAST_SHOWN_KEY,
        )
      ) {
        setMode("ios");
      }
      return;
    }

    // Android / Desktop Chrome / Edge
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      if (!checkAndMarkShow(DISMISS_KEY, VIEW_COUNT_KEY, LAST_SHOWN_KEY)) {
        return;
      }
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("android");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt,
      );
  }, []);

  async function onInstallAndroid() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      localStorage.removeItem(VIEW_COUNT_KEY);
    }
    setMode("hidden");
  }

  function onDismissAndroid() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    localStorage.removeItem(VIEW_COUNT_KEY);
    setMode("hidden");
  }

  function onDismissIos() {
    localStorage.setItem(IOS_DISMISS_KEY, String(Date.now()));
    localStorage.removeItem(IOS_VIEW_COUNT_KEY);
    setMode("hidden");
  }

  if (mode === "hidden") return null;

  // iOS (tüm tarayıcılar): manuel ekleme rehberi
  if (mode === "ios") {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 rounded-[14px] bg-white border border-ink-200 shadow-[0_12px_32px_-12px_rgba(15,17,16,0.25)] p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-full bg-ink-900 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-ink-50" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium text-ink-900">
              Çevrende&apos;yi ana ekrana ekle
            </div>
            <div className="text-[12.5px] text-ink-500 mt-1 leading-snug">
              Altta <ShareIcon />{" "}
              <strong className="text-ink-900">Paylaş</strong> &rarr;{" "}
              <strong className="text-ink-900">Ana Ekrana Ekle</strong>{" "}
              de.
            </div>
          </div>
          <button
            type="button"
            onClick={onDismissIos}
            className="shrink-0 text-ink-400 hover:text-ink-900 transition bg-transparent border-0 cursor-pointer p-1 -mt-1 -mr-1"
            aria-label="Kapat"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Android / Chrome / Edge: tek tıkla ekle
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
          onClick={onDismissAndroid}
          className="px-3 h-9 text-[13px] text-ink-500 hover:text-ink-900 transition bg-transparent border-0 cursor-pointer"
          aria-label="Kapat"
        >
          Sonra
        </button>
        <button
          type="button"
          onClick={onInstallAndroid}
          className="px-3.5 h-9 rounded-full bg-ink-900 text-white text-[13px] font-medium hover:bg-accent-600 transition border-0 cursor-pointer"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <span className="inline-flex items-center align-middle">
      <svg
        width="13"
        height="14"
        viewBox="0 0 16 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2.5" y="7" width="11" height="9" rx="1.5" />
        <path d="M8 1.5v9" />
        <path d="M5 4.5 8 1.5l3 3" />
      </svg>
    </span>
  );
}
