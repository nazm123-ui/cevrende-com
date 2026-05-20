export const JOB_TYPES = [
  { value: "daily", label: "Günlük" },
  { value: "part_time", label: "Yarı Zamanlı" },
  { value: "full_time", label: "Tam Zamanlı" },
  { value: "seasonal", label: "Sezonluk" },
  { value: "shift", label: "Vardiyalı" },
  { value: "one_time", label: "Tek Seferlik" },
  { value: "event", label: "Etkinlik" },
  { value: "urgent", label: "Acil" },
] as const;

export type JobTypeValue = (typeof JOB_TYPES)[number]["value"];

export const SALARY_TYPES = [
  { value: "hourly", label: "Saatlik" },
  { value: "daily", label: "Günlük" },
  { value: "weekly", label: "Haftalık" },
  { value: "monthly", label: "Aylık" },
  { value: "per_job", label: "İş Bitiminde" },
  { value: "negotiable", label: "Görüşülür" },
  { value: "not_specified", label: "Belirtilmemiş" },
] as const;

export type SalaryTypeValue = (typeof SALARY_TYPES)[number]["value"];

export const JOB_CATEGORIES_SEED = [
  { slug: "garson-servis", name: "Garson / Servis" },
  { slug: "komi", name: "Komi" },
  { slug: "mutfak-yardimcisi", name: "Mutfak Yardımcısı" },
  { slug: "temizlik", name: "Temizlik" },
  { slug: "magaza-personeli", name: "Mağaza Personeli" },
  { slug: "depo-paketleme", name: "Depo / Paketleme" },
  { slug: "tasima-nakliye", name: "Taşıma / Nakliye Yardımı" },
  { slug: "kurye-dagitim", name: "Kurye / Dağıtım" },
  { slug: "etkinlik-personeli", name: "Etkinlik Personeli" },
  { slug: "guvenlik", name: "Güvenlik" },
  { slug: "insaat-tadilat", name: "İnşaat / Tadilat Yardımı" },
  { slug: "bahce-peyzaj", name: "Bahçe / Peyzaj" },
  { slug: "cocuk-bakimi", name: "Çocuk Bakımı" },
  { slug: "yasli-bakimi", name: "Yaşlı Bakımı" },
  { slug: "ev-hizmetleri", name: "Ev Hizmetleri" },
  { slug: "diger", name: "Diğer" },
] as const;
