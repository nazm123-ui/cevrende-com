"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  currentPhotoUrl?: string | null;
  initials: string;
};

export default function ProfilePhotoUpload({
  currentPhotoUrl,
  initials,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentPhotoUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSelect() {
    inputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // aynı dosyayı tekrar seçmek için reset
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya 5 MB'dan büyük olamaz.");
      return;
    }

    // Anlık preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yükleme başarısız.");
        // Eski URL'e geri dön
        setPreviewUrl(currentPhotoUrl ?? null);
        return;
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar dene.");
      setPreviewUrl(currentPhotoUrl ?? null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  }

  async function onRemove() {
    if (!confirm("Profil fotoğrafını kaldırmak istiyor musun?")) return;
    setUploading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/photo", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Silme başarısız.");
        return;
      }
      setPreviewUrl(null);
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-4">
        <div className="relative">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Profil fotoğrafı"
              className="w-20 h-20 rounded-full object-cover border border-ink-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand-50 border border-ink-200 flex items-center justify-center text-ink-900 text-[24px] font-medium tracking-[-0.01em]">
              {initials}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-ink-900/40 flex items-center justify-center">
              <span className="text-white text-[11px] font-medium">
                ...
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onSelect}
            disabled={uploading}
            className="inline-flex items-center h-9 px-4 rounded-full bg-ink-900 text-white text-[13.5px] font-medium border-0 hover:bg-accent-600 transition disabled:opacity-50 cursor-pointer"
          >
            {previewUrl ? "Değiştir" : "Fotoğraf yükle"}
          </button>
          {previewUrl && (
            <button
              type="button"
              onClick={onRemove}
              disabled={uploading}
              className="inline-flex items-center h-9 px-4 rounded-full border border-ink-200 bg-white text-[13px] text-ink-700 hover:border-ink-900 transition disabled:opacity-50 cursor-pointer"
            >
              Kaldır
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      <p className="text-[12px] text-ink-500 leading-snug max-w-[420px]">
        JPG, PNG veya WebP — en fazla 5 MB. Otomatik 512×512 ölçeklenir,
        uygunsuz içerik filtresinden geçer.
      </p>

      {error && (
        <p className="text-[13px] text-red-700 bg-red-50 border border-red-100 rounded-[10px] px-3 py-2 m-0 max-w-[420px]">
          {error}
        </p>
      )}
    </div>
  );
}
