"use client";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";

export default function ComingSoon({ title, description }: { title: string, description?: string }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#16191F]">{title}</h1>
      </div>
      
      <div className="aws-panel p-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#F2F3F3] rounded-full flex items-center justify-center mb-6 border border-[#D5DBDB]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#545B64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#16191F] mb-3">{title}</h2>
        <p className="text-[#545B64] text-[14px] max-w-lg mb-8 leading-relaxed">
          {description || "This feature is currently under development and will be available in a future update."}
        </p>
        <div className="flex gap-4">
          <Link href="/" className="aws-btn-secondary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
