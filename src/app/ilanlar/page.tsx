import { Suspense } from "react";
import ListingsClient from "@/components/listings/ListingsClient";

export const metadata = {
  title: "İşçi Arama | Cevrende",
  description: "Pendik ve çevresindeki işçileri meslek ve bölgeyle filtrele.",
};

export default async function IlanlariPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">Yükleniyor...</div>}>
        <ListingsClient />
      </Suspense>
    </>
  );
}
