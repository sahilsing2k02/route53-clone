"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, RefreshCw, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/Notification";

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const fetchZoneDetails = async () => {
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
  };

  useEffect(() => {
    if (user) {
      fetchZoneDetails();
    }
  }, [user, zoneId]);

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
  }, [search, typeFilter, pageSize]);

  if (!user || (!zone && loading)) {
    return <div className="p-8 text-[#545B64]">Loading...</div>;
  }

  if (!zone) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-[#545B64] mb-2 flex items-center gap-2">
          <Link href="/hosted-zones" className="text-[#0073BB] hover:underline">Hosted zones</Link>
          <span>&gt;</span>
          <span>{zone.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#16191F]">{zone.name}</h1>
        </div>
      </div>

      {/* Hosted zone details panel */}
      <div className="aws-panel p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#16191F]">Hosted zone details</h2>
          <button 
            onClick={() => setShowEditZone(true)}
            className="aws-btn-secondary flex items-center gap-1"
          >
            <Pencil size={12} />
            Edit details
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-[#545B64] font-bold mb-1">Hosted zone ID</div>
            <div className="text-[#16191F] font-mono text-xs">{zone.id}</div>
          </div>
          <div>
            <div className="text-[#545B64] font-bold mb-1">Type</div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                zone.private_zone
                  ? "bg-[#F1FAFF] text-[#0073BB] border border-[#0073BB]"
                  : "bg-[#F2F8F0] text-[#1D8102] border border-[#1D8102]"
              }`}>
                {zone.private_zone ? "Private" : "Public"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[#545B64] font-bold mb-1">Record count</div>
            <div className="text-[#16191F]">{zone.record_set_count}</div>
          </div>
          <div>
            <div className="text-[#545B64] font-bold mb-1">Description</div>
            <div className="text-[#16191F]">{zone.comment || "-"}</div>
          </div>
        </div>
      </div>

      {/* Records section header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#16191F]">Records</h2>
        <div className="flex gap-2">
          <button 
            onClick={fetchZoneDetails}
            className="aws-btn-icon"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="aws-btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Create record
          </button>
        </div>
      </div>

      {/* Records table with filters */}
      <div className="aws-panel">
        <div className="p-4 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#545B64]" size={16} />
            <input
              type="text"
              placeholder="Find records by name or value"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aws-input !pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#545B64] uppercase">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="aws-select"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>{t === "All" ? "All types" : t}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="aws-table-header px-4 py-3 border-r min-w-[200px]">Record name</th>
                <th className="aws-table-header px-4 py-3 border-r">Type</th>
                <th className="aws-table-header px-4 py-3 border-r">Routing policy</th>
                <th className="aws-table-header px-4 py-3 border-r">TTL (seconds)</th>
                <th className="aws-table-header px-4 py-3 border-r min-w-[300px]">Value/Route traffic to</th>
                <th className="aws-table-header px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#545B64]">Loading...</td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#545B64]">
                    {records.length === 0
                      ? "No records found. Create a record to get started."
                      : "No records match the current filter criteria."}
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F2F3F3]">
                    <td className="aws-table-cell font-bold text-[#16191F]">{record.name}</td>
                    <td className="aws-table-cell">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-[#F2F3F3] text-[#545B64] border border-[#D5DBDB]">
                        {record.type}
                      </span>
                    </td>
                    <td className="aws-table-cell">{record.routing_policy}</td>
                    <td className="aws-table-cell">{record.ttl}</td>
                    <td className="aws-table-cell whitespace-pre-wrap font-mono text-xs text-[#0073BB]">{record.value}</td>
                    <td className="aws-table-cell border-r-0">
                      {["NS", "SOA"].includes(record.type) && record.name === zone.name ? (
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => openEditRecord(record)}
                            className="text-[#0073BB] hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <span className="text-[#545B64] text-xs italic border border-[#D5DBDB] px-1.5 py-0.5 rounded bg-[#FAFAFA]">System</span>
                        </div>
                      ) : (
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => openEditRecord(record)}
                            className="text-[#0073BB] hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteRecord(record)}
                            className="text-[#D13212] hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
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
            <span>{filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}</span>
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

      {/* ===== MODALS ===== */}

      {/* Quick Create Record Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#D5DBDB] flex justify-between items-center bg-[#FAFAFA]">
              <h2 className="text-xl font-bold text-[#16191F]">Quick create record</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#545B64] hover:text-[#16191F] text-lg">✕</button>
            </div>
            
            <form onSubmit={handleCreateRecord} className="overflow-y-auto flex-1 p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Record name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRecord.name}
                    onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                    className="flex-1 aws-input text-right"
                    placeholder="www"
                  />
                  <span className="text-sm font-bold text-[#545B64]">.{zone.name}</span>
                </div>
                <p className="text-xs text-[#545B64] mt-1">Leave blank to create a record for the zone apex.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-[#16191F] mb-1">Record type</label>
                  <select
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    className="aws-select w-full"
                  >
                    <option value="A">A - Routes traffic to an IPv4 address</option>
                    <option value="AAAA">AAAA - Routes traffic to an IPv6 address</option>
                    <option value="CNAME">CNAME - Routes traffic to another domain name</option>
                    <option value="MX">MX - Specifies mail servers</option>
                    <option value="TXT">TXT - Text string for verification</option>
                    <option value="NS">NS - Name servers for a hosted zone</option>
                    <option value="PTR">PTR - Routes traffic to a domain name</option>
                    <option value="SRV">SRV - Application-specific values</option>
                    <option value="CAA">CAA - Specifies certificate authorities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#16191F] mb-1">TTL (Seconds)</label>
                  <input
                    type="number"
                    value={newRecord.ttl}
                    onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value) || 300})}
                    className="aws-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Routing policy</label>
                <select
                  value={newRecord.routing_policy}
                  onChange={(e) => setNewRecord({...newRecord, routing_policy: e.target.value})}
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

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Value</label>
                <textarea
                  value={newRecord.value}
                  onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                  className="w-full h-32 px-3 py-1.5 border border-[#879196] rounded-[2px] focus:outline-none focus:border-[#0073BB] focus:ring-1 focus:ring-[#0073BB] text-sm font-mono"
                  placeholder="Enter one value per line"
                  required
                />
                <p className="text-xs text-[#545B64] mt-1">Enter multiple values on separate lines.</p>
              </div>
              
              <div className="flex gap-4 justify-end mt-8 border-t border-[#D5DBDB] pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="aws-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="aws-btn-primary disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#D5DBDB] flex justify-between items-center bg-[#FAFAFA]">
              <h2 className="text-xl font-bold text-[#16191F]">Edit hosted zone details</h2>
              <button onClick={() => setShowEditZone(false)} className="text-[#545B64] hover:text-[#16191F] text-lg">✕</button>
            </div>
            
            <form onSubmit={handleEditZone} className="overflow-y-auto flex-1 p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Domain name</label>
                <input
                  type="text"
                  value={editZoneData.name}
                  onChange={(e) => setEditZoneData({...editZoneData, name: e.target.value})}
                  className="w-full aws-input"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Description</label>
                <input
                  type="text"
                  value={editZoneData.comment}
                  onChange={(e) => setEditZoneData({...editZoneData, comment: e.target.value})}
                  className="w-full aws-input"
                />
              </div>

              <div className="mb-4">
                <span className="block text-sm font-bold text-[#16191F] mb-2">Type</span>
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-type"
                      checked={!editZoneData.private_zone}
                      onChange={() => setEditZoneData({...editZoneData, private_zone: false})}
                      className="w-4 h-4 text-[#0073BB] border-[#879196] focus:ring-[#0073BB]"
                    />
                    <span className="font-bold text-[#16191F]">Public hosted zone</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-type"
                      checked={editZoneData.private_zone}
                      onChange={() => setEditZoneData({...editZoneData, private_zone: true})}
                      className="w-4 h-4 text-[#0073BB] border-[#879196] focus:ring-[#0073BB]"
                    />
                    <span className="font-bold text-[#16191F]">Private hosted zone</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-4 justify-end mt-8 border-t border-[#D5DBDB] pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditZone(false)}
                  className="aws-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="aws-btn-primary disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#D5DBDB] flex justify-between items-center bg-[#FAFAFA]">
              <h2 className="text-xl font-bold text-[#16191F]">Edit record</h2>
              <button onClick={() => setShowEditRecord(false)} className="text-[#545B64] hover:text-[#16191F] text-lg">✕</button>
            </div>
            
            <form onSubmit={handleUpdateRecord} className="overflow-y-auto flex-1 p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Record name</label>
                <input
                  type="text"
                  value={editingRecord.name}
                  onChange={(e) => setEditingRecord({...editingRecord, name: e.target.value})}
                  className="w-full aws-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-[#16191F] mb-1">Record type</label>
                  <select
                    value={editingRecord.type}
                    onChange={(e) => setEditingRecord({...editingRecord, type: e.target.value})}
                    className="aws-select w-full"
                  >
                    <option value="A">A - IPv4 address</option>
                    <option value="AAAA">AAAA - IPv6 address</option>
                    <option value="CNAME">CNAME - Another domain name</option>
                    <option value="MX">MX - Mail servers</option>
                    <option value="TXT">TXT - Text string</option>
                    <option value="NS">NS - Name servers</option>
                    <option value="PTR">PTR - Domain name</option>
                    <option value="SRV">SRV - Application-specific</option>
                    <option value="CAA">CAA - Certificate authorities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#16191F] mb-1">TTL (Seconds)</label>
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

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#16191F] mb-1">Value</label>
                <textarea
                  value={editingRecord.value}
                  onChange={(e) => setEditingRecord({...editingRecord, value: e.target.value})}
                  className="w-full h-32 px-3 py-1.5 border border-[#879196] rounded-[2px] focus:outline-none focus:border-[#0073BB] focus:ring-1 focus:ring-[#0073BB] text-sm font-mono"
                  placeholder="Enter one value per line"
                  required
                />
              </div>
              
              <div className="flex gap-4 justify-end mt-8 border-t border-[#D5DBDB] pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditRecord(false)}
                  className="aws-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editRecordLoading}
                  className="aws-btn-primary disabled:opacity-50"
                >
                  {editRecordLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-[#D5DBDB] bg-[#FAFAFA]">
              <h2 className="text-lg font-bold text-[#16191F]">Delete record</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#16191F] mb-2">
                Are you sure you want to delete this record?
              </p>
              <div className="bg-[#F2F3F3] border border-[#D5DBDB] rounded-sm p-3 text-sm mb-4">
                <div className="flex gap-4">
                  <div>
                    <span className="text-[#545B64] font-bold">Name: </span>
                    <span className="font-mono">{deleteTarget.name}</span>
                  </div>
                  <div>
                    <span className="text-[#545B64] font-bold">Type: </span>
                    <span>{deleteTarget.type}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#545B64] mb-4">
                This action cannot be undone. The record will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="aws-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRecord}
                  className="bg-[#D13212] hover:bg-[#B02A0D] text-white font-bold py-[4px] px-[12px] text-sm rounded-[2px] shadow-sm transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
