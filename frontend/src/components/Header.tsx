"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <header className="h-[40px] bg-gradient-to-r from-[#232F3E] to-[#16191F] text-white flex items-center justify-between px-4 text-[13px] sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold tracking-tight flex items-center gap-1 hover:opacity-80 transition-opacity">
          <span className="text-[#f99237] text-lg leading-none mt-[-2px]">AWS</span>
        </Link>
      </div>

      {user && (
        <div className="flex-1 max-w-xl px-8 hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for services, features, blogs, docs, and more"
              className="w-full bg-[#16191F] border border-[#545B64] rounded-[2px] py-1 px-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white focus:text-black focus:border-[#0073BB] transition-colors"
            />
            <div className="absolute right-2 top-1.5 text-gray-400 text-xs border border-gray-500 rounded px-1 hidden lg:block">Alt + S</div>
          </div>
        </div>
      )}
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer transition-colors px-2 py-1 border border-transparent hover:border-gray-500 rounded-[2px]">
            <span>Global</span>
            <span className="text-[10px] ml-1">▼</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors px-2 py-1 border border-transparent hover:border-gray-500 rounded-[2px]">
            <User size={14} />
            <span>{user.name}</span>
            <span className="text-[10px] ml-1">▼</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors px-2 py-1 border border-transparent hover:border-gray-500 rounded-[2px]"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}
