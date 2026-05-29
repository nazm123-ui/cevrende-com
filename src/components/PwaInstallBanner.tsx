"use client";

import { useEffect, useState } from "react";

// Chrome'un yakaladığı install prompt event tipi
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "cev_install_dismissed_at";
const IOS_DISMISS_KEY = "cev_ios_install_dismissed_at";
const IOS_NON_SAFARI_DISMISS_KEY = "cev_ios_chrome_dismissed_at";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 gün gizle

type Mode = "hidden" | "android" | "ios-safari" | "ios-non-safari";

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIosUA = /iPhone|iPad|iPod/.test(ua);
  // iPad Safari masaüstü UA gönderiyor, touch ile teyit et
  const isIpadDesktopMode =
    /Macintosh/.test(ua) && "ontouchend" in document;
  return isIosUA || isIpadDesktopMode;
}

// iOS'ta Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS) gibi tarayıcılar
// Safari motorunu kullanır ama "Ana Ekrana Ekle" yapamaz (Apple izin vermiyor).
// Kullanıcı önce Safari'ye geçmeli.
function isNonSafariIosBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser/.test(navigator.userAgent);
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

    if (detectIOS()) {
      // iOS'ta non-Safari (Chrome/Firefox/Edge): Önce Safari'ye gitmesi gerek
      if (isNonSafariIosBrowser()) {
        const dismissedAt = Number(
          localStorage.getItem(IOS_NON_SAFARI_DISMISS_KEY) || 0,
        );
        if (Date.now() - dismissedAt >= DISMISS_DURATION_MS) {
          setMode("ios-non-safari");
        }
        return;
      }

      // iOS Safari: beforeinstallprompt yok, manuel rehber
      const dismissedAt = Number(
        localStorage.getItem(IOS_DISMISS_KEY) || 0,
      );
      if (Date.now() - dismissedAt >= DISMISS_DURATION_MS) {
        setMode("ios-safari");
      }
      return;
    }

    // Android / Desktop Chrome / Edge
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
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
    }
    setMode("hidden");
  }

  function onDismissAndroid() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setMode("hidden");
  }

  function onDismissIos() {
    localStorage.setItem(IOS_DISMISS_KEY, String(Date.now()));
    setMode("hidden");
  }

  function onDismissIosNonSafari() {
    localStorage.setItem(IOS_NON_SAFARI_DISMISS_KEY, String(Date.now()));
    setMode("hidden");
  }

  if (mode === "hidden") return null;

  // iOS non-Safari (Chrome/Firefox/Edge): Önce Safari'ye gitmesi gerek
  if (mode === "ios-non-safari") {
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
              Uygulama için Safari gerekiyor
            </div>
            <div className="text-[12.5px] text-ink-500 mt-1 leading-snug">
              iPhone&apos;da ana ekrana ekleme sadece{" "}
              <strong className="text-ink-900">Safari</strong>&apos;den
              yapılabiliyor. Aynı linki Safari&apos;de aç → Paylaş → Ana
              Ekrana Ekle.
            </div>
          </div>
          <button
            type="button"
            onClick={onDismissIosNonSafari}
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

  // iOS Safari: manuel ekleme rehberi
  if (mode === "ios-safari") {
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
              Safari&apos;de altta{" "}
              <ShareIcon />{" "}
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
