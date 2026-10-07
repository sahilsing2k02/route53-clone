import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingBody from "@/components/marketing/MarketingBody";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Amazon Route 53 - DNS Service - AWS",
  description:
    "Amazon Route 53 is a highly available and scalable cloud domain name system (DNS) service. Enables to customize DNS routing policies to reduce latency.",
};

export default function LandingPage() {
  return (
    <div className="marketing-site min-h-screen bg-white text-[16px] leading-normal">
      <MarketingHeader />
      <MarketingBody />
      <MarketingFooter />
    </div>
  );
}
