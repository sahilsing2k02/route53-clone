"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronDown, Search, UserRound, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LOGO_DARK } from "@/components/marketing/content";

/* eslint-disable @next/next/no-img-element */

/**
 * Signed-in global header. Uses the same visual language as the public
 * aws.amazon.com/route53 page (dark utility bar + white primary nav).
 */
export default function Header() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted || !user) return null;

  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* Utility bar */}
      <div className="bg-[#0f141a] text-white">
        <div className="mx-auto flex h-[34px] max-w-[1600px] items-center justify-end gap-6 px-6 text-[12px]">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
            Global
          </span>
          <Link href="/" className="hover:underline">Marketing site</Link>
          <div className="relative" ref={helpRef}>
            <button onClick={() => setHelpOpen(!helpOpen)} className="flex items-center gap-1 hover:underline">
              Support <ChevronDown size={11} />
            </button>
            {helpOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-[12px] bg-white text-[#0f141a] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between border-b border-[#e9ebed] px-4 py-3">
                  <h3 className="text-[14px] font-semibold">Help &amp; Support</h3>
                  <button onClick={() => setHelpOpen(false)} className="text-[#414d5c] hover:text-[#0f141a]"><X size={16} /></button>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <p className="text-[13px] leading-relaxed text-[#414d5c]">Find answers, documentation, and support for your AWS services.</p>
                  <div className="flex items-start gap-2 rounded-[8px] border border-[#0972d3] bg-[#f0fbff] px-3 py-2 text-[12px] font-medium text-[#0972d3]">
                    <div className="mt-0.5 font-bold">i</div>
                    <div>This feature is coming soon in a future update when I get selected for the full-time job at Scalers AI 😁😁</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1 hover:underline">
              {user.name} <span className="hidden text-[#b6bec9] xl:inline">@ 1234-5678-9012</span>
              <ChevronDown size={11} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-[12px] bg-white text-[#0f141a] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="border-b border-[#e9ebed] px-4 py-3">
                  <div className="text-[14px] font-semibold">{user.name}</div>
                  <div className="mt-0.5 font-mono text-[12px] text-[#414d5c]">Account ID: 1234-5678-9012</div>
                  <div className="text-[12px] text-[#414d5c]">IAM: AdministratorAccess</div>
                </div>
                <button
                  onClick={() => { setUserMenuOpen(false); logout(); }}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-[14px] hover:bg-[#f2f3f3]"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
          <UserRound size={20} strokeWidth={1.5} className="rounded-full border border-white p-[2px]" />
        </div>
      </div>

      {/* Primary nav */}
      <div className="border-b border-[#e9ebed] bg-white text-[#0f141a]">
        <div className="mx-auto flex h-[64px] max-w-[1600px] items-center gap-6 px-6">
          <Link href="/dashboard" aria-label="AWS Route 53 home" className="flex items-center">
            <img src={LOGO_DARK} alt="AWS" width={46} height={28} className="h-[28px] w-auto" />
          </Link>
          <div className="relative max-w-xl flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#414d5c]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for services, features, marketplace products, and docs"
              className="w-full rounded-full border border-[#8d99a8] bg-white py-2 pl-10 pr-16 text-[14px] placeholder-[#6b7686] focus:border-[#0972d3] focus:outline-none focus:ring-2 focus:ring-[#0972d3]/30"
            />
            <span onClick={() => searchInputRef.current?.focus()} className="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-md border border-[#c6c6cd] px-1.5 py-0.5 text-[11px] text-[#414d5c] lg:block">
              Alt + S
            </span>
          </div>
          <button onClick={logout} className="ml-auto rounded-full bg-[#0f141a] px-5 py-[9px] text-[14px] font-semibold text-white transition-colors hover:bg-[#2e3a4a]">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
