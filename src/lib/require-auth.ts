import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  return user;
}

export async function requireVerifiedUser() {
  const user = await requireUser();
  if (!user.isEmailVerified) {
    redirect(`/dogrulama?userId=${user.id}`);
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) redirect("/");
  return user;
}

// API route helper: redirect yerine JSON yanıt döner.
export type ApiAuthResult =
  | { ok: true; user: CurrentUser }
  | { ok: false; response: NextResponse };

export async function requireVerifiedUserApi(): Promise<ApiAuthResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Giriş yapmanız gerekiyor." },
        { status: 401 },
      ),
    };
  }
  if (!user.isEmailVerified) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "E-posta doğrulaması gerekiyor." },
        { status: 403 },
      ),
    };
  }
  return { ok: true, user };
}
