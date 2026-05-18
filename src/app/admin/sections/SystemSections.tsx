"use client";
import { useState, useEffect } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { DollarSign, UserPlus, Building, Layers, ShieldCheck, Settings, Save, CheckCircle2, Plus, Trash2, RefreshCw, Globe2 } from "lucide-react";

const Skeleton = ({ className = "" }: { className?: string }) => <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-gold-500" : "bg-white/10"}`}>
    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? "left-6" : "left-1"}`} />
  </button>
);

// â”€â”€â”€ Employees (from DB) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type EmployeeType = {
  id: string; name: string; username: string; role: string;
  branchId: string | null; phone: string | null; email: string | null;
  active: boolean; title: string | null; shift: string | null;
  branch?: { id: string; name: string };
};

const ROLES: Record<string, string> = { admin: "Ù…Ø¯ÙŠØ±", supervisor: "Ù…Ø´Ø±Ù", agent: "ÙˆÙƒÙŠÙ„", accountant: "Ù…Ø­Ø§Ø³Ø¨", manager: "Ù…Ø¯ÙŠØ± ÙØ±Ø¹" };
const SHIFTS = ["ØµØ¨Ø§Ø­ÙŠ", "Ù…Ø³Ø§Ø¦ÙŠ", "Ù„ÙŠÙ„ÙŠ"];

export function EmployeesSection({ isDark }: { isDark?: boolean }) {
  const { data: emps, loading, refetch } = useAdminData<EmployeeType[]>("/api/admin/employees");
  const { data: branches } = useAdminData<any[]>("/api/admin/branches");
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", password: "", role: "agent", branchId: "", title: "", shift: "" });

  const handleToggle = async (id: string, active: boolean) => {
    await fetch("/api/admin/employees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active: !active }) });
    refetch();
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„Ù…ÙˆØ¸ÙØŸ")) return;
    await fetch(`/api/admin/employees?id=${id}`, { method: "DELETE" });
    refetch();
  };
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) return alert("ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„");
    
    await fetch("/api/admin/employees", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(formData) 
    });
    setFormData({ name: "", username: "", password: "", role: "agent", branchId: branches?.[0]?.id || "", title: "", shift: "" });
    setShowAdd(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><UserPlus className="h-7 w-7 text-gold-500" /> Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„..." : `${emps?.length || 0} Ù…ÙˆØ¸Ù ÙÙŠ Ø§Ù„Ù†Ø¸Ø§Ù…`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${showAdd ? "bg-white/10 text-white" : "bg-gold-500 text-black hover:bg-gold-400"}`}>
            {showAdd ? "Ø¥Ù„ØºØ§Ø¡" : <><Plus className="h-4 w-4" /> Ø¥Ø¶Ø§ÙØ© Ù…ÙˆØ¸Ù</>}
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-3xl border border-gold-500/20 bg-gold-500/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="Ù…Ø«Ø§Ù„: Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…Ø¯" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…</label>
              <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="ahmed_qadi" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Ø§Ù„Ø¯ÙˆØ± (Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ§Øª)</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all appearance-none">
                {Object.entries(ROLES).map(([val, lbl]) => <option key={val} value={val} className="bg-[#1a1610]">{lbl}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Ø§Ù„Ù…Ø³Ù…Ù‰ Ø§Ù„ÙˆØ¸ÙŠÙÙŠ</label>
              <input list="job-titles" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="Ø§ÙƒØªØ¨ Ø£Ùˆ Ø§Ø®ØªØ± Ø§Ù„Ù…Ø³Ù…Ù‰ Ø§Ù„ÙˆØ¸ÙŠÙÙŠ..." />
              <datalist id="job-titles">
                <option value="Ù…ÙˆØ¸Ù Ø­Ø¬ÙˆØ²Ø§Øª Ø·ÙŠØ±Ø§Ù†" />
                <option value="Ù…Ù†Ø³Ù‚ ØªØ£Ø´ÙŠØ±Ø§Øª" />
                <option value="Ù…ÙˆØ¸Ù Ø§Ø³ØªÙ‚Ø¨Ø§Ù„" />
                <option value="Ù…Ø³Ø¤ÙˆÙ„ Ø£ÙŠØ¯ÙŠ Ø¹Ø§Ù…Ù„Ø©" />
                <option value="Ù…Ø­Ø§Ø³Ø¨ Ù…Ø§Ù„ÙŠ" />
                <option value="Ù…Ø¯ÙŠØ± ÙØ±Ø¹" />
                <option value="Ù…Ø³Ø¤ÙˆÙ„ Ø¹Ù„Ø§Ù‚Ø§Øª Ø¹Ø§Ù…Ø©" />
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ø¯ÙˆØ§Ù…</label>
              <input list="shift-times" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="Ø§ÙƒØªØ¨ Ø£Ùˆ Ø§Ø®ØªØ± Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø¯ÙˆØ§Ù…..." />
              <datalist id="shift-times">
                <option value="ØµØ¨Ø§Ø­ÙŠ (8:00 Øµ - 4:00 Ù…)" />
                <option value="Ù…Ø³Ø§Ø¦ÙŠ (4:00 Ù… - 12:00 Øµ)" />
                <option value="Ù„ÙŠÙ„ÙŠ (12:00 Øµ - 8:00 Øµ)" />
                <option value="Ø¯ÙˆØ§Ù… Ù…Ø±Ù†" />
                <option value="Ø¯ÙˆØ§Ù… Ø¬Ø²Ø¦ÙŠ" />
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Ø§Ù„ÙØ±Ø¹</label>
              <select value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all appearance-none">
                <option value="" className="bg-[#1a1610]">Ø§Ø®ØªØ± Ø§Ù„ÙØ±Ø¹...</option>
                {branches?.map(b => <option key={b.id} value={b.id} className="bg-[#1a1610]">{b.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full h-[52px] bg-gold-500 text-black rounded-xl font-black hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10">Ø­ÙØ¸ Ø§Ù„Ù…ÙˆØ¸Ù Ø§Ù„Ø¬Ø¯ÙŠØ¯</button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="space-y-4">
          {(emps || []).map(emp => (
            <div key={emp.id} className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
              <div className="grid md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-gold-500 font-black text-lg border border-white/10">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 font-black uppercase mb-0.5">Ø§Ù„Ø§Ø³Ù…</p>
                    <p className="font-black text-white">{emp.name}</p>
                    {emp.username === "admin" && <span className="text-[9px] bg-gold-500/10 text-gold-500 px-1.5 py-0.5 rounded-md font-bold">Ø­Ø³Ø§Ø¨ Ø±Ø¦ÙŠØ³ÙŠ</span>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1.5">Ø§Ù„ÙˆØ¸ÙŠÙØ© / Ø§Ù„Ø¯ÙˆØ§Ù…</p>
                  <p className="font-mono text-white/70 text-sm">{emp.title || ROLES[emp.role] || emp.role} <span className="text-white/20 mx-2">â€¢</span> {emp.shift || "ØºÙŠØ± Ù…Ø­Ø¯Ø¯"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1.5">Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ© / Ø§Ù„ÙØ±Ø¹</p>
                  <p className="text-sm text-white/70 font-bold">{ROLES[emp.role] || emp.role} <span className="text-white/20 mx-2">â€¢</span> {emp.branch?.name || "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ"}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 font-black">Ù†Ø´Ø·</span>
                    <Toggle value={emp.active} onChange={() => handleToggle(emp.id, emp.active)} />
                  </div>
                  <div className="flex gap-2">
                    {emp.username !== "admin" && (
                      <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-400/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(emps || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…ÙˆØ¸ÙÙˆÙ†</div>}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Audit Log (from DB) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type AuditLogType = {
  id: string; action: string; entity: string; entityId: string;
  employeeId: string | null; details: any; createdAt: string;
};

export function AuditLogSection({ isDark }: { isDark?: boolean }) {
  const { data: logs, loading, refetch } = useAdminData<AuditLogType[]>("/api/admin/audit?limit=50");

  const ACTION_COLORS: Record<string, string> = {
    CREATE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    UPDATE: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    DELETE: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-gold-500" /> Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±Ø§Ù‚Ø¨Ø©</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„..." : `${logs?.length || 0} Ø³Ø¬Ù„`}</p>
        </div>
        <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : (
        <div className="rounded-[2rem] border border-white/5 bg-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡", "Ø§Ù„ÙƒÙŠØ§Ù†", "Ø§Ù„Ù…Ø¹Ø±Ù", "Ø§Ù„ØªØ§Ø±ÙŠØ®", "Ø§Ù„Ù†ÙˆØ¹"].map(h => (
                  <th key={h} className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(logs || []).map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full border uppercase tracking-wider ${ACTION_COLORS[log.action] || ""}`}>
                      {log.action === "CREATE" ? "Ø¥Ù†Ø´Ø§Ø¡" : log.action === "UPDATE" ? "ØªØ¹Ø¯ÙŠÙ„" : log.action === "DELETE" ? "Ø­Ø°Ù" : log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-sm">{log.entity}</td>
                  <td className="px-6 py-4 font-mono text-xs text-white/40">{log.entityId.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-xs text-white/40">{new Date(log.createdAt).toLocaleString("ar-SA")}</td>
                  <td className="px-6 py-4 text-xs text-white/40">{log.employeeId ? "Ù…ÙˆØ¸Ù" : "Ù†Ø¸Ø§Ù…"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(logs || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø³Ø¬Ù„Ø§Øª</div>}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Pricing (local) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type PricingType = { id: string; destination: string; ticket: number; security: number; visa: number; active: boolean; };

export function PricingSection({ isDark }: { isDark?: boolean }) {
  const { data: rows, loading, refetch } = useAdminData<PricingType[]>("/api/pricing");

  const upd = async (id: string, key: string, val: string | number) => {
    try {
      await fetch("/api/pricing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [key]: val }) });
      refetch();
    } catch {}
  };
  const add = async () => {
    try {
      await fetch("/api/pricing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ destination: "ÙˆØ¬Ù‡Ø© Ø¬Ø¯ÙŠØ¯Ø©", ticket: 0, security: 0, visa: 0 }) });
      refetch();
    } catch {}
  };
  const del = async (id: string) => {
    if (!confirm("Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ØŸ")) return;
    try {
      await fetch(`/api/pricing?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><DollarSign className="h-7 w-7 text-gold-500" /> Ø§Ù„ØªØ³Ø¹ÙŠØ± Ø§Ù„Ø°ÙƒÙŠ</h2>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> Ø¥Ø¶Ø§ÙØ©</button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
      <div className="rounded-[2rem] border border-white/5 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["Ø§Ù„ÙˆØ¬Ù‡Ø©","Ø³Ø¹Ø± Ø§Ù„ØªØ°ÙƒØ±Ø©","Ø±Ø³ÙˆÙ… Ø§Ù„Ø£Ù…Ù†","Ø±Ø³ÙˆÙ… Ø§Ù„ØªØ£Ø´ÙŠØ±Ø©","Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ",""].map(h=><th key={h} className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">{h}</th>)}</tr></thead>
          <tbody>{(rows || []).map(row=>{const total=row.ticket+row.security+row.visa;return(
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
              <td className="px-6 py-4"><input value={row.destination} onChange={e=>upd(row.id,"destination",e.target.value)} className="font-bold text-white bg-transparent border-b border-white/10 focus:border-gold-500 outline-none w-28 transition-colors"/></td>
              {(["ticket","security","visa"] as const).map(k=><td key={k} className="px-6 py-4"><div className="flex items-center gap-1"><input type="number" value={(row as any)[k]} onChange={e=>upd(row.id,k,parseFloat(e.target.value)||0)} className="w-16 font-black text-gold-400 bg-white/5 rounded-lg p-1.5 outline-none text-sm text-center"/><span className="text-[10px] text-white/30 font-bold">$</span></div></td>)}
              <td className="px-6 py-4"><span className="font-black text-emerald-400 text-base">${total}</span></td>
              <td className="px-6 py-4"><button onClick={()=>del(row.id)} className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all"><Trash2 className="h-4 w-4"/></button></td>
            </tr>);})}</tbody>
        </table>
        {(rows || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª ØªØ³Ø¹ÙŠØ±</div>}
      </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Branches (local) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type BranchType = { id: string; name: string; city: string; phone: string | null; active: boolean; };

export function BranchesSection({ isDark }: { isDark?: boolean }) {
  const { data: branches, loading, refetch } = useAdminData<BranchType[]>("/api/admin/branches");

  const add = async () => {
    try {
      await fetch("/api/admin/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "ÙØ±Ø¹ Ø¬Ø¯ÙŠØ¯", city: "â€”", phone: "" }) });
      refetch();
    } catch {}
  };
  const upd = async (id: string, key: string, val: any) => {
    try {
      await fetch("/api/admin/branches", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [key]: val }) });
      refetch();
    } catch {}
  };
  const del = async (id: string) => {
    if (!confirm("Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ØŸ")) return;
    try {
      await fetch(`/api/admin/branches?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Building className="h-7 w-7 text-gold-500" /> Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ÙØ±ÙˆØ¹</h2>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> Ø¥Ø¶Ø§ÙØ© ÙØ±Ø¹</button>
        </div>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(branches || []).map(b => (
          <div key={b.id} className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500"><Building className="h-6 w-6" /></div>
              <div className="flex items-center gap-2">
                <Toggle value={b.active} onChange={() => upd(b.id, "active", !b.active)} />
                <button onClick={() => del(b.id)} className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <input value={b.name} onChange={e => upd(b.id, "name", e.target.value)} className="font-black text-white text-base mb-2 bg-transparent border-b border-white/10 focus:border-gold-500 outline-none w-full" />
            <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-xs font-bold text-white/40">
              <input value={b.city} onChange={e => upd(b.id, "city", e.target.value)} className="bg-transparent outline-none w-20" placeholder="Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©" />
              <input value={b.phone || ""} onChange={e => upd(b.id, "phone", e.target.value)} className="bg-transparent font-mono outline-none w-full" placeholder="Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ" />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

// â”€â”€â”€ CMS (local) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type CmsPageType = { id: string; slug: string; title: string; content: any; };

const CMS_PAGES = [
  { slug: "home", label: "Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", desc: "Ø®Ø¯Ù…Ø§ØªØŒ Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª" },
  { slug: "about", label: "Ù…Ù† Ù†Ø­Ù†", desc: "ØªØ§Ø±ÙŠØ® Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø©" },
  { slug: "travel", label: "Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©", desc: "ÙˆØ¬Ù‡Ø§Øª ÙˆØ¹Ø±ÙˆØ¶" },
  { slug: "hotels", label: "Ø§Ù„ÙÙ†Ø§Ø¯Ù‚", desc: "Ø§Ù„Ù†ØµÙˆØµ ÙˆØ§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ†" },
  { slug: "visa", label: "Ø§Ù„ØªØ£Ø´ÙŠØ±Ø§Øª", desc: "Ø§Ù„Ù†ØµÙˆØµ ÙˆØ§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ†" },
  { slug: "manpower", label: "Ø§Ù„Ø£ÙŠØ¯ÙŠ Ø§Ù„Ø¹Ø§Ù…Ù„Ø©", desc: "Ø§Ù„Ù†ØµÙˆØµ ÙˆØ§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ†" },
  { slug: "clients", label: "Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡", desc: "Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª ÙˆØ§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª" },
  { slug: "blog", label: "Ø§Ù„Ù…Ø¯ÙˆÙ†Ø©", desc: "Ù…Ø­ØªÙˆÙ‰ ØµÙØ­Ø© Ø§Ù„Ù…Ù‚Ø§Ù„Ø§Øª" },
  { slug: "vip", label: "Ø¨ÙˆØ§Ø¨Ø© VIP", desc: "Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ØªØ¹Ø±ÙŠÙÙŠ" },
  { slug: "faq", label: "Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©", desc: "FAQs" },
  { slug: "contact", label: "Ø§ØªØµÙ„ Ø¨Ù†Ø§", desc: "Ø§Ù„ÙØ±ÙˆØ¹" },
  { slug: "privacy", label: "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©", desc: "Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø®ØµÙˆØµÙŠØ©" },
  { slug: "cookies", label: "Ø³ÙŠØ§Ø³Ø© Ø§Ù„ÙƒÙˆÙƒÙŠØ²", desc: "Ù…Ø­ØªÙˆÙ‰ Ù…Ù„ÙØ§Øª Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·" },
  { slug: "trust", label: "Ø§Ù„Ø«Ù‚Ø© ÙˆØ§Ù„Ø£Ù…Ø§Ù†", desc: "Ø§Ù„ØªØ±Ø§Ø®ÙŠØµ ÙˆØ§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª" },
  { slug: "en_home", label: "English Home", desc: "English Frontpage Content" },
  // â•â•â• PORTAL PAGES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  { slug: "booking_portal", label: "ðŸš€ Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ø°ÙƒÙŠ", desc: "HeroØŒ Bento CardsØŒ Ø¢Ù„ÙŠØ© Ø§Ù„Ø¹Ù…Ù„" },
];

const KEY_LABELS: Record<string, string> = {
  heroTitle: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ", heroSubtitle: "Ø§Ù„ÙˆØµÙ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ", heroTagline: "Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø§ÙØªØªØ§Ø­ÙŠØ©",
  services: "Ø§Ù„Ø®Ø¯Ù…Ø§Øª", stats: "Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª", whyUsTitle: "Ø¹Ù†ÙˆØ§Ù† Ù‚Ø³Ù… Ù„Ù…Ø§Ø°Ø§ Ù†Ø­Ù†",
  whyUsText: "Ù†Øµ Ù‚Ø³Ù… Ù„Ù…Ø§Ø°Ø§ Ù†Ø­Ù†", pageTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ØµÙØ­Ø©", pageSubtitle: "ÙˆØµÙ Ø§Ù„ØµÙØ­Ø©",
  sectionTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù‚Ø³Ù…", title: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù†", desc: "Ø§Ù„ÙˆØµÙ", value: "Ø§Ù„Ù‚ÙŠÙ…Ø©",
  label: "Ø§Ù„ØªØ³Ù…ÙŠØ© (Label)", icon: "Ø£ÙŠÙ‚ÙˆÙ†Ø© (Ø§Ø³Ù…/ÙƒÙˆØ¯)", href: "Ø§Ù„Ø±Ø§Ø¨Ø·", features: "Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª",
  heroTitlePart1: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ (Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø£ÙˆÙ„)", heroTitlePart2: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ (Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø«Ø§Ù†ÙŠ)",
  servicesTagline: "Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø§ÙØªØªØ§Ø­ÙŠØ© Ù„Ù„Ø®Ø¯Ù…Ø§Øª", servicesTitle: "Ø¹Ù†ÙˆØ§Ù† Ù‚Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø§Øª",
  whyUsTagline: "Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø§ÙØªØªØ§Ø­ÙŠØ© Ù„Ù„Ù…Ø§Ø°Ø§ Ù†Ø­Ù†", whyUsGrid: "Ø´Ø¨ÙƒØ© Ù„Ù…Ø§Ø°Ø§ Ù†Ø­Ù†",
  whyUsFeatures: "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª", heroFeatures: "Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
  employersTitle: "Ø¹Ù†ÙˆØ§Ù† Ø£ØµØ­Ø§Ø¨ Ø§Ù„Ø¹Ù…Ù„", employersText: "Ù†Øµ Ø£ØµØ­Ø§Ø¨ Ø§Ù„Ø¹Ù…Ù„", 
  employersFeatures: "Ù‚Ø§Ø¦Ù…Ø© Ù…Ù…ÙŠØ²Ø§Øª Ø£ØµØ­Ø§Ø¨ Ø§Ù„Ø¹Ù…Ù„", employersCTA: "Ø²Ø± Ø¯Ø¹ÙˆØ© Ø£ØµØ­Ø§Ø¨ Ø§Ù„Ø¹Ù…Ù„", 
  jobsTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙˆØ¸Ø§Ø¦Ù", jobsText: "Ù†Øµ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù", jobsCTA: "Ø²Ø± Ø§Ù„ÙˆØ¸Ø§Ø¦Ù", 
  processTitle: "Ø¹Ù†ÙˆØ§Ù† Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„", processText: "Ù†Øµ Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„", processSteps: "Ø®Ø·ÙˆØ§Øª Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„",
  visionTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø±Ø¤ÙŠØ©", visionDesc: "ÙˆØµÙ Ø§Ù„Ø±Ø¤ÙŠØ©", missionTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù…Ù‡Ù…Ø©", 
  missionDesc: "ÙˆØµÙ Ø§Ù„Ù…Ù‡Ù…Ø©", valuesTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù‚ÙŠÙ…", values: "Ø§Ù„Ù‚ÙŠÙ…", 
  milestonesTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²Ø§Øª", milestones: "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²Ø§Øª", 
  branchesTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙØ±ÙˆØ¹", branches: "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ÙØ±ÙˆØ¹", ctaTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡", 
  ctaDesc: "ÙˆØµÙ Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡", ctaButton: "Ù†Øµ Ø²Ø± Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡", filters: "Ø§Ù„ØªØµÙ†ÙŠÙØ§Øª", 
  all: "Ø§Ù„ÙƒÙ„", fiveStar: "5 Ù†Ø¬ÙˆÙ…", fourStar: "4 Ù†Ø¬ÙˆÙ…", threeStar: "3 Ù†Ø¬ÙˆÙ…", 
  makkah: "Ù…ÙƒØ©", madinah: "Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©", ctaText: "Ù†Øµ Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡", bookingBtn: "Ø²Ø± Ø§Ù„Ø­Ø¬Ø²", 
  whatsappBtn: "Ø²Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨", callBtn: "Ø²Ø± Ø§Ù„Ø§ØªØµØ§Ù„", companyName: "Ø§Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ©", 
  experience: "Ø§Ù„Ø®Ø¨Ø±Ø© Ø§Ù„Ù…ÙƒØªÙˆØ¨Ø©", newsletterTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù†Ø´Ø±Ø© Ø§Ù„Ø¨Ø±ÙŠØ¯ÙŠØ©", 
  newsletterText: "Ù†Øµ Ø§Ù„Ù†Ø´Ø±Ø© Ø§Ù„Ø¨Ø±ÙŠØ¯ÙŠØ©", newsletterPlaceholder: "Ù†Øµ Ø­Ù‚Ù„ Ø§Ù„Ø¥Ø¯Ø®Ø§Ù„", 
  newsletterButton: "Ø²Ø± Ø§Ù„Ù†Ø´Ø±Ø©", newsletterLoading: "Ù†Øµ Ø§Ù„ØªØ­Ù…ÙŠÙ„", newsletterSuccess: "Ù†Øµ Ø§Ù„Ù†Ø¬Ø§Ø­",
  items: "Ø§Ù„Ø¹Ù†Ø§ØµØ± Ø§Ù„Ù…ØªÙØ±Ø¹Ø©", steps: "Ø§Ù„Ø®Ø·ÙˆØ§Øª", advantages: "Ø§Ù„Ù…Ø²Ø§ÙŠØ§ Ø§Ù„Ø¥Ø¶Ø§ÙÙŠØ©",
  tagline: "Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…ÙØªØ§Ø­ÙŠØ©", subtitle: "Ø§Ù„ÙˆØµÙ Ø§Ù„ÙØ±Ø¹ÙŠ",
  bookingTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø­Ø¬Ø²", bookingSubtitle: "ÙˆØµÙ Ø§Ù„Ø­Ø¬Ø² Ø§Ù„ÙØ±Ø¹ÙŠ",
  destinationsTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙˆØ¬Ù‡Ø§Øª", packagesTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¨Ø§Ù‚Ø§Øª",
  packagesSubtitle: "ÙˆØµÙ Ø§Ù„Ø¨Ø§Ù‚Ø§Øª", heroTags: "ÙˆØ³ÙˆÙ… Ù‚Ø³Ù… Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©",
  destinationsBtn: "Ø²Ø± ØªÙ‚Ø¯ÙŠÙ… Ø·Ù„Ø¨ Ø§Ù„ØªØ£Ø´ÙŠØ±Ø©", destinationsDesc: "ÙˆØµÙ Ø£Ù‚Ø³Ø§Ù… Ø§Ù„ØªØ£Ø´ÙŠØ±Ø©",
  stepsTitle: "Ø¹Ù†ÙˆØ§Ù† Ø®Ø·ÙˆØ§Øª Ø§Ù„ØªØ£Ø´ÙŠØ±Ø©", ctaBtn: "Ù†Øµ Ø²Ø± Ø§Ù„Ø¯Ø¹ÙˆØ©",
  pageContent: "Ù…Ø­ØªÙˆÙ‰ Ø§Ù„ØµÙØ­Ø©", sections: "Ø§Ù„Ø£Ù‚Ø³Ø§Ù…",
  lastUpdated: "ØªØ§Ø±ÙŠØ® Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«", contactTitle: "Ø¹Ù†ÙˆØ§Ù† Ù‚Ø³Ù… Ø§Ù„ØªÙˆØ§ØµÙ„",
  contactBody: "Ù†Øµ Ù‚Ø³Ù… Ø§Ù„ØªÙˆØ§ØµÙ„", body: "Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù‚Ø³Ù…",
  bullets: "Ù†Ù‚Ø§Ø· Ø§Ù„Ù‚Ø³Ù…", text: "Ù†Øµ",
  // â•â•â• BOOKING PORTAL SPECIFIC KEYS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  badgeText: "Ù†Øµ Ø§Ù„Ø´Ø§Ø±Ø© Ø§Ù„Ø¹Ù„ÙˆÙŠØ© (badge)",
  engineName: "Ø§Ø³Ù… Ù…Ø­Ø±Ùƒ Ø§Ù„Ø­Ø¬Ø² (Engine Name)",
  heroParagraph: "Ø§Ù„ÙˆØµÙ Ø§Ù„ØªÙØµÙŠÙ„ÙŠ ÙÙŠ Ø§Ù„Ù€ Hero",
  heroCTA: "Ù†Øµ Ø²Ø± Ø§Ù„Ø¨Ø¯Ø¡ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
  radarTitle: "Ø¹Ù†ÙˆØ§Ù† Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø±Ø§Ø¯Ø§Ø± 360Â°",
  radarDesc: "ÙˆØµÙ Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø±Ø§Ø¯Ø§Ø±",
  successRateTitle: "Ø¹Ù†ÙˆØ§Ù† Ø¨Ø·Ø§Ù‚Ø© Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²",
  successRateDesc: "Ø§Ù„ÙˆØµÙ Ø§Ù„ØªØ­Ù„ÙŠÙ„ÙŠ Ù„Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²",
  successRateValue: "Ù‚ÙŠÙ…Ø© Ù†Ø³Ø¨Ø© Ø§Ù„Ø¥Ù†Ø¬Ø§Ø² (%)",
  successRateLive: "Ù†Øµ Ù…Ø¤Ø´Ø± Ø§Ù„Ø¨Ø« Ø§Ù„Ù…Ø¨Ø§Ø´Ø±",
  supportTeamTitle: "Ø¹Ù†ÙˆØ§Ù† Ø¨Ø·Ø§Ù‚Ø© ÙØ±ÙŠÙ‚ Ø§Ù„Ø¯Ø¹Ù…",
  supportTeamDesc: "Ø§Ù„ÙˆØµÙ Ø§Ù„ÙØ±Ø¹ÙŠ Ù„Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø¯Ø¹Ù…",
  supportPhone: "Ø±Ù‚Ù… Ù‡Ø§ØªÙ Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„ÙÙ†ÙŠ",
  workflowSectionTitle: "Ø¹Ù†ÙˆØ§Ù† Ù‚Ø³Ù… Ø¢Ù„ÙŠØ© Ø§Ù„Ø¹Ù…Ù„",
  workflowSectionDesc: "Ø§Ù„ÙˆØµÙ Ø§Ù„ØªØ¹Ø±ÙŠÙÙŠ Ù„Ù‚Ø³Ù… Ø¢Ù„ÙŠØ© Ø§Ù„Ø¹Ù…Ù„",
  workflowSteps: "Ø®Ø·ÙˆØ§Øª Ø¢Ù„ÙŠØ© Ø§Ù„Ø¹Ù…Ù„ (3 Ø®Ø·ÙˆØ§Øª)",
  navLinks: "Ø±ÙˆØ§Ø¨Ø· Ø´Ø±ÙŠØ· Ø§Ù„ØªÙ†Ù‚Ù„ Ø§Ù„Ø¹Ù„ÙˆÙŠ",
  ctaWorkspaceBtn: "Ù†Øµ Ø²Ø± Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø­Ø¬Ø² ÙÙŠ Ø§Ù„Ø´Ø±ÙŠØ· Ø§Ù„Ø¹Ù„ÙˆÙŠ",
};

const formatKey = (key: string) => KEY_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

const DynamicForm = ({ data, onChange, path = "", depth = 0 }: { data: any; onChange: (val: any) => void; path?: string; depth?: number }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    if (data.length > 50 || data.includes('\n')) {
      return <textarea value={data} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-gold-500 focus:bg-black/40 hover:border-white/20 transition-all min-h-[140px] shadow-inner text-sm leading-relaxed custom-scrollbar" dir="auto" />;
    }
    return <input type="text" value={data} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold-500 focus:bg-black/40 hover:border-white/20 transition-all shadow-inner font-bold text-sm" dir="auto" />;
  }

  if (typeof data === "number") {
    return <input type="number" value={data} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold-500 focus:bg-black/40 hover:border-white/20 transition-all shadow-inner text-sm font-mono font-bold" dir="ltr" />;
  }

  if (typeof data === "boolean") {
    return (
      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 w-fit">
        <button type="button" onClick={() => onChange(!data)} className={`relative h-6 w-11 rounded-full transition-all ${data ? "bg-gold-500 shadow-[0_0_10px_rgba(201,162,39,0.5)]" : "bg-white/20"}`}>
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${data ? "left-6" : "left-1"}`} />
        </button>
        <span className="text-white font-bold text-sm">{data ? "Ù…ÙØ¹Ù„" : "Ù…Ø¹Ø·Ù„"}</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className={`space-y-4 rounded-3xl border ${depth === 0 ? "border-gold-500/20 p-6 bg-gold-500/[0.02]" : "border-white/10 p-5 bg-white/[0.02]"}`}>
        <div className="grid gap-5">
          {data.map((item, index) => (
            <div key={index} className="relative group bg-white/[0.03] p-6 rounded-2xl border border-white/10 shadow-sm hover:border-gold-500/30 transition-colors">
              <button type="button" onClick={() => {
                const newData = [...data];
                newData.splice(index, 1);
                onChange(newData);
              }} className="absolute top-4 left-4 p-2 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm z-10">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="h-6 w-6 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center font-black text-xs">{index + 1}</div>
                <span className="text-xs font-black text-gold-500 uppercase tracking-widest">Ø¹Ù†ØµØ± ÙØ±Ø¹ÙŠ ({formatKey(path.split('.').pop() || "")})</span>
              </div>
              <DynamicForm data={item} onChange={(newVal) => {
                const newData = [...data];
                newData[index] = newVal;
                onChange(newData);
              }} path={`${path}[${index}]`} depth={depth + 1} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => {
          const template = data.length > 0 ? (typeof data[0] === 'object' ? JSON.parse(JSON.stringify(data[0])) : (typeof data[0] === 'string' ? "" : 0)) : "";
          onChange([...data, template]);
        }} className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-sm transition-all border border-white/20 border-dashed w-full justify-center mt-4 group">
          <Plus className="h-5 w-5 text-gold-500 group-hover:scale-110 transition-transform" /> Ø¥Ø¶Ø§ÙØ© Ø¹Ù†ØµØ± Ø¬Ø¯ÙŠØ¯ Ø¥Ù„Ù‰ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©
        </button>
      </div>
    );
  }

  if (typeof data === "object") {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${depth === 0 ? "p-2" : "bg-white/[0.02] p-6 rounded-3xl border border-white/5"}`}>
        {Object.entries(data).map(([key, val]) => {
          const isComplex = typeof val === "object" && val !== null;
          return (
            <div key={key} className={`space-y-2.5 ${isComplex ? 'md:col-span-2' : ''}`}>
              <label className="text-xs font-black text-gold-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-gold-500/50" />
                {formatKey(key)}
              </label>
              <DynamicForm data={val} onChange={(newVal) => {
                onChange({ ...data, [key]: newVal });
              }} path={path ? `${path}.${key}` : key} depth={depth + 1} />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

const PAGE_DEFAULTS: Record<string, any> = {
  about: {
    heroTitle: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø§Ù„Ø°Ù‡Ø¨ÙŠØ©",
    heroDesc: "Ø£ÙƒØ«Ø± Ù…Ù† 45 Ø¹Ø§Ù…Ø§Ù‹ Ù…Ù† Ø§Ù„ØªÙ…ÙŠÙ‘Ø² ÙÙŠ Ø§Ù„Ø³ÙØ±ÙŠØ§Øª ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø© ÙˆØ®Ø¯Ù…Ø§Øª Ø§Ù„Ø£ÙŠØ§Ø¯ÙŠ Ø§Ù„Ø¹Ø§Ù…Ù„Ø©.",
    vision: "Ø£Ù† Ù†ÙƒÙˆÙ† Ø§Ù„Ø´Ø±ÙŠÙƒ Ø§Ù„Ø³ÙŠØ§Ø­ÙŠ Ø§Ù„Ø£ÙˆÙ„ ÙˆØ§Ù„Ø£ÙƒØ«Ø± Ø«Ù‚Ø© ÙÙŠ Ù…Ù†Ø·Ù‚Ø© Ø§Ù„Ø®Ù„ÙŠØ¬ ÙˆØ§Ù„Ø´Ø±Ù‚ Ø§Ù„Ø£ÙˆØ³Ø·.",
    mission: "ØªÙ‚Ø¯ÙŠÙ… ØªØ¬Ø§Ø±Ø¨ Ø³ÙØ± Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ© Ø¨Ø¬ÙˆØ¯Ø© Ø¹Ø§Ù„ÙŠØ© ÙˆØ£Ø³Ø¹Ø§Ø± ØªÙ†Ø§ÙØ³ÙŠØ©.",
    stats: [
      { value: "860,000+", label: "Ø¹Ù…ÙŠÙ„ Ø³Ø¹ÙŠØ¯" },
      { value: "45+", label: "Ø³Ù†Ø© Ø®Ø¨Ø±Ø©" },
      { value: "75+", label: "Ø¯ÙˆÙ„Ø© Ø­ÙˆÙ„ Ø§Ù„Ø¹Ø§Ù„Ù…" },
      { value: "5", label: "ÙØ±ÙˆØ¹ Ù†Ø´Ø·Ø©" },
      { value: "ISO 9001", label: "Ø´Ù‡Ø§Ø¯Ø© Ø§Ù„Ø¬ÙˆØ¯Ø©" },
      { value: "98%", label: "Ù†Ø³Ø¨Ø© Ø§Ù„Ø±Ø¶Ø§" },
    ],
    values: [
      { title: "Ø§Ù„Ù…ÙˆØ«ÙˆÙ‚ÙŠØ©", desc: "Ù†Ù„ØªØ²Ù… Ø¨Ø£Ø¹Ù„Ù‰ Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ø¬ÙˆØ¯Ø© ÙˆØ§Ù„Ø´ÙØ§ÙÙŠØ©.", icon: "ShieldCheck" },
      { title: "Ø§Ù„ØªÙ…ÙŠÙ‘Ø²", desc: "Ù†Ø³Ø¹Ù‰ Ù„ØªÙ‚Ø¯ÙŠÙ… ØªØ¬Ø±Ø¨Ø© Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ© ØªÙÙˆÙ‚ Ø§Ù„ØªÙˆÙ‚Ø¹Ø§Øª.", icon: "Star" },
      { title: "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø£ÙˆÙ„Ø§Ù‹", desc: "Ù†Ø¶Ø¹ Ø±Ø¶Ø§ Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙÙŠ ØµÙ…ÙŠÙ… ÙƒÙ„ Ù‚Ø±Ø§Ø±Ø§ØªÙ†Ø§.", icon: "Users" },
      { title: "Ø§Ù„Ø§Ù†ØªØ´Ø§Ø± Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠ", desc: "Ø´Ø¨ÙƒØ© Ø´Ø±Ø§ÙƒØ§Øª ÙÙŠ 75+ Ø¯ÙˆÙ„Ø©.", icon: "Globe2" },
    ],
    milestones: [
      { year: "1980", title: "Ø§Ù„ØªØ£Ø³ÙŠØ³", desc: "ØªØ£Ø³ÙŠØ³ Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø§Ù„Ø°Ù‡Ø¨ÙŠØ© ÙÙŠ Ø§Ù„ÙƒÙˆÙŠØª." },
      { year: "1992", title: "Ø§Ù„ØªÙˆØ³Ø¹ Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ…ÙŠ", desc: "ÙØªØ­ ÙØ±ÙˆØ¹ ÙÙŠ Ø§Ù„ÙŠÙ…Ù† â€” Ø¹Ø¯Ù† ÙˆØµÙ†Ø¹Ø§Ø¡." },
      { year: "2005", title: "Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø£ÙŠØ§Ø¯ÙŠ Ø§Ù„Ø¹Ø§Ù…Ù„Ø©", desc: "Ø¥Ø·Ù„Ø§Ù‚ Ù‚Ø³Ù… Ø§Ù„ØªÙˆØ¸ÙŠÙ." },
      { year: "2015", title: "Ø´Ù‡Ø§Ø¯Ø© ISO 9001", desc: "Ø§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø´Ù‡Ø§Ø¯Ø© Ø§Ù„Ø¬ÙˆØ¯Ø© Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ©." },
      { year: "2020", title: "Ø§Ù„ØªØ­ÙˆÙ„ Ø§Ù„Ø±Ù‚Ù…ÙŠ", desc: "Ø¥Ø·Ù„Ø§Ù‚ Ø§Ù„Ù…Ù†ØµØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ© Ø§Ù„Ø´Ø§Ù…Ù„Ø©." },
      { year: "2025", title: "860,000 Ø¹Ù…ÙŠÙ„", desc: "ØªØ¬Ø§ÙˆØ² 860,000 Ø¹Ù…ÙŠÙ„ Ø³Ø¹ÙŠØ¯." },
    ],
    services: [
      { title: "Ø§Ù„Ø³ÙØ±ÙŠØ§Øª ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©", desc: "Ø­Ø¬ÙˆØ²Ø§Øª Ø·ÙŠØ±Ø§Ù† ÙˆØ¨Ø±Ø§Ù…Ø¬ Ø³ÙŠØ§Ø­ÙŠØ© Ù„Ø£ÙƒØ«Ø± Ù…Ù† 150 ÙˆØ¬Ù‡Ø©.", href: "/services/travel", icon: "Plane" },
      { title: "Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„ÙÙ†Ø§Ø¯Ù‚", desc: "ÙÙ†Ø§Ø¯Ù‚ 4 Ùˆ5 Ù†Ø¬ÙˆÙ… Ø¨Ø£Ø³Ø¹Ø§Ø± Ø­ØµØ±ÙŠØ©.", href: "/services/hotels", icon: "Hotel" },
      { title: "Ø®Ø¯Ù…Ø§Øª Ø§Ù„ØªØ£Ø´ÙŠØ±Ø§Øª", desc: "Ù…Ø¹Ø§Ù„Ø¬Ø© Ø³Ø±ÙŠØ¹Ø© Ù„Ø£ÙƒØ«Ø± Ù…Ù† 30 Ø¯ÙˆÙ„Ø©.", href: "/services/visa", icon: "Globe2" },
      { title: "Ø§Ù„Ø£ÙŠØ§Ø¯ÙŠ Ø§Ù„Ø¹Ø§Ù…Ù„Ø©", desc: "ØªÙˆØ¸ÙŠÙ Ø§Ù„ÙƒÙØ§Ø¡Ø§Øª Ù„Ù„Ø´Ø±ÙƒØ§Øª ÙÙŠ Ø§Ù„Ø®Ù„ÙŠØ¬.", href: "/services/manpower", icon: "Briefcase" },
    ],
    ctaTitle: "Ù‡Ù„ ØªØ­ØªØ§Ø¬ Ù…Ø³Ø§Ø¹Ø¯Ø© ÙÙŠ ØªØ®Ø·ÙŠØ· Ø±Ø­Ù„ØªÙƒØŸ",
    ctaDesc: "ÙØ±ÙŠÙ‚ Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø§Ù„Ø°Ù‡Ø¨ÙŠØ© Ø¬Ø§Ù‡Ø² Ù„Ù…Ø³Ø§Ø¹Ø¯ØªÙƒ Ø¹Ù„Ù‰ Ù…Ø¯Ø§Ø± Ø§Ù„Ø³Ø§Ø¹Ø©.",
    ctaButton: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ø§Ù„Ø¢Ù†",
  },
  home: {
    heroTitle: "Ø±Ø­Ù„ØªÙƒ ØªØ¨Ø¯Ø£ Ù…Ù† Ù‡Ù†Ø§",
    heroDesc: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø§Ù„Ø°Ù‡Ø¨ÙŠØ© â€” 45 Ø¹Ø§Ù…Ø§Ù‹ Ù…Ù† Ø§Ù„ØªÙ…ÙŠÙ‘Ø² ÙÙŠ Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©.",
    heroTagline: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø§Ù„Ø°Ù‡Ø¨ÙŠØ© â€” Ù…Ù†Ø° 1980",
    servicesTitle: "Ø®Ø¯Ù…Ø§ØªÙ†Ø§ Ø§Ù„Ù…ØªÙƒØ§Ù…Ù„Ø©",
    servicesTagline: "OUR SERVICES",
    whyUsTitle: "Ù„Ù…Ø§Ø°Ø§ Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠØŸ",
    whyUsText: "Ù†Ù‚Ø¯Ù… Ø®Ø¯Ù…Ø§Øª Ø³ÙØ± ÙˆØ³ÙŠØ§Ø­Ø© Ù…ØªÙƒØ§Ù…Ù„Ø© Ø¨Ø®Ø¨Ø±Ø© 45 Ø¹Ø§Ù…Ø§Ù‹ ÙˆØ´Ø±Ø§ÙƒØ§Øª Ø¹Ø§Ù„Ù…ÙŠØ©.",
    whyUsFeatures: [
      { title: "45+ Ø³Ù†Ø© Ø®Ø¨Ø±Ø©", desc: "Ø£Ø±Ø¨Ø¹Ø© Ø¹Ù‚ÙˆØ¯ Ù…Ù† Ø§Ù„Ø®Ø¨Ø±Ø© ÙÙŠ ØµÙ†Ø§Ø¹Ø© Ø§Ù„Ø³ÙØ±." },
      { title: "860,000+ Ø¹Ù…ÙŠÙ„", desc: "Ø«Ù‚Ø© Ù…Ø¦Ø§Øª Ø§Ù„Ø¢Ù„Ø§Ù Ù…Ù† Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡." },
      { title: "75+ Ø¯ÙˆÙ„Ø©", desc: "Ø´Ø¨ÙƒØ© Ø´Ø±Ø§ÙƒØ§Øª ÙˆØ§Ø³Ø¹Ø© Ø­ÙˆÙ„ Ø§Ù„Ø¹Ø§Ù„Ù…." },
      { title: "ISO 9001", desc: "Ø´Ù‡Ø§Ø¯Ø© Ø¬ÙˆØ¯Ø© Ø¯ÙˆÙ„ÙŠØ©." },
    ],
    newsletterTitle: "Ø§Ø´ØªØ±Ùƒ ÙÙŠ Ù†Ø´Ø±ØªÙ†Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯ÙŠØ©",
    newsletterText: "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ø£Ø­Ø¯Ø« Ø§Ù„Ø¹Ø±ÙˆØ¶ ÙˆØ§Ù„ÙˆØ¬Ù‡Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø­ÙŠØ©.",
    newsletterPlaceholder: "Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ",
    newsletterButton: "Ø§Ø´ØªØ±Ùƒ Ø§Ù„Ø¢Ù†",
    newsletterLoading: "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ...",
    newsletterSuccess: "Ø´ÙƒØ±Ø§Ù‹! ØªÙ… Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ Ø¨Ù†Ø¬Ø§Ø­.",
  },
  travel: {
    heroTitle: "Ø§ÙƒØªØ´Ù Ø§Ù„Ø¹Ø§Ù„Ù… Ù…Ø¹ Ø§Ù„Ù‚Ø§Ø¶ÙŠ",
    heroDesc: "Ø±Ø­Ù„Ø§ØªÙƒ Ø§Ù„Ù…Ø«Ø§Ù„ÙŠØ© ØªÙ†ØªØ¸Ø±Ùƒ â€” ÙˆØ¬Ù‡Ø§Øª Ø¹Ø§Ù„Ù…ÙŠØ© ÙˆØ¨Ø§Ù‚Ø§Øª Ù…Ø®ØµØµØ© ÙˆØ®Ø¨Ø±Ø© 45 Ø¹Ø§Ù…Ø§Ù‹.",
    heroTags: ["+150 ÙˆØ¬Ù‡Ø©", "+45 Ø³Ù†Ø© Ø®Ø¨Ø±Ø©", "Ø¯Ø¹Ù… 24/7", "Ø£ÙØ¶Ù„ Ø§Ù„Ø£Ø³Ø¹Ø§Ø±"],
    destinationsTitle: "Ø§Ù„ÙˆØ¬Ù‡Ø§Øª Ø§Ù„Ù…Ù…ÙŠØ²Ø©",
    packagesTitle: "Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ø³ÙØ±",
    packagesSubtitle: "Ø§Ø®ØªØ± Ø§Ù„Ø¨Ø§Ù‚Ø© Ø§Ù„ØªÙŠ ØªÙ†Ø§Ø³Ø¨Ùƒ",
    bookingTitle: "Ø§Ø­Ø¬Ø² Ø±Ø­Ù„ØªÙƒ Ø§Ù„Ø¢Ù†",
    bookingSubtitle: "Ø£Ø±Ø³Ù„ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ÙˆÙ†ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ ÙÙˆØ±Ø§Ù‹",
    ctaTitle: "Ø¬Ø§Ù‡Ø² Ù„Ù„Ù…ØºØ§Ù…Ø±Ø©ØŸ",
    ctaDesc: "ÙØ±ÙŠÙ‚ Ø§Ù„Ù‚Ø§Ø¶ÙŠ ÙŠØ³Ø§Ø¹Ø¯Ùƒ ÙÙŠ Ø§Ø®ØªÙŠØ§Ø± ÙˆØ¬Ù‡ØªÙƒ ÙˆØªØ®Ø·ÙŠØ· Ø±Ø­Ù„ØªÙƒ.",
    ctaButton: "ØªÙˆØ§ØµÙ„ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨",
  },
  hotels: {
    heroTitle: "Ø£ÙØ®Ù… Ø§Ù„ÙÙ†Ø§Ø¯Ù‚ Ø¨Ø£ÙØ¶Ù„ Ø§Ù„Ø£Ø³Ø¹Ø§Ø±",
    heroDesc: "Ù†Ø®ØªØ§Ø± Ù„Ùƒ Ø£Ø±Ù‚Ù‰ Ø§Ù„ÙÙ†Ø§Ø¯Ù‚ ÙÙŠ Ø£Ø¬Ù…Ù„ Ø§Ù„ÙˆØ¬Ù‡Ø§Øª â€” 4 Ùˆ5 Ù†Ø¬ÙˆÙ… Ø¨Ø£Ø³Ø¹Ø§Ø± Ø­ØµØ±ÙŠØ©.",
    ctaTitle: "Ø§Ø­Ø¬Ø² ÙÙ†Ø¯Ù‚Ùƒ Ø§Ù„Ø¢Ù†",
    ctaDesc: "ØªÙˆØ§ØµÙ„ Ù…Ø¹ ÙØ±ÙŠÙ‚Ù†Ø§ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø£ÙØ¶Ù„ Ø§Ù„Ø£Ø³Ø¹Ø§Ø±.",
    ctaButton: "Ø§Ø­Ø¬Ø² Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨",
  },
  visa: {
    heroTitle: "Ø®Ø¯Ù…Ø§Øª Ø§Ù„ØªØ£Ø´ÙŠØ±Ø§Øª Ù…Ù† Ø§Ù„Ù‚Ø§Ø¶ÙŠ",
    heroDesc: "Ø¯Ø¹Ù… Ù…ØªÙƒØ§Ù…Ù„ ÙÙŠ Ø§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ù„ØªØ£Ø´ÙŠØ±Ø© Ù„Ø£ÙƒØ«Ø± Ù…Ù† 30 Ø¯ÙˆÙ„Ø©ØŒ Ø¨Ø®Ø¨Ø±Ø© ØªÙ…ØªØ¯ Ù„Ø£ÙƒØ«Ø± Ù…Ù† 45 Ø¹Ø§Ù…Ø§Ù‹.",
    destinationsTitle: "Ø§Ù„ØªØ£Ø´ÙŠØ±Ø§Øª Ø§Ù„Ù…ØªØ§Ø­Ø© Ø¹Ø¨Ø± Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ",
    destinationsDesc: "Ø§Ø®ØªØ± ÙˆØ¬Ù‡ØªÙƒ ÙˆØ§Ø·Ù„Ø¨ ØªØ£Ø´ÙŠØ±ØªÙƒ Ø¨Ø³Ù‡ÙˆÙ„Ø© Ø¹Ø¨Ø± ÙØ±ÙŠÙ‚ Ø§Ù„Ù‚Ø§Ø¶ÙŠ",
    destinationsBtn: "Ù‚Ø¯Ù‘Ù… Ø·Ù„Ø¨Ùƒ Ø§Ù„Ø¢Ù†",
    stepsTitle: "ÙƒÙŠÙ ØªØ­ØµÙ„ Ø¹Ù„Ù‰ ØªØ£Ø´ÙŠØ±ØªÙƒØŸ",
    steps: [
      { title: "Ø£Ø±Ø³Ù„ Ø·Ù„Ø¨Ùƒ", desc: "Ø£Ø±Ø³Ù„ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ø¹Ø¨Ø± Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ Ø£Ùˆ ÙˆØ§ØªØ³Ø§Ø¨", icon: "FileText" },
      { title: "Ø£Ø±ÙÙ‚ Ø§Ù„Ù…Ø³ØªÙ†Ø¯Ø§Øª", desc: "Ø¬ÙˆØ§Ø² Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„ÙˆØ«Ø§Ø¦Ù‚ Ø§Ù„Ø¯Ø§Ø¹Ù…Ø©", icon: "Upload" },
      { title: "Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© ÙˆØ§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©", desc: "ÙØ±ÙŠÙ‚Ù†Ø§ ÙŠØªÙˆÙ„Ù‰ ÙƒØ§Ù…Ù„ Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…", icon: "Search" },
      { title: "Ø§Ø³ØªÙ„Ù… Ø§Ù„ØªØ£Ø´ÙŠØ±Ø©", desc: "ØªÙØ³Ù„ÙŽÙ‘Ù… Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ§Ù‹ Ø£Ùˆ Ù…Ø·Ø¨ÙˆØ¹Ø©", icon: "BadgeCheck" },
    ],
    features: [
      { text: "Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ø³ØªÙ…Ø±Ø© Ù„Ù„Ø·Ù„Ø¨", icon: "Shield" },
      { text: "Ù…Ø¹Ø§Ù„Ø¬Ø© Ø³Ø±ÙŠØ¹Ø© ÙˆÙ…ÙˆØ«ÙˆÙ‚Ø©", icon: "Clock" },
      { text: "ØªØºØ·ÙŠØ© +30 Ø¯ÙˆÙ„Ø©", icon: "Globe2" },
      { text: "Ø®Ø¨Ø±Ø© 45+ Ø³Ù†Ø©", icon: "CheckCircle2" },
    ],
    ctaTitle: "ÙØ±ÙŠÙ‚ Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø¬Ø§Ù‡Ø² Ù„Ù…Ø³Ø§Ø¹Ø¯ØªÙƒ",
    ctaDesc: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø±Ø¯ ÙÙˆØ±ÙŠ.",
    ctaBtn: "ØªÙˆØ§ØµÙ„ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨",
  },
  manpower: {
    heroTitle: "Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø£ÙŠØ§Ø¯ÙŠ Ø§Ù„Ø¹Ø§Ù…Ù„Ø©",
    heroDesc: "Ù†Ø±Ø¨Ø· Ø£ØµØ­Ø§Ø¨ Ø§Ù„Ø¹Ù…Ù„ Ø¨Ø£ÙØ¶Ù„ Ø§Ù„ÙƒÙØ§Ø¡Ø§Øª â€” Ø®Ø¨Ø±Ø© 45 Ø¹Ø§Ù…Ø§Ù‹ ÙÙŠ ØªÙˆØ¸ÙŠÙ Ø§Ù„Ù…Ù‡Ù†ÙŠÙŠÙ† ÙÙŠ Ø§Ù„Ø®Ù„ÙŠØ¬.",
    employersTitle: "Ù„Ø£ØµØ­Ø§Ø¨ Ø§Ù„Ø¹Ù…Ù„",
    employersText: "Ø­Ù„ÙˆÙ„ ØªÙˆØ¸ÙŠÙ Ù…ØªÙƒØ§Ù…Ù„Ø© Ù„Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ù…Ø¤Ø³Ø³Ø§Øª ÙÙŠ Ø§Ù„ÙƒÙˆÙŠØª ÙˆØ§Ù„Ø®Ù„ÙŠØ¬.",
    employersCTA: "ØªÙˆØ§ØµÙ„ Ù„Ù„Ø§Ø³ØªÙØ³Ø§Ø±",
    jobsTitle: "Ù„Ù„Ø¨Ø§Ø­Ø«ÙŠÙ† Ø¹Ù† Ø¹Ù…Ù„",
    jobsText: "Ø³Ø¬Ù‘Ù„ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ÙˆØ³Ù†ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ø¹Ù†Ø¯ ØªÙˆÙØ± ÙØ±ØµØ© Ù…Ù†Ø§Ø³Ø¨Ø©.",
    jobsCTA: "Ø³Ø¬Ù‘Ù„ Ø³ÙŠØ±ØªÙƒ Ø§Ù„Ø°Ø§ØªÙŠØ©",
    processTitle: "ÙƒÙŠÙ Ù†Ø¹Ù…Ù„",
    processSteps: [
      { title: "Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø£ÙˆÙ„ÙŠ", desc: "Ø£Ø±Ø³Ù„ Ù…ØªØ·Ù„Ø¨Ø§ØªÙƒ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨ Ø£Ùˆ Ø§Ù„Ù†Ù…ÙˆØ°Ø¬." },
      { title: "Ø§Ù„Ø§Ø®ØªÙŠØ§Ø± ÙˆØ§Ù„ÙØ±Ø²", desc: "ÙŠØ®ØªØ§Ø± ÙØ±ÙŠÙ‚Ù†Ø§ Ø£ÙØ¶Ù„ Ø§Ù„Ù…Ø±Ø´Ø­ÙŠÙ†." },
      { title: "Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„Ø§Øª", desc: "Ù†Ø±ØªØ¨ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„Ø§Øª Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©." },
      { title: "Ø§Ù„Ø§Ø³ØªÙ‚Ø¯Ø§Ù…", desc: "Ù†ØªÙˆÙ„Ù‰ ÙƒØ§Ù…Ù„ Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„Ø§Ø³ØªÙ‚Ø¯Ø§Ù…." },
    ],
    ctaTitle: "Ø§Ø¨Ø¯Ø£ Ø§Ù„ØªÙˆØ¸ÙŠÙ Ù…Ø¹Ù†Ø§ Ø§Ù„ÙŠÙˆÙ…",
    ctaDesc: "ØªÙˆØ§ØµÙ„ Ù…Ø¹ ÙØ±ÙŠÙ‚Ù†Ø§ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ø³ØªØ´Ø§Ø±Ø© Ù…Ø¬Ø§Ù†ÙŠØ©.",
    ctaButton: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§",
  },
  privacy: {
    pageTitle: "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©",
    lastUpdated: "Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«: 1 Ù…Ø§ÙŠÙˆ 2026",
    sections: [
      { title: "1. Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªÙŠ Ù†Ø¬Ù…Ø¹Ù‡Ø§", body: "Ù†Ø¬Ù…Ø¹ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ø¹Ù†Ø¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ø£Ùˆ Ø­Ø¬Ø² Ø®Ø¯Ù…Ø§ØªÙ†Ø§." },
      { title: "2. ÙƒÙŠÙ Ù†Ø³ØªØ®Ø¯Ù… Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", body: "ØªÙØ³ØªØ®Ø¯Ù… Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ù„ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø®Ø¯Ù…Ø§Øª ÙˆØ¥Ø±Ø³Ø§Ù„ Ø§Ù„ØªØ­Ø¯ÙŠØ«Ø§Øª." },
      { title: "3. Ù…Ø´Ø§Ø±ÙƒØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", body: "Ù„Ø§ Ù†Ø¨ÙŠØ¹ Ø£Ùˆ Ù†Ø´Ø§Ø±Ùƒ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ù…Ø¹ Ø£Ø·Ø±Ø§Ù Ø«Ø§Ù„Ø«Ø©." },
      { title: "4. Ø£Ù…Ø§Ù† Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", body: "Ù†Ø³ØªØ®Ø¯Ù… ØªÙ‚Ù†ÙŠØ§Øª Ø§Ù„ØªØ´ÙÙŠØ± Ø§Ù„Ø­Ø¯ÙŠØ«Ø© Ù„Ø­Ù…Ø§ÙŠØ© Ø¨ÙŠØ§Ù†Ø§ØªÙƒ." },
      { title: "5. Ø­Ù‚ÙˆÙ‚Ùƒ", bullets: ["Ø§Ù„Ø­Ù‚ ÙÙŠ Ø§Ù„ÙˆØµÙˆÙ„ Ù„Ø¨ÙŠØ§Ù†Ø§ØªÙƒ", "Ø§Ù„Ø­Ù‚ ÙÙŠ ØªØµØ­ÙŠØ­ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", "Ø§Ù„Ø­Ù‚ ÙÙŠ Ø­Ø°Ù Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª"] },
    ],
    contactTitle: "6. ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§",
    contactBody: "Ù„Ø£ÙŠ Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø¨Ø®ØµÙˆØµ Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©ØŒ ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§:",
  },
  cookies: {
    pageTitle: "Ø³ÙŠØ§Ø³Ø© Ù…Ù„ÙØ§Øª ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·",
    lastUpdated: "Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«: 1 Ù…Ø§ÙŠÙˆ 2026",
    sections: [
      { title: "1. Ù…Ø§ Ù‡ÙŠ Ù…Ù„ÙØ§Øª Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·ØŸ", body: "Ù…Ù„ÙØ§Øª ØµØºÙŠØ±Ø© ØªÙØ®Ø²ÙŽÙ‘Ù† ÙÙŠ Ù…ØªØµÙØ­Ùƒ Ù„ØªØ­Ø³ÙŠÙ† ØªØ¬Ø±Ø¨ØªÙƒ." },
      { title: "2. Ø£Ù†ÙˆØ§Ø¹ Ù…Ù„ÙØ§Øª Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·", bullets: ["Ù…Ù„ÙØ§Øª Ø¶Ø±ÙˆØ±ÙŠØ© Ù„Ù„ØªØ´ØºÙŠÙ„", "Ù…Ù„ÙØ§Øª Ø§Ù„Ø£Ø¯Ø§Ø¡ ÙˆØ§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª"] },
      { title: "3. ÙƒÙŠÙ ØªØªØ­ÙƒÙ… Ø¨Ù‡Ø§", body: "ÙŠÙ…ÙƒÙ†Ùƒ ØªØ¹Ø·ÙŠÙ„ Ù…Ù„ÙØ§Øª Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø· Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ØªØµÙØ­." },
    ],
    contactTitle: "4. ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§",
    contactBody: "Ù„Ø£ÙŠ Ø§Ø³ØªÙØ³Ø§Ø±Ø§Øª Ø¨Ø®ØµÙˆØµ Ù…Ù„ÙØ§Øª Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·ØŒ ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§:",
  },
  trust: {
    pageTitle: "Ù…Ø±ÙƒØ² Ø§Ù„Ø´ÙØ§ÙÙŠØ©",
    pageSubtitle: "Ø³ÙŠØ§Ø³Ø§ØªØŒ ØªØ±Ø§Ø®ÙŠØµØŒ ÙˆØ´Ù‡Ø§Ø¯Ø§Øª.",
    sectionTitle: "Ø³Ø¬Ù„ Ø£ØµÙˆÙ„ Ø«Ù„Ø§Ø«ÙŠØ© Ø§Ù„Ø£Ø¨Ø¹Ø§Ø¯",
  },
  en_home: {
    heroTagline: "GOLDEN AL'QADI GROUP â€” SINCE 1980",
    heroTitlePart1: "Travel in",
    heroTitlePart2: "Golden Style",
    heroSubtitle: "Kuwait's premier travel, tourism, and manpower group â€” 45 years of excellence.",
    services: [
      { title: "Travel & Tourism", desc: "Premium flight bookings to 150+ destinations.", href: "/services/travel", icon: "Plane" },
      { title: "Visa Services", desc: "Fast visa processing for 30+ countries.", href: "/services/visa", icon: "Globe2" },
      { title: "Luxury Hotels", desc: "Hand-picked 4 & 5-star hotels worldwide.", href: "/services/hotels", icon: "Hotel" },
      { title: "Manpower Services", desc: "Connecting talent with leading Gulf companies.", href: "/services/manpower", icon: "Users" },
    ],
    stats: [
      { value: "860K+", label: "Happy Clients" },
      { value: "45+", label: "Years Experience" },
      { value: "75+", label: "Countries Covered" },
      { value: "ISO 9001", label: "Certified Quality" },
    ],
  },
  faq: {
    pageTitle: "Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©",
    pageSubtitle: "Ø¥Ø¬Ø§Ø¨Ø§Øª Ø¹Ù„Ù‰ Ø£ÙƒØ«Ø± Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø´ÙŠÙˆØ¹Ø§Ù‹ Ø­ÙˆÙ„ Ø®Ø¯Ù…Ø§ØªÙ†Ø§.",
    items: [
      { question: "ÙƒÙŠÙ Ø£Ø­Ø¬Ø² Ø±Ø­Ù„Ø© Ø¹Ø¨Ø± Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠØŸ", answer: "ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨ Ø£Ùˆ Ø²ÙŠØ§Ø±Ø© Ø£Ø­Ø¯ ÙØ±ÙˆØ¹Ù†Ø§." },
      { question: "Ù…Ø§ Ù‡ÙŠ Ø§Ù„Ø¯ÙˆÙ„ Ø§Ù„ØªÙŠ ØªØºØ·ÙŠÙ‡Ø§ Ø®Ø¯Ù…Ø© Ø§Ù„ØªØ£Ø´ÙŠØ±Ø§ØªØŸ", answer: "Ù†ØºØ·ÙŠ Ø£ÙƒØ«Ø± Ù…Ù† 30 Ø¯ÙˆÙ„Ø© Ø­ÙˆÙ„ Ø§Ù„Ø¹Ø§Ù„Ù…." },
    ],
  },
  vip: { heroTitle: "Ø¨ÙˆØ§Ø¨Ø© VIP", heroDesc: "Ø®Ø¯Ù…Ø§Øª Ø­ØµØ±ÙŠØ© Ù„Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§ Ø§Ù„Ù…Ù…ÙŠØ²ÙŠÙ†." },
  clients: {
    pageTitle: "Ø¹Ù…Ù„Ø§Ø¤Ù†Ø§ Ø§Ù„ÙƒØ±Ø§Ù…",
    pageSubtitle: "Ø£ÙƒØ«Ø± Ù…Ù† 860,000 Ø¹Ù…ÙŠÙ„ Ø³Ø¹ÙŠØ¯ ÙŠØ«Ù‚ÙˆÙ† ÙÙŠ Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ.",
    stats: [
      { value: "860,000+", label: "Ø¹Ù…ÙŠÙ„ Ø³Ø¹ÙŠØ¯" },
      { value: "98%", label: "Ù†Ø³Ø¨Ø© Ø§Ù„Ø±Ø¶Ø§" },
      { value: "45+", label: "Ø³Ù†Ø© Ø®Ø¨Ø±Ø©" },
    ],
  },
  blog: { pageTitle: "Ù…Ø¯ÙˆÙ†Ø© Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ", pageSubtitle: "Ø¢Ø®Ø± Ø§Ù„Ø£Ø®Ø¨Ø§Ø± ÙˆØ§Ù„Ù†ØµØ§Ø¦Ø­ Ø§Ù„Ø³ÙŠØ§Ø­ÙŠØ©." },
  contact: { pageTitle: "Ø§ØªØµÙ„ Ø¨Ù†Ø§", pageSubtitle: "Ù†Ø­Ù† Ø¯Ø§Ø¦Ù…Ø§Ù‹ ÙÙŠ Ø®Ø¯Ù…ØªÙƒÙ….", branchesTitle: "ÙØ±ÙˆØ¹Ù†Ø§" },

  // â•â•â• PORTAL: BOOKING PORTAL PAGE (Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ø°ÙƒÙŠ) â•â•â•â•â•â•â•â•
  booking_portal: {
    // â”€â”€â”€ Ø§Ù„Ø´Ø±ÙŠØ· Ø§Ù„Ø¹Ù„ÙˆÙŠ (Navbar) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    companyName: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ",
    companyTagline: "Ø§Ù„Ø°Ù‡Ø¨ÙŠØ©",
    navLinks: [
      { label: "Ù„ÙˆØ­Ø© Ø§Ù„Ù‚ÙŠØ§Ø¯Ø©", href: "/portal/dashboard" },
      { label: "Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„", href: "/portal/workspace" },
      { label: "ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª", href: "/portal/leads" },
    ],
    ctaWorkspaceBtn: "Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø­Ø¬Ø²",

    // â”€â”€â”€ Hero Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    badgeText: "Ù†Ø¸Ø§Ù… Ù…Ø­Ø±Ùƒ Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ø§Ø­ØªØ±Ø§ÙÙŠ AlQadi Engine PRO",
    heroTitle: "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ø°ÙƒÙŠ",
    engineName: "AlQadi Engine PRO",
    heroParagraph: "Ù…Ø­Ø±Ùƒ AlQadi Engine PRO ÙŠØ¯Ù…Ø¬ Ø®ÙˆØ§Ø±Ø²Ù…ÙŠØ§Øª Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ø°ÙƒÙŠ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ù„ØªÙˆÙÙŠØ± ÙˆØ¥Ø¯Ø§Ø±Ø© Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„Ø·ÙŠØ±Ø§Ù†ØŒ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø§Øª Ø§Ù„Ø£Ù…Ù†ÙŠØ©ØŒ ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù„ÙˆØ¬Ø³ØªÙŠØ© Ø§Ù„Ù…ØªÙƒØ§Ù…Ù„Ø© Ù„Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§ ÙÙŠ Ø«ÙˆØ§Ù†Ù.",
    heroCTA: "Ø§Ø¨ØªØ¯Ø£ Ø§Ù„Ø¨Ø­Ø« ÙˆØ§Ù„Ø­Ø¬Ø² Ø§Ù„Ø¢Ù†",

    // â”€â”€â”€ Bento Card 1: Radar 360Â° â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    radarTitle: "360Â°",
    radarDesc: "Ø±Ø§Ø¯Ø§Ø± Ù…Ø±Ø§Ù‚Ø¨Ø© Ø§Ù„Ø±Ø­Ù„Ø§Øª Ø§Ù„Ø°ÙƒÙŠ Ù„ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø± Ù…Ø¨Ø§Ø´Ø±Ø© Ø¨Ø«ÙˆØ§Ù†Ù Ù…Ø¹Ø¯ÙˆØ¯Ø©.",

    // â”€â”€â”€ Bento Card 2: Success Rate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    successRateTitle: "Ù…Ø¹Ø¯Ù„ Ø¯Ù‚Ø© ÙˆØ¥Ù†Ø¬Ø§Ø² Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª",
    successRateDesc: "Ø£Ø¯Ø§Ø¡ Ø§Ù„Ù†Ø¸Ø§Ù… ÙˆØ®Ø§Ø¯Ù… Ø§Ù„Ù…Ø²Ø§Ù…Ù†Ø© Ø§Ù„ØªÙ„Ù‚Ø§Ø¦ÙŠ Ø®Ù„Ø§Ù„ Ø§Ù„Ù€ 24 Ø³Ø§Ø¹Ø© Ø§Ù„Ù…Ø§Ø¶ÙŠØ©",
    successRateValue: 99.98,
    successRateLive: "Ù…Ø¨Ø§Ø´Ø± Ù†Ø´Ø·",

    // â”€â”€â”€ Bento Card 4: Support Team â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    supportTeamTitle: "ÙØ±ÙŠÙ‚ Ø§Ù„Ø¯Ø¹Ù… ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ§Øª",
    supportTeamDesc: "Ù…ØªØ§Ø­ 24/7 â€” Ø§ØªØµÙ„ Ù…Ø¨Ø§Ø´Ø±Ø©",
    supportPhone: "+96525555555",

    // â”€â”€â”€ Section 3: Workflow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    workflowSectionTitle: "Ø¢Ù„ÙŠØ© Ø§Ù„Ø¹Ù…Ù„",
    workflowSectionDesc: "Ù†Ø­Ù† Ù„Ø§ Ù†Ø¨ÙŠØ¹ ØªØ°Ø§ÙƒØ± ÙÙ‚Ø·ØŒ Ù†Ø­Ù† Ù†Ø¨Ù†ÙŠ ØªØ¬Ø±Ø¨Ø© Ø³ÙØ± Ù…ØªÙƒØ§Ù…Ù„Ø© ØªÙ…Ù†Ø­ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø±Ø§Ø­Ø© Ø§Ù„Ø¨Ø§Ù„ ÙˆØ§Ù„Ø«Ù‚Ø© Ø§Ù„ÙƒØ§Ù…Ù„Ø©.",
    workflowHighlight: "Ø³ÙØ± Ù…ØªÙƒØ§Ù…Ù„Ø©",
    workflowSteps: [
      {
        step: "01",
        title: "Ø§Ø³ØªÙ„Ø§Ù… ÙˆØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª",
        desc: "Ù†Ø³ØªÙ‚Ø¨Ù„ Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø­Ø¬Ø² Ù…Ù† Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆÙ†Ø­Ù„Ù„ Ù…ØªØ·Ù„Ø¨Ø§ØªÙ‡Ù… Ø§Ù„Ù„ÙˆØ¬Ø³ØªÙŠØ© Ø¨Ø¯Ù‚Ø© (Ø§Ù„ÙˆØ¬Ù‡Ø§ØªØŒ Ø§Ù„ØªÙˆØ§Ø±ÙŠØ®ØŒ ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø®Ø§ØµØ©) Ù„Ø¶Ù…Ø§Ù† Ø§Ù„Ø®ÙŠØ§Ø± Ø§Ù„Ø£Ù†Ø³Ø¨.",
      },
      {
        step: "02",
        title: "Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ø°ÙƒÙŠ Ø§Ù„Ù…Ø¨Ø§Ø´Ø±",
        desc: "ÙŠÙ‚ÙˆÙ… Ù…Ø­Ø±Ùƒ AlQadi Ø¨Ù…Ø³Ø­ Ù…Ø¨Ø§Ø´Ø± Ù„ÙƒØ§ÙØ© Ø®Ø·ÙˆØ· Ø§Ù„Ø·ÙŠØ±Ø§Ù† ÙˆØ§Ù„Ù…Ø²ÙˆØ¯ÙŠÙ† Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¹Ø±ÙˆØ¶ ØªÙˆØ§Ø²Ù† Ø¨ÙŠÙ† Ø§Ù„Ø³Ø¹Ø± ÙˆØ§Ù„Ù…ÙˆØ«ÙˆÙ‚ÙŠØ© ÙˆØ§Ù„Ø³Ø±Ø¹Ø©.",
      },
      {
        step: "03",
        title: "ØªØ£ÙƒÙŠØ¯ ÙÙˆØ±ÙŠ ÙˆØ¥ØµØ¯Ø§Ø±",
        desc: "Ø¥ØµØ¯Ø§Ø± ÙÙˆØ±ÙŠ Ù„Ù„ØªØ°Ø§ÙƒØ± ÙˆØªÙˆÙÙŠØ± Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø§Øª Ø§Ù„Ø£Ù…Ù†ÙŠØ© ÙˆØ¥Ø±Ø³Ø§Ù„ ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø² Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¹Ø¨Ø± Ù‚Ù†ÙˆØ§Øª Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©.",
      },
    ],
  },
};

export function CMSSection({ isDark }: { isDark?: boolean }) {
  const { data: pages, loading, refetch } = useAdminData<CmsPageType[]>("/api/cms");
  const [selected, setSelected] = useState<string | null>(null);
  const [editData, setEditData] = useState("{}");
  const [formData, setFormData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"form" | "json">("form");
  const [saving, setSaving] = useState(false);

  const handleSelect = async (slug: string) => {
    setSelected(slug);
    const existing = pages?.find(p => p.slug === slug);
    if (existing) {
      setEditData(JSON.stringify(existing.content, null, 2));
      setFormData(existing.content);
    } else {
      const def = PAGE_DEFAULTS[slug] || { heroTitle: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ØµÙØ­Ø©", heroDesc: "ÙˆØµÙ Ø§Ù„ØµÙØ­Ø©..." };
      setEditData(JSON.stringify(def, null, 2));
      setFormData(def);
    }
    setViewMode("form");
  };

  const syncToJSON = (newFormData: any) => {
    setFormData(newFormData);
    setEditData(JSON.stringify(newFormData, null, 2));
  };

  const syncToForm = (jsonString: string) => {
    setEditData(jsonString);
    try {
      setFormData(JSON.parse(jsonString));
    } catch {
      // invalid json
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(editData);
      const existing = pages?.find(p => p.slug === selected);
      if (existing) {
        await fetch("/api/cms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: existing.id, content: parsed }) });
      } else {
        await fetch("/api/cms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: selected, title: CMS_PAGES.find(p => p.slug === selected)?.label || selected, content: parsed }) });
      }
      refetch();
    } catch {
      alert("Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ØºÙŠØ± ØµØ§Ù„Ø­Ø©");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Layers className="h-7 w-7 text-gold-500" /> Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø­ØªÙˆÙ‰ (CMS)</h2>
        <p className="text-white/40 text-sm mt-1">ØªØ­Ø±ÙŠØ± Ù…Ø­ØªÙˆÙ‰ ØµÙØ­Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø¨ÙˆØ§Ø¬Ù‡Ø§Øª Ù…Ø¨Ø³Ø·Ø©</p>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : !selected ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CMS_PAGES.map(p => (
            <button key={p.slug} onClick={() => handleSelect(p.slug)}
              className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/20 hover:bg-white/[0.07] transition-all text-right group relative overflow-hidden">
              {pages?.find(x => x.slug === p.slug) && <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-emerald-500" />}
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-gold-500/10 transition-colors">
                <Layers className="h-5 w-5 text-white/30 group-hover:text-gold-500 transition-colors" />
              </div>
              <h4 className="font-black text-white mb-1">{p.label}</h4>
              <p className="text-xs text-white/40">{p.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold bg-white/5 px-3 py-1.5 rounded-lg">â† Ø§Ù„Ø±Ø¬ÙˆØ¹</button>
              <h4 className="text-xl font-black text-gold-400">{CMS_PAGES.find(p => p.slug === selected)?.label}</h4>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
                <button onClick={() => setViewMode("form")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "form" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
                  ÙˆØ§Ø¬Ù‡Ø© Ù…ÙØµÙ„Ø©
                </button>
                <button onClick={() => setViewMode("json")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "json" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
                  Ù…Ø­Ø±Ø± Ø§Ù„ÙƒÙˆØ¯
                </button>
              </div>
              <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gold-500 text-black rounded-xl font-black text-sm hover:bg-gold-400 transition-all disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸..." : "Ø­ÙØ¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª"}
              </button>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {viewMode === "form" ? (
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
                {formData ? (
                  <DynamicForm data={formData} onChange={syncToJSON} />
                ) : (
                  <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                    <p className="text-white/40 font-bold mb-2">Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ØºÙŠØ± ØµØ§Ù„Ø­Ø© Ù„Ù„Ø¹Ø±Ø¶ ÙƒÙˆØ§Ø¬Ù‡Ø©</p>
                    <p className="text-xs text-white/30">ÙŠØ±Ø¬Ù‰ Ø¥ØµÙ„Ø§Ø­Ù‡Ø§ ÙÙŠ Ù…Ø­Ø±Ø± Ø§Ù„ÙƒÙˆØ¯ Ø£ÙˆÙ„Ø§Ù‹</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/60 p-1">
                <textarea value={editData} onChange={e => syncToForm(e.target.value)} dir="ltr"
                  className="w-full h-[500px] bg-transparent p-4 text-sm text-emerald-300 font-mono outline-none resize-y custom-scrollbar" spellCheck={false} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Settings (local) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function SettingsSection({ isDark }: { isDark?: boolean }) {
  const { data: remoteSettings, loading, refetch } = useAdminData<Record<string, any>>("/api/settings");
  
  const defaultSettings = {
    siteName: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù‚Ø§Ø¶ÙŠ Ø§Ù„Ø°Ù‡Ø¨ÙŠØ©", siteUrl: "https://alqadigroup.com",
    emailFrom: "noreply@alqadigroup.com", currency: "KWD",
    darkMode: true, notifications: true, maintenanceMode: false,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  // Sync when data loads
  if (remoteSettings && Object.keys(remoteSettings).length > 0 && settings === defaultSettings) {
    setSettings({ ...defaultSettings, ...remoteSettings });
  }

  const save = async () => {
    try {
      await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Settings className="h-7 w-7 text-gold-500" /> Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù†Ø¸Ø§Ù…</h2>
        <button onClick={save} className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black rounded-xl font-black hover:bg-gold-400 transition-all">
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? "ØªÙ…!" : "Ø­ÙØ¸"}
        </button>
      </div>
      {loading ? (
        <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      ) : (
      <>
      <div className="grid md:grid-cols-2 gap-6">
        {[{label:"Ø§Ø³Ù… Ø§Ù„Ù…ÙˆÙ‚Ø¹",key:"siteName",dir:"rtl"},{label:"Ø±Ø§Ø¨Ø· Ø§Ù„Ù…ÙˆÙ‚Ø¹",key:"siteUrl",dir:"ltr"},{label:"Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„",key:"emailFrom",dir:"ltr"},{label:"Ø§Ù„Ø¹Ù…Ù„Ø©",key:"currency",dir:"ltr"}].map(f=>(
          <div key={f.key} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{f.label}</label>
            <input dir={f.dir} value={(settings as any)[f.key]} onChange={e=>setSettings(s=>({...s,[f.key]:e.target.value}))}
              className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-white font-bold py-1 transition-colors"/>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
        <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest mb-6">Ø§Ù„ØªØ¨Ø¯ÙŠÙ„Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ¹Ø©</h3>
        {[{key:"darkMode",label:"Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ†",desc:"ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø«ÙŠÙ… Ø§Ù„Ø¯Ø§ÙƒÙ†"},{key:"notifications",label:"Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª",desc:"ØªÙØ¹ÙŠÙ„ Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ø§Ù„Ù†Ø¸Ø§Ù…"},{key:"maintenanceMode",label:"ÙˆØ¶Ø¹ Ø§Ù„ØµÙŠØ§Ù†Ø©",desc:"Ø¥Ø®ÙØ§Ø¡ Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ù…Ø¤Ù‚ØªØ§Ù‹"}].map(t=>(
          <div key={t.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div><p className="font-bold text-white text-sm">{t.label}</p><p className="text-xs text-white/40">{t.desc}</p></div>
            <Toggle value={(settings as any)[t.key]} onChange={()=>setSettings(s=>({...s,[t.key]:!(s as any)[t.key]}))}/>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  🚀 BOOKING PORTAL CMS SECTION
//  تحكم كامل في محتوى بوابة الحجز الذكي من لوحة الإدارة
// ══════════════════════════════════════════════════════════════════
export function BookingPortalCMSSection({ isDark }: { isDark?: boolean }) {
  const { data: pages, loading, refetch } = useAdminData<CmsPageType[]>("/api/cms");
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && pages) {
      const existing = pages.find((p) => p.slug === "booking_portal");
      const defaults = (PAGE_DEFAULTS as any)["booking_portal"] || {};
      setFormData(existing?.content ?? defaults);
    }
  }, [pages, loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = pages?.find((p) => p.slug === "booking_portal");
      const method = existing ? "PUT" : "POST";
      const body = existing
        ? { id: existing.id, slug: "booking_portal", title: "بوابة الحجز الذكي", content: formData }
        : { slug: "booking_portal", title: "بوابة الحجز الذكي", content: formData };
      await fetch("/api/cms", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      await refetch();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* silent */ }
    setSaving(false);
  };

  const base = isDark ? "text-white" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const card = isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200";
  const inp = isDark
    ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-[#b08d57]"
    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#b08d57]";

  const Field = ({ label, k, multi = false }: { label: string; k: string; multi?: boolean }) => {
    const val = formData?.[k] ?? "";
    return (
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{label}</label>
        {multi ? (
          <textarea
            rows={3}
            value={typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)}
            onChange={(e) => {
              try { setFormData((p: any) => ({ ...p, [k]: JSON.parse(e.target.value) })); }
              catch { setFormData((p: any) => ({ ...p, [k]: e.target.value })); }
            }}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-colors outline-none resize-none ${inp}`}
          />
        ) : (
          <input
            type="text"
            value={String(val)}
            onChange={(e) => setFormData((p: any) => ({ ...p, [k]: e.target.value }))}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none ${inp}`}
          />
        )}
      </div>
    );
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#b08d57] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black ${base}`}>🚀 بوابة الحجز الذكي</h2>
          <p className={`text-sm mt-1 ${muted}`}>تعديل جميع النصوص والمحتوى الظاهر في <strong dir="ltr">/portal/booking</strong></p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/portal/booking"
            target="_blank"
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${isDark ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            معاينة الصفحة ↗
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-[#b08d57] hover:bg-[#8e6d3e] text-slate-950"
            } disabled:opacity-60`}
          >
            {saving ? "جاري الحفظ..." : saved ? "✓ تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {/* ─── شريط التنقل (Navbar) ─── */}
      <div className={`rounded-2xl border p-6 space-y-4 ${card}`}>
        <h3 className={`font-bold text-sm uppercase tracking-wider ${muted}`}>⬆ شريط التنقل العلوي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="اسم الشركة" k="companyName" />
          <Field label="الشعار النصي (tagline)" k="companyTagline" />
          <Field label="نص زر مساحة الحجز" k="ctaWorkspaceBtn" />
        </div>
        <Field label="روابط القائمة (JSON)" k="navLinks" multi />
      </div>

      {/* ─── Hero ─── */}
      <div className={`rounded-2xl border p-6 space-y-4 ${card}`}>
        <h3 className={`font-bold text-sm uppercase tracking-wider ${muted}`}>🎯 قسم الـ Hero الرئيسي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="نص الشارة العلوية (Badge)" k="badgeText" />
          <Field label="اسم محرك الحجز" k="engineName" />
          <Field label="العنوان الرئيسي الكبير" k="heroTitle" />
          <Field label="نص زر البدء" k="heroCTA" />
        </div>
        <Field label="الوصف التفصيلي (Paragraph)" k="heroParagraph" multi />
      </div>

      {/* ─── Bento Cards ─── */}
      <div className={`rounded-2xl border p-6 space-y-4 ${card}`}>
        <h3 className={`font-bold text-sm uppercase tracking-wider ${muted}`}>🃏 بطاقات Bento Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 rounded-xl bg-white/5">
            <p className={`text-xs font-bold ${muted}`}>بطاقة 1 — رادار 360°</p>
            <Field label="العنوان (الرقم الكبير)" k="radarTitle" />
            <Field label="الوصف" k="radarDesc" />
          </div>
          <div className="space-y-4 p-4 rounded-xl bg-white/5">
            <p className={`text-xs font-bold ${muted}`}>بطاقة 2 — معدل الإنجاز</p>
            <Field label="العنوان" k="successRateTitle" />
            <Field label="الوصف التحليلي" k="successRateDesc" />
            <Field label="نسبة الإنجاز (رقم)" k="successRateValue" />
            <Field label="نص مؤشر البث المباشر" k="successRateLive" />
          </div>
          <div className="space-y-4 p-4 rounded-xl bg-white/5 md:col-span-2">
            <p className={`text-xs font-bold ${muted}`}>بطاقة 4 — فريق الدعم والعمليات</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="عنوان البطاقة" k="supportTeamTitle" />
              <Field label="الوصف الفرعي" k="supportTeamDesc" />
              <Field label="رقم الهاتف (مع كود الدولة)" k="supportPhone" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Workflow ─── */}
      <div className={`rounded-2xl border p-6 space-y-4 ${card}`}>
        <h3 className={`font-bold text-sm uppercase tracking-wider ${muted}`}>⚙️ قسم آلية العمل</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="عنوان القسم الكبير" k="workflowSectionTitle" />
          <Field label="الكلمة المُبرزة بالذهبي" k="workflowHighlight" />
        </div>
        <Field label="وصف القسم" k="workflowSectionDesc" multi />
        <Field label="خطوات آلية العمل (JSON — 3 خطوات)" k="workflowSteps" multi />
      </div>

      {/* Live Preview Link */}
      <div className={`rounded-2xl border p-5 flex items-center justify-between ${isDark ? "border-[#b08d57]/30 bg-[#b08d57]/5" : "border-[#b08d57]/20 bg-[#b08d57]/5"}`}>
        <div>
          <p className={`font-bold text-sm ${base}`}>لتطبيق التغييرات فعلياً في الواجهة</p>
          <p className={`text-xs mt-0.5 ${muted}`}>بعد الحفظ، قم بتوصيل هذه القيم من الـ API مباشرة في <code dir="ltr" className="text-[#b08d57]">booking/page.tsx</code></p>
        </div>
        <a
          href="/portal/booking"
          target="_blank"
          className="shrink-0 px-4 py-2 bg-[#b08d57] text-slate-950 rounded-xl text-sm font-bold hover:bg-[#8e6d3e] transition-colors"
        >
          فتح البوابة ↗
        </a>
      </div>
    </div>
  );
}
