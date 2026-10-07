"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#16191F]">Route 53 Dashboard</h1>
        <p className="text-[#545B64] mt-1">Manage your domain names and routing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="aws-panel p-6">
          <h2 className="text-lg font-bold text-[#16191F] mb-2">Hosted zones</h2>
          <p className="text-sm text-[#545B64] mb-4">
            Route traffic to your domain by creating a hosted zone.
          </p>
          <Link href="/hosted-zones" className="aws-btn-secondary inline-block">
            View hosted zones
          </Link>
        </div>
        
        <div className="aws-panel p-6 opacity-60">
          <h2 className="text-lg font-bold text-[#16191F] mb-2">Health checks</h2>
          <p className="text-sm text-[#545B64] mb-4">
            Monitor the health and performance of your web applications. (Coming Soon)
          </p>
        </div>

        <div className="aws-panel p-6 opacity-60">
          <h2 className="text-lg font-bold text-[#16191F] mb-2">Traffic policies</h2>
          <p className="text-sm text-[#545B64] mb-4">
            Route traffic based on multiple criteria. (Coming Soon)
          </p>
        </div>

        <div className="aws-panel p-6 opacity-60">
          <h2 className="text-lg font-bold text-[#16191F] mb-2">Resolver</h2>
          <p className="text-sm text-[#545B64] mb-4">
            Respond to DNS queries for your VPC. (Coming Soon)
          </p>
        </div>

        <div className="aws-panel p-6 opacity-60">
          <h2 className="text-lg font-bold text-[#16191F] mb-2">Profiles</h2>
          <p className="text-sm text-[#545B64] mb-4">
            Share DNS settings across VPCs and AWS accounts. (Coming Soon)
          </p>
        </div>
      </div>
    </div>
  );
}
