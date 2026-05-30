import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { getConversations } from "@/lib/messages";
import { getPhoneVisibility } from "@/lib/phone-visibility";
import { parseExperiences } from "@/lib/experience";
import { getPublicUrl } from "@/lib/r2";
import { getDistrictByName } from "@/lib/districts";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata = { title: "Profilim — Cevrende.com" };
export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await requireVerifiedUser();

  const [user, categories, conversations, savedRows] = await Promise.all([
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
    getConversations(session.id),
    prisma.savedProfile.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      select: {
        savedUser: {
          select: {
            id: true,
            fullName: true,
            professions: true,
          },
        },
      },
    }),
  ]);

  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const savedProfiles = savedRows.map((r) => {
    const initials = r.savedUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
    return {
      id: r.savedUser.id,
      fullName: r.savedUser.fullName,
      initials,
      professionNames: r.savedUser.professions
        .map((s) => categoryNameBySlug.get(s) ?? s)
        .slice(0, 3),
    };
  });

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

  const recentConvos = conversations.slice(0, 3).map((c) => ({
    otherUserId: c.otherUserId,
    name: c.otherUserName,
    initials: c.otherUserName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join(""),
    lastMessage: c.lastMessage,
    lastMessageAt: c.lastMessageAt.toISOString(),
    unread: c.unreadCount,
  }));

  const profilePhotoUrl = user.profilePhotoKey
    ? getPublicUrl(user.profilePhotoKey)
    : null;

  const district = await getDistrictByName(user.district);
  const neighborhoods = district?.neighborhoods ?? [];

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
      recentConversations={recentConvos}
      savedProfiles={savedProfiles}
      categories={categories}
      initialFormState={{
        professions: user.professions,
        bio: user.bio ?? "",
        showDistrict: settings.showDistrict ?? false,
        phoneVisibility: getPhoneVisibility(user.workerSettings as never),
        experiences,
      }}
      initialIsAvailable={user.isAvailable}
      neighborhoods={neighborhoods}
    />
  );
}
