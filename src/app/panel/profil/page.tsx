import { requireVerifiedUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import ProfileForm, { type ProfileFormInitial } from "@/components/panel/ProfileForm";
import { getPhoneVisibility, type WorkerSettings } from "@/lib/phone-visibility";

export const metadata = { title: "Profilim — Cevrende.com" };

export default async function ProfilPage() {
  const session = await requireVerifiedUser();

  const [user, categories] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.id },
      select: {
        professions: true,
        bio: true,
        neighborhood: true,
        workerSettings: true,
      },
    }),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const settings = (user.workerSettings ?? {}) as WorkerSettings;

  const initial: ProfileFormInitial = {
    professions: user.professions,
    bio: user.bio ?? "",
    neighborhood: user.neighborhood ?? "",
    showName: settings.showName ?? false,
    showDistrict: settings.showDistrict ?? true,
    phoneVisibility: getPhoneVisibility(settings),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
        Profilim
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        İşverenler seni bu bilgilerle bulacak. Numaranı paylaşmak zorunda
        değilsin — platform üzerinden mesajlaşabilirsin.
      </p>

      <div className="mt-6">
        <ProfileForm categories={categories} initial={initial} />
      </div>
    </div>
  );
}
