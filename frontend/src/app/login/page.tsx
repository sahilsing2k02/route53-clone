"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("admin@aws-route53.internal");
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F2F3F3] text-[#16191F]">
      {/* Top Simple Header */}
      <div className="bg-[#16191F] py-3 px-6 flex items-center justify-between border-b border-[#232F3E]">
        <div className="flex items-center gap-1 font-black text-[16px]">
          <span className="text-[#FF9900]">AWS</span>
          <span className="text-white text-[13px] font-normal ml-2">Management Console</span>
        </div>
      </div>

      {/* Main Sign In Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2px] shadow-sm w-full max-w-md border border-[#D5DBDB]">
          <div className="mb-6">
            <h1 className="text-[20px] font-bold text-[#16191F] tracking-tight">Sign in</h1>
            <p className="text-[12px] text-[#545B64] mt-1">
              Sign in to Route 53 Management Console (Mock IAM Session)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[12px] font-bold text-[#545B64] uppercase">
                <User size={13} />
                <span>IAM User Name or Email</span>
              </div>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="aws-input"
                placeholder="e.g. aws-admin or user@domain.com"
                required
              />
              <p className="text-[11px] text-[#879196] mt-1">
                Enter your simulated IAM credentials to access the console.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 text-[12px] font-bold text-[#545B64] uppercase">
                <Lock size={13} />
                <span>Password</span>
              </div>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="aws-input"
                placeholder="Password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full aws-btn-primary py-2 text-[14px]"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EAEDED] text-[11px] text-[#879196] space-y-1 text-center">
            <div>Demo Environment • SQLite Database Persistent Mode</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 text-center text-[11px] text-[#879196] border-t border-[#D5DBDB] bg-white">
        <div className="flex justify-center gap-4 mb-1">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Cookie preferences</span>
        </div>
        <div>© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved. (Route 53 Clone)</div>
      </div>
    </div>
  );
}
