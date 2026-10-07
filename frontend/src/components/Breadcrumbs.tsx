"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [
    { label: "Route 53", href: "/dashboard" },
    ...items,
  ];

  return (
    <nav className="flex items-center text-[12px] text-[#414d5c] mb-3 select-none" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1.5 list-none p-0 m-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              {index > 0 && (
                <ChevronRight size={12} className="text-[#879196] flex-shrink-0" />
              )}
              {isLast || !item.href ? (
                <span className="text-[#0f141a] font-semibold">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#0972d3] hover:underline hover:text-[#033160] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
