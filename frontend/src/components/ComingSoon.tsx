"use client";
import { useAuth } from "@/context/AuthContext";

export default function ComingSoon({ title }: { title: string }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold text-[#16191F] mb-4">{title}</h1>
      <p className="text-[#545B64] text-lg">This feature is coming soon.</p>
    </div>
  );
}
