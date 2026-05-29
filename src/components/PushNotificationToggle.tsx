"use client";

import { useEffect, useState } from "react";

type Status =
  | "loading"
  | "unsupported"
  | "permission-denied"
  | "subscribed"
  | "unsubscribed";

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buffer;
}

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("permission-denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setStatus(sub ? "subscribed" : "unsubscribed");
      } catch {
        setStatus("unsupported");
      }
    })();
  }, []);

  async function subscribe() {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(
          permission === "denied" ? "permission-denied" : "unsubscribed",
        );
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
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
          userAgent: navigator.userAgent.slice(0, 280),
        }),
      });
      if (res.ok) setStatus("subscribed");
    } catch (err) {
      console.error("[push] subscribe failed:", err);
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setStatus("unsubscribed");
    } catch (err) {
      console.error("[push] unsubscribe failed:", err);
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") return null;
  if (status === "unsupported") {
    return (
      <div className="rounded-[14px] border border-ink-100 bg-white p-4">
        <div className="text-[13.5px] font-medium text-ink-900">
          Bildirimler
        </div>
        <div className="text-[12.5px] text-ink-500 mt-1 leading-snug">
          Bu tarayıcı henüz web bildirimini desteklemiyor. iOS 16.4+ Safari veya
          Chrome/Edge ile dene.
        </div>
      </div>
    );
  }
  if (status === "permission-denied") {
    return (
      <div className="rounded-[14px] border border-ink-100 bg-white p-4">
        <div className="text-[13.5px] font-medium text-ink-900">
          Bildirimler kapalı
        </div>
        <div className="text-[12.5px] text-ink-500 mt-1 leading-snug">
          Tarayıcı ayarlarından bildirim iznini açtıktan sonra yeniden gel.
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-[14px] border border-ink-100 bg-white p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium text-ink-900">
          {status === "subscribed"
            ? "Bildirimler açık"
            : "Anlık bildirimleri aç"}
        </div>
        <div className="text-[12.5px] text-ink-500 mt-1 leading-snug">
          {status === "subscribed"
            ? "Yeni mesaj geldiğinde anında haber veririz."
            : "Sana mesaj geldiğinde tarayıcı veya telefonun bildirim gösterir."}
        </div>
      </div>
      <button
        type="button"
        onClick={status === "subscribed" ? unsubscribe : subscribe}
        disabled={busy}
        className={
          status === "subscribed"
            ? "inline-flex items-center h-9 px-3.5 rounded-full border border-ink-200 text-[13px] font-medium text-ink-900 hover:border-ink-900 transition disabled:opacity-50"
            : "inline-flex items-center h-9 px-3.5 rounded-full bg-ink-900 text-white text-[13px] font-medium hover:bg-accent-600 transition disabled:opacity-50 border-0 cursor-pointer"
        }
      >
        {busy ? "..." : status === "subscribed" ? "Kapat" : "Aç"}
      </button>
    </div>
  );
}
