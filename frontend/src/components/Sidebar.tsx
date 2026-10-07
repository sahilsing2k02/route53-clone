"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Hosted zones", href: "/hosted-zones" },
  { name: "Health checks", href: "/health-checks" },
  { name: "Traffic policies", href: "/traffic-policies" },
  { name: "Resolver", href: "/resolver" },
  { name: "Profiles", href: "/profiles" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#D5DBDB] h-[calc(100vh-40px)] overflow-y-auto sticky top-[40px]">
      <div className="p-4 border-b border-[#D5DBDB] bg-[#FAFAFA]">
        <h2 className="font-bold text-[15px] text-[#16191F]">Route 53</h2>
      </div>
      <nav className="py-2">
        <div className="px-6 py-2 text-xs font-bold text-[#879196] uppercase tracking-wider">
          Dashboard
        </div>
        <ul className="mb-2">
          <li>
            <Link
              href="/"
              className={`block px-6 py-1.5 text-[13px] border-l-4 transition-colors ${
                pathname === "/"
                  ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                  : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
              }`}
            >
              Dashboard
            </Link>
          </li>
        </ul>
        
        <div className="px-6 py-2 text-xs font-bold text-[#879196] uppercase tracking-wider border-t border-[#F2F3F3] mt-2 pt-4">
          DNS management
        </div>
        <ul className="mb-2">
          {navigation.slice(1).map((item) => {
            const isActive = item.href !== "/" && pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-6 py-1.5 text-[13px] border-l-4 transition-colors ${
                    isActive
                      ? "border-[#EC7211] bg-[#F2F3F3] font-bold text-[#16191F]"
                      : "border-transparent text-[#545B64] hover:text-[#16191F] hover:bg-[#FAFAFA]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
