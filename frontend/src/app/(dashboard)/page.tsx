"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Activity, GitBranch, Globe2, Plus, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [zoneCount, setZoneCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones`);
      if (res.ok) {
        const data = await res.json();
        setZoneCount(Array.isArray(data) ? data.length : 0);
      }
    } catch {
      setZoneCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchSummary();
    }
  }, [user, fetchSummary]);

  if (!mounted || !user) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* AWS Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Dashboard" }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#16191F] tracking-tight">Route 53 Dashboard</h1>
          <p className="text-[13px] text-[#545B64] mt-0.5">
            Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.
          </p>
        </div>
        <div>
          <Link href="/hosted-zones/create" className="aws-btn-primary">
            <Plus size={14} />
            <span>Create hosted zone</span>
          </Link>
        </div>
      </div>

      {/* Resource Summary Container (AWS Cloudscape Card) */}
      <div className="aws-panel mb-6 overflow-hidden">
        <div className="aws-panel-header">
          <h2 className="text-[14px] font-bold text-[#16191F]">DNS Management & Global Resources</h2>
          <button 
            onClick={fetchSummary} 
            className="text-[12px] text-[#545B64] hover:text-[#16191F] flex items-center gap-1"
            title="Refresh summary"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#EAEDED]">
          {/* Hosted Zones Widget */}
          <div className="pt-4 sm:pt-0 sm:pr-6">
            <div className="flex items-center gap-2 text-[#545B64] text-[12px] font-bold uppercase mb-1">
              <Layers size={14} className="text-[#EC7211]" />
              <span>Hosted zones</span>
            </div>
            <div className="text-[28px] font-bold text-[#16191F] leading-tight my-1">
              {loading ? "-" : zoneCount}
            </div>
            <Link 
              href="/hosted-zones" 
              className="text-[#0073BB] hover:underline text-[12px] font-semibold inline-flex items-center gap-1 mt-1"
            >
              <span>View hosted zones</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          {/* Traffic Policies */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center gap-2 text-[#545B64] text-[12px] font-bold uppercase mb-1">
              <GitBranch size={14} className="text-[#879196]" />
              <span>Traffic policies</span>
            </div>
            <div className="text-[28px] font-bold text-[#16191F] leading-tight my-1">
              0
            </div>
            <Link 
              href="/traffic-policies" 
              className="text-[#0073BB] hover:underline text-[12px] font-semibold inline-flex items-center gap-1 mt-1"
            >
              <span>View policies</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          {/* Health Checks */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center gap-2 text-[#545B64] text-[12px] font-bold uppercase mb-1">
              <Activity size={14} className="text-[#879196]" />
              <span>Health checks</span>
            </div>
            <div className="text-[28px] font-bold text-[#16191F] leading-tight my-1">
              0
            </div>
            <Link 
              href="/health-checks" 
              className="text-[#0073BB] hover:underline text-[12px] font-semibold inline-flex items-center gap-1 mt-1"
            >
              <span>View health checks</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          {/* Resolver Profiles */}
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center gap-2 text-[#545B64] text-[12px] font-bold uppercase mb-1">
              <ShieldCheck size={14} className="text-[#879196]" />
              <span>Resolver Profiles</span>
            </div>
            <div className="text-[28px] font-bold text-[#16191F] leading-tight my-1">
              0
            </div>
            <Link 
              href="/resolver" 
              className="text-[#0073BB] hover:underline text-[12px] font-semibold inline-flex items-center gap-1 mt-1"
            >
              <span>View resolver</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards (AWS Cloudscape Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aws-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe2 size={16} className="text-[#EC7211]" />
              <h3 className="text-[15px] font-bold text-[#16191F]">DNS Routing Management</h3>
            </div>
            <p className="text-[13px] text-[#545B64] leading-relaxed mb-4">
              Create and manage public or private hosted zones to route user requests for your domains to web servers, load balancers, and CDN distributions.
            </p>
          </div>
          <Link href="/hosted-zones" className="aws-btn-secondary w-fit">
            Manage hosted zones
          </Link>
        </div>

        <div className="aws-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch size={16} className="text-[#545B64]" />
              <h3 className="text-[15px] font-bold text-[#16191F]">Traffic Flow Policies</h3>
            </div>
            <p className="text-[13px] text-[#545B64] leading-relaxed mb-4">
              Use visual traffic policies to route traffic based on geolocation, latency, IP networks, and multi-region failover.
            </p>
          </div>
          <Link href="/traffic-policies" className="aws-btn-secondary w-fit">
            Configure traffic policies
          </Link>
        </div>

        <div className="aws-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-[#545B64]" />
              <h3 className="text-[15px] font-bold text-[#16191F]">Availability Monitoring</h3>
            </div>
            <p className="text-[13px] text-[#545B64] leading-relaxed mb-4">
              Configure health checks to monitor web servers, API endpoints, and cloud infrastructure with automatic DNS failover triggers.
            </p>
          </div>
          <Link href="/health-checks" className="aws-btn-secondary w-fit">
            Configure health checks
          </Link>
        </div>
      </div>
    </div>
  );
}
