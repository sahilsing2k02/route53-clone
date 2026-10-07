import Header from "@/components/Header";
import ConsoleSubNav from "@/components/ConsoleSubNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(180deg,#a9f1f8_0%,#d2f8fb_50%,#ffffff_100%)]" />
      <Header />
      <Suspense fallback={null}>
        <ConsoleSubNav />
      </Suspense>
      <main className="relative mx-auto w-full max-w-[1280px] flex-1 px-6 pb-16 pt-4 md:px-10">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
