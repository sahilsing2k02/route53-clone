"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Pencil, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle,
  Shield,
  Tag
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/components/Notification";
import Breadcrumbs from "@/components/Breadcrumbs";

const RECORD_TYPES = ["All", "A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "PTR", "SRV", "CAA"];
const PAGE_SIZES = [10, 25, 50, 100];

export default function HostedZoneDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const zoneId = unwrappedParams.id;
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();
  
  const [zone, setZone] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"records" | "dnssec" | "tags">("records");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Copied state
  const [copiedId, setCopiedId] = useState(false);

  // Edit zone modal state
  const [showEditZone, setShowEditZone] = useState(false);
  const [editZoneData, setEditZoneData] = useState({ name: "", comment: "", private_zone: false });
  const [editLoading, setEditLoading] = useState(false);

  // Create record modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newRecord, setNewRecord] = useState({
    name: "",
    type: "A",
    ttl: 300,
    value: "",
    routing_policy: "Simple"
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit record modal state
  const [showEditRecord, setShowEditRecord] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editRecordLoading, setEditRecordLoading] = useState(false);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const fetchZoneDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${zoneId}`);
      if (res.ok) {
        const data = await res.json();
        setZone(data);
        setEditZoneData({ name: data.name, comment: data.comment || "", private_zone: data.private_zone });
        setRecords(Array.isArray(data.records) ? data.records : []);
      } else {
        router.push("/hosted-zones");
      }
    } catch (err) {
      console.error(err);
      addNotification("error", "Failed to load hosted zone details.");
    } finally {
      setLoading(false);
    }
  }, [zoneId, router, addNotification]);

  useEffect(() => {
    if (user) {
      fetchZoneDetails();
    }
  }, [user, fetchZoneDetails]);

  const copyZoneId = () => {
    if (!zone) return;
    navigator.clipboard.writeText(zone.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const confirmDeleteRecord = (record: any) => {
    setDeleteTarget(record);
  };

  const handleDeleteRecord = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/records/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        addNotification("success", `Record "${deleteTarget.name}" (${deleteTarget.type}) has been deleted.`);
        fetchZoneDetails();
      } else {
        addNotification("error", "Failed to delete record.");
      }
    } catch (err) {
      console.error(err);
      addNotification("error", "Network error occurred.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeletingBulk(true);

    let deleted = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/records/${id}`, {
          method: "DELETE",
        });
        if (res.ok) deleted++;
      } catch (err) {
        console.error(err);
      }
    }
    setIsDeletingBulk(false);
    setShowBulkDeleteModal(false);
    addNotification("success", `Successfully deleted ${deleted} record(s).`);
    setSelectedIds(new Set());
    fetchZoneDetails();
  };

  const handleExportZone = () => {
    if (!zone || !records) return;
    
    const exportData = {
      zone: {
        id: zone.id,
        name: zone.name,
        private_zone: zone.private_zone,
        comment: zone.comment,
        record_set_count: zone.record_set_count
      },
      records: records.map(r => ({
        name: r.name,
        type: r.type,
        ttl: r.ttl,
        routing_policy: r.routing_policy,
        value: r.value
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zone.name}.zone.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification("success", `Exported zone "${zone.name}" records as JSON.`);
  };

  const handleEditZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editZoneData),
      });
      if (res.ok) {
        setShowEditZone(false);
        addNotification("success", "Hosted zone details updated successfully.");
        fetchZoneDetails();
      } else {
        addNotification("error", "Failed to update hosted zone.");
      }
    } catch (err) {
      console.error(err);
      addNotification("error", "Network error occurred.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const formattedName = newRecord.name ? `${newRecord.name}.${zone.name}` : zone.name;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${zoneId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRecord,
          name: formattedName
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewRecord({ name: "", type: "A", ttl: 300, value: "", routing_policy: "Simple" });
        addNotification("success", `Record "${formattedName}" (${newRecord.type}) has been created.`);
        fetchZoneDetails();
      } else {
        addNotification("error", "Failed to create record.");
      }
    } catch (err) {
      console.error(err);
      addNotification("error", "Network error occurred.");
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditRecord = (record: any) => {
    setEditingRecord({ ...record });
    setShowEditRecord(true);
  };

  const handleUpdateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditRecordLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/records/${editingRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRecord),
      });
      if (res.ok) {
        setShowEditRecord(false);
        addNotification("success", `Record "${editingRecord.name}" updated successfully.`);
        fetchZoneDetails();
      } else {
        addNotification("error", "Failed to update record.");
      }
    } catch (err) {
      console.error(err);
      addNotification("error", "Network error occurred.");
    } finally {
      setEditRecordLoading(false);
    }
  };

  // Filter + search
  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
      r.value.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [search, typeFilter, pageSize]);

  // Selection handlers
  const deletableRecords = paginatedRecords.filter(
    r => !(["NS", "SOA"].includes(r.type) && r.name === zone?.name)
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === deletableRecords.length && deletableRecords.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(deletableRecords.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Find single selected record for Edit
  const selectedRecord = selectedIds.size === 1 
    ? records.find(r => r.id === Array.from(selectedIds)[0])
    : null;

  if (!user || (!zone && loading)) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[#545B64]">
          <RefreshCw size={16} className="animate-spin text-[#EC7211]" />
          <span>Loading hosted zone details...</span>
        </div>
      </div>
    );
  }

  if (!zone) return null;

  // Extract NS record values for summary
  const nsRecord = records.find(r => r.type === "NS" && r.name === zone.name);
  const nameServers = nsRecord ? nsRecord.value.split("\n").filter(Boolean) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* AWS Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Hosted zones", href: "/hosted-zones" },
        { label: zone.name }
      ]} />

      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-[#16191F] tracking-tight">{zone.name}</h1>
            {zone.private_zone ? (
              <span className="aws-badge-private">Private hosted zone</span>
            ) : (
              <span className="aws-badge-public">Public hosted zone</span>
            )}
          </div>
          <p className="text-[12px] text-[#545B64] mt-0.5">
            Hosted zone ID: <span className="font-mono text-[#16191F]">{zone.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={fetchZoneDetails}
            className="aws-btn-icon"
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={handleExportZone}
            className="aws-btn-secondary"
            title="Export zone as JSON"
          >
            <Download size={13} />
            <span>Export zone</span>
          </button>

          <button
            onClick={() => setShowEditZone(true)}
            className="aws-btn-secondary"
          >
            <Pencil size={13} />
            <span>Edit zone details</span>
          </button>
        </div>
      </div>

      {/* Hosted Zone Details Panel (AWS Cloudscape Card) */}
      <div className="aws-panel mb-6 overflow-hidden">
        <div className="aws-panel-header">
          <h2 className="text-[14px] font-bold text-[#16191F]">Hosted zone details</h2>
          <button 
            onClick={() => setShowEditZone(true)}
            className="text-[12px] text-[#0073BB] hover:underline flex items-center gap-1 font-semibold"
          >
            Edit
          </button>
        </div>
        
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[13px]">
          <div>
            <div className="text-[12px] font-bold text-[#545B64] uppercase mb-1">Hosted zone ID</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#16191F] font-semibold">{zone.id}</span>
              <button 
                onClick={copyZoneId}
                className="text-[#545B64] hover:text-[#16191F] p-0.5 transition-colors"
                title="Copy hosted zone ID"
              >
                {copiedId ? <Check size={13} className="text-[#1D8102]" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <div>
            <div className="text-[12px] font-bold text-[#545B64] uppercase mb-1">Type</div>
            <div>
              {zone.private_zone ? "Private hosted zone" : "Public hosted zone"}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-bold text-[#545B64] uppercase mb-1">Record count</div>
            <div className="font-semibold text-[#16191F]">{zone.record_set_count}</div>
          </div>

          <div>
            <div className="text-[12px] font-bold text-[#545B64] uppercase mb-1">Description</div>
            <div className="text-[#545B64]">{zone.comment || "-"}</div>
          </div>
        </div>

        {/* Name Servers subsection if available */}
        {nameServers.length > 0 && (
          <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#EAEDED] flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="text-[12px] font-bold text-[#545B64] uppercase sm:w-40 flex-shrink-0">
              Name servers (NS):
            </div>
            <div className="flex-1 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[12px] text-[#0073BB]">
              {nameServers.map((ns, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-[#879196]">{idx + 1}.</span>
                  <span>{ns}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AWS Cloudscape Tabs */}
      <div className="border-b border-[#D5DBDB] mb-4 flex items-center gap-6 text-[13px] select-none">
        <button
          onClick={() => setActiveTab("records")}
          className={`pb-2.5 font-bold cursor-pointer transition-colors relative ${
            activeTab === "records"
              ? "text-[#16191F] border-b-[3px] border-[#EC7211] -mb-[1px]"
              : "text-[#545B64] hover:text-[#16191F]"
          }`}
        >
          <span>Records</span>
          <span className="ml-1.5 text-[11px] font-normal text-[#545B64]">({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("dnssec")}
          className={`pb-2.5 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === "dnssec"
              ? "text-[#16191F] border-b-[3px] border-[#EC7211] -mb-[1px]"
              : "text-[#545B64] hover:text-[#16191F]"
          }`}
        >
          <Shield size={13} />
          <span>DNSSEC</span>
        </button>

        <button
          onClick={() => setActiveTab("tags")}
          className={`pb-2.5 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === "tags"
              ? "text-[#16191F] border-b-[3px] border-[#EC7211] -mb-[1px]"
              : "text-[#545B64] hover:text-[#16191F]"
          }`}
        >
          <Tag size={13} />
          <span>Tags</span>
        </button>
      </div>

      {/* Tab: DNSSEC or Tags Placeholder */}
      {activeTab === "dnssec" && (
        <div className="aws-panel p-6 mb-6 text-center">
          <Shield size={28} className="mx-auto text-[#879196] mb-2" />
          <h3 className="font-bold text-[#16191F] text-[15px] mb-1">DNSSEC signing is not enabled</h3>
          <p className="text-[#545B64] text-[13px] max-w-md mx-auto mb-4">
            DNSSEC validates DNS responses to protect your domain from DNS spoofing and man-in-the-middle attacks.
          </p>
          <button className="aws-btn-secondary" onClick={() => addNotification("info", "DNSSEC simulation active.")}>
            Enable DNSSEC signing
          </button>
        </div>
      )}

      {activeTab === "tags" && (
        <div className="aws-panel p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-[#16191F] text-[14px]">Hosted zone tags (0)</h3>
            <button className="aws-btn-secondary" onClick={() => addNotification("info", "Tags editor active.")}>
              Manage tags
            </button>
          </div>
          <p className="text-[#545B64] text-[13px]">
            No tags associated with this hosted zone. Use tags to track costs and categorize AWS resources.
          </p>
        </div>
      )}

      {/* Tab: Records (Main Content) */}
      {activeTab === "records" && (
        <>
          {/* Records Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#16191F]">Records</h2>
              <span className="text-[13px] text-[#545B64]">({filteredRecords.length})</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedRecord && !(["NS", "SOA"].includes(selectedRecord.type) && selectedRecord.name === zone.name) && (
                <button
                  onClick={() => openEditRecord(selectedRecord)}
                  className="aws-btn-secondary"
                >
                  <Pencil size={13} />
                  <span>Edit record</span>
                </button>
              )}

              <button
                onClick={() => setShowBulkDeleteModal(true)}
                disabled={selectedIds.size === 0}
                className={selectedIds.size > 0 ? "aws-btn-danger" : "aws-btn-secondary"}
              >
                <Trash2 size={13} />
                <span>Delete record</span>
                {selectedIds.size > 0 && <span>({selectedIds.size})</span>}
              </button>

              <button
                onClick={() => setShowCreate(true)}
                className="aws-btn-primary"
              >
                <Plus size={14} />
                <span>Create record</span>
              </button>
            </div>
          </div>

          {/* Records Table Container */}
          <div className="aws-panel overflow-hidden">
            {/* Filter Bar */}
            <div className="p-3 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#545B64]" size={14} />
                  <input
                    type="text"
                    placeholder="Search records by name or value"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="aws-input !pl-8 text-[13px]"
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#879196] hover:text-[#16191F] text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="text-[12px] font-bold text-[#545B64] uppercase">Type:</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="aws-select text-[12px] py-1"
                  >
                    {RECORD_TYPES.map((t) => (
                      <option key={t} value={t}>{t === "All" ? "All record types" : `${t} record`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[12px] text-[#545B64]">
                {selectedIds.size > 0 ? `${selectedIds.size} of ${filteredRecords.length} selected` : `${filteredRecords.length} total`}
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
                        checked={deletableRecords.length > 0 && selectedIds.size === deletableRecords.length}
                        onChange={toggleSelectAll}
                        disabled={deletableRecords.length === 0}
                        aria-label="Select all deletable records"
                        className="w-3.5 h-3.5 rounded-[2px] border-[#879196] text-[#0073BB] focus:ring-[#0073BB] disabled:opacity-30 cursor-pointer"
                      />
                    </th>
                    <th className="aws-table-header min-w-[180px]">Record name</th>
                    <th className="aws-table-header">Type</th>
                    <th className="aws-table-header">Routing policy</th>
                    <th className="aws-table-header">Differentiator</th>
                    <th className="aws-table-header">Alias</th>
                    <th className="aws-table-header">TTL (seconds)</th>
                    <th className="aws-table-header min-w-[280px]">Value/Route traffic to</th>
                    <th className="aws-table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-[#545B64]">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw size={16} className="animate-spin text-[#EC7211]" />
                          <span>Loading DNS records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-[#545B64]">
                        <div className="max-w-md mx-auto">
                          <div className="text-[15px] font-bold text-[#16191F] mb-1">
                            {records.length === 0 ? "No DNS records" : "No matching records"}
                          </div>
                          <p className="text-[13px] text-[#545B64] mb-4">
                            {records.length === 0
                              ? "Create records to route traffic to your IP addresses, AWS resources, or other domains."
                              : "No records match the current filter criteria."}
                          </p>
                          {records.length === 0 ? (
                            <button onClick={() => setShowCreate(true)} className="aws-btn-primary">
                              <Plus size={14} />
                              <span>Create record</span>
                            </button>
                          ) : (
                            <button onClick={() => { setSearch(""); setTypeFilter("All"); }} className="aws-btn-secondary">
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((record) => {
                      const isSystem = ["NS", "SOA"].includes(record.type) && record.name === zone.name;
                      const isSelected = selectedIds.has(record.id);

                      return (
                        <tr 
                          key={record.id} 
                          className={`hover:bg-[#F2F3F3] transition-colors cursor-pointer ${isSelected ? "bg-[#F1FAFF]" : ""}`}
                          onClick={() => !isSystem && toggleSelect(record.id)}
                        >
                          <td className="aws-table-cell w-10 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(record.id)}
                              disabled={isSystem}
                              aria-label={`Select record ${record.name}`}
                              className="w-3.5 h-3.5 rounded-[2px] border-[#879196] text-[#0073BB] focus:ring-[#0073BB] disabled:opacity-30 cursor-pointer"
                            />
                          </td>
                          <td className="aws-table-cell font-bold text-[#16191F]">{record.name}</td>
                          <td className="aws-table-cell">
                            <span className="aws-badge-type">
                              {record.type}
                            </span>
                          </td>
                          <td className="aws-table-cell">{record.routing_policy || "Simple"}</td>
                          <td className="aws-table-cell text-[#879196]">-</td>
                          <td className="aws-table-cell text-[#879196]">No</td>
                          <td className="aws-table-cell font-mono text-[12px]">{record.ttl}</td>
                          <td className="aws-table-cell font-mono text-[12px] text-[#0073BB] whitespace-pre-line leading-relaxed">
                            {record.value}
                          </td>
                          <td className="aws-table-cell text-right" onClick={(e) => e.stopPropagation()}>
                            {isSystem ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditRecord(record)}
                                  className="text-[#0073BB] hover:underline font-bold text-[12px]"
                                >
                                  Edit
                                </button>
                                <span className="text-[11px] text-[#879196] bg-[#FAFAFA] border border-[#D5DBDB] px-1.5 py-0.5 rounded-[2px]" title="Default apex record created by Route 53">
                                  System
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => openEditRecord(record)}
                                  className="text-[#0073BB] hover:underline font-bold text-[12px] inline-flex items-center gap-1"
                                >
                                  <Pencil size={11} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => confirmDeleteRecord(record)}
                                  className="text-[#D13212] hover:underline font-bold text-[12px] inline-flex items-center gap-1"
                                >
                                  <Trash2 size={11} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 bg-[#FAFAFA] flex justify-between items-center text-[12px] text-[#545B64] border-t border-[#D5DBDB]">
              <div className="flex items-center gap-3">
                <span>
                  {filteredRecords.length === 0 ? "0 records" : `${startIndex + 1}-${Math.min(startIndex + pageSize, filteredRecords.length)} of ${filteredRecords.length} records`}
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
        </>
      )}

      {/* ===== MODALS (AWS Cloudscape Style) ===== */}

      {/* Quick Create Record Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-[#D5DBDB]">
            <div className="px-6 py-3.5 border-b border-[#D5DBDB] flex justify-between items-center bg-[#FAFAFA]">
              <div>
                <h2 className="text-[16px] font-bold text-[#16191F]">Quick create record</h2>
                <p className="text-[12px] text-[#545B64]">Define routing to direct user requests for your domain or subdomain.</p>
              </div>
              <button 
                onClick={() => setShowCreate(false)} 
                className="text-[#545B64] hover:text-[#16191F] text-sm"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateRecord} className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* Record Name */}
              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">
                  Record name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRecord.name}
                    onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                    className="flex-1 aws-input text-right"
                    placeholder="e.g. www or api"
                  />
                  <span className="text-[13px] font-bold text-[#545B64] select-none bg-[#FAFAFA] border border-[#D5DBDB] px-2 py-1.5 rounded-[2px]">
                    .{zone.name}
                  </span>
                </div>
                <p className="text-[11px] text-[#545B64] mt-1">Leave blank to create a record for the zone apex ({zone.name}).</p>
              </div>

              {/* Record Type & TTL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#16191F] mb-1">
                    Record type
                  </label>
                  <select
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    className="aws-select w-full"
                  >
                    <option value="A">A - Routes traffic to an IPv4 address</option>
                    <option value="AAAA">AAAA - Routes traffic to an IPv6 address</option>
                    <option value="CNAME">CNAME - Routes traffic to another domain name</option>
                    <option value="MX">MX - Specifies mail servers</option>
                    <option value="TXT">TXT - Text string for verification / SPF</option>
                    <option value="NS">NS - Name servers for a delegated zone</option>
                    <option value="PTR">PTR - Routes traffic to a domain name (Reverse DNS)</option>
                    <option value="SRV">SRV - Application-specific service records</option>
                    <option value="CAA">CAA - Specifies certificate authorities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#16191F] mb-1">
                    TTL (Seconds)
                  </label>
                  <input
                    type="number"
                    value={newRecord.ttl}
                    onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value) || 300})}
                    className="aws-input"
                    min="0"
                    placeholder="300"
                    required
                  />
                  <p className="text-[11px] text-[#879196] mt-0.5">Default: 300 seconds (5 minutes)</p>
                </div>
              </div>

              {/* Routing Policy */}
              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">
                  Routing policy
                </label>
                <select
                  value={newRecord.routing_policy}
                  onChange={(e) => setNewRecord({...newRecord, routing_policy: e.target.value})}
                  className="aws-select w-full"
                >
                  <option value="Simple">Simple routing - Route traffic to a single resource</option>
                  <option value="Weighted">Weighted - Route traffic proportionally based on assigned weights</option>
                  <option value="Latency">Latency - Route traffic to the region with lowest network latency</option>
                  <option value="Failover">Failover - Route traffic to primary or secondary backup</option>
                  <option value="Geolocation">Geolocation - Route traffic based on geographic location</option>
                  <option value="Multivalue">Multivalue answer - Respond with up to 8 healthy records</option>
                </select>
              </div>

              {/* Value / Route traffic to */}
              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">
                  Value/Route traffic to
                </label>
                <textarea
                  value={newRecord.value}
                  onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                  className="w-full h-28 px-3 py-2 border border-[#879196] rounded-[2px] focus:outline-none focus:border-[#0073BB] focus:ring-1 focus:ring-[#0073BB] text-[13px] font-mono leading-relaxed"
                  placeholder={
                    newRecord.type === "A" ? "192.0.2.1\n198.51.100.2" :
                    newRecord.type === "CNAME" ? "target-domain.example.com." :
                    newRecord.type === "MX" ? "10 mail.example.com." :
                    newRecord.type === "TXT" ? '"v=spf1 include:example.com ~all"' :
                    "Enter one value per line"
                  }
                  required
                />
                <p className="text-[11px] text-[#545B64] mt-1">Enter one value per line. Route 53 will return multiple IP addresses for multi-answer queries.</p>
              </div>
              
              <div className="flex justify-end gap-2 border-t border-[#EAEDED] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="aws-btn-secondary"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="aws-btn-primary"
                >
                  {createLoading ? "Creating..." : "Create records"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hosted Zone Modal */}
      {showEditZone && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-[#D5DBDB]">
            <div className="px-6 py-3.5 border-b border-[#D5DBDB] flex justify-between items-center bg-[#FAFAFA]">
              <h2 className="text-[16px] font-bold text-[#16191F]">Edit hosted zone details</h2>
              <button onClick={() => setShowEditZone(false)} className="text-[#545B64] hover:text-[#16191F] text-sm">✕</button>
            </div>
            
            <form onSubmit={handleEditZone} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">Domain name</label>
                <input
                  type="text"
                  value={editZoneData.name}
                  onChange={(e) => setEditZoneData({...editZoneData, name: e.target.value})}
                  className="aws-input"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">Description - optional</label>
                <input
                  type="text"
                  value={editZoneData.comment}
                  onChange={(e) => setEditZoneData({...editZoneData, comment: e.target.value})}
                  className="aws-input"
                  placeholder="Updated description"
                />
              </div>

              <div>
                <span className="block text-[13px] font-bold text-[#16191F] mb-2">Type</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                    <input
                      type="radio"
                      name="edit-type"
                      checked={!editZoneData.private_zone}
                      onChange={() => setEditZoneData({...editZoneData, private_zone: false})}
                      className="w-3.5 h-3.5 text-[#0073BB] border-[#879196] focus:ring-[#0073BB]"
                    />
                    <span className="font-semibold text-[#16191F]">Public hosted zone</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                    <input
                      type="radio"
                      name="edit-type"
                      checked={editZoneData.private_zone}
                      onChange={() => setEditZoneData({...editZoneData, private_zone: true})}
                      className="w-3.5 h-3.5 text-[#0073BB] border-[#879196] focus:ring-[#0073BB]"
                    />
                    <span className="font-semibold text-[#16191F]">Private hosted zone for Amazon VPC</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 border-t border-[#EAEDED] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditZone(false)}
                  className="aws-btn-secondary"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="aws-btn-primary"
                >
                  {editLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditRecord && editingRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-[#D5DBDB]">
            <div className="px-6 py-3.5 border-b border-[#D5DBDB] flex justify-between items-center bg-[#FAFAFA]">
              <h2 className="text-[16px] font-bold text-[#16191F]">Edit record</h2>
              <button onClick={() => setShowEditRecord(false)} className="text-[#545B64] hover:text-[#16191F] text-sm">✕</button>
            </div>
            
            <form onSubmit={handleUpdateRecord} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">Record name</label>
                <input
                  type="text"
                  value={editingRecord.name}
                  onChange={(e) => setEditingRecord({...editingRecord, name: e.target.value})}
                  className="aws-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#16191F] mb-1">Record type</label>
                  <select
                    value={editingRecord.type}
                    onChange={(e) => setEditingRecord({...editingRecord, type: e.target.value})}
                    className="aws-select w-full"
                  >
                    <option value="A">A - IPv4 address</option>
                    <option value="AAAA">AAAA - IPv6 address</option>
                    <option value="CNAME">CNAME - Canonical name</option>
                    <option value="MX">MX - Mail servers</option>
                    <option value="TXT">TXT - Text record</option>
                    <option value="NS">NS - Name servers</option>
                    <option value="SOA">SOA - Start of authority</option>
                    <option value="PTR">PTR - Pointer</option>
                    <option value="SRV">SRV - Service</option>
                    <option value="CAA">CAA - Certification Authority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#16191F] mb-1">TTL (Seconds)</label>
                  <input
                    type="number"
                    value={editingRecord.ttl}
                    onChange={(e) => setEditingRecord({...editingRecord, ttl: parseInt(e.target.value) || 300})}
                    className="aws-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">Routing policy</label>
                <select
                  value={editingRecord.routing_policy || "Simple"}
                  onChange={(e) => setEditingRecord({...editingRecord, routing_policy: e.target.value})}
                  className="aws-select w-full"
                >
                  <option value="Simple">Simple routing</option>
                  <option value="Weighted">Weighted</option>
                  <option value="Latency">Latency</option>
                  <option value="Failover">Failover</option>
                  <option value="Geolocation">Geolocation</option>
                  <option value="Multivalue">Multivalue answer</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#16191F] mb-1">Value</label>
                <textarea
                  value={editingRecord.value}
                  onChange={(e) => setEditingRecord({...editingRecord, value: e.target.value})}
                  className="w-full h-28 px-3 py-2 border border-[#879196] rounded-[2px] focus:outline-none focus:border-[#0073BB] focus:ring-1 focus:ring-[#0073BB] text-[13px] font-mono leading-relaxed"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 border-t border-[#EAEDED] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditRecord(false)}
                  className="aws-btn-secondary"
                  disabled={editRecordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editRecordLoading}
                  className="aws-btn-primary"
                >
                  {editRecordLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Single Record Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-md border border-[#D5DBDB]">
            <div className="px-6 py-3.5 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center gap-2 text-[#D13212]">
              <AlertTriangle size={18} />
              <h2 className="text-[16px] font-bold text-[#16191F]">Delete record?</h2>
            </div>
            
            <div className="p-6">
              <p className="text-[13px] text-[#16191F] mb-3">
                Are you sure you want to delete this DNS record?
              </p>
              <div className="bg-[#F2F3F3] border border-[#D5DBDB] rounded-[2px] p-3 text-[12px] mb-4 space-y-1">
                <div><span className="text-[#545B64] font-bold">Name: </span><span className="font-mono">{deleteTarget.name}</span></div>
                <div><span className="text-[#545B64] font-bold">Type: </span><span className="font-semibold">{deleteTarget.type}</span></div>
                <div><span className="text-[#545B64] font-bold">TTL: </span><span>{deleteTarget.ttl}s</span></div>
              </div>
              <p className="text-[11px] text-[#879196] mb-4">
                This action cannot be undone. Traffic will no longer be routed by this record.
              </p>
              <div className="flex justify-end gap-2 border-t border-[#EAEDED] pt-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="aws-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRecord}
                  className="aws-btn-danger-solid"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Records Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-md border border-[#D5DBDB]">
            <div className="px-6 py-3.5 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center gap-2 text-[#D13212]">
              <AlertTriangle size={18} />
              <h2 className="text-[16px] font-bold text-[#16191F]">Delete {selectedIds.size} record{selectedIds.size > 1 ? "s" : ""}?</h2>
            </div>
            
            <div className="p-6">
              <p className="text-[13px] text-[#16191F] mb-3">
                Are you sure you want to delete <span className="font-bold">{selectedIds.size}</span> selected record{selectedIds.size > 1 ? "s" : ""}?
              </p>
              <p className="text-[11px] text-[#879196] mb-4">
                This action is permanent and cannot be reversed.
              </p>
              <div className="flex justify-end gap-2 border-t border-[#EAEDED] pt-4">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="aws-btn-secondary"
                  disabled={isDeletingBulk}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                  className="aws-btn-danger-solid"
                >
                  {isDeletingBulk ? "Deleting..." : "Delete records"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
