"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HostedZones() {
  const { user } = useAuth();
  const [zones, setZones] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones`);
      if (res.ok) {
        const data = await res.json();
        setZones(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchZones();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hosted zone?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchZones();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#16191F]">Hosted zones</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchZones}
            className="aws-btn-secondary flex items-center justify-center p-[6px]"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/hosted-zones/create"
            className="aws-btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Create hosted zone
          </Link>
        </div>
      </div>

      <div className="aws-panel">
        <div className="p-4 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#545B64]" size={16} />
            <input
              type="text"
              placeholder="Find hosted zones"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aws-input !pl-9"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="aws-table-header px-4 py-3 border-r">Domain name</th>
                <th className="aws-table-header px-4 py-3 border-r">Type</th>
                <th className="aws-table-header px-4 py-3 border-r">Record count</th>
                <th className="aws-table-header px-4 py-3 border-r">Description</th>
                <th className="aws-table-header px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#545B64]">Loading...</td>
                </tr>
              ) : filteredZones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#545B64]">No hosted zones found.</td>
                </tr>
              ) : (
                filteredZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-[#F2F3F3]">
                    <td className="aws-table-cell font-bold">
                      <Link href={`/hosted-zones/${zone.id}`} className="text-[#0073BB] hover:underline">
                        {zone.name}
                      </Link>
                    </td>
                    <td className="aws-table-cell">
                      {zone.private_zone ? "Private" : "Public"}
                    </td>
                    <td className="aws-table-cell">{zone.record_set_count}</td>
                    <td className="aws-table-cell">{zone.comment || "-"}</td>
                    <td className="aws-table-cell border-r-0">
                      <button
                        onClick={() => handleDelete(zone.id)}
                        className="text-[#D13212] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-[#FAFAFA] flex justify-between items-center text-sm text-[#545B64] border-t border-[#D5DBDB]">
          <div>{filteredZones.length} zones</div>
        </div>
      </div>
    </div>
  );
}
