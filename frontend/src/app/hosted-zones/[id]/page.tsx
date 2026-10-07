"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, RefreshCw, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function HostedZoneDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const zoneId = unwrappedParams.id;
  const { user } = useAuth();
  const router = useRouter();
  
  const [zone, setZone] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchZoneDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/hosted-zones/${zoneId}`);
      if (res.ok) {
        const data = await res.json();
        setZone(data);
        setRecords(data.records);
      } else {
        router.push("/hosted-zones");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchZoneDetails();
    }
  }, [user, zoneId]);

  const handleDeleteRecord = async (recordId: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/records/${recordId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchZoneDetails();
        }
      } catch (err) {
        console.error(err);
      }
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
        fetchZoneDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) || r.value.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || (!zone && loading)) {
    return <div className="p-8 text-[#545B64]">Loading...</div>;
  }

  if (!zone) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
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

      <div className="aws-panel p-4 mb-6">
        <h2 className="text-lg font-bold text-[#16191F] mb-4">Hosted zone details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-[#545B64] font-bold mb-1">Hosted zone ID</div>
            <div className="text-[#16191F]">{zone.id}</div>
          </div>
          <div>
            <div className="text-[#545B64] font-bold mb-1">Type</div>
            <div className="text-[#16191F]">{zone.private_zone ? "Private" : "Public"}</div>
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#16191F]">Records</h2>
        <div className="flex gap-2">
          <button 
            onClick={fetchZoneDetails}
            className="aws-btn-secondary flex items-center justify-center p-[6px]"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="aws-btn-primary flex items-center gap-2"
          >
            Create record
          </button>
        </div>
      </div>

      <div className="aws-panel">
        <div className="p-4 border-b border-[#D5DBDB] bg-[#FAFAFA] flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#545B64]" size={16} />
            <input
              type="text"
              placeholder="Find records by name or value"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aws-input pl-9"
            />
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
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#545B64]">No records found.</td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F2F3F3]">
                    <td className="aws-table-cell font-bold text-[#16191F]">{record.name}</td>
                    <td className="aws-table-cell">{record.type}</td>
                    <td className="aws-table-cell">{record.routing_policy}</td>
                    <td className="aws-table-cell">{record.ttl}</td>
                    <td className="aws-table-cell whitespace-pre-wrap font-mono text-xs text-[#0073BB]">{record.value}</td>
                    <td className="aws-table-cell border-r-0">
                      {["NS", "SOA"].includes(record.type) && record.name === zone.name ? (
                        <span className="text-[#545B64] text-xs italic">System</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-[#D13212] hover:underline flex items-center gap-1 font-bold"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-[#FAFAFA] flex justify-between items-center text-sm text-[#545B64] border-t border-[#D5DBDB]">
          <div>{filteredRecords.length} records</div>
        </div>
      </div>

      {/* Quick Create Record Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#D5DBDB] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#16191F]">Quick create record</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#545B64] hover:text-[#16191F]">✕</button>
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
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-[#16191F] mb-1">Record type</label>
                  <select
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    className="aws-input"
                  >
                    <option value="A">A - Routes traffic to an IPv4 address and some AWS resources</option>
                    <option value="AAAA">AAAA - Routes traffic to an IPv6 address and some AWS resources</option>
                    <option value="CNAME">CNAME - Routes traffic to another domain name and to some AWS resources</option>
                    <option value="MX">MX - Specifies mail servers</option>
                    <option value="TXT">TXT - Routes traffic to text strings</option>
                    <option value="PTR">PTR - Routes traffic to a domain name</option>
                    <option value="SRV">SRV - Routes traffic to an IP address</option>
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
                <label className="block text-sm font-bold text-[#16191F] mb-1">Value</label>
                <textarea
                  value={newRecord.value}
                  onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                  className="w-full h-32 px-3 py-1.5 border border-[#879196] rounded-[2px] focus:outline-none focus:border-[#0073BB] focus:ring-1 focus:ring-[#0073BB] text-sm font-mono"
                  placeholder="Enter multiple values on separate lines"
                  required
                />
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
    </div>
  );
}
