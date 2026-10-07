"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { 
  Globe2, 
  Menu, 
  ChevronLeft, 
  LayoutDashboard, 
  Layers, 
  Activity, 
  GitBranch, 
  ShieldCheck, 
  Users 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  if (collapsed) {
    return (
      <aside className="w-[48px] flex-shrink-0 bg-white border-r border-[#D5DBDB] h-[calc(100vh-40px)] sticky top-[40px] flex flex-col items-center py-2 select-none z-30 transition-all">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 text-[#545B64] hover:text-[#16191F] hover:bg-[#F2F3F3] rounded-[2px] transition-colors"
          title="Expand navigation"
        >
          <Menu size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-[230px] flex-shrink-0 bg-white border-r border-[#D5DBDB] h-[calc(100vh-40px)] overflow-y-auto sticky top-[40px] select-none z-30 flex flex-col justify-between transition-all">
      <div>
        {/* Service Header */}
        <div className="px-4 py-3 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 size={16} className="text-[#EC7211]" />
            <h2 className="font-bold text-[14px] text-[#16191F] tracking-tight">Route 53</h2>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 text-[#879196] hover:text-[#16191F] hover:bg-[#EAEDED] rounded-[2px] transition-colors"
            title="Collapse navigation"
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="py-2 text-[13px]">
          {/* Dashboard */}
          <div className="mb-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 border-l-[3px] transition-colors ${
                pathname === "/dashboard"
                  ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                  : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
              }`}
            >
              <LayoutDashboard size={14} className="text-[#879196]" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* DNS management */}
          <div className="mt-3">
            <div className="px-4 py-1 text-[11px] font-bold text-[#545B64] uppercase tracking-wider">
              DNS management
            </div>
            <ul className="mt-0.5 space-y-0.5">
              <li>
                <Link
                  href="/hosted-zones"
                  className={`flex items-center gap-2 px-4 py-2 border-l-[3px] transition-colors ${
                    pathname.startsWith("/hosted-zones")
                      ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                      : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <Layers size={14} className={pathname.startsWith("/hosted-zones") ? "text-[#EC7211]" : "text-[#879196]"} />
                  <span>Hosted zones</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Traffic management */}
          <div className="mt-3">
            <div className="px-4 py-1 text-[11px] font-bold text-[#545B64] uppercase tracking-wider">
              Traffic management
            </div>
            <ul className="mt-0.5 space-y-0.5">
              <li>
                <Link
                  href="/traffic-policies"
                  className={`flex items-center gap-2 px-4 py-2 border-l-[3px] transition-colors ${
                    pathname.startsWith("/traffic-policies")
                      ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                      : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <GitBranch size={14} className="text-[#879196]" />
                  <span>Traffic policies</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Availability monitoring */}
          <div className="mt-3">
            <div className="px-4 py-1 text-[11px] font-bold text-[#545B64] uppercase tracking-wider">
              Availability monitoring
            </div>
            <ul className="mt-0.5 space-y-0.5">
              <li>
                <Link
                  href="/health-checks"
                  className={`flex items-center gap-2 px-4 py-2 border-l-[3px] transition-colors ${
                    pathname.startsWith("/health-checks")
                      ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                      : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <Activity size={14} className="text-[#879196]" />
                  <span>Health checks</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* DNS Firewall & Resolver */}
          <div className="mt-3">
            <div className="px-4 py-1 text-[11px] font-bold text-[#545B64] uppercase tracking-wider">
              Resolver & Profiles
            </div>
            <ul className="mt-0.5 space-y-0.5">
              <li>
                <Link
                  href="/resolver"
                  className={`flex items-center gap-2 px-4 py-2 border-l-[3px] transition-colors ${
                    pathname.startsWith("/resolver")
                      ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                      : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <ShieldCheck size={14} className="text-[#879196]" />
                  <span>Resolver</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profiles"
                  className={`flex items-center gap-2 px-4 py-2 border-l-[3px] transition-colors ${
                    pathname.startsWith("/profiles")
                      ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                      : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <Users size={14} className="text-[#879196]" />
                  <span>Profiles</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#D5DBDB] bg-[#FAFAFA] text-[11px] text-[#879196]">
        <div>Route 53 Global Console</div>
        <div className="text-[10px]">API: v2013-04-01</div>
      </div>
    </aside>
  );
}
