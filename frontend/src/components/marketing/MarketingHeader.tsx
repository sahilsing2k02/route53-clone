"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Search, UserRound } from "lucide-react";
import { LOGO_DARK, NAV_ITEMS } from "./content";

/* eslint-disable @next/next/no-img-element */

const UTILITY = [
  { label: "English", chevron: true },
  { label: "Contact us" },
  { label: "AWS Marketplace" },
  { label: "Support", chevron: true },
  { label: "My account", chevron: true },
];

export default function MarketingHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const active = NAV_ITEMS.find((n) => n.name === open)?.menu;

  return (
    <header id="marketing-header" className="sticky top-0 z-50 w-full" onMouseLeave={() => setOpen(null)}>
      {/* Utility bar */}
      <div className="hidden md:block bg-[#0f141a] text-white">
        <div className="mx-auto flex h-[34px] max-w-[1600px] items-center justify-end gap-6 px-6 text-[12px]">
          {UTILITY.map((u) => (
            <button key={u.label} className="flex items-center gap-1 hover:underline">
              {u.label === "English" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
              )}
              {u.label}
              {u.chevron && <ChevronDown size={11} />}
            </button>
          ))}
          <UserRound size={20} strokeWidth={1.5} className="rounded-full border border-white p-[2px]" />
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-[#e9ebed] bg-white text-[#0f141a]">
        <div className="mx-auto flex h-[64px] max-w-[1600px] items-center px-4 sm:px-6">
          <Link href="/" className="mr-5 flex items-center shrink-0" aria-label="AWS home">
            <img src={LOGO_DARK} alt="AWS" width={46} height={28} className="h-[24px] sm:h-[28px] w-auto shrink-0" />
          </Link>
          <nav className="hidden lg:flex h-full items-center shrink-0" aria-label="Primary">
            {NAV_ITEMS.map((item, i) => (
              <div key={item.name} className="flex h-full items-center">
                {i === 1 && <span className="mx-3 h-[22px] w-px bg-[#c6c6cd]" />}
                <button
                  onMouseEnter={() => setOpen(item.menu ? item.name : null)}
                  onClick={() => setOpen(open === item.name ? null : item.menu ? item.name : null)}
                  className={`relative flex h-full items-center px-3 text-[14px] ${item.featured ? "font-semibold text-[#7300e5]" : "font-medium"} hover:text-[#0972d3]`}
                >
                  {item.name}
                  {open === item.name && <span className="absolute inset-x-3 bottom-0 h-[3px] bg-[#0f141a]" />}
                </button>
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 sm:gap-5 text-[13px] sm:text-[14px] font-medium shrink-0">
            <button className="hidden sm:flex items-center gap-2 hover:text-[#0972d3]"><Search size={16} /> Search</button>
            <Link href="/login" id="nav-signin" className="hover:text-[#0972d3] hidden sm:block">Sign in to console</Link>
            <Link href="/login" id="nav-create-account" className="rounded-full bg-[#0f141a] px-4 sm:px-5 py-[7px] sm:py-[9px] text-[13px] sm:text-[14px] font-semibold text-white transition-colors hover:bg-[#2e3a4a]">
              Create account
            </Link>
          </div>
        </div>

        {/* Mega-menu panel */}
        {active && (
          <div className="absolute left-0 top-full w-full border-t border-[#e9ebed] bg-white shadow-[0_20px_30px_rgba(0,0,0,0.12)]">
            <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_2fr] gap-12 px-10 py-9">
              <div>
                <h3 className="mb-2 text-[20px] font-semibold">{active.heading}</h3>
                <p className="text-[14px] leading-relaxed text-[#414d5c]">{active.blurb}</p>
                {active.cta && <a className="mt-4 inline-block text-[14px] font-semibold text-[#0972d3] hover:underline" href="#">{active.cta}</a>}
              </div>
              <ul className="grid grid-cols-2 gap-x-10 gap-y-4">
                {active.links.map((l) => (
                  <li key={l.label}>
                    <a href="#" className="block text-[14px] font-semibold hover:text-[#0972d3] hover:underline">{l.label}</a>
                    {l.description && <p className="mt-0.5 text-[13px] text-[#414d5c]">{l.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
