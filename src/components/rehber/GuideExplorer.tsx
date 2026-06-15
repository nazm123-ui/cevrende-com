"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { normalizeTr } from "@/lib/normalize-tr";

export type GuideCard = {
  slug: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  topicSlug: string;
  topicLabel: string;
  from: string;
  to: string;
  coverImage?: string | null;
};

export type TopicChip = { slug: string; label: string; count: number };

export default function GuideExplorer({
  guides,
  topics,
}: {
  guides: GuideCard[];
  topics: TopicChip[];
}) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = normalizeTr(query.trim());
    return guides.filter((g) => {
      if (activeTopic !== "all" && g.topicSlug !== activeTopic) return false;
      if (!q) return true;
      const hay = normalizeTr(`${g.title} ${g.excerpt} ${g.topicLabel}`);
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [guides, query, activeTopic]);

  return (
    <section className="pt-8 pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* Arama */}
        <div className="relative max-w-[520px]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hizmet rehberi ara…"
            aria-label="Rehber ara"
            className="w-full h-12 pl-11 pr-4 rounded-full border border-ink-200 bg-white text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-ink-700 transition"
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sol menü */}
          <aside className="lg:sticky lg:top-6 self-start">
            <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-500 mb-3">
              Kategoriler
            </p>
            <nav className="flex flex-col gap-1">
              <TopicButton
                label="Tüm Rehberler"
                count={guides.length}
                active={activeTopic === "all"}
                onClick={() => setActiveTopic("all")}
              />
              {topics.map((t) => (
                <TopicButton
                  key={t.slug}
                  label={t.label}
                  count={t.count}
                  active={activeTopic === t.slug}
                  onClick={() => setActiveTopic(t.slug)}
                />
              ))}
            </nav>

            {/* Usta CTA */}
            <div className="mt-6 rounded-[16px] bg-accent-700 text-white p-5">
              <p className="text-[16px] font-semibold">Usta mısın?</p>
              <p className="mt-1.5 text-[13px] text-white/80 leading-relaxed">
                Pendik&apos;te seni arayan insanlar doğrudan sana ulaşsın.
                Ücretsiz profil oluştur, komisyon yok.
              </p>
              <Link
                href="/kayit"
                className="mt-4 inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-accent-700 text-[14px] font-medium hover:bg-white/90 transition w-full"
              >
                Ücretsiz profil oluştur
              </Link>
            </div>
          </aside>

          {/* Kartlar */}
          <div>
            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center border border-dashed border-ink-200 rounded-[16px]">
                <p className="text-ink-700 text-[15px]">
                  Aramanla eşleşen rehber bulunamadı.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveTopic("all");
                  }}
                  className="mt-3 text-[14px] text-accent-600 hover:text-accent-700 transition"
                >
                  Filtreleri temizle
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((g) => (
                  <GuideCardItem key={g.slug} guide={g} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-between gap-2 h-10 px-3.5 rounded-[10px] text-[14px] transition text-left ${
        active
          ? "bg-accent-50 text-accent-700 font-medium"
          : "text-ink-700 hover:bg-ink-100"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`text-[12px] tabular-nums ${
          active ? "text-accent-700" : "text-ink-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function GuideCardItem({ guide: g }: { guide: GuideCard }) {
  return (
    <Link
      href={`/rehber/${g.slug}`}
      className="group flex flex-col rounded-[16px] border border-ink-100 bg-white overflow-hidden hover:border-ink-300 hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.18)] transition"
    >
      <div
        className="relative h-44 w-full"
        style={
          g.coverImage
            ? undefined
            : { backgroundImage: `linear-gradient(135deg, ${g.from}, ${g.to})` }
        }
      >
        {g.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={g.coverImage}
            alt={g.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center h-7 px-3 rounded-full bg-white/90 backdrop-blur text-[12px] font-medium text-ink-800">
          {g.topicLabel}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="font-mono text-[12px] text-ink-500">{g.dateLabel}</div>
        <h3 className="mt-2 text-[17px] sm:text-[18px] font-semibold tracking-[-0.01em] leading-snug text-ink-900">
          {g.title}
        </h3>
        <p className="mt-2 text-[14px] text-ink-700 leading-relaxed line-clamp-3">
          {g.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] text-accent-600 group-hover:gap-2.5 transition-all">
          Oku <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
