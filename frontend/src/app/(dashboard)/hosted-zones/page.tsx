"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/components/Notification";

const PAGE_SIZES = [10, 25, 50, 100];

export default function HostedZones() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [zones, setZones] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "public" | "private">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
      addNotification("error", "Failed to fetch hosted zones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchZones();
    }
  }, [user]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the hosted zone "${name}"? This will also delete all records in the zone.`)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          addNotification("success", `Hosted zone "${name}" has been successfully deleted.`);
          fetchZones();
        } else {
          addNotification("error", `Failed to delete hosted zone "${name}".`);
        }
      } catch (err) {
        console.error(err);
        addNotification("error", "Network error occurred while deleting.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} hosted zone(s)? This will also delete all associated records.`)) return;

    let deleted = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${id}`, {
          method: "DELETE",
        });
        if (res.ok) deleted++;
      } catch (err) {
        console.error(err);
      }
    }
    addNotification("success", `Successfully deleted ${deleted} hosted zone(s).`);
    setSelectedIds(new Set());
    fetchZones();
  };

  // Apply filters
  const filteredZones = zones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(search.toLowerCase()) ||
      (z.comment && z.comment.toLowerCase().includes(search.toLowerCase()));
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "public" && !z.private_zone) ||
      (typeFilter === "private" && z.private_zone);
    return matchesSearch && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredZones.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedZones = filteredZones.slice(startIndex, startIndex + pageSize);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, pageSize]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedZones.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedZones.map((z) => z.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#16191F]">Hosted zones</h1>
          <p className="text-sm text-[#545B64] mt-1">
            A hosted zone is a container for records, which include information about how to route traffic for a domain and its subdomains.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={fetchZones}
            className="aws-btn-icon"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="aws-btn-secondary flex items-center gap-2 text-[#D13212]"
            >
              <Trash2 size={14} />
              Delete ({selectedIds.size})
            </button>
          )}
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
        {/* Toolbar with search and filters */}
        <div className="p-4 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#545B64]" size={16} />
            <input
              type="text"
              placeholder="Find hosted zones"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aws-input !pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#545B64] uppercase">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="aws-select"
            >
              <option value="all">All types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="aws-table-header px-4 py-3 border-r w-10">
                  <input
                    type="checkbox"
                    checked={paginatedZones.length > 0 && selectedIds.size === paginatedZones.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-[#879196] text-[#0073BB] focus:ring-[#0073BB]"
                  />
                </th>
                <th className="aws-table-header px-4 py-3 border-r">Domain name</th>
                <th className="aws-table-header px-4 py-3 border-r">Hosted zone ID</th>
                <th className="aws-table-header px-4 py-3 border-r">Type</th>
                <th className="aws-table-header px-4 py-3 border-r">Record count</th>
                <th className="aws-table-header px-4 py-3 border-r">Description</th>
                <th className="aws-table-header px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#545B64]">Loading...</td>
                </tr>
              ) : paginatedZones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#545B64]">
                    {zones.length === 0
                      ? "No hosted zones found. Create a hosted zone to get started."
                      : "No hosted zones match the current filter criteria."}
                  </td>
                </tr>
              ) : (
                paginatedZones.map((zone) => (
                  <tr key={zone.id} className={`hover:bg-[#F2F3F3] ${selectedIds.has(zone.id) ? "bg-[#F1FAFF]" : ""}`}>
                    <td className="aws-table-cell w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(zone.id)}
                        onChange={() => toggleSelect(zone.id)}
                        className="w-4 h-4 rounded border-[#879196] text-[#0073BB] focus:ring-[#0073BB]"
                      />
                    </td>
                    <td className="aws-table-cell font-bold">
                      <Link href={`/hosted-zones/${zone.id}`} className="text-[#0073BB] hover:underline">
                        {zone.name}
                      </Link>
                    </td>
                    <td className="aws-table-cell font-mono text-xs text-[#545B64]">{zone.id}</td>
                    <td className="aws-table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        zone.private_zone
                          ? "bg-[#F1FAFF] text-[#0073BB] border border-[#0073BB]"
                          : "bg-[#F2F8F0] text-[#1D8102] border border-[#1D8102]"
                      }`}>
                        {zone.private_zone ? "Private" : "Public"}
                      </span>
                    </td>
                    <td className="aws-table-cell">{zone.record_set_count}</td>
                    <td className="aws-table-cell text-[#545B64]">{zone.comment || "-"}</td>
                    <td className="aws-table-cell border-r-0">
                      <button
                        onClick={() => handleDelete(zone.id, zone.name)}
                        className="text-[#D13212] hover:underline flex items-center gap-1 font-bold text-xs"
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

        {/* Pagination footer */}
        <div className="p-3 bg-[#FAFAFA] flex justify-between items-center text-sm text-[#545B64] border-t border-[#D5DBDB]">
          <div className="flex items-center gap-3">
            <span>{filteredZones.length} zone{filteredZones.length !== 1 ? "s" : ""}</span>
            <span className="text-[#D5DBDB]">|</span>
            <div className="flex items-center gap-1">
              <label className="text-xs">Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="aws-select text-xs py-0.5 px-1 pr-6"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">
              Page {safeCurrentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="aws-btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="aws-btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
