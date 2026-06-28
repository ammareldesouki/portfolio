import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavBar />
      <main className="relative pt-20">{children}</main>
      <Footer />
    </>
  );
}
