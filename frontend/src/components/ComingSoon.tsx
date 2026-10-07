"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Construction, ArrowLeft } from "lucide-react";

export default function ComingSoon({ 
  title, 
  description 
}: { 
  title: string; 
  description?: string;
}) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* AWS Breadcrumbs */}
      <Breadcrumbs items={[{ label: title }]} />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#16191F] tracking-tight">{title}</h1>
        <p className="text-[13px] text-[#545B64] mt-0.5">
          Amazon Route 53 service feature
        </p>
      </div>
      
      {/* Cloudscape Feature Placeholder Container */}
      <div className="aws-panel p-10 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-[#F2F3F3] rounded-full flex items-center justify-center mb-4 border border-[#D5DBDB] text-[#545B64]">
          <Construction size={24} className="text-[#EC7211]" />
        </div>
        
        <h2 className="text-[16px] font-bold text-[#16191F] mb-2">{title} is in Development</h2>
        
        <p className="text-[#545B64] text-[13px] max-w-lg mb-6 leading-relaxed">
          {description || "This Route 53 feature is currently in preview and will be available in an upcoming service update. You can continue managing your Hosted Zones and DNS records."}
        </p>
        
        <div className="flex gap-3">
          <Link href="/hosted-zones" className="aws-btn-primary">
            <span>Go to Hosted zones</span>
          </Link>
          <Link href="/dashboard" className="aws-btn-secondary">
            <ArrowLeft size={13} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
