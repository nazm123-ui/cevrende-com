"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={
        className ??
        "text-sm font-medium text-ink-700 hover:text-brand-700 transition disabled:opacity-50"
      }
    >
      {loading ? "Çıkılıyor..." : "Çıkış"}
    </button>
  );
}
