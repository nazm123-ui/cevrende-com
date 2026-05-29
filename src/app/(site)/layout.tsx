import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 min-w-0 w-full">{children}</main>
      <Footer />
      <HeartbeatProvider enabled={!!user} />
    </div>
  );
}
