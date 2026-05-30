import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";

// Teşhis amaçlı: env değişkenlerinin SET olup olmadığını döner (değer dönmez).
// Sadece admin erişebilir.
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  function status(name: string) {
    const v = process.env[name];
    return {
      set: !!v,
      length: v?.length ?? 0,
      preview: v ? `${v.slice(0, 6)}…${v.slice(-3)}` : null,
    };
  }

  return NextResponse.json({
    R2_ACCOUNT_ID: status("R2_ACCOUNT_ID"),
    R2_ACCESS_KEY_ID: status("R2_ACCESS_KEY_ID"),
    R2_SECRET_ACCESS_KEY: status("R2_SECRET_ACCESS_KEY"),
    R2_BUCKET_NAME: status("R2_BUCKET_NAME"),
    R2_PUBLIC_URL: status("R2_PUBLIC_URL"),
    CF_API_TOKEN: status("CF_API_TOKEN"),
    CF_ACCOUNT_ID: status("CF_ACCOUNT_ID"),
    NODE_ENV: process.env.NODE_ENV,
  });
}
