"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/components/Notification";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Globe, Lock, AlertCircle } from "lucide-react";

export default function CreateHostedZone() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotification();
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
        body: JSON.stringify({ name: name.trim(), comment: comment.trim(), private_zone: isPrivate }),
      });

      if (res.ok) {
        const data = await res.json();
        addNotification("success", `Successfully created hosted zone "${data.name}" (${data.id}).`);
        router.push("/hosted-zones");
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to create hosted zone");
      }
    } catch {
      setError("Network error occurred while connecting to Route 53 backend.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* AWS Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Hosted zones", href: "/hosted-zones" },
        { label: "Create hosted zone" }
      ]} />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0f141a] tracking-tight">Create hosted zone</h1>
        <p className="text-[13px] text-[#414d5c] mt-0.5">
          A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-3 bg-[#FDECE9] border-l-4 border-[#D13212] rounded-[8px] text-[#D13212] text-[13px] flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div><span className="font-bold">Error:</span> {error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hosted Zone Configuration Container */}
        <div className="aws-panel overflow-hidden">
          <div className="aws-panel-header">
            <h2 className="text-[14px] font-bold text-[#0f141a]">Hosted zone configuration</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Domain Name */}
            <div className="max-w-xl">
              <label htmlFor="name" className="block text-[13px] font-bold text-[#0f141a] mb-1">
                Domain name <span className="text-[#D13212]">*</span>
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
              <p className="text-[11px] text-[#414d5c] mt-1">
                Enter a fully qualified domain name, such as example.com.
              </p>
            </div>

            {/* Description */}
            <div className="max-w-xl">
              <label htmlFor="comment" className="block text-[13px] font-bold text-[#0f141a] mb-1">
                Description - <span className="font-normal text-[#414d5c]">optional</span>
              </label>
              <input
                type="text"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="aws-input"
                placeholder="e.g., My production hosted zone"
              />
              <p className="text-[11px] text-[#414d5c] mt-1">
                Optional note about this hosted zone.
              </p>
            </div>

            {/* Type selection */}
            <div>
              <span className="block text-[13px] font-bold text-[#0f141a] mb-2">
                Type <span className="text-[#D13212]">*</span>
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {/* Public */}
                <label 
                  className={`p-4 border rounded-[8px] cursor-pointer transition-colors flex items-start gap-3 ${
                    !isPrivate 
                      ? "border-[#0972d3] bg-[#F1FAFF]" 
                      : "border-[#D5DBDB] bg-white hover:bg-[#f9fafb]"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="w-4 h-4 text-[#0972d3] border-[#879196] focus:ring-[#0972d3] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#0f141a]">
                      <Globe size={14} className="text-[#1D8102]" />
                      <span>Public hosted zone</span>
                    </div>
                    <p className="text-[12px] text-[#414d5c] mt-1 leading-relaxed">
                      Routes traffic on the internet. Recommended for publicly accessible web applications and services.
                    </p>
                  </div>
                </label>

                {/* Private */}
                <label 
                  className={`p-4 border rounded-[8px] cursor-pointer transition-colors flex items-start gap-3 ${
                    isPrivate 
                      ? "border-[#0972d3] bg-[#F1FAFF]" 
                      : "border-[#D5DBDB] bg-white hover:bg-[#f9fafb]"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="w-4 h-4 text-[#0972d3] border-[#879196] focus:ring-[#0972d3] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#0f141a]">
                      <Lock size={14} className="text-[#0972d3]" />
                      <span>Private hosted zone for Amazon VPC</span>
                    </div>
                    <p className="text-[12px] text-[#414d5c] mt-1 leading-relaxed">
                      Routes traffic within one or more Virtual Private Clouds (VPCs) that you specify.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Container (AWS Style Optional Section) */}
        <div className="aws-panel overflow-hidden">
          <div className="aws-panel-header">
            <h2 className="text-[14px] font-bold text-[#0f141a]">Tags - <span className="font-normal text-[#414d5c]">optional</span></h2>
          </div>
          <div className="p-6">
            <p className="text-[12px] text-[#414d5c] mb-3">
              A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value, both of which you define.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="block text-[12px] font-bold text-[#414d5c] mb-1">Key</label>
                <input type="text" placeholder="e.g. Environment" className="aws-input" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#414d5c] mb-1">Value</label>
                <input type="text" placeholder="e.g. Production" className="aws-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/hosted-zones"
            className="aws-btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="aws-btn-primary"
          >
            {loading ? "Creating..." : "Create hosted zone"}
          </button>
        </div>
      </form>
    </div>
  );
}
