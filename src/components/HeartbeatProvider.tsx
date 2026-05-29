"use client";

import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 60_000;

type Props = { enabled: boolean };

// Sadece logged-in user için heartbeat ping atar. Hidden tab'da durur,
// görünür olunca tekrar başlar. Sade fetch, sessiz hata yönetimi.
export default function HeartbeatProvider({ enabled }: Props) {
  useEffect(() => {
    if (!enabled) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    function ping() {
      if (document.visibilityState !== "visible") return;
      fetch("/api/heartbeat", { method: "POST", keepalive: true }).catch(
        () => {},
      );
    }

    function start() {
      if (intervalId) return;
      ping();
      intervalId = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    }

    function stop() {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    }

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled]);

  return null;
}
