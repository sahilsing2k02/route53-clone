"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* eslint-disable @next/next/no-img-element */
import { LOGO_DARK } from "@/components/marketing/content";

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
    <div className="relative flex min-h-screen flex-col bg-white text-[#0f141a]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(180deg,#a9f1f8_0%,#d2f8fb_50%,#ffffff_100%)]" />

      <header className="relative z-10 flex h-[64px] items-center justify-between px-8">
        <Link href="/" aria-label="AWS home"><img src={LOGO_DARK} alt="AWS" className="h-[30px] w-auto" /></Link>
        <Link href="/" className="text-[14px] font-medium hover:underline">Back to Route 53 overview</Link>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[440px] rounded-[24px] bg-white p-10 shadow-[0_6px_30px_rgba(15,20,26,0.18)]">
          <h1 className="text-[28px] font-medium leading-tight">Sign in</h1>
          <p className="mt-2 text-[14px] text-[#414d5c]">
            Sign in to the Amazon Route 53 console (mock IAM session)
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[14px] font-semibold">IAM user name or email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="aws-input"
                placeholder="e.g. aws-admin or user@domain.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[14px] font-semibold">Password</label>
              <input id="password" type="password" defaultValue="••••••••••••" className="aws-input" placeholder="Password" />
            </div>

            <button type="submit" id="login-submit" className="aws-btn-primary w-full py-[11px] text-[15px]">
              Sign in
            </button>
          </form>

          <p className="mt-6 border-t border-[#e9ebed] pt-4 text-center text-[12px] text-[#414d5c]">
            Demo environment • SQLite persistent mode
          </p>
        </div>
      </div>

      <footer className="relative z-10 px-6 py-5 text-center text-[12px] text-[#414d5c]">
        © 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved. (Route 53 Clone)
      </footer>
    </div>
  );
}
