import ProfileForm, {
  type ProfileFormInitial,
} from "@/components/panel/ProfileForm";

type Props = {
  categories: { slug: string; name: string }[];
  initial: ProfileFormInitial;
};

export default function ProfileSettingsTab({ categories, initial }: Props) {
  return (
    <div style={{ maxWidth: 760 }}>
      <h3 style={{ marginBottom: 8 }}>Profil ayarları</h3>
      <p
        className="text-sm text-muted"
        style={{ marginTop: 0, marginBottom: 24, lineHeight: 1.55 }}
      >
        Mesleklerini, hakkımda metnini, iş deneyimini ve gizlilik tercihlerini buradan düzenle. Bu bilgiler profilinde diğer kullanıcılara gösterilir.
      </p>

      <ProfileForm categories={categories} initial={initial} />
    </div>
  );
}
