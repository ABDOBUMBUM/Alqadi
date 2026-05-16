"use client";
import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { Users, Search, Plus, CheckCircle2, XCircle, Clock, MoreVertical, RefreshCw, Loader2, Trash2 } from "lucide-react";

type Client = {
  id: string; name: string; email: string | null; phone: string | null;
  nationality: string | null; loyaltyPts: number; createdAt: string;
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
);

export function CRMSection({ isDark }: { isDark?: boolean }) {
  const { data: clients, loading, error, refetch } = useAdminData<Client[]>("/api/admin/crm");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

  const filtered = (clients || []).filter(c =>
    c.name.includes(search) || (c.email && c.email.includes(search)) || (c.phone && c.phone.includes(search))
  );

  const handleAdd = async () => {
    if (!newClient.name) return;
    try {
      await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      setNewClient({ name: "", email: "", phone: "" });
      setAdding(false);
      refetch();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    try {
      await fetch(`/api/admin/crm?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="h-7 w-7 text-gold-500" /> إدارة العملاء CRM
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {loading ? "جاري التحميل..." : `${clients?.length || 0} عميل مسجل في قاعدة البيانات`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black rounded-xl font-black hover:bg-gold-400 transition-all">
            <Plus className="h-4 w-4" /> إضافة عميل
          </button>
        </div>
      </div>

      {/* Add new client form */}
      {adding && (
        <div className="p-6 rounded-2xl border border-gold-500/20 bg-gold-500/5 space-y-4">
          <h4 className="text-sm font-black text-gold-500 uppercase tracking-widest">عميل جديد</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
              placeholder="الاسم الكامل" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-gold-500/50" />
            <input value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
              placeholder="البريد الإلكتروني" dir="ltr" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-gold-500/50" />
            <input value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))}
              placeholder="رقم الهاتف" dir="ltr" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-gold-500/50" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-6 py-2 bg-gold-500 text-black rounded-xl font-black text-sm hover:bg-gold-400 transition-all">حفظ</button>
            <button onClick={() => setAdding(false)} className="px-6 py-2 bg-white/5 text-white/50 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">إلغاء</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد أو الهاتف..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all" />
      </div>

      {/* Table */}
      <div className="rounded-[2rem] border border-white/5 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : error ? (
          <div className="text-center py-16 text-red-400 font-bold">خطأ في تحميل البيانات: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">العميل</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">البريد</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">الهاتف</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">نقاط الولاء</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">تاريخ التسجيل</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr key={client.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 border border-gold-500/20 flex items-center justify-center font-black text-gold-500 text-sm">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{client.name}</p>
                          <p className="text-[11px] text-white/30 font-mono">{client.nationality || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/60 font-mono">{client.email || "—"}</td>
                    <td className="px-6 py-5 text-sm text-white/60 font-mono">{client.phone || "—"}</td>
                    <td className="px-6 py-5"><span className="font-black text-gold-400">{client.loyaltyPts}</span></td>
                    <td className="px-6 py-5 text-[11px] text-white/40">{new Date(client.createdAt).toLocaleDateString("ar-SA")}</td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleDelete(client.id)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all text-red-400/50 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-16 text-white/30 font-bold">لا توجد نتائج</div>
        )}
      </div>
    </div>
  );
}
