"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";
import Icon from "@/components/ui/Icon";

const DISTRICTS = ["Tümü", "Pendik", "Tuzla", "Kartal"];

export default function TopFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const current = {
    q: params.get("q") ?? "",
    ilce: params.get("ilce") ?? "Tümü",
    mahalle: params.get("mahalle") ?? "",
  };

  function submit(formData: FormData) {
    const next = new URLSearchParams(params.toString());
    const q = (formData.get("q") as string)?.trim() || "";
    const ilce = (formData.get("ilce") as string) || "Tümü";
    const mahalle = (formData.get("mahalle") as string) || "";

    if (q) next.set("q", q);
    else next.delete("q");
    if (ilce && ilce !== "Tümü") next.set("ilce", ilce);
    else next.delete("ilce");
    if (mahalle) next.set("mahalle", mahalle);
    else next.delete("mahalle");

    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  return (
    <form
      action={submit}
      style={{
        background: "#fff",
        border: "1px solid var(--color-ink-100)",
        borderRadius: 14,
        padding: 14,
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr auto",
        gap: 10,
        alignItems: "center",
      }}
      className="filter-bar"
    >
      {/* Arama input */}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-ink-400)",
            pointerEvents: "none",
          }}
        >
          <Icon name="search" size={18} />
        </span>
        <input
          name="q"
          type="search"
          defaultValue={current.q}
          placeholder="İsim, yetkinlik, pozisyon…"
          style={{
            paddingLeft: 42,
            height: 44,
            border: 0,
            background: "#FAFAF7",
          }}
        />
      </div>

      {/* İlçe */}
      <select
        name="ilce"
        defaultValue={current.ilce}
        style={{
          height: 44,
          border: 0,
          background: "#FAFAF7",
          appearance: "auto",
        }}
      >
        {DISTRICTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Mahalle */}
      <select
        name="mahalle"
        defaultValue={current.mahalle}
        style={{
          height: 44,
          border: 0,
          background: "#FAFAF7",
          appearance: "auto",
        }}
      >
        <option value="">Tüm mahalleler</option>
        {PENDIK_NEIGHBORHOODS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* Filtrele button */}
      <button
        type="submit"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          height: 44,
          padding: "0 22px",
          borderRadius: 999,
          background: "var(--color-accent-600)",
          color: "#fff",
          border: 0,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <Icon name="filter" size={14} /> Filtrele
      </button>
    </form>
  );
}
