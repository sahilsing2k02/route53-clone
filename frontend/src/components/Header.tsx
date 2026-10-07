"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Globe, Bell, HelpCircle, Terminal, ChevronDown, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const regionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (regionMenuRef.current && !regionMenuRef.current.contains(e.target as Node)) {
        setRegionMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!mounted || !user) return null;

  return (
    <header className="h-[40px] bg-[#16191F] text-white flex items-center justify-between px-3 text-[12px] sticky top-0 z-50 select-none border-b border-[#232F3E]">
      {/* Left: AWS Logo & Services */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1.5 hover:opacity-90 transition-opacity py-1 px-1">
          {/* AWS Logo */}
          <div className="flex items-center font-black text-[15px] tracking-tight">
            <span className="text-[#FF9900]">AWS</span>
          </div>
        </Link>
        <div className="h-4 w-[1px] bg-[#545B64] hidden sm:block"></div>
        <Link 
          href="/" 
          className="text-white hover:text-[#FF9900] font-semibold text-[13px] hidden sm:flex items-center gap-1"
        >
          <span>Route 53</span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search for services, features, marketplace products, and docs"
            className="w-full bg-[#232F3E] border border-[#545B64] rounded-[2px] py-1 pl-8 pr-16 text-white text-[12px] placeholder-[#879196] focus:outline-none focus:bg-white focus:text-[#16191F] focus:placeholder-[#545B64] focus:border-[#0073BB] transition-colors"
          />
          <div className="absolute left-2.5 top-1.5 text-[#879196] pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
          <div 
            className="absolute right-1.5 top-1 text-[#879196] text-[10px] border border-[#545B64] rounded px-1.5 py-0.5 cursor-pointer hover:border-gray-400 hidden lg:block"
            onClick={() => searchInputRef.current?.focus()}
          >
            Alt + S
          </div>
        </div>
      </div>
      
      {/* Right Tools & Context */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* CloudShell */}
        <button 
          className="p-1.5 text-[#D5DBDB] hover:text-white hover:bg-[#232F3E] rounded-[2px] transition-colors"
          title="CloudShell"
        >
          <Terminal size={15} />
        </button>

        {/* Notifications */}
        <button 
          className="p-1.5 text-[#D5DBDB] hover:text-white hover:bg-[#232F3E] rounded-[2px] transition-colors relative"
          title="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#EC7211] rounded-full"></span>
        </button>

        {/* Help */}
        <button 
          className="p-1.5 text-[#D5DBDB] hover:text-white hover:bg-[#232F3E] rounded-[2px] transition-colors"
          title="Help and Support"
        >
          <HelpCircle size={15} />
        </button>

        <div className="h-4 w-[1px] bg-[#545B64] mx-1"></div>

        {/* Region Selector (Global for Route 53) */}
        <div className="relative" ref={regionMenuRef}>
          <button
            onClick={() => setRegionMenuOpen(!regionMenuOpen)}
            className="flex items-center gap-1.5 text-[#D5DBDB] hover:text-white hover:bg-[#232F3E] px-2 py-1 rounded-[2px] transition-colors cursor-pointer"
          >
            <Globe size={13} className="text-[#879196]" />
            <span className="font-semibold text-[12px]">Global</span>
            <ChevronDown size={11} className="text-[#879196]" />
          </button>

          {regionMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#16191F] border border-[#545B64] shadow-xl rounded-[2px] z-50 text-[12px] py-1 text-[#D5DBDB]">
              <div className="px-3 py-2 border-b border-[#232F3E] text-[#879196] text-[11px] font-bold uppercase">
                Service Scope
              </div>
              <div className="px-3 py-2 flex items-center justify-between text-white bg-[#232F3E]">
                <span>Global (Route 53 does not require region selection)</span>
                <Check size={14} className="text-[#EC7211]" />
              </div>
            </div>
          )}
        </div>

        {/* User / Account Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 text-[#D5DBDB] hover:text-white hover:bg-[#232F3E] px-2 py-1 rounded-[2px] transition-colors cursor-pointer"
          >
            <User size={13} className="text-[#879196]" />
            <span className="font-semibold text-[12px]">{user.name}</span>
            <span className="text-[#879196] text-[11px] hidden xl:inline">@ 1234-5678-9012</span>
            <ChevronDown size={11} className="text-[#879196]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#16191F] border border-[#545B64] shadow-xl rounded-[2px] z-50 text-[12px] text-[#D5DBDB] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#232F3E] bg-[#232F3E]">
                <div className="font-bold text-white text-[13px]">{user.name}</div>
                <div className="text-[11px] text-[#879196] font-mono mt-0.5">Account ID: 1234-5678-9012</div>
                <div className="text-[11px] text-[#879196]">IAM: AdministratorAccess</div>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#232F3E] text-[#D5DBDB] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut size={13} className="text-[#EC7211]" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
