import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "infocevrende@gmail.com";
  const password = "demo1234";
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isPhoneVerified: true,
      isEmailVerified: true,
      isActive: true,
    },
    create: {
      fullName: "Cevrende Admin",
      email,
      phone: "05000000000",
      passwordHash,
      city: "İstanbul",
      district: "Pendik",
      isPhoneVerified: true,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`✓ Admin hazır: ${result.email} (id: ${result.id})`);
  console.log(`  Şifre: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
