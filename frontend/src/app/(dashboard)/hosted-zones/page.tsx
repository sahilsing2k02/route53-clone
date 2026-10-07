"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, RefreshCw, ChevronLeft, ChevronRight, ExternalLink, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/components/Notification";
import Breadcrumbs from "@/components/Breadcrumbs";

const PAGE_SIZES = [10, 25, 50, 100];

export default function HostedZones() {
  const { user } = useAuth();
  const router = useRouter();
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
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones`);
      if (res.ok) {
        const data = await res.json();
        setZones(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      addNotification("error", "Failed to fetch hosted zones from Route 53 API.");
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    if (user) {
      fetchZones();
    }
  }, [user, fetchZones]);

  // Apply filters
  const filteredZones = zones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(search.toLowerCase()) ||
      (z.comment && z.comment.toLowerCase().includes(search.toLowerCase())) ||
      (z.id && z.id.toLowerCase().includes(search.toLowerCase()));
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
    if (selectedIds.size === paginatedZones.length && paginatedZones.length > 0) {
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

  const handleConfirmDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);

    let successCount = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${id}`, {
          method: "DELETE",
        });
        if (res.ok) successCount++;
      } catch (err) {
        console.error(err);
      }
    }

    setIsDeleting(false);
    setShowDeleteModal(false);
    setSelectedIds(new Set());
    addNotification("success", `Successfully deleted ${successCount} hosted zone(s).`);
    fetchZones();
  };

  const handleViewDetails = () => {
    if (selectedIds.size === 1) {
      const selectedId = Array.from(selectedIds)[0];
      router.push(`/hosted-zones/${selectedId}`);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* AWS Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Hosted zones" }]} />

      {/* Page Header with Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold text-[#0f141a] tracking-tight">Hosted zones</h1>
            <span className="text-[13px] font-normal text-[#414d5c]">({filteredZones.length})</span>
          </div>
          <p className="text-[13px] text-[#414d5c] mt-0.5 max-w-2xl">
            A hosted zone is a container for records, which include information about how to route traffic for a domain and its subdomains.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={fetchZones}
            className="aws-btn-icon"
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleViewDetails}
            disabled={selectedIds.size !== 1}
            className="aws-btn-secondary"
          >
            View details
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={selectedIds.size === 0}
            className={selectedIds.size > 0 ? "aws-btn-danger" : "aws-btn-secondary"}
          >
            <Trash2 size={13} />
            <span>Delete</span>
            {selectedIds.size > 0 && <span>({selectedIds.size})</span>}
          </button>

          <Link
            href="/hosted-zones/create"
            className="aws-btn-primary"
          >
            <Plus size={14} />
            <span>Create hosted zone</span>
          </Link>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="aws-panel overflow-hidden">
        {/* Filter / Search Bar */}
        <div className="p-3 border-b border-[#D5DBDB] bg-[#f9fafb] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#414d5c]" size={14} />
              <input
                type="text"
                placeholder="Search hosted zones by name, ID, or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="aws-input !pl-8 text-[13px]"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#879196] hover:text-[#0f141a] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-[12px] font-bold text-[#414d5c] uppercase">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="aws-select text-[12px] py-1"
              >
                <option value="all">All types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="text-[12px] text-[#414d5c]">
            {selectedIds.size > 0 ? `${selectedIds.size} of ${filteredZones.length} selected` : `${filteredZones.length} total`}
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr>
                <th className="aws-table-header w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedZones.length > 0 && selectedIds.size === paginatedZones.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all hosted zones"
                    className="w-3.5 h-3.5 rounded-[8px] border-[#879196] text-[#0972d3] focus:ring-[#0972d3] cursor-pointer"
                  />
                </th>
                <th className="aws-table-header">Domain name</th>
                <th className="aws-table-header">Hosted zone ID</th>
                <th className="aws-table-header">Type</th>
                <th className="aws-table-header">Record count</th>
                <th className="aws-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#414d5c]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-[#0972d3]" />
                      <span>Loading hosted zones...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedZones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#414d5c]">
                    <div className="max-w-md mx-auto">
                      <div className="text-[15px] font-bold text-[#0f141a] mb-1">
                        {zones.length === 0 ? "No hosted zones" : "No matches found"}
                      </div>
                      <p className="text-[13px] text-[#414d5c] mb-4">
                        {zones.length === 0
                          ? "You don't have any hosted zones in Route 53. Create a hosted zone to start routing traffic."
                          : "No hosted zones match the search and filter criteria. Try clearing filters."}
                      </p>
                      {zones.length === 0 ? (
                        <Link href="/hosted-zones/create" className="aws-btn-primary">
                          <Plus size={14} />
                          <span>Create hosted zone</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => { setSearch(""); setTypeFilter("all"); }}
                          className="aws-btn-secondary"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedZones.map((zone) => {
                  const isSelected = selectedIds.has(zone.id);
                  return (
                    <tr 
                      key={zone.id} 
                      className={`hover:bg-[#F2F3F3] transition-colors cursor-pointer ${isSelected ? "bg-[#F1FAFF]" : ""}`}
                      onClick={() => toggleSelect(zone.id)}
                    >
                      <td className="aws-table-cell w-10 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(zone.id)}
                          aria-label={`Select ${zone.name}`}
                          className="w-3.5 h-3.5 rounded-[8px] border-[#879196] text-[#0972d3] focus:ring-[#0972d3] cursor-pointer"
                        />
                      </td>
                      <td className="aws-table-cell font-bold" onClick={(e) => e.stopPropagation()}>
                        <Link 
                          href={`/hosted-zones/${zone.id}`} 
                          className="text-[#0972d3] hover:underline hover:text-[#033160] inline-flex items-center gap-1"
                        >
                          <span>{zone.name}</span>
                          <ExternalLink size={11} className="text-[#879196]" />
                        </Link>
                      </td>
                      <td className="aws-table-cell font-mono text-[12px] text-[#414d5c]">{zone.id}</td>
                      <td className="aws-table-cell">
                        {zone.private_zone ? (
                          <span className="aws-badge-private">Private</span>
                        ) : (
                          <span className="aws-badge-public">Public</span>
                        )}
                      </td>
                      <td className="aws-table-cell font-medium">{zone.record_set_count}</td>
                      <td className="aws-table-cell text-[#414d5c]">{zone.comment || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Cloudscape Pagination Footer */}
        <div className="p-3 bg-[#f9fafb] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[12px] text-[#414d5c] border-t border-[#D5DBDB]">
          <div className="flex items-center gap-3">
            <span>
              {filteredZones.length === 0 ? "0 hosted zones" : `${startIndex + 1}-${Math.min(startIndex + pageSize, filteredZones.length)} of ${filteredZones.length} hosted zones`}
            </span>
            <span className="text-[#D5DBDB]">|</span>
            <div className="flex items-center gap-1.5">
              <label>Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="aws-select text-[11px] py-0.5 px-2 pr-6"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span>
              Page {safeCurrentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="aws-btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="aws-btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (AWS Cloudscape style) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[8px] shadow-2xl w-full max-w-lg border border-[#D5DBDB]">
            <div className="px-6 py-4 border-b border-[#D5DBDB] bg-[#f9fafb] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#D13212]">
                <AlertTriangle size={18} />
                <h2 className="text-[16px] font-bold text-[#0f141a]">Delete hosted zone{selectedIds.size > 1 ? "s" : ""}?</h2>
              </div>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="text-[#414d5c] hover:text-[#0f141a] text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-[13px] text-[#0f141a] mb-3">
                Are you sure you want to delete <span className="font-bold">{selectedIds.size}</span> hosted zone{selectedIds.size > 1 ? "s" : ""}?
              </p>
              
              <div className="bg-[#FDECE9] border-l-4 border-[#D13212] p-3 text-[12px] text-[#D13212] mb-4">
                <span className="font-bold">Warning: </span>
                Deleting a hosted zone permanently removes all associated DNS records. This action cannot be undone and DNS queries for this zone will no longer resolve.
              </div>

              <div className="flex justify-end gap-2 border-t border-[#EAEDED] pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="aws-btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="aws-btn-danger-solid"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
