"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Hosted zones", href: "/hosted-zones" },
  { label: "Traffic policies", href: "/traffic-policies" },
  { label: "Health checks", href: "/health-checks" },
  { label: "Resolver", href: "/resolver" },
  { label: "Profiles", href: "/profiles" },
];

/** Floating "Amazon Route 53 | ..." pill used on aws.amazon.com/route53, now the console nav. */
export default function ConsoleSubNav() {
  const pathname = usePathname();
  return (
    <div className="pointer-events-none sticky top-[100px] z-40">
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-3 md:px-10">
        <div className="pointer-events-auto flex h-[54px] items-center overflow-x-auto rounded-[14px] bg-white px-7 shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
          <span className="mr-10 shrink-0 text-[15px] font-semibold">Amazon Route 53</span>
          <nav className="flex h-full items-stretch gap-7 text-[14px]" aria-label="Route 53 console">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex shrink-0 items-center border-b-[3px] ${active ? "border-[#0f141a] font-semibold" : "border-transparent font-medium"} hover:border-[#0f141a]`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
