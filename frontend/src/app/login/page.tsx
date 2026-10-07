"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F3F3]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-[#D5DBDB]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#16191F]">Sign in</h1>
          <p className="text-sm text-[#545B64] mt-2">Sign in to Route 53 Clone (Mock Authentication)</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-[#16191F] mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#879196] rounded-[2px] focus:outline-none focus:border-[#0073BB] focus:ring-1 focus:ring-[#0073BB]"
              placeholder="user@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#EC7211] hover:bg-[#EB5F07] text-white font-bold py-2 px-4 rounded-[2px] transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
