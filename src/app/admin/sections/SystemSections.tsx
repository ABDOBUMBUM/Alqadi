"use client";
import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { DollarSign, UserPlus, Building, Layers, ShieldCheck, Settings, Save, CheckCircle2, Plus, Trash2, RefreshCw } from "lucide-react";

const Skeleton = ({ className = "" }: { className?: string }) => <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-gold-500" : "bg-white/10"}`}>
    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? "left-6" : "left-1"}`} />
  </button>
);

// ─── Employees (from DB) ─────────────────────────────────────────────────────
type EmployeeType = {
  id: string; name: string; username: string; role: string;
  branchId: string | null; phone: string | null; email: string | null;
  active: boolean; title: string | null; shift: string | null;
  branch?: { id: string; name: string };
};

const ROLES: Record<string, string> = { admin: "مدير", supervisor: "مشرف", agent: "وكيل", accountant: "محاسب", manager: "مدير فرع" };
const SHIFTS = ["صباحي", "مسائي", "ليلي"];

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
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;
    await fetch(`/api/admin/employees?id=${id}`, { method: "DELETE" });
    refetch();
  };
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) return alert("يرجى ملء جميع الحقول");
    
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
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><UserPlus className="h-7 w-7 text-gold-500" /> إدارة الموظفين</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${emps?.length || 0} موظف في النظام`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${showAdd ? "bg-white/10 text-white" : "bg-gold-500 text-black hover:bg-gold-400"}`}>
            {showAdd ? "إلغاء" : <><Plus className="h-4 w-4" /> إضافة موظف</>}
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-6 rounded-3xl border border-gold-500/20 bg-gold-500/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">الاسم الكامل</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="مثال: أحمد محمد" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">اسم المستخدم</label>
              <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="ahmed_qadi" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">كلمة المرور</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">الدور (الصلاحيات)</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all appearance-none">
                {Object.entries(ROLES).map(([val, lbl]) => <option key={val} value={val} className="bg-[#1a1610]">{lbl}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">المسمى الوظيفي</label>
              <input list="job-titles" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="اكتب أو اختر المسمى الوظيفي..." />
              <datalist id="job-titles">
                <option value="موظف حجوزات طيران" />
                <option value="منسق تأشيرات" />
                <option value="موظف استقبال" />
                <option value="مسؤول أيدي عاملة" />
                <option value="محاسب مالي" />
                <option value="مدير فرع" />
                <option value="مسؤول علاقات عامة" />
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">مواعيد الدوام</label>
              <input list="shift-times" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all" placeholder="اكتب أو اختر موعد الدوام..." />
              <datalist id="shift-times">
                <option value="صباحي (8:00 ص - 4:00 م)" />
                <option value="مسائي (4:00 م - 12:00 ص)" />
                <option value="ليلي (12:00 ص - 8:00 ص)" />
                <option value="دوام مرن" />
                <option value="دوام جزئي" />
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">الفرع</label>
              <select value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold-500 transition-all appearance-none">
                <option value="" className="bg-[#1a1610]">اختر الفرع...</option>
                {branches?.map(b => <option key={b.id} value={b.id} className="bg-[#1a1610]">{b.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full h-[52px] bg-gold-500 text-black rounded-xl font-black hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10">حفظ الموظف الجديد</button>
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
                    <p className="text-[10px] text-white/30 font-black uppercase mb-0.5">الاسم</p>
                    <p className="font-black text-white">{emp.name}</p>
                    {emp.username === "admin" && <span className="text-[9px] bg-gold-500/10 text-gold-500 px-1.5 py-0.5 rounded-md font-bold">حساب رئيسي</span>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1.5">الوظيفة / الدوام</p>
                  <p className="font-mono text-white/70 text-sm">{emp.title || ROLES[emp.role] || emp.role} <span className="text-white/20 mx-2">•</span> {emp.shift || "غير محدد"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1.5">الصلاحية / الفرع</p>
                  <p className="text-sm text-white/70 font-bold">{ROLES[emp.role] || emp.role} <span className="text-white/20 mx-2">•</span> {emp.branch?.name || "الرئيسي"}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 font-black">نشط</span>
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
          {(emps || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">لا يوجد موظفون</div>}
        </div>
      )}
    </div>
  );
}

// ─── Audit Log (from DB) ──────────────────────────────────────────────────────
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
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-gold-500" /> سجل المراقبة</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${logs?.length || 0} سجل`}</p>
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
                {["الإجراء", "الكيان", "المعرف", "التاريخ", "النوع"].map(h => (
                  <th key={h} className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(logs || []).map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full border uppercase tracking-wider ${ACTION_COLORS[log.action] || ""}`}>
                      {log.action === "CREATE" ? "إنشاء" : log.action === "UPDATE" ? "تعديل" : log.action === "DELETE" ? "حذف" : log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-sm">{log.entity}</td>
                  <td className="px-6 py-4 font-mono text-xs text-white/40">{log.entityId.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-xs text-white/40">{new Date(log.createdAt).toLocaleString("ar-SA")}</td>
                  <td className="px-6 py-4 text-xs text-white/40">{log.employeeId ? "موظف" : "نظام"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(logs || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">لا توجد سجلات</div>}
        </div>
      )}
    </div>
  );
}

// ─── Pricing (local) ─────────────────────────────────────────────────────────
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
      await fetch("/api/pricing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ destination: "وجهة جديدة", ticket: 0, security: 0, visa: 0 }) });
      refetch();
    } catch {}
  };
  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`/api/pricing?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><DollarSign className="h-7 w-7 text-gold-500" /> التسعير الذكي</h2>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة</button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
      <div className="rounded-[2rem] border border-white/5 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["الوجهة","سعر التذكرة","رسوم الأمن","رسوم التأشيرة","الإجمالي",""].map(h=><th key={h} className="text-right px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">{h}</th>)}</tr></thead>
          <tbody>{(rows || []).map(row=>{const total=row.ticket+row.security+row.visa;return(
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
              <td className="px-6 py-4"><input value={row.destination} onChange={e=>upd(row.id,"destination",e.target.value)} className="font-bold text-white bg-transparent border-b border-white/10 focus:border-gold-500 outline-none w-28 transition-colors"/></td>
              {(["ticket","security","visa"] as const).map(k=><td key={k} className="px-6 py-4"><div className="flex items-center gap-1"><input type="number" value={(row as any)[k]} onChange={e=>upd(row.id,k,parseFloat(e.target.value)||0)} className="w-16 font-black text-gold-400 bg-white/5 rounded-lg p-1.5 outline-none text-sm text-center"/><span className="text-[10px] text-white/30 font-bold">$</span></div></td>)}
              <td className="px-6 py-4"><span className="font-black text-emerald-400 text-base">${total}</span></td>
              <td className="px-6 py-4"><button onClick={()=>del(row.id)} className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all"><Trash2 className="h-4 w-4"/></button></td>
            </tr>);})}</tbody>
        </table>
        {(rows || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">لا يوجد بيانات تسعير</div>}
      </div>
      )}
    </div>
  );
}

// ─── Branches (local) ────────────────────────────────────────────────────────
type BranchType = { id: string; name: string; city: string; phone: string | null; active: boolean; };

export function BranchesSection({ isDark }: { isDark?: boolean }) {
  const { data: branches, loading, refetch } = useAdminData<BranchType[]>("/api/admin/branches");

  const add = async () => {
    try {
      await fetch("/api/admin/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "فرع جديد", city: "—", phone: "" }) });
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
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`/api/admin/branches?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Building className="h-7 w-7 text-gold-500" /> إدارة الفروع</h2>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة فرع</button>
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
              <input value={b.city} onChange={e => upd(b.id, "city", e.target.value)} className="bg-transparent outline-none w-20" placeholder="المدينة" />
              <input value={b.phone || ""} onChange={e => upd(b.id, "phone", e.target.value)} className="bg-transparent font-mono outline-none w-full" placeholder="رقم الهاتف" />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

// ─── CMS (local) ─────────────────────────────────────────────────────────────
type CmsPageType = { id: string; slug: string; title: string; content: any; };

const CMS_PAGES = [
  { slug: "home", label: "الصفحة الرئيسية", desc: "خدمات، إحصائيات" },
  { slug: "about", label: "من نحن", desc: "تاريخ المجموعة" },
  { slug: "travel", label: "السفر والسياحة", desc: "وجهات وعروض" },
  { slug: "hotels", label: "الفنادق", desc: "النصوص والعناوين" },
  { slug: "visa", label: "التأشيرات", desc: "النصوص والعناوين" },
  { slug: "manpower", label: "الأيدي العاملة", desc: "النصوص والعناوين" },
  { slug: "clients", label: "العملاء", desc: "الإحصائيات والتقييمات" },
  { slug: "blog", label: "المدونة", desc: "محتوى صفحة المقالات" },
  { slug: "vip", label: "بوابة VIP", desc: "المحتوى التعريفي" },
  { slug: "faq", label: "الأسئلة الشائعة", desc: "FAQs" },
  { slug: "contact", label: "اتصل بنا", desc: "الفروع" },
  { slug: "privacy", label: "سياسة الخصوصية", desc: "محتوى الخصوصية" },
  { slug: "cookies", label: "سياسة الكوكيز", desc: "محتوى ملفات الارتباط" },
  { slug: "trust", label: "الثقة والأمان", desc: "التراخيص والشهادات" },
  { slug: "en_home", label: "English Home", desc: "English Frontpage Content" },
];

const KEY_LABELS: Record<string, string> = {
  heroTitle: "العنوان الرئيسي", heroSubtitle: "الوصف الرئيسي", heroTagline: "الكلمة الافتتاحية",
  services: "الخدمات", stats: "الإحصائيات", whyUsTitle: "عنوان قسم لماذا نحن",
  whyUsText: "نص قسم لماذا نحن", pageTitle: "عنوان الصفحة", pageSubtitle: "وصف الصفحة",
  sectionTitle: "عنوان القسم", title: "العنوان", desc: "الوصف", value: "القيمة",
  label: "التسمية (Label)", icon: "أيقونة (اسم/كود)", href: "الرابط", features: "المميزات",
  heroTitlePart1: "العنوان الرئيسي (الجزء الأول)", heroTitlePart2: "العنوان الرئيسي (الجزء الثاني)",
  servicesTagline: "الكلمة الافتتاحية للخدمات", servicesTitle: "عنوان قسم الخدمات",
  whyUsTagline: "الكلمة الافتتاحية للماذا نحن", whyUsGrid: "شبكة لماذا نحن",
  whyUsFeatures: "قائمة المميزات", heroFeatures: "المميزات الرئيسية",
  employersTitle: "عنوان أصحاب العمل", employersText: "نص أصحاب العمل", 
  employersFeatures: "قائمة مميزات أصحاب العمل", employersCTA: "زر دعوة أصحاب العمل", 
  jobsTitle: "عنوان الوظائف", jobsText: "نص الوظائف", jobsCTA: "زر الوظائف", 
  processTitle: "عنوان سير العمل", processText: "نص سير العمل", processSteps: "خطوات سير العمل",
  visionTitle: "عنوان الرؤية", visionDesc: "وصف الرؤية", missionTitle: "عنوان المهمة", 
  missionDesc: "وصف المهمة", valuesTitle: "عنوان القيم", values: "القيم", 
  milestonesTitle: "عنوان الإنجازات", milestones: "قائمة الإنجازات", 
  branchesTitle: "عنوان الفروع", branches: "قائمة الفروع", ctaTitle: "عنوان الإجراء", 
  ctaDesc: "وصف الإجراء", ctaButton: "نص زر الإجراء", filters: "التصنيفات", 
  all: "الكل", fiveStar: "5 نجوم", fourStar: "4 نجوم", threeStar: "3 نجوم", 
  makkah: "مكة", madinah: "المدينة", ctaText: "نص الإجراء", bookingBtn: "زر الحجز", 
  whatsappBtn: "زر الواتساب", callBtn: "زر الاتصال", companyName: "اسم الشركة", 
  experience: "الخبرة المكتوبة", newsletterTitle: "عنوان النشرة البريدية", 
  newsletterText: "نص النشرة البريدية", newsletterPlaceholder: "نص حقل الإدخال", 
  newsletterButton: "زر النشرة", newsletterLoading: "نص التحميل", newsletterSuccess: "نص النجاح",
  items: "العناصر المتفرعة", steps: "الخطوات", advantages: "المزايا الإضافية",
  tagline: "الكلمة المفتاحية", subtitle: "الوصف الفرعي",
  bookingTitle: "عنوان الحجز", bookingSubtitle: "وصف الحجز الفرعي",
  destinationsTitle: "عنوان الوجهات", packagesTitle: "عنوان الباقات",
  packagesSubtitle: "وصف الباقات", heroTags: "وسوم قسم البداية",
  // Visa specific extra keys (ctaTitle/ctaDesc already above)
  destinationsBtn: "زر تقديم طلب التأشيرة", destinationsDesc: "وصف أقسام التأشيرة",
  stepsTitle: "عنوان خطوات التأشيرة", ctaBtn: "نص زر الدعوة",
  // Privacy / Cookies / Trust legal pages
  pageContent: "محتوى الصفحة", sections: "الأقسام",
  lastUpdated: "تاريخ آخر تحديث", contactTitle: "عنوان قسم التواصل",
  contactBody: "نص قسم التواصل", body: "محتوى القسم",
  bullets: "نقاط القسم", text: "نص",
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
        <span className="text-white font-bold text-sm">{data ? "مفعل" : "معطل"}</span>
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
                <span className="text-xs font-black text-gold-500 uppercase tracking-widest">عنصر فرعي ({formatKey(path.split('.').pop() || "")})</span>
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
          <Plus className="h-5 w-5 text-gold-500 group-hover:scale-110 transition-transform" /> إضافة عنصر جديد إلى القائمة
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
    heroTitle: "مجموعة القاضي الذهبية",
    heroDesc: "أكثر من 45 عاماً من التميّز في السفريات والسياحة وخدمات الأيادي العاملة.",
    vision: "أن نكون الشريك السياحي الأول والأكثر ثقة في منطقة الخليج والشرق الأوسط.",
    mission: "تقديم تجارب سفر استثنائية بجودة عالية وأسعار تنافسية.",
    stats: [
      { value: "860,000+", label: "عميل سعيد" },
      { value: "45+", label: "سنة خبرة" },
      { value: "75+", label: "دولة حول العالم" },
      { value: "5", label: "فروع نشطة" },
      { value: "ISO 9001", label: "شهادة الجودة" },
      { value: "98%", label: "نسبة الرضا" },
    ],
    values: [
      { title: "الموثوقية", desc: "نلتزم بأعلى معايير الجودة والشفافية.", icon: "ShieldCheck" },
      { title: "التميّز", desc: "نسعى لتقديم تجربة استثنائية تفوق التوقعات.", icon: "Star" },
      { title: "العميل أولاً", desc: "نضع رضا العميل في صميم كل قراراتنا.", icon: "Users" },
      { title: "الانتشار العالمي", desc: "شبكة شراكات في 75+ دولة.", icon: "Globe2" },
    ],
    milestones: [
      { year: "1980", title: "التأسيس", desc: "تأسيس مجموعة القاضي الذهبية في الكويت." },
      { year: "1992", title: "التوسع الإقليمي", desc: "فتح فروع في اليمن — عدن وصنعاء." },
      { year: "2005", title: "خدمات الأيادي العاملة", desc: "إطلاق قسم التوظيف." },
      { year: "2015", title: "شهادة ISO 9001", desc: "الحصول على شهادة الجودة العالمية." },
      { year: "2020", title: "التحول الرقمي", desc: "إطلاق المنصة الرقمية الشاملة." },
      { year: "2025", title: "860,000 عميل", desc: "تجاوز 860,000 عميل سعيد." },
    ],
    services: [
      { title: "السفريات والسياحة", desc: "حجوزات طيران وبرامج سياحية لأكثر من 150 وجهة.", href: "/services/travel", icon: "Plane" },
      { title: "حجوزات الفنادق", desc: "فنادق 4 و5 نجوم بأسعار حصرية.", href: "/services/hotels", icon: "Hotel" },
      { title: "خدمات التأشيرات", desc: "معالجة سريعة لأكثر من 30 دولة.", href: "/services/visa", icon: "Globe2" },
      { title: "الأيادي العاملة", desc: "توظيف الكفاءات للشركات في الخليج.", href: "/services/manpower", icon: "Briefcase" },
    ],
    ctaTitle: "هل تحتاج مساعدة في تخطيط رحلتك؟",
    ctaDesc: "فريق مجموعة القاضي الذهبية جاهز لمساعدتك على مدار الساعة.",
    ctaButton: "تواصل معنا الآن",
  },
  home: {
    heroTitle: "رحلتك تبدأ من هنا",
    heroDesc: "مجموعة القاضي الذهبية — 45 عاماً من التميّز في السفر والسياحة.",
    heroTagline: "مجموعة القاضي الذهبية — منذ 1980",
    servicesTitle: "خدماتنا المتكاملة",
    servicesTagline: "OUR SERVICES",
    whyUsTitle: "لماذا مجموعة القاضي؟",
    whyUsText: "نقدم خدمات سفر وسياحة متكاملة بخبرة 45 عاماً وشراكات عالمية.",
    whyUsFeatures: [
      { title: "45+ سنة خبرة", desc: "أربعة عقود من الخبرة في صناعة السفر." },
      { title: "860,000+ عميل", desc: "ثقة مئات الآلاف من العملاء." },
      { title: "75+ دولة", desc: "شبكة شراكات واسعة حول العالم." },
      { title: "ISO 9001", desc: "شهادة جودة دولية." },
    ],
    newsletterTitle: "اشترك في نشرتنا البريدية",
    newsletterText: "احصل على أحدث العروض والوجهات السياحية.",
    newsletterPlaceholder: "البريد الإلكتروني",
    newsletterButton: "اشترك الآن",
    newsletterLoading: "جاري الاشتراك...",
    newsletterSuccess: "شكراً! تم الاشتراك بنجاح.",
  },
  travel: {
    heroTitle: "اكتشف العالم مع القاضي",
    heroDesc: "رحلاتك المثالية تنتظرك — وجهات عالمية وباقات مخصصة وخبرة 45 عاماً.",
    heroTags: ["+150 وجهة", "+45 سنة خبرة", "دعم 24/7", "أفضل الأسعار"],
    destinationsTitle: "الوجهات المميزة",
    packagesTitle: "باقات السفر",
    packagesSubtitle: "اختر الباقة التي تناسبك",
    bookingTitle: "احجز رحلتك الآن",
    bookingSubtitle: "أرسل بياناتك ونتواصل معك فوراً",
    ctaTitle: "جاهز للمغامرة؟",
    ctaDesc: "فريق القاضي يساعدك في اختيار وجهتك وتخطيط رحلتك.",
    ctaButton: "تواصل عبر واتساب",
  },
  hotels: {
    heroTitle: "أفخم الفنادق بأفضل الأسعار",
    heroDesc: "نختار لك أرقى الفنادق في أجمل الوجهات — 4 و5 نجوم بأسعار حصرية.",
    ctaTitle: "احجز فندقك الآن",
    ctaDesc: "تواصل مع فريقنا للحصول على أفضل الأسعار.",
    ctaButton: "احجز عبر واتساب",
  },
  visa: {
    heroTitle: "خدمات التأشيرات من القاضي",
    heroDesc: "دعم متكامل في الحصول على التأشيرة لأكثر من 30 دولة، بخبرة تمتد لأكثر من 45 عاماً.",
    destinationsTitle: "التأشيرات المتاحة عبر مجموعة القاضي",
    destinationsDesc: "اختر وجهتك واطلب تأشيرتك بسهولة عبر فريق القاضي",
    destinationsBtn: "قدّم طلبك الآن",
    stepsTitle: "كيف تحصل على تأشيرتك؟",
    steps: [
      { title: "أرسل طلبك", desc: "أرسل بياناتك عبر النموذج أو واتساب", icon: "FileText" },
      { title: "أرفق المستندات", desc: "جواز السفر والوثائق الداعمة", icon: "Upload" },
      { title: "المراجعة والمعالجة", desc: "فريقنا يتولى كامل إجراءات التقديم", icon: "Search" },
      { title: "استلم التأشيرة", desc: "تُسلَّم إلكترونياً أو مطبوعة", icon: "BadgeCheck" },
    ],
    features: [
      { text: "متابعة مستمرة للطلب", icon: "Shield" },
      { text: "معالجة سريعة وموثوقة", icon: "Clock" },
      { text: "تغطية +30 دولة", icon: "Globe2" },
      { text: "خبرة 45+ سنة", icon: "CheckCircle2" },
    ],
    ctaTitle: "فريق مجموعة القاضي جاهز لمساعدتك",
    ctaDesc: "تواصل معنا عبر واتساب للحصول على رد فوري.",
    ctaBtn: "تواصل عبر واتساب",
  },
  manpower: {
    heroTitle: "خدمات الأيادي العاملة",
    heroDesc: "نربط أصحاب العمل بأفضل الكفاءات — خبرة 45 عاماً في توظيف المهنيين في الخليج.",
    employersTitle: "لأصحاب العمل",
    employersText: "حلول توظيف متكاملة للشركات والمؤسسات في الكويت والخليج.",
    employersCTA: "تواصل للاستفسار",
    jobsTitle: "للباحثين عن عمل",
    jobsText: "سجّل بياناتك وسنتواصل معك عند توفر فرصة مناسبة.",
    jobsCTA: "سجّل سيرتك الذاتية",
    processTitle: "كيف نعمل",
    processSteps: [
      { title: "التواصل الأولي", desc: "أرسل متطلباتك عبر واتساب أو النموذج." },
      { title: "الاختيار والفرز", desc: "يختار فريقنا أفضل المرشحين." },
      { title: "المقابلات", desc: "نرتب المقابلات المناسبة." },
      { title: "الاستقدام", desc: "نتولى كامل إجراءات الاستقدام." },
    ],
    ctaTitle: "ابدأ التوظيف معنا اليوم",
    ctaDesc: "تواصل مع فريقنا للحصول على استشارة مجانية.",
    ctaButton: "تواصل معنا",
  },
  privacy: {
    pageTitle: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: 1 مايو 2026",
    sections: [
      { title: "1. البيانات التي نجمعها", body: "نجمع معلومات الاتصال الأساسية عند التواصل معنا أو حجز خدماتنا." },
      { title: "2. كيف نستخدم البيانات", body: "تُستخدم البيانات لتقديم الخدمات وإرسال التحديثات." },
      { title: "3. مشاركة البيانات", body: "لا نبيع أو نشارك بياناتك مع أطراف ثالثة." },
      { title: "4. أمان البيانات", body: "نستخدم تقنيات التشفير الحديثة لحماية بياناتك." },
      { title: "5. حقوقك", bullets: ["الحق في الوصول لبياناتك", "الحق في تصحيح البيانات", "الحق في حذف البيانات"] },
    ],
    contactTitle: "6. تواصل معنا",
    contactBody: "لأي استفسارات بخصوص سياسة الخصوصية، تواصل معنا:",
  },
  cookies: {
    pageTitle: "سياسة ملفات تعريف الارتباط",
    lastUpdated: "آخر تحديث: 1 مايو 2026",
    sections: [
      { title: "1. ما هي ملفات الارتباط؟", body: "ملفات صغيرة تُخزَّن في متصفحك لتحسين تجربتك." },
      { title: "2. أنواع ملفات الارتباط", bullets: ["ملفات ضرورية للتشغيل", "ملفات الأداء والتحليلات"] },
      { title: "3. كيف تتحكم بها", body: "يمكنك تعطيل ملفات الارتباط من إعدادات المتصفح." },
    ],
    contactTitle: "4. تواصل معنا",
    contactBody: "لأي استفسارات بخصوص ملفات الارتباط، تواصل معنا:",
  },
  trust: {
    pageTitle: "مركز الشفافية",
    pageSubtitle: "سياسات، تراخيص، وشهادات.",
    sectionTitle: "سجل أصول ثلاثية الأبعاد",
  },
  en_home: {
    heroTagline: "GOLDEN AL'QADI GROUP — SINCE 1980",
    heroTitlePart1: "Travel in",
    heroTitlePart2: "Golden Style",
    heroSubtitle: "Kuwait's premier travel, tourism, and manpower group — 45 years of excellence.",
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
    pageTitle: "الأسئلة الشائعة",
    pageSubtitle: "إجابات على أكثر الأسئلة شيوعاً حول خدماتنا.",
    items: [
      { question: "كيف أحجز رحلة عبر مجموعة القاضي؟", answer: "يمكنك التواصل معنا عبر واتساب أو زيارة أحد فروعنا." },
      { question: "ما هي الدول التي تغطيها خدمة التأشيرات؟", answer: "نغطي أكثر من 30 دولة حول العالم." },
    ],
  },
  vip: { heroTitle: "بوابة VIP", heroDesc: "خدمات حصرية لعملائنا المميزين." },
  clients: {
    pageTitle: "عملاؤنا الكرام",
    pageSubtitle: "أكثر من 860,000 عميل سعيد يثقون في مجموعة القاضي.",
    stats: [
      { value: "860,000+", label: "عميل سعيد" },
      { value: "98%", label: "نسبة الرضا" },
      { value: "45+", label: "سنة خبرة" },
    ],
  },
  blog: { pageTitle: "مدونة مجموعة القاضي", pageSubtitle: "آخر الأخبار والنصائح السياحية." },
  contact: { pageTitle: "اتصل بنا", pageSubtitle: "نحن دائماً في خدمتكم.", branchesTitle: "فروعنا" },
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
      const def = PAGE_DEFAULTS[slug] || { heroTitle: "عنوان الصفحة", heroDesc: "وصف الصفحة..." };
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
      alert("البيانات غير صالحة");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Layers className="h-7 w-7 text-gold-500" /> إدارة المحتوى (CMS)</h2>
        <p className="text-white/40 text-sm mt-1">تحرير محتوى صفحات الموقع بواجهات مبسطة</p>
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
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold bg-white/5 px-3 py-1.5 rounded-lg">← الرجوع</button>
              <h4 className="text-xl font-black text-gold-400">{CMS_PAGES.find(p => p.slug === selected)?.label}</h4>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
                <button onClick={() => setViewMode("form")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "form" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
                  واجهة مفصلة
                </button>
                <button onClick={() => setViewMode("json")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "json" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
                  محرر الكود
                </button>
              </div>
              <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gold-500 text-black rounded-xl font-black text-sm hover:bg-gold-400 transition-all disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
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
                    <p className="text-white/40 font-bold mb-2">البيانات غير صالحة للعرض كواجهة</p>
                    <p className="text-xs text-white/30">يرجى إصلاحها في محرر الكود أولاً</p>
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

// ─── Settings (local) ──────────────────────────────────────────────────────
export function SettingsSection({ isDark }: { isDark?: boolean }) {
  const { data: remoteSettings, loading, refetch } = useAdminData<Record<string, any>>("/api/settings");
  
  const defaultSettings = {
    siteName: "مجموعة القاضي الذهبية", siteUrl: "https://alqadigroup.com",
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
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Settings className="h-7 w-7 text-gold-500" /> إعدادات النظام</h2>
        <button onClick={save} className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black rounded-xl font-black hover:bg-gold-400 transition-all">
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? "تم!" : "حفظ"}
        </button>
      </div>
      {loading ? (
        <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      ) : (
      <>
      <div className="grid md:grid-cols-2 gap-6">
        {[{label:"اسم الموقع",key:"siteName",dir:"rtl"},{label:"رابط الموقع",key:"siteUrl",dir:"ltr"},{label:"بريد الإرسال",key:"emailFrom",dir:"ltr"},{label:"العملة",key:"currency",dir:"ltr"}].map(f=>(
          <div key={f.key} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{f.label}</label>
            <input dir={f.dir} value={(settings as any)[f.key]} onChange={e=>setSettings(s=>({...s,[f.key]:e.target.value}))}
              className="w-full bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-white font-bold py-1 transition-colors"/>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
        <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest mb-6">التبديلات السريعة</h3>
        {[{key:"darkMode",label:"الوضع الداكن",desc:"تفعيل الثيم الداكن"},{key:"notifications",label:"الإشعارات",desc:"تفعيل إشعارات النظام"},{key:"maintenanceMode",label:"وضع الصيانة",desc:"إخفاء الموقع مؤقتاً"}].map(t=>(
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
