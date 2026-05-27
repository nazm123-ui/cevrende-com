import LogoutButton from "@/components/auth/LogoutButton";
import AccountForm from "./AccountForm";
import type { ProfileUser } from "./ProfileClient";

type Props = {
  user: ProfileUser;
};

export default function AccountTab({ user }: Props) {
  return (
    <div style={{ maxWidth: 640 }}>
      <h3 style={{ marginBottom: 8 }}>Hesap bilgileri</h3>
      <p
        className="text-sm text-muted"
        style={{ marginTop: 0, marginBottom: 24, lineHeight: 1.55 }}
      >
        Ad ve mahalle bilgini buradan güncelleyebilirsin. E-posta ve telefon değişiklikleri için destekle iletişime geç.
      </p>

      <AccountForm
        initial={{
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          district: user.district,
          neighborhood: user.neighborhood ?? "",
        }}
      />

      <div className="divider" style={{ margin: "40px 0 32px" }} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <LogoutButton className="btn btn-secondary" />
      </div>
    </div>
  );
}
