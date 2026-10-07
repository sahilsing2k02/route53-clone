"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CreateHostedZone() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, private_zone: isPrivate }),
      });

      if (res.ok) {
        router.push("/hosted-zones");
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to create hosted zone");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-sm text-[#545B64] mb-2 flex items-center gap-2">
          <Link href="/hosted-zones" className="text-[#0073BB] hover:underline">Hosted zones</Link>
          <span>&gt;</span>
          <span>Create hosted zone</span>
        </div>
        <h1 className="text-2xl font-bold text-[#16191F]">Create hosted zone</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#FDECE9] border border-[#D13212] rounded-sm text-[#D13212] text-sm flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="aws-panel p-6 mb-6">
          <h2 className="text-lg font-bold text-[#16191F] mb-4">Hosted zone configuration</h2>
          
          <div className="mb-6 max-w-xl">
            <label htmlFor="name" className="block text-sm font-bold text-[#16191F] mb-1">
              Domain name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="aws-input"
              placeholder="example.com"
              required
            />
            <p className="text-xs text-[#545B64] mt-1">Enter the name of the domain.</p>
          </div>

          <div className="mb-6 max-w-xl">
            <label htmlFor="comment" className="block text-sm font-bold text-[#16191F] mb-1">
              Description - optional
            </label>
            <input
              type="text"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="aws-input"
              placeholder="My awesome hosted zone"
            />
          </div>

          <div className="mb-4">
            <span className="block text-sm font-bold text-[#16191F] mb-2">Type</span>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="w-4 h-4 text-[#0073BB] border-[#879196] focus:ring-[#0073BB]"
                />
                <span className="font-bold text-[#16191F]">Public hosted zone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="w-4 h-4 text-[#0073BB] border-[#879196] focus:ring-[#0073BB]"
                />
                <span className="font-bold text-[#16191F]">Private hosted zone</span>
              </label>
            </div>
            <p className="text-xs text-[#545B64] mt-2">
              {isPrivate 
                ? "Routes traffic within an Amazon VPC."
                : "Routes traffic on the internet."}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/hosted-zones"
            className="aws-btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="aws-btn-primary disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create hosted zone"}
          </button>
        </div>
      </form>
    </div>
  );
}
