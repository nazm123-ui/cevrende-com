// Run: npx tsx scripts/seed-districts.ts
import { PrismaClient } from "@prisma/client";
import { ISTANBUL_DISTRICTS } from "../src/lib/seed/istanbul-districts";

const prisma = new PrismaClient();

async function main() {
  let created = 0;
  let updated = 0;
  for (const d of ISTANBUL_DISTRICTS) {
    const existing = await prisma.district.findUnique({ where: { slug: d.slug } });
    if (existing) {
      // Sadece mahalle listesi ve order güncelle; isEnabled admin'in kararı olduğu için
      // dokunma (eğer admin daha önce Tuzla'yı açtıysa açık kalmalı).
      await prisma.district.update({
        where: { slug: d.slug },
        data: {
          name: d.name,
          order: d.order,
          neighborhoods: d.neighborhoods,
        },
      });
      updated++;
    } else {
      await prisma.district.create({
        data: {
          slug: d.slug,
          name: d.name,
          isEnabled: d.isEnabled,
          order: d.order,
          neighborhoods: d.neighborhoods,
        },
      });
      created++;
    }
  }
  const all = await prisma.district.count();
  const enabled = await prisma.district.count({ where: { isEnabled: true } });
  console.log(`✅ Seed tamamlandı.`);
  console.log(`   Yeni: ${created} / Güncellenen: ${updated}`);
  console.log(`   Toplam ilçe: ${all} (aktif: ${enabled})`);
}

main()
  .catch((err) => {
    console.error("❌ Seed başarısız:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
