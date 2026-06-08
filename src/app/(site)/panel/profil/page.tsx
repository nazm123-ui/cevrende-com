import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { getPhoneVisibility } from "@/lib/phone-visibility";
import { parseExperiences } from "@/lib/experience";
import { getPublicUrl } from "@/lib/r2";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata = { title: "Profilim — Cevrende.com" };
export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await requireVerifiedUser();

  const [user, categories] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        district: true,
        neighborhood: true,
        professions: true,
        bio: true,
        workerSettings: true,
        experiences: true,
        isAvailable: true,
        profilePhotoKey: true,
        createdAt: true,
      },
    }),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const settings = (user.workerSettings ?? {}) as {
    showDistrict?: boolean;
  };
  const experiences = parseExperiences(user.experiences);
  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  const profilePhotoUrl = user.profilePhotoKey
    ? getPublicUrl(user.profilePhotoKey)
    : null;

  return (
    <ProfileClient
      user={{
        id: user.id,
        fullName: user.fullName,
        initials,
        email: user.email,
        phone: user.phone,
        district: user.district,
        neighborhood: user.neighborhood,
        professions: user.professions,
        bio: user.bio ?? "",
        profilePhotoUrl,
        createdAt: user.createdAt.toISOString(),
      }}
      stats={{
        professionCount: user.professions.length,
        experienceCount: experiences.length,
      }}
      categories={categories}
      initialFormState={{
        professions: user.professions,
        bio: user.bio ?? "",
        showDistrict: settings.showDistrict ?? false,
        phoneVisibility: getPhoneVisibility(user.workerSettings as never),
        experiences,
      }}
      initialIsAvailable={user.isAvailable}
    />
  );
}
