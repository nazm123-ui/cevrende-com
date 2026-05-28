"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { formatPhone } from "@/lib/format";

interface Props {
  workerId: string;
  workerPhone: string;
  showFullPhone: boolean;
  canContact: boolean;
  isSelf: boolean;
  initialSaved?: boolean;
}

const cardCls =
  "p-6 bg-white border border-ink-100 rounded-[14px] shadow-[0_1px_0_rgba(15,17,16,0.02),0_8px_24px_-12px_rgba(15,17,16,0.10)]";

const btnBase =
  "inline-flex items-center justify-center gap-2 w-full h-12 px-[22px] rounded-full text-[15px] font-medium tracking-[-0.005em] whitespace-nowrap cursor-pointer no-underline border border-transparent transition";

const btnPrimary = `${btnBase} bg-ink-900 text-white border-ink-900 hover:bg-ink-800`;
const btnAccent = `${btnBase} bg-accent-600 text-white border-accent-600 hover:bg-accent-700`;
const btnSecondary = `${btnBase} bg-transparent text-ink-900 border-ink-200 hover:border-ink-900`;

export default function WorkerContactCard({
  workerId,
  workerPhone,
  showFullPhone,
  canContact,
  isSelf,
  initialSaved = false,
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [savingBusy, setSavingBusy] = useState(false);

  async function toggleSaved() {
    if (savingBusy) return;
    const next = !saved;
    setSaved(next);
    setSavingBusy(true);
    try {
      const res = await fetch("/api/saved-profiles", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedUserId: workerId }),
      });
      if (!res.ok) {
        setSaved(!next);
      }
    } catch {
      setSaved(!next);
    } finally {
      setSavingBusy(false);
    }
  }

  if (isSelf) {
    return (
      <div className={cardCls}>
        <div className="eyebrow mb-3">Bu profil sana ait</div>
        <Link href="/panel/profil" className={btnPrimary}>
          Profilini düzenle
        </Link>
      </div>
    );
  }

  return (
    <div className={cardCls}>
      <div className="eyebrow mb-3">İletişim</div>

      {showFullPhone ? (
        <>
          <div className="flex items-center gap-2 text-ink-900">
            <Icon name="phone" size={16} />
            <span className="font-mono text-[16px] tracking-[0.02em]">
              {formatPhone(workerPhone)}
            </span>
          </div>
          <a
            href={`tel:${workerPhone.replace(/\s/g, "")}`}
            className={`${btnAccent} mt-[18px]`}
          >
            Şimdi ara
          </a>
          {canContact && (
            <button
              onClick={() => router.push(`/panel/mesajlar/${workerId}`)}
              className={`${btnSecondary} mt-2`}
            >
              Mesaj gönder
            </button>
          )}
          {!canContact && (
            <Link href="/kayit" className={`${btnSecondary} mt-2`}>
              Mesaj göndermek için kayıt ol
            </Link>
          )}
        </>
      ) : (
        <>
          {canContact ? (
            <button
              onClick={() => router.push(`/panel/mesajlar/${workerId}`)}
              className={btnPrimary}
            >
              Mesaj gönder
            </button>
          ) : (
            <Link href="/kayit" className={btnPrimary}>
              Ücretsiz kayıt — mesajlaş
            </Link>
          )}
          <p className="mt-3 text-[12.5px] leading-[1.5] text-ink-500">
            Bu profil sadece platform içi mesajlaşma kabul ediyor. Telefon,
            profil sahibinin tercihiyle paylaşılmıyor.
          </p>
        </>
      )}

      {canContact && (
        <>
          <div className="divider my-5" />
          <button
            onClick={toggleSaved}
            disabled={savingBusy}
            className={`w-full bg-transparent border-0 p-2 font-[inherit] inline-flex items-center justify-center gap-2 text-[14px] transition ${
              saved ? "text-accent-600" : "text-ink-500 hover:text-ink-900"
            } ${savingBusy ? "cursor-wait" : "cursor-pointer"}`}
          >
            <Icon name={saved ? "bookmark-filled" : "bookmark"} size={15} />
            {saved ? "Kaydedildi" : "Profili kaydet"}
          </button>
        </>
      )}
    </div>
  );
}
