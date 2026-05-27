"use client";

import { useState, useMemo } from "react";
import WorkerRow from "./WorkerRow";
import SortRadio from "./SortRadio";
import EmptyState from "./EmptyState";
import Icon from "@/components/ui/Icon";
import {
  SAMPLE_WORKERS,
  DISTRICTS,
  CATEGORIES,
  JOB_TYPES,
} from "@/lib/sample-data";

export default function ListingsClient() {
  const [district, setDistrict] = useState("Tümü");
  const [type, setType] = useState("Tümü");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return SAMPLE_WORKERS.filter((w) => {
      if (district !== "Tümü" && w.district !== district) return false;
      if (type !== "Tümü" && w.type !== type) return false;
      if (
        query &&
        !`${w.name} ${w.headline} ${w.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (category !== "all" && w.categoryId !== category) return false;
      return true;
    });
  }, [district, type, query, category]);

  return (
    <div className="page">
      {/* Başlık bölümü */}
      <section style={{ padding: "56px 0 24px" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            İş arayanlar
          </div>
          <h2 style={{ marginBottom: 8 }}>Pendik ve çevresindeki ustalar</h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: 16 }}>
            <span className="font-mono">{filtered.length}</span> kişi listeleniyor ·
            son güncelleme bugün
          </p>
        </div>
      </section>

      {/* Search + filter bar */}
      <section style={{ padding: "0 0 24px" }}>
        <div className="container">
          <div
            className="card filter-bar"
            style={{
              padding: 14,
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr auto",
              gap: 10,
              alignItems: "center",
            }}
          >
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
                placeholder="İsim, yetkinlik, pozisyon…"
                style={{
                  paddingLeft: 42,
                  height: 44,
                  border: 0,
                  background: "#FAFAF7",
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                height: 44,
                border: 0,
                background: "#FAFAF7",
                appearance: "auto",
              }}
            >
              {DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                height: 44,
                border: 0,
                background: "#FAFAF7",
                appearance: "auto",
              }}
            >
              {JOB_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button className="btn btn-accent" style={{ height: 44 }}>
              Filtrele
            </button>
          </div>

          {/* Mobil filtre toggle */}
          <button
            className="filter-mobile-toggle"
            onClick={() => setFiltersOpen(true)}
            style={{ display: "none" }}
          >
            <Icon name="filter" size={16} /> Filtreler &amp; kategoriler
          </button>
        </div>
      </section>

      {/* Ana içerik — sidebar + listings */}
      <section style={{ padding: "8px 0 96px" }}>
        <div
          className="container listings-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          <aside
            className="listings-sidebar"
            style={{ position: "sticky", top: 88 }}
          >
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Kategoriler
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    border: 0,
                    font: "inherit",
                    padding: "10px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    color:
                      category === c.id
                        ? "var(--color-ink-900)"
                        : "var(--color-ink-700)",
                    fontWeight: category === c.id ? 500 : 400,
                    background:
                      category === c.id ? "rgba(15,17,16,.04)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 14.5, letterSpacing: "-0.005em" }}>
                    {c.label}
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: "var(--color-ink-400)", fontSize: 13.5 }}
                  >
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="divider" style={{ margin: "24px 0" }} />
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Sıralama
            </div>
            <SortRadio value={sort} onChange={setSort} />
          </aside>

          <div>
            <div
              className="row"
              style={{
                justifyContent: "space-between",
                marginBottom: 16,
                color: "var(--color-ink-500)",
                fontSize: 13.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>
                <span
                  className="font-mono"
                  style={{ color: "var(--color-ink-700)" }}
                >
                  {filtered.length}
                </span>{" "}
                sonuç
              </span>
              <span>Yeniden eskiye</span>
            </div>
            {filtered.length === 0 ? (
              <EmptyState
                onReset={() => {
                  setDistrict("Tümü");
                  setType("Tümü");
                  setQuery("");
                  setCategory("all");
                }}
              />
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {filtered.map((w) => (
                  <WorkerRow key={w.id} worker={w} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobil filtre modal */}
      {filtersOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setFiltersOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,17,16,.32)",
            backdropFilter: "blur(2px)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "18px 18px 0 0",
              width: "100%",
              maxWidth: "100%",
              padding: "24px 20px 32px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h3>Filtreler</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFiltersOpen(false)}
                style={{ width: 36, padding: 0 }}
                aria-label="Kapat"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Kategoriler
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginBottom: 24,
              }}
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    border: 0,
                    font: "inherit",
                    padding: "12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    color:
                      category === c.id
                        ? "var(--color-ink-900)"
                        : "var(--color-ink-700)",
                    fontWeight: category === c.id ? 500 : 400,
                    background:
                      category === c.id ? "rgba(15,17,16,.04)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{c.label}</span>
                  <span
                    className="font-mono"
                    style={{ color: "var(--color-ink-400)", fontSize: 13.5 }}
                  >
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Sıralama
            </div>
            <SortRadio value={sort} onChange={setSort} />
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 24 }}
              onClick={() => setFiltersOpen(false)}
            >
              Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
