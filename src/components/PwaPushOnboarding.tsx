"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "cev_push_onboarding_dismissed_at";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 gün
const APPEAR_DELAY_MS = 2000; // standalone açılıştan sonra 2 sn bekle

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buffer;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

type Props = { enabled: boolean };

// Kullanıcı uygulamayı ana ekrana ekleyip ilk açtığında, Hesap Ayarları'na
// gitmeden bildirim izin akışını başlatan nazik teklif kartı. Sadece:
// - logged-in (enabled)
// - standalone modda (ana ekrandan açılmış)
// - permission henüz default (sorulmamış)
// - browser destekliyor
// - son 14 gün içinde dismiss etmemiş
// durumlarında görünür.
export default function PwaPushOnboarding({ enabled }: Props) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return; // izin verilmiş ya da reddedilmiş
    if (!isStandalone()) return; // sadece ana ekrandan açıldıysa

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;

    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [enabled]);

  async function onEnable() {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        setVisible(false);
        return;
      }
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setVisible(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const json = sub.toJSON() as {
        endpoint?: string;
        keys?: { p256dh?: string; auth?: string };
      };
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
          userAgent: navigator.userAgent.slice(0, 280),
        }),
      });
      setVisible(false);
    } catch (err) {
      console.error("[push onboarding] failed:", err);
      setVisible(false);
    } finally {
      setBusy(false);
    }
  }

  function onDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(16px,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-labelledby="push-onboard-title"
    >
      <div className="mx-auto max-w-[460px] rounded-[18px] bg-white border border-ink-200 shadow-[0_20px_60px_-20px_rgba(15,17,16,0.30)] p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1F5A45"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="push-onboard-title"
              className="text-[16px] font-semibold text-ink-900 leading-tight m-0"
            >
              Mesajları kaçırma
            </h3>
            <p className="text-[13.5px] text-ink-500 mt-1.5 leading-snug">
              Sana yeni mesaj geldiğinde uygulamayı açmana gerek kalmadan
              ekranda hemen göstereyim mi?
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDismiss}
            disabled={busy}
            className="flex-1 h-11 rounded-full border border-ink-200 bg-white text-[14px] font-medium text-ink-700 hover:border-ink-900 transition disabled:opacity-50 cursor-pointer"
          >
            Şimdi değil
          </button>
          <button
            type="button"
            onClick={onEnable}
            disabled={busy}
            className="flex-1 h-11 rounded-full bg-ink-900 text-white text-[14px] font-medium hover:bg-accent-600 transition border-0 disabled:opacity-50 cursor-pointer"
          >
            {busy ? "Açılıyor..." : "Evet, aç"}
          </button>
        </div>

        <p className="text-[11.5px] text-ink-400 mt-3 text-center leading-snug">
          İstediğin zaman Hesap Ayarları&apos;ndan kapatabilirsin.
        </p>
      </div>
    </div>
  );
}
