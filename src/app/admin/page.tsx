"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Settings, Phone, Mail, MapPin, Globe2, Users,
  Briefcase, Hotel, Plane, Save, Eye, EyeOff, LogOut,
  CheckCircle, DollarSign, Edit3, ChevronDown, ChevronUp,
  UserPlus, Building, Tag, Trash2, RefreshCw, Copy, ShieldCheck, Database,
  Search, Plus, Filter, MoreVertical, CheckCircle2, XCircle, Clock, RefreshCw as RefreshCwIcon
} from "lucide-react";

// ⚠️ Security: Password loaded from environment variable — never hardcode!
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "CHANGE_ME_IN_ENV";

// ── Initial content (matches actual site data) ────────────────
const DEFAULT_CONTENT = {
  company: {
    nameAr: "مجموعة القاضي الذهبية",
    nameEn: "Golden Al'Qadi Group",
    phone: "+96598765432",
    email: "info@alqadigroup.com",
    address: "الكويت — مجمع القاضي، شارع الخليج العربي",
    whatsapp: "96598765432",
    foundedYear: "1980",
    taglineAr: "السفريات والسياحة وخدمات الأيادي العاملة",
    taglineEn: "Travel, Tourism & Manpower Services",
  },
  stats: {
    clients: "860,000+",
    experience: "45+",
    countries: "75+",
    satisfaction: "98%",
  },
  destinations: [
    { city: "لندن", country: "المملكة المتحدة", priceKWD: "210", active: true },
    { city: "إسطنبول", country: "تركيا", priceKWD: "145", active: true },
    { city: "باريس", country: "فرنسا", priceKWD: "175", active: true },
    { city: "دبي", country: "الإمارات", priceKWD: "190", active: true },
    { city: "القاهرة", country: "مصر", priceKWD: "90", active: true },
    { city: "كوالالمبور", country: "ماليزيا", priceKWD: "130", active: true },
  ],
  packages: [
    { name: "باقة أوروبا الملكية", nights: "10", priceKWD: "2800", discount: "22%", active: true },
    { name: "برنامج الصيف الذهبي", nights: "7", priceKWD: "1600", discount: "18%", active: true },
    { name: "Business Elite", nights: "5", priceKWD: "4500", discount: "VIP", active: true },
  ],
  jobs: [
    { title: "مهندس مدني", company: "شركة الأبنية الكويتية", location: "الكويت", salary: "650-900 KWD", active: true },
    { title: "ممرض رعاية مركزة", company: "مستشفى الأمل الكويتي", location: "الكويت", salary: "450-600 KWD", active: true },
    { title: "مختص تقنية المعلومات", company: "مجموعة التقنية الخليجية", location: "دبي", salary: "5000-7000 AED", active: true },
  ],
  employees: [
    { name: "أحمد القاضي", username: "ahmed.alqadi", password: "••••••••", phone: "+9671234567", role: "supervisor", branch: "hq", shift: "morning", active: true },
    { name: "محمد علي", username: "mohammed.ali", password: "••••••••", phone: "+9677654321", role: "booking", branch: "sanaa", shift: "morning", active: true },
    { name: "عبدالله سعيد", username: "abdallah.saeed", password: "••••••••", phone: "+9678765432", role: "booking", branch: "sanafer", shift: "evening", active: true },
  ],
  branches: [
    { id: "hq", name: "الإدارة العامة", active: true },
    { id: "sanaa", name: "فرع صنعاء", active: true },
    { id: "sanafer", name: "عدن - السنافر", active: true },
    { id: "mansoura", name: "عدن - المنصورة (فلاي مي)", active: true },
    { id: "khormaksar", name: "عدن - خور مكسر", active: true },
  ],
  pricing: [
    { destination: "القاهرة", ticketPrice: "120", securityApproval: "15", visaFee: "25" },
    { destination: "اسطنبول", ticketPrice: "145", securityApproval: "15", visaFee: "30" },
    { destination: "لندن", ticketPrice: "210", securityApproval: "20", visaFee: "50" },
    { destination: "دبي", ticketPrice: "80", securityApproval: "10", visaFee: "0" },
  ],
};

import type { LucideIcon } from "lucide-react";

type Content = typeof DEFAULT_CONTENT;
type Section = "company" | "stats" | "destinations" | "packages" | "hotels" | "visas" | "jobs" | "employees" | "branches" | "pricing" | "crm" | "bookings" | "dynamic_db" | "audit_log" | "support_tickets" | "cms" | "api_integrations";

const SECTIONS: { id: Section; label: string; icon: LucideIcon; group?: string }[] = [
  // ── الإعدادات الأساسية ──
  { id: "company", label: "بيانات الشركة", icon: Globe2, group: "الأساسيات" },
  { id: "stats", label: "الإحصائيات", icon: CheckCircle, group: "الأساسيات" },
  
  // ── العمليات والخدمات ──
  { id: "bookings", label: "إدارة الحجوزات", icon: Save, group: "العمليات" },
  { id: "crm", label: "إدارة العملاء (CRM)", icon: Users, group: "العمليات" },
  { id: "support_tickets", label: "تذاكر الدعم الفني", icon: Phone, group: "العمليات" },
  
  // ── المنتجات السياحية ──
  { id: "destinations", label: "الوجهات السياحية", icon: Plane, group: "المنتجات" },
  { id: "packages", label: "الباقات والعروض", icon: Tag, group: "المنتجات" },
  { id: "hotels", label: "إدارة الفنادق", icon: Hotel, group: "المنتجات" },
  { id: "visas", label: "إدارة التأشيرات", icon: Globe2, group: "المنتجات" },
  { id: "jobs", label: "الأيدي العاملة", icon: Briefcase, group: "المنتجات" },
  
  // ── الإدارة المتقدمة والأدوات الخارقة ──
  { id: "pricing", label: "التسعير التلقائي", icon: DollarSign, group: "إدارة متقدمة" },
  { id: "employees", label: "إدارة الموظفين", icon: Users, group: "إدارة متقدمة" },
  { id: "branches", label: "إدارة الفروع", icon: Building, group: "إدارة متقدمة" },
  { id: "dynamic_db", label: "قواعد البيانات الديناميكية", icon: Database, group: "إدارة متقدمة" },
  { id: "cms", label: "إدارة المحتوى (CMS)", icon: Copy, group: "إدارة متقدمة" },
  { id: "audit_log", label: "سجل المراقبة (Audit Log)", icon: ShieldCheck, group: "إدارة متقدمة" },
  { id: "api_integrations", label: "إدارة ربط الـ APIs", icon: RefreshCw, group: "إدارة متقدمة" },
];

const STORAGE_KEY = "alqadi_admin_auth";

async function loadContentFromDB() {
  try {
    const res = await fetch("/api/admin/content");
    if (res.ok) {
      const data = await res.json();
      return { ...DEFAULT_CONTENT, ...data };
    }
  } catch (error) {
    console.error("Failed to load content from DB", error);
  }
  return DEFAULT_CONTENT;
}


/* ── Field component ─────────────────────────────────────────── */
function Field({ label, value, onChange, type = "text", hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/50">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-gold-500/20 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400 transition"
      />
      {hint && <p className="mt-1 text-[10px] text-white/30">{hint}</p>}
    </div>
  );
}

// ⚠️ Security: Default password from env — change immediately after first login
const DEFAULT_EMPLOYEE_PASSWORD = process.env.NEXT_PUBLIC_DEFAULT_EMP_PASSWORD || "ChangeMe@FirstLogin!";

type Employee = {
  name: string; username: string; password: string; phone: string;
  role: string; branch: string; shift: string; active: boolean;
};

/* ── Employees Section ──────────────────────────────────────── */
function EmployeesSection({ content, setContent }: {
  content: { employees: Employee[]; branches: { id: string; name: string; active: boolean }[] };
  setContent: (fn: (c: any) => any) => void;
}) {
  const [showPw, setShowPw] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState<number | null>(null);

  function updateEmp(i: number, patch: Partial<Employee>) {
    setContent((c: any) => {
      const emps = [...c.employees];
      emps[i] = { ...emps[i], ...patch };
      return { ...c, employees: emps };
    });
  }

  function copyUsername(i: number, username: string) {
    navigator.clipboard.writeText(username).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function resetPassword(i: number) {
    updateEmp(i, { password: DEFAULT_EMPLOYEE_PASSWORD });
    setResetConfirm(i);
    setTimeout(() => setResetConfirm(null), 3000);
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">إدارة حسابات الموظفين وصلاحياتهم</p>
        <button
          onClick={() => setContent((c: any) => ({
            ...c,
            employees: [...c.employees, {
              name: "موظف جديد", username: "new.employee", password: DEFAULT_EMPLOYEE_PASSWORD,
              phone: "", role: "booking", branch: "hq", shift: "morning", active: true
            }]
          }))}
          className="flex items-center gap-2 rounded-xl border border-gold-500/25 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500/20 transition"
        >
          <UserPlus className="h-3.5 w-3.5" /> إضافة موظف
        </button>
      </div>

      {/* Employee cards */}
      {content.employees.map((emp, i) => (
        <Card key={i} title={`${emp.name} — ${emp.role === "supervisor" ? "🔑 مشرف" : "📋 موظف حجز"}`}>
          {/* Reset password alert */}
          {resetConfirm === i && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              تم إعادة تعيين كلمة المرور إلى: <span className="font-mono font-bold">{DEFAULT_EMPLOYEE_PASSWORD}</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <Field label="الاسم الكامل" value={emp.name} onChange={v => updateEmp(i, { name: v })} />

            {/* Phone */}
            <Field label="رقم الهاتف" value={emp.phone ?? ""} onChange={v => updateEmp(i, { phone: v })} hint="مثال: +9671234567" />

            {/* Username */}
            <div>
              <label className="mb-1 block text-xs text-white/50">اسم المستخدم (Username)</label>
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type="text"
                  value={emp.username ?? ""}
                  onChange={e => updateEmp(i, { username: e.target.value })}
                  className="w-full rounded-xl border border-gold-500/20 bg-black/60 py-2.5 pl-10 pr-4 font-mono text-sm text-white outline-none focus:border-gold-400 transition"
                  dir="ltr"
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => copyUsername(i, emp.username ?? "")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold-400 transition"
                  title="نسخ اسم المستخدم"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copied === i && <p className="mt-1 text-[10px] text-emerald-400">✓ تم النسخ!</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs text-white/50">كلمة المرور</label>
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type={showPw[i] ? "text" : "password"}
                  value={emp.password ?? ""}
                  onChange={e => updateEmp(i, { password: e.target.value })}
                  className="w-full rounded-xl border border-gold-500/20 bg-black/60 py-2.5 pl-10 pr-4 font-mono text-sm text-white outline-none focus:border-gold-400 transition"
                  dir="ltr"
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowPw(s => ({ ...s, [i]: !s[i] }))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                >
                  {showPw[i] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-xs text-white/50">الصلاحية</label>
              <select suppressHydrationWarning value={emp.role} onChange={e => updateEmp(i, { role: e.target.value })}
                className="w-full rounded-xl border border-gold-500/20 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400 transition">
                <option value="booking">موظف حجز</option>
                <option value="supervisor">مشرف</option>
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="mb-1 block text-xs text-white/50">الفرع</label>
              <select suppressHydrationWarning value={emp.branch} onChange={e => updateEmp(i, { branch: e.target.value })}
                className="w-full rounded-xl border border-gold-500/20 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400 transition">
                {content.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            {/* Shift */}
            <div>
              <label className="mb-1 block text-xs text-white/50">الشفت</label>
              <select suppressHydrationWarning value={emp.shift} onChange={e => updateEmp(i, { shift: e.target.value })}
                className="w-full rounded-xl border border-gold-500/20 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400 transition">
                <option value="morning">صباحي</option>
                <option value="evening">مسائي</option>
                <option value="night">ليلي</option>
              </select>
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
              <span className="flex-1 text-sm text-white/50">حالة الحساب</span>
              <button
                suppressHydrationWarning
                onClick={() => updateEmp(i, { active: !emp.active })}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${emp.active ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-red-500/15 text-red-400 hover:bg-red-500/25"}`}
              >
                {emp.active ? "✓ مفعّل" : "✗ موقوف"}
              </button>
            </div>
          </div>

          {/* Actions row */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <button
              suppressHydrationWarning
              onClick={() => resetPassword(i)}
              className="flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/20 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" /> إعادة تعيين كلمة المرور
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setContent((c: any) => ({ ...c, employees: c.employees.filter((_: any, idx: number) => idx !== i) }))}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="h-3.5 w-3.5" /> حذف الموظف
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Collapsible card ───────────────────────────────────────── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-gold-500/15 bg-white/[0.03] overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-gold-400" /> : <ChevronDown className="h-4 w-4 text-gold-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="border-t border-white/8 p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Visas Section (DB) ──────────────────────────────────────── */
function VisasSection() {
  const [visas, setVisas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVisas();
  }, []);

  async function fetchVisas() {
    setLoading(true);
    try {
      const res = await fetch("/api/visas?admin=true");
      if (res.ok) {
        const data = await res.json();
        setVisas(data);
      }
    } catch {
      setError("فشل في تحميل التأشيرات");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddVisa() {
    const newVisa = {
      country: "دولة جديدة",
      type: "tourism",
      price: 50,
      processingDays: 7,
      active: true,
    };
    try {
      const res = await fetch("/api/visas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVisa),
      });
      if (res.ok) fetchVisas();
    } catch {
      setError("فشل في إضافة التأشيرة");
    }
  }

  async function updateVisa(id: string, patch: any) {
    setVisas(vs => vs.map(v => (v.id === id ? { ...v, ...patch } : v)));
    try {
      await fetch("/api/visas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
    } catch {
      setError("فشل في تحديث التأشيرة");
    }
  }

  async function deleteVisa(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه التأشيرة؟")) return;
    try {
      const res = await fetch(`/api/visas?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchVisas();
    } catch {
      setError("فشل في حذف التأشيرة");
    }
  }

  if (loading) return <div className="p-4 text-center text-white/50 animate-pulse">جاري تحميل التأشيرات من قاعدة البيانات...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">إدارة تأشيرات قاعدة البيانات الحقيقية</p>
        <button
          onClick={handleAddVisa}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition"
        >
          <Globe2 className="h-4 w-4" /> إضافة تأشيرة
        </button>
      </div>

      {error && <div className="text-red-400 text-xs text-center">{error}</div>}

      {visas.map((v) => (
        <Card key={v.id} title={`${v.country} - ${v.type === 'tourism' ? 'سياحية' : v.type === 'business' ? 'عمل' : v.type}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="الدولة (عربي)" value={v.country} onChange={val => updateVisa(v.id, { country: val })} />
            <Field label="الدولة (إنجليزي)" value={v.countryEn || ""} onChange={val => updateVisa(v.id, { countryEn: val })} />
            
            <div>
              <label className="mb-1 block text-xs text-white/50">نوع التأشيرة</label>
              <select
                value={v.type}
                onChange={e => updateVisa(v.id, { type: e.target.value })}
                className="w-full rounded-xl border border-gold-500/20 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400 transition"
              >
                <option value="tourism">سياحية</option>
                <option value="business">عمل</option>
                <option value="study">دراسة</option>
                <option value="transit">عبور (ترانزيت)</option>
              </select>
            </div>

            <Field label="رسوم التأشيرة" type="number" value={v.price} onChange={val => updateVisa(v.id, { price: parseFloat(val) || 0 })} />
            <Field label="مدة الإنجاز (بالأيام)" type="number" value={v.processingDays} onChange={val => updateVisa(v.id, { processingDays: parseInt(val) || 1 })} />
            
            <div className="md:col-span-2 mt-2 border-t border-red-500/10 pt-4 flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <input 
                   type="checkbox" 
                   checked={v.active} 
                   onChange={e => updateVisa(v.id, { active: e.target.checked })} 
                   className="rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50"
                />
                تأشيرة نشطة (تظهر في الموقع)
              </label>
              <button
                onClick={() => deleteVisa(v.id)}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> حذف التأشيرة
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Jobs Section (DB) ────────────────────────────────────────── */
function JobsSection() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs?admin=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (id: string, updates: any) => {
    setSavingId(id);
    try {
      await fetch("/api/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleAdd = async () => {
    setSavingId("new");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "عنوان الوظيفة",
          titleEn: "Job Title",
          category: "medical",
          country: "الكويت",
          salary: 0,
          currency: "KWD",
          experience: "سنتان",
          active: false
        }),
      });
      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;
    setSavingId(id);
    try {
      await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      setJobs(jobs.filter((j) => j.id !== id));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="text-white/60 text-sm">جارٍ تحميل الوظائف...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">تعديل الوظائف في قاعدة البيانات</p>
        <button
          onClick={handleAdd}
          disabled={savingId === "new"}
          className="flex items-center gap-2 rounded-xl border border-gold-500/25 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500/20 transition disabled:opacity-50"
        >
          {savingId === "new" ? "جارٍ الإضافة..." : "+ إضافة وظيفة"}
        </button>
      </div>
      {jobs.map((job, index) => (
        <Card key={job.id || index} title={`${job.title} — ${job.country}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="المسمى الوظيفي (عربي)"
              value={job.title}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, title: v } : j)));
                handleUpdate(job.id, { title: v });
              }}
            />
            <Field
              label="الدولة"
              value={job.country}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, country: v } : j)));
                handleUpdate(job.id, { country: v });
              }}
            />
            <Field
              label="التصنيف (Category)"
              value={job.category}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, category: v } : j)));
                handleUpdate(job.id, { category: v });
              }}
              hint="medical | engineering | teaching | domestic | general"
            />
            <Field
              label="الراتب"
              type="number"
              value={job.salary}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, salary: v } : j)));
                handleUpdate(job.id, { salary: Number(v) });
              }}
            />
            <Field
              label="العملة"
              value={job.currency}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, currency: v } : j)));
                handleUpdate(job.id, { currency: v });
              }}
            />
            <Field
              label="الخبرة المطلوبة"
              value={job.experience || ""}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, experience: v } : j)));
                handleUpdate(job.id, { experience: v });
              }}
            />
            <Field
              label="رابط الصورة (Image URL)"
              value={job.imageUrl || ""}
              onChange={(v) => {
                setJobs(jobs.map((j) => (j.id === job.id ? { ...j, imageUrl: v } : j)));
                handleUpdate(job.id, { imageUrl: v });
              }}
            />
            
            <div className="flex items-center gap-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={job.active}
                  onChange={(e) => {
                    const active = e.target.checked;
                    setJobs(jobs.map((j) => (j.id === job.id ? { ...j, active } : j)));
                    handleUpdate(job.id, { active });
                  }}
                  className="rounded border-white/20 bg-white/5 accent-gold-500"
                />
                متاح حالياً
              </label>
              
              <button
                onClick={() => handleDelete(job.id)}
                disabled={savingId === job.id}
                className="mr-auto text-xs text-red-400 hover:text-red-300 transition"
              >
                {savingId === job.id ? "..." : "حذف الوظيفة"}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

/* ── Hotels Section (DB) ──────────────────────────────────────── */
function HotelsSection() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    setLoading(true);
    try {
      const res = await fetch("/api/hotels");
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      }
    } catch {
      setError("فشل في تحميل الفنادق");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddHotel() {
    const newHotel = {
      name: "فندق جديد",
      city: "المدينة",
      country: "الدولة",
      stars: 4,
      priceFrom: 100,
      active: true,
    };
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHotel),
      });
      if (res.ok) fetchHotels();
    } catch {
      setError("فشل في إضافة الفندق");
    }
  }

  async function updateHotel(id: string, patch: any) {
    // Optimistic update locally
    setHotels(hs => hs.map(h => (h.id === id ? { ...h, ...patch } : h)));
    try {
      await fetch("/api/hotels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
    } catch {
      setError("فشل في تحديث الفندق");
    }
  }

  async function deleteHotel(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الفندق؟")) return;
    try {
      const res = await fetch(`/api/hotels?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchHotels();
    } catch {
      setError("فشل في حذف الفندق");
    }
  }

  if (loading) return <div className="p-4 text-center text-white/50 animate-pulse">جاري تحميل الفنادق من قاعدة البيانات...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">إدارة فنادق قاعدة البيانات الحقيقية</p>
        <button
          onClick={handleAddHotel}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition"
        >
          <Building className="h-4 w-4" /> إضافة فندق
        </button>
      </div>

      {error && <div className="text-red-400 text-xs text-center">{error}</div>}

      {hotels.map((h) => (
        <Card key={h.id} title={`${h.name} - ${h.city}، ${h.country}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="اسم الفندق (عربي)" value={h.name} onChange={v => updateHotel(h.id, { name: v })} />
            <Field label="الاسم (إنجليزي)" value={h.nameEn || ""} onChange={v => updateHotel(h.id, { nameEn: v })} />
            <Field label="المدينة" value={h.city} onChange={v => updateHotel(h.id, { city: v })} />
            <Field label="الدولة" value={h.country} onChange={v => updateHotel(h.id, { country: v })} />
            <Field label="عدد النجوم" type="number" value={h.stars} onChange={v => updateHotel(h.id, { stars: parseInt(v) || 4 })} />
            <Field label="السعر المبدئي" type="number" value={h.priceFrom} onChange={v => updateHotel(h.id, { priceFrom: parseFloat(v) || 0 })} />
            <Field label="رابط الصورة (Image URL)" value={h.imageUrl || ""} onChange={v => updateHotel(h.id, { imageUrl: v })} />
            
            <div className="md:col-span-2">
               <label className="mb-1 block text-xs text-white/50">الوصف</label>
               <textarea
                 value={h.description || ""}
                 onChange={e => updateHotel(h.id, { description: e.target.value })}
                 className="w-full rounded-xl border border-gold-500/20 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400 transition"
                 rows={3}
               />
            </div>

            <div className="md:col-span-2 mt-2 border-t border-red-500/10 pt-4 flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <input 
                   type="checkbox" 
                   checked={h.active} 
                   onChange={e => updateHotel(h.id, { active: e.target.checked })} 
                   className="rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50"
                />
                فندق نشط (يظهر في الموقع)
              </label>
              <button
                onClick={() => deleteHotel(h.id)}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> حذف الفندق
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwErr, setPwErr] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("company");
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [saved, setSaved] = useState(false);

  // ── Enterprise State ──
  const [crmClients, setCrmClients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [dynamicSchemas, setDynamicSchemas] = useState<any[]>([]);
  const [apiIntegrations, setApiIntegrations] = useState<any[]>([]);
  const [enterpriseLoading, setEnterpriseLoading] = useState(false);

  // API Form state
  const [apiForm, setApiForm] = useState({ name: "", label: "", type: "rest", endpoint: "", apiKey: "", secret: "", active: true });
  const [apiFormOpen, setApiFormOpen] = useState(false);
  const [apiEditId, setApiEditId] = useState<string | null>(null);
  const [apiTestResults, setApiTestResults] = useState<Record<string, { ok: boolean; message: string; loading?: boolean }>>({});

  // Dynamic DB form state
  const [dbFormOpen, setDbFormOpen] = useState(false);
  const [dbForm, setDbForm] = useState({ name: "", labelAr: "", fields: [{ name: "title", type: "string", labelAr: "العنوان" }] });

  // ── CMS Page Editor State ──
  const CMS_PAGES = [
    { key: "cms_about", label: "من نحن", desc: "المراحل التاريخية، القيم، الرؤية والمهمة" },
    { key: "cms_contact", label: "اتصل بنا", desc: "بيانات الفروع والعناوين" },
    { key: "cms_blog", label: "المدونة", desc: "المقالات والأخبار" },
    { key: "cms_faq", label: "الأسئلة الشائعة", desc: "الأسئلة والأجوبة" },
    { key: "cms_clients", label: "عملاؤنا", desc: "الشهادات وأسماء العملاء" },
    { key: "cms_vip", label: "VIP", desc: "مزايا برنامج VIP" },
    { key: "cms_home", label: "الصفحة الرئيسية", desc: "الخدمات والأخبار" },
    { key: "cms_travel", label: "السفريات", desc: "لماذا نحن وأنواع الرحلات" },
  ];
  const [cmsEditKey, setCmsEditKey] = useState<string | null>(null);
  const [cmsEditData, setCmsEditData] = useState<string>("");
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSaved, setCmsSaved] = useState(false);
  const [cmsPageData, setCmsPageData] = useState<Record<string, any>>({});

  async function loadCmsPage(key: string) {
    setCmsEditKey(key);
    setCmsSaved(false);
    try {
      const r = await fetch("/api/content");
      if (r.ok) {
        const data = await r.json();
        const pageData = data[key] || {};
        setCmsPageData(prev => ({ ...prev, [key]: pageData }));
        setCmsEditData(JSON.stringify(pageData, null, 2));
      }
    } catch { setCmsEditData("{}"); }
  }

  async function saveCmsPage() {
    if (!cmsEditKey) return;
    setCmsSaving(true);
    try {
      const parsed = JSON.parse(cmsEditData);
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [cmsEditKey]: parsed }),
      });
      setCmsPageData(prev => ({ ...prev, [cmsEditKey!]: parsed }));
      setCmsSaved(true);
      setTimeout(() => setCmsSaved(false), 3000);
    } catch { alert("❌ تنسيق JSON غير صحيح. تأكد من صحة البيانات."); }
    setCmsSaving(false);
  }

  async function createDynamicSchema() {
    if (!dbForm.name || !dbForm.labelAr) return;
    const r = await fetch("/api/admin/dynamic-schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dbForm),
    });
    if (r.ok) {
      setDbFormOpen(false);
      setDbForm({ name: "", labelAr: "", fields: [{ name: "title", type: "string", labelAr: "العنوان" }] });
      fetchEnterpriseData("dynamic_db");
    }
  }

  async function testApiConnection(id: string) {
    setApiTestResults(prev => ({ ...prev, [id]: { ok: false, message: "", loading: true } }));
    try {
      const r = await fetch("/api/admin/api-config/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const data = await r.json();
      setApiTestResults(prev => ({ ...prev, [id]: { ok: data.ok, message: data.message, loading: false } }));
    } catch {
      setApiTestResults(prev => ({ ...prev, [id]: { ok: false, message: "❌ فشل الاتصال بخادم الاختبار", loading: false } }));
    }
  }

  async function saveApiIntegration() {
    const method = apiEditId ? "PUT" : "POST";
    const body = apiEditId ? { id: apiEditId, ...apiForm } : apiForm;
    const r = await fetch("/api/admin/api-config", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) {
      setApiFormOpen(false);
      setApiEditId(null);
      setApiForm({ name: "", label: "", type: "rest", endpoint: "", apiKey: "", secret: "", active: true });
      fetchEnterpriseData("api_integrations");
    }
  }

  async function deleteApiIntegration(id: string) {
    await fetch(`/api/admin/api-config?id=${id}`, { method: "DELETE" });
    fetchEnterpriseData("api_integrations");
  }

  async function fetchEnterpriseData(section: string) {
    setEnterpriseLoading(true);
    try {
      if (section === "crm") {
        const r = await fetch("/api/admin/crm"); if (r.ok) setCrmClients(await r.json());
      } else if (section === "bookings") {
        const r = await fetch("/api/admin/bookings"); if (r.ok) setBookings(await r.json());
      } else if (section === "audit_log") {
        const r = await fetch("/api/admin/audit"); if (r.ok) setAuditLogs(await r.json());
      } else if (section === "support_tickets") {
        const r = await fetch("/api/admin/tickets"); if (r.ok) setTickets(await r.json());
      } else if (section === "dynamic_db") {
        const r = await fetch("/api/admin/dynamic-schema"); if (r.ok) setDynamicSchemas(await r.json());
      } else if (section === "api_integrations") {
        const r = await fetch("/api/admin/api-config"); if (r.ok) setApiIntegrations(await r.json());
      }
    } catch { /* ignore */ } finally { setEnterpriseLoading(false); }
  }

  function handleSectionChange(s: Section) {
    setActiveSection(s);
    fetchEnterpriseData(s);
  }

  useEffect(() => {
    try {
      if (localStorage.getItem("alqadi_admin_auth") === "1") {
        setAuthed(true);
        loadContentFromDB().then((data) => setContent(data));
      }
    } catch { /* ignore */ }
  }, []);

  function login() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      try { localStorage.setItem("alqadi_admin_auth", "1"); } catch { /* ignore */ }
      loadContentFromDB().then((data) => setContent(data));
    } else {
      setPwErr(true);
      setTimeout(() => setPwErr(false), 2000);
    }
  }

  function logout() {
    setAuthed(false);
    try { localStorage.removeItem("alqadi_admin_auth"); } catch { /* ignore */ }
  }

  async function save() {
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch { /* ignore */ }
  }

  function updateCompany(key: keyof Content["company"], val: string) {
    setContent(c => ({ ...c, company: { ...c.company, [key]: val } }));
  }

  function updateStats(key: keyof Content["stats"], val: string) {
    setContent(c => ({ ...c, stats: { ...c.stats, [key]: val } }));
  }

  // Login screen
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-sm rounded-3xl border border-gold-500/25 bg-zinc-950 p-8 shadow-2xl"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10">
              <Lock className="h-7 w-7 text-gold-400" />
            </div>
            <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
            <p className="mt-1 text-sm text-white/40">مجموعة القاضي الذهبية — Admin Panel</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="كلمة المرور"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                suppressHydrationWarning
                className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition ${pwErr ? "border-red-500 bg-red-500/5" : "border-gold-500/25 bg-black/60 focus:border-gold-400"
                  }`}
              />
              <button onClick={() => setShowPw(v => !v)} type="button" suppressHydrationWarning
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwErr && <p className="text-center text-xs text-red-400">كلمة مرور غير صحيحة</p>}
            <button onClick={login} suppressHydrationWarning
              className="w-full rounded-xl bg-gold-500 py-3 text-sm font-bold text-black transition hover:bg-gold-400">
              دخول
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-white">
              <Settings className="h-6 w-6 text-gold-400" />
              لوحة إدارة المحتوى
            </h1>
            <p className="mt-1 text-sm text-white/40">راجع وعدّل كل محتويات الموقع من هنا</p>
          </div>
          <div className="flex gap-3">
            <button onClick={save}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${saved ? "bg-emerald-500 text-white" : "bg-gold-500 text-black hover:bg-gold-400"
                }`}
            >
              {saved ? <><CheckCircle className="h-4 w-4" /> تم الحفظ</> : <><Save className="h-4 w-4" /> حفظ التغييرات</>}
            </button>
            <button onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/60 hover:border-red-500/40 hover:text-red-400 transition">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <nav className="space-y-4">
            {Object.entries(
              SECTIONS.reduce((acc, section) => {
                const g = section.group || "أقسام أخرى";
                if (!acc[g]) acc[g] = [];
                acc[g].push(section);
                return acc;
              }, {} as Record<string, typeof SECTIONS>)
            ).map(([groupName, sections]) => (
              <div key={groupName} className="space-y-1">
                <h4 className="px-4 py-1 text-[10px] font-bold text-white/30 uppercase tracking-wider">{groupName}</h4>
                {sections.map(s => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <button key={s.id} onClick={() => handleSectionChange(s.id)}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm transition",
                        isActive
                          ? "border border-gold-500/30 bg-gold-500/10 text-gold-300"
                          : "text-white/60 hover:bg-white/[0.04] hover:text-white",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Content */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              >
                {/* Company */}
                {activeSection === "company" && (
                  <div className="space-y-4">
                    <Card title="الهوية والاتصال">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="اسم الشركة بالعربي" value={content.company.nameAr} onChange={v => updateCompany("nameAr", v)} />
                        <Field label="Company Name (English)" value={content.company.nameEn} onChange={v => updateCompany("nameEn", v)} />
                        <Field label="رقم الهاتف" value={content.company.phone} onChange={v => updateCompany("phone", v)} hint="مثال: +96598765432" />
                        <Field label="البريد الإلكتروني" value={content.company.email} onChange={v => updateCompany("email", v)} type="email" />
                        <Field label="رقم واتساب (بدون +)" value={content.company.whatsapp} onChange={v => updateCompany("whatsapp", v)} hint="يُستخدم في أزرار الحجز والتواصل" />
                        <Field label="سنة التأسيس" value={content.company.foundedYear} onChange={v => updateCompany("foundedYear", v)} />
                      </div>
                    </Card>
                    <Card title="العنوان والشعار">
                      <div className="grid gap-4">
                        <Field label="العنوان" value={content.company.address} onChange={v => updateCompany("address", v)} />
                        <Field label="الشعار الفرعي (عربي)" value={content.company.taglineAr} onChange={v => updateCompany("taglineAr", v)} />
                        <Field label="Tagline (English)" value={content.company.taglineEn} onChange={v => updateCompany("taglineEn", v)} />
                      </div>
                    </Card>
                    {/* Preview */}
                    <div className="rounded-2xl border border-gold-500/15 bg-gold-500/5 p-5">
                      <p className="mb-3 text-xs font-semibold text-gold-400">معاينة بطاقة التواصل</p>
                      <div className="flex flex-wrap gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-400" />{content.company.phone}</span>
                        <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-400" />{content.company.email}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-400" />{content.company.address}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                {activeSection === "stats" && (
                  <Card title="الأرقام والإحصائيات (تظهر في الصفحة الرئيسية)">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="إجمالي العملاء" value={content.stats.clients} onChange={v => updateStats("clients", v)} hint='مثال: "860,000+" أو "أكثر من مليون"' />
                      <Field label="سنوات الخبرة" value={content.stats.experience} onChange={v => updateStats("experience", v)} />
                      <Field label="عدد الدول" value={content.stats.countries} onChange={v => updateStats("countries", v)} />
                      <Field label="نسبة الرضا" value={content.stats.satisfaction} onChange={v => updateStats("satisfaction", v)} />
                    </div>
                  </Card>
                )}

                {/* Destinations */}
                {activeSection === "destinations" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/60">تعديل الوجهات السياحية وأسعارها</p>
                      <button
                        onClick={() => setContent(c => ({
                          ...c,
                          destinations: [...c.destinations, { city: "مدينة جديدة", country: "الدولة", priceKWD: "0", active: true }]
                        }))}
                        className="flex items-center gap-2 rounded-xl border border-gold-500/25 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500/20 transition"
                      >
                        + إضافة وجهة
                      </button>
                    </div>
                    {content.destinations.map((d, i) => (
                      <Card key={i} title={`${d.city} — ${d.country}`}>
                        <div className="grid gap-4 md:grid-cols-3">
                          <Field label="المدينة (عربي)" value={d.city} onChange={v => {
                            const dests = [...content.destinations];
                            dests[i] = { ...dests[i], city: v };
                            setContent(c => ({ ...c, destinations: dests }));
                          }} />
                          <Field label="الدولة" value={d.country} onChange={v => {
                            const dests = [...content.destinations];
                            dests[i] = { ...dests[i], country: v };
                            setContent(c => ({ ...c, destinations: dests }));
                          }} />
                          <div>
                            <label className="mb-1 block text-xs text-white/50">السعر (دينار كويتي)</label>
                            <div className="relative">
                              <DollarSign className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-400" />
                              <input type="number" value={d.priceKWD}
                                onChange={e => {
                                  const dests = [...content.destinations];
                                  dests[i] = { ...dests[i], priceKWD: e.target.value };
                                  setContent(c => ({ ...c, destinations: dests }));
                                }}
                                className="w-full rounded-xl border border-gold-500/20 bg-black/60 py-2.5 pl-4 pr-9 text-sm text-white outline-none focus:border-gold-400 transition"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Packages */}
                {activeSection === "packages" && (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">تعديل الباقات السياحية والعروض</p>
                    {content.packages.map((p, i) => (
                      <Card key={i} title={p.name}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="اسم الباقة" value={p.name} onChange={v => {
                            const pkgs = [...content.packages];
                            pkgs[i] = { ...pkgs[i], name: v };
                            setContent(c => ({ ...c, packages: pkgs }));
                          }} />
                          <Field label="السعر (دينار كويتي)" value={p.priceKWD} onChange={v => {
                            const pkgs = [...content.packages];
                            pkgs[i] = { ...pkgs[i], priceKWD: v };
                            setContent(c => ({ ...c, packages: pkgs }));
                          }} type="number" />
                          <Field label="عدد الليالي" value={p.nights} onChange={v => {
                            const pkgs = [...content.packages];
                            pkgs[i] = { ...pkgs[i], nights: v };
                            setContent(c => ({ ...c, packages: pkgs }));
                          }} />
                          <Field label="نسبة الخصم" value={p.discount} onChange={v => {
                            const pkgs = [...content.packages];
                            pkgs[i] = { ...pkgs[i], discount: v };
                            setContent(c => ({ ...c, packages: pkgs }));
                          }} hint='مثال: "20%" أو "VIP"' />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Hotels (Real DB Table) */}
                {activeSection === "hotels" && <HotelsSection />}

                {/* Visas (Real DB Table) */}
                {activeSection === "visas" && <VisasSection />}

                {/* Jobs (Real DB Table) */}
                {activeSection === "jobs" && <JobsSection />}

                {/* ── Employees ── */}
                {activeSection === "employees" && (
                  <EmployeesSection content={content} setContent={setContent} />
                )}

                {/* ── Branches ── */}
                {activeSection === "branches" && (
                  <Card title="الفروع النشطة">
                    <div className="space-y-3">
                      {content.branches.map((b, i) => (
                        <div key={b.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Building className="h-4 w-4 text-gold-400" />
                            <Field label="" value={b.name} onChange={v => {
                              const brs = [...content.branches];
                              brs[i] = { ...brs[i], name: v };
                              setContent(c => ({ ...c, branches: brs }));
                            }} />
                          </div>
                          <button onClick={() => {
                            const brs = [...content.branches];
                            brs[i] = { ...brs[i], active: !brs[i].active };
                            setContent(c => ({ ...c, branches: brs }));
                          }} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${b.active ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                            {b.active ? "✓ مفعّل" : "✗ معطّل"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* ── Pricing ── */}
                {activeSection === "pricing" && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-gold-500/15 bg-gold-500/5 p-4 text-sm text-white/60">
                      <Tag className="mb-1 inline h-4 w-4 text-gold-400" /> هذه الأسعار تُسحب تلقائياً في حاسبة التسعير داخل مساحة عمل الموظف.
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/60">أسعار التذاكر والموافقات حسب الوجهة (بالدولار)</p>
                      <button
                        onClick={() => setContent(c => ({
                          ...c,
                          pricing: [...c.pricing, { destination: "وجهة جديدة", ticketPrice: "0", securityApproval: "0", visaFee: "0" }]
                        }))}
                        className="flex items-center gap-2 rounded-xl border border-gold-500/25 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500/20 transition"
                      >
                        + إضافة وجهة
                      </button>
                    </div>
                    {content.pricing.map((p, i) => (
                      <Card key={i} title={p.destination}>
                        <div className="grid gap-4 md:grid-cols-4">
                          <Field label="الوجهة" value={p.destination} onChange={v => {
                            const pr = [...content.pricing];
                            pr[i] = { ...pr[i], destination: v };
                            setContent(c => ({ ...c, pricing: pr }));
                          }} />
                          <Field label="سعر التذكرة ($)" value={p.ticketPrice} onChange={v => {
                            const pr = [...content.pricing];
                            pr[i] = { ...pr[i], ticketPrice: v };
                            setContent(c => ({ ...c, pricing: pr }));
                          }} type="number" />
                          <Field label="الموافقة الأمنية ($)" value={p.securityApproval} onChange={v => {
                            const pr = [...content.pricing];
                            pr[i] = { ...pr[i], securityApproval: v };
                            setContent(c => ({ ...c, pricing: pr }));
                          }} type="number" />
                          <Field label="رسوم التأشيرة ($)" value={p.visaFee} onChange={v => {
                            const pr = [...content.pricing];
                            pr[i] = { ...pr[i], visaFee: v };
                            setContent(c => ({ ...c, pricing: pr }));
                          }} type="number" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-white/30">الإجمالي: <span className="text-gold-400 font-bold">${Number(p.ticketPrice) + Number(p.securityApproval) + Number(p.visaFee)}</span></p>
                          <button onClick={() => {
                            const pr = content.pricing.filter((_, idx) => idx !== i);
                            setContent(c => ({ ...c, pricing: pr }));
                          }} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition">
                            <Trash2 className="h-3.5 w-3.5" /> حذف
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                  {/* ── Enterprise Real Sections ── */}
                  {activeSection === "bookings" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Save className="h-6 w-6 text-gold-400" /> إدارة الحجوزات
                        </h3>
                        <button className="flex items-center gap-2 rounded-xl bg-gold-500 text-slate-900 px-4 py-2 font-bold hover:bg-gold-400 transition">
                          <Plus className="h-4 w-4" /> إضافة حجز
                        </button>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-slate-900 overflow-hidden">
                        <table className="w-full text-left text-sm" dir="rtl">
                          <thead className="bg-white/5 text-white/60">
                            <tr>
                              <th className="p-4 font-medium">رقم الحجز</th>
                              <th className="p-4 font-medium">العميل</th>
                              <th className="p-4 font-medium">الخدمة</th>
                              <th className="p-4 font-medium">المبلغ</th>
                              <th className="p-4 font-medium">الحالة</th>
                              <th className="p-4 font-medium text-left">إجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {enterpriseLoading ? (
                              <tr><td colSpan={6} className="p-8 text-center text-white/40">جارٍ التحميل...</td></tr>
                            ) : bookings.length === 0 ? (
                              <tr><td colSpan={6} className="p-8 text-center text-white/40">لا توجد حجوزات بعد</td></tr>
                            ) : bookings.map((b: any) => (
                              <tr key={b.id} className="hover:bg-white/[0.02]">
                                <td className="p-4 font-mono text-white/80">#{b.id.slice(-6).toUpperCase()}</td>
                                <td className="p-4 text-white">{b.client?.name ?? b.clientName ?? "—"}</td>
                                <td className="p-4 text-white/60">{b.serviceType ?? "—"}</td>
                                <td className="p-4 text-gold-400">{b.totalAmount ? `${b.totalAmount} KWD` : "—"}</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border ${
                                    b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                    b.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  }`}>{b.status === "confirmed" ? "مؤكد" : b.status === "cancelled" ? "ملغي" : "قيد المراجعة"}</span>
                                </td>
                                <td className="p-4 text-left"><button className="text-white/40 hover:text-white transition"><MoreVertical className="h-4 w-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeSection === "crm" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Users className="h-6 w-6 text-blue-400" /> إدارة العملاء (CRM)
                        </h3>
                        <div className="flex gap-2">
                          <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <input type="text" placeholder="بحث عن عميل..." className="rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-blue-500/50" />
                          </div>
                          <button className="flex items-center gap-2 rounded-xl bg-blue-500 text-white px-4 py-2 font-bold hover:bg-blue-400 transition">
                            <UserPlus className="h-4 w-4" /> إضافة عميل
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {enterpriseLoading ? (
                          <p className="col-span-3 py-8 text-center text-white/40">جارٍ التحميل...</p>
                        ) : crmClients.length === 0 ? (
                          <div className="col-span-3 py-12 text-center">
                            <Users className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-white/40">لا يوجد عملاء مسجلون بعد</p>
                          </div>
                        ) : crmClients.map((c: any) => (
                          <div key={c.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
                            <div className="flex justify-between items-start mb-4">
                              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">{c.name?.[0] ?? "؟"}</div>
                              <span className={`text-[10px] px-2 py-1 rounded-lg border ${ (c.loyaltyPoints ?? 0) >= 100 ? "bg-gold-500/10 text-gold-400 border-gold-500/20" : "bg-white/5 text-white/40 border-white/10" }`}>{(c.loyaltyPoints ?? 0) >= 100 ? `VIP (${c.loyaltyPoints} نقطة)` : "جديد"}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white">{c.name}</h4>
                            <p className="text-xs text-white/40 mb-3 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.email ?? "—"}</p>
                            <div className="pt-3 border-t border-white/5 text-xs text-white/60 flex justify-between">
                              <span>{c.phone ?? "—"}</span>
                              <button className="text-blue-400 hover:text-blue-300">عرض الملف</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === "dynamic_db" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Database className="h-6 w-6 text-emerald-400" /> قواعد البيانات الديناميكية
                        </h3>
                        <button onClick={() => setDbFormOpen(v => !v)} className="flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-900 px-4 py-2 font-bold hover:bg-emerald-400 transition">
                          <Plus className="h-4 w-4" /> {dbFormOpen ? "إلغاء" : "إنشاء جدول جديد"}
                        </button>
                      </div>

                      {dbFormOpen && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
                          <h4 className="font-bold text-emerald-400">تعريف الجدول الجديد</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs text-white/50">اسم الجدول (بالإنجليزية - بدون مسافات)</label>
                              <input value={dbForm.name} onChange={e => setDbForm(f => ({ ...f, name: e.target.value.replace(/\s/g,"_") }))} placeholder="e.g. custom_offers" className="w-full rounded-xl border border-emerald-500/30 bg-black/60 px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-400 transition" />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-white/50">التسمية بالعربية</label>
                              <input value={dbForm.labelAr} onChange={e => setDbForm(f => ({ ...f, labelAr: e.target.value }))} placeholder="مثل: عروض خاصة" className="w-full rounded-xl border border-emerald-500/30 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400 transition" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs text-white/50">حقول الجدول</label>
                              <button onClick={() => setDbForm(f => ({ ...f, fields: [...f.fields, { name: "", type: "string", labelAr: "" }] }))} className="text-xs text-emerald-400 hover:text-emerald-300">+ إضافة حقل</button>
                            </div>
                            <div className="space-y-2">
                              {dbForm.fields.map((field, fi) => (
                                <div key={fi} className="grid grid-cols-3 gap-2 items-center">
                                  <input value={field.name} onChange={e => { const fs=[...dbForm.fields]; fs[fi]={...fs[fi],name:e.target.value}; setDbForm(f=>({...f,fields:fs})); }} placeholder="field_name" className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400" />
                                  <input value={field.labelAr} onChange={e => { const fs=[...dbForm.fields]; fs[fi]={...fs[fi],labelAr:e.target.value}; setDbForm(f=>({...f,fields:fs})); }} placeholder="اسم الحقل عربي" className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400" />
                                  <select value={field.type} onChange={e => { const fs=[...dbForm.fields]; fs[fi]={...fs[fi],type:e.target.value}; setDbForm(f=>({...f,fields:fs})); }} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none">
                                    <option value="string">نص</option>
                                    <option value="number">رقم</option>
                                    <option value="boolean">صح/خطأ</option>
                                    <option value="date">تاريخ</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={createDynamicSchema} className="flex-1 rounded-xl bg-emerald-500 text-slate-900 py-2.5 font-bold hover:bg-emerald-400 transition">حفظ الجدول</button>
                            <button onClick={() => setDbFormOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-white/60 hover:bg-white/10 transition">إلغاء</button>
                          </div>
                        </div>
                      )}

                      {enterpriseLoading ? (
                        <div className="rounded-2xl border border-white/5 bg-slate-900 p-8 text-center text-white/40">جارٍ التحميل...</div>
                      ) : dynamicSchemas.length === 0 ? (
                        <div className="rounded-2xl border border-white/5 bg-slate-900 p-8 text-center">
                          <Database className="h-12 w-12 text-emerald-500/20 mx-auto mb-3" />
                          <h4 className="text-lg font-bold text-white mb-2">لا توجد جداول مخصصة بعد</h4>
                          <p className="text-sm text-white/50 max-w-sm mx-auto">أنشئ جدولك الأول بالضغط على الزر أعلاه.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">{dynamicSchemas.map((s: any) => (
                          <div key={s.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white mb-1">{s.labelAr}</h4>
                                <p className="text-xs text-white/40 font-mono">db: {s.name}</p>
                              </div>
                              <button onClick={async () => { await fetch(`/api/admin/dynamic-schema?id=${s.id}`,{method:"DELETE"}); fetchEnterpriseData("dynamic_db"); }} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 text-xs text-white/60">
                              <span>حقول: {(s.fields as any[])?.length ?? 0}</span>
                              <span>سجلات: {s.records?.length ?? 0}</span>
                            </div>
                          </div>
                        ))}</div>
                      )}
                    </div>
                  )}

                  {activeSection === "audit_log" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="h-6 w-6 text-red-400" /> سجل المراقبة الأمني
                        </h3>
                        <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 text-white/60 px-4 py-2 text-sm hover:bg-white/10 transition">
                          <Filter className="h-4 w-4" /> تصفية السجل
                        </button>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-slate-900 overflow-hidden">
                        <table className="w-full text-left text-sm" dir="rtl">
                          <thead className="bg-white/5 text-white/60">
                            <tr>
                              <th className="p-4 font-medium">الوقت</th>
                              <th className="p-4 font-medium">الموظف</th>
                              <th className="p-4 font-medium">الإجراء</th>
                              <th className="p-4 font-medium">القسم</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {enterpriseLoading ? (
                              <tr><td colSpan={4} className="p-8 text-center text-white/40">جارٍ التحميل...</td></tr>
                            ) : auditLogs.length === 0 ? (
                              <tr><td colSpan={4} className="p-8 text-center text-white/40">لا توجد سجلات بعد</td></tr>
                            ) : auditLogs.map((log: any) => (
                              <tr key={log.id} className="hover:bg-white/[0.02]">
                                <td className="p-4 text-white/60 font-mono text-xs">{new Date(log.createdAt).toLocaleString("ar")}</td>
                                <td className="p-4 text-white">{log.performedBy ?? "—"}</td>
                                <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] ${ log.action === "CREATE" ? "text-emerald-400 bg-emerald-500/10" : log.action === "DELETE" ? "text-red-400 bg-red-500/10" : "text-blue-400 bg-blue-500/10" }`}>{log.action}</span></td>
                                <td className="p-4 text-white/80">{log.entity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeSection === "support_tickets" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Phone className="h-6 w-6 text-purple-400" /> تذاكر الدعم الفني
                        </h3>
                        <div className="flex gap-2">
                          <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-purple-500/50">
                            <option value="all" className="bg-slate-900">جميع التذاكر</option>
                            <option value="open" className="bg-slate-900">مفتوحة</option>
                            <option value="closed" className="bg-slate-900">مغلقة</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        {enterpriseLoading ? (
                          <div className="py-8 text-center text-white/40">جارٍ التحميل...</div>
                        ) : tickets.length === 0 ? (
                          <div className="py-12 text-center"><Phone className="h-12 w-12 text-white/10 mx-auto mb-3" /><p className="text-white/40">لا توجد تذاكر دعم بعد</p></div>
                        ) : tickets.map((t: any) => (
                          <div key={t.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-base font-bold text-white flex items-center gap-2">{t.subject} <span className={`text-[10px] px-2 py-0.5 rounded border ${ t.priority === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" : t.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-white/5 text-white/40 border-white/10" }`}>{t.priority === "high" ? "عالية" : t.priority === "medium" ? "متوسطة" : "منخفضة"}</span></h4>
                              <span className="text-xs text-white/40 font-mono">#{t.id.slice(-6).toUpperCase()}</span>
                            </div>
                            <p className="text-sm text-white/60 mb-4">{t.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <span className="text-xs text-white/40">{t.client?.name ?? "عميل"} · {new Date(t.createdAt).toLocaleDateString("ar")}</span>
                              <button onClick={() => fetch(`/api/admin/tickets`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: t.id, status: "closed" }) }).then(() => fetchEnterpriseData("support_tickets"))} className="text-purple-400 text-sm hover:text-purple-300">إغلاق التذكرة</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === "cms" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Copy className="h-6 w-6 text-orange-400" /> إدارة المحتوى (CMS)
                        </h3>
                        {cmsSaved && (
                          <span className="flex items-center gap-2 text-sm text-emerald-400 animate-pulse">
                            <CheckCircle2 className="h-4 w-4" /> تم الحفظ بنجاح!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50 -mt-2">تحرير محتوى صفحات الموقع — اختر الصفحة ثم عدّل البيانات واحفظ.</p>

                      {!cmsEditKey ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {CMS_PAGES.map(page => (
                            <button
                              key={page.key}
                              onClick={() => loadCmsPage(page.key)}
                              className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-orange-500/30 transition flex flex-col items-center justify-center text-center hover:bg-slate-800/50 cursor-pointer group"
                            >
                              <Copy className="h-8 w-8 text-white/20 mb-3 group-hover:text-orange-400 transition" />
                              <h4 className="font-bold text-white">{page.label}</h4>
                              <p className="text-xs text-white/40 mt-1 mb-4">{page.desc}</p>
                              <span className="w-full py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-orange-500/20 hover:text-orange-300 transition">
                                {cmsPageData[page.key] ? "✏️ تحرير" : "➕ إضافة محتوى"}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => { setCmsEditKey(null); setCmsEditData(""); }}
                              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
                            >
                              ← الرجوع لقائمة الصفحات
                            </button>
                            <h4 className="text-lg font-bold text-orange-400">
                              تحرير: {CMS_PAGES.find(p => p.key === cmsEditKey)?.label}
                            </h4>
                          </div>
                          
                          <div className="rounded-2xl border border-white/5 bg-slate-900 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-white/40">محرر JSON — عدّل البيانات أدناه</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    try { setCmsEditData(JSON.stringify(JSON.parse(cmsEditData), null, 2)); } catch { /* ignore */ }
                                  }}
                                  className="text-xs text-white/40 hover:text-blue-400 transition px-2 py-1 rounded bg-white/5"
                                >
                                  🔄 تنسيق
                                </button>
                              </div>
                            </div>
                            <textarea
                              value={cmsEditData}
                              onChange={e => setCmsEditData(e.target.value)}
                              dir="ltr"
                              className="w-full h-80 rounded-xl border border-white/10 bg-black/60 p-4 text-sm text-emerald-300 font-mono outline-none resize-y focus:border-orange-500/50 transition"
                              spellCheck={false}
                            />
                          </div>

                          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-sm text-blue-200">
                            <p className="font-bold mb-2">📖 دليل التحرير:</p>
                            <ul className="space-y-1 text-xs text-blue-200/70">
                              <li>• <strong>من نحن:</strong> {`{ "milestones": [...], "values": [...], "stats": [...], "vision": "...", "mission": "...", "branches": [...] }`}</li>
                              <li>• <strong>المدونة:</strong> {`{ "posts": [{ "slug": "...", "title": "...", "date": "..." }] }`}</li>
                              <li>• <strong>الأسئلة:</strong> {`{ "faqs": [{ "category": "...", "questions": [{ "q": "...", "a": "..." }] }] }`}</li>
                              <li>• <strong>اتصل بنا:</strong> {`{ "branches": [{ "name": "...", "address": "...", "hours": "...", "phone": "..." }] }`}</li>
                              <li>• <strong>عملاؤنا:</strong> {`{ "clients": [...], "testimonials": [...], "stats": [...], "whyUs": [...] }`}</li>
                              <li>• <strong>الرئيسية:</strong> {`{ "services": [{ "title": "...", "desc": "..." }], "updates": [{ "title": "...", "time": "...", "tag": "..." }] }`}</li>
                              <li>• <strong>السفريات:</strong> {`{ "whyUs": [{ "title": "...", "desc": "..." }] }`}</li>
                            </ul>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={saveCmsPage}
                              disabled={cmsSaving}
                              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
                            >
                              {cmsSaving ? "⏳ جاري الحفظ..." : "💾 حفظ التعديلات"}
                            </button>
                            <button
                              onClick={() => { setCmsEditKey(null); setCmsEditData(""); }}
                              className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/60 hover:bg-white/5 transition"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === "api_integrations" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <RefreshCw className="h-6 w-6 text-indigo-400" /> إدارة ربط الـ APIs
                        </h3>
                        <button onClick={() => setApiFormOpen(v => !v)} className="flex items-center gap-2 rounded-xl bg-indigo-500 text-white px-4 py-2 font-bold hover:bg-indigo-400 transition">
                          <Plus className="h-4 w-4" /> {apiFormOpen ? "إلغاء" : "إضافة API"}
                        </button>
                      </div>

                      {apiFormOpen && (
                        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-4">
                          <h4 className="font-bold text-indigo-400">{apiEditId ? "تعديل API" : "إضافة API جديد"}</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div><label className="mb-1 block text-xs text-white/50">اسم الـ API (بالإنجليزية)</label><input value={apiForm.name} onChange={e => setApiForm(f=>({...f,name:e.target.value}))} placeholder="e.g. booking_com" className="w-full rounded-xl border border-indigo-500/30 bg-black/60 px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-400" /></div>
                            <div><label className="mb-1 block text-xs text-white/50">الاسم الظاهر</label><input value={apiForm.label} onChange={e => setApiForm(f=>({...f,label:e.target.value}))} placeholder="مثل: Booking.com" className="w-full rounded-xl border border-indigo-500/30 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400" /></div>
                            <div><label className="mb-1 block text-xs text-white/50">Endpoint URL</label><input value={apiForm.endpoint} onChange={e => setApiForm(f=>({...f,endpoint:e.target.value}))} placeholder="https://api.example.com/v1" className="w-full rounded-xl border border-indigo-500/30 bg-black/60 px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-400" /></div>
                            <div><label className="mb-1 block text-xs text-white/50">API Key</label><input value={apiForm.apiKey} onChange={e => setApiForm(f=>({...f,apiKey:e.target.value}))} placeholder="sk-xxxx..." className="w-full rounded-xl border border-indigo-500/30 bg-black/60 px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-400" /></div>
                            <div><label className="mb-1 block text-xs text-white/50">Secret (optional)</label><input type="password" value={apiForm.secret} onChange={e => setApiForm(f=>({...f,secret:e.target.value}))} placeholder="••••••••" className="w-full rounded-xl border border-indigo-500/30 bg-black/60 px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-400" /></div>
                            <div><label className="mb-1 block text-xs text-white/50">نوع الـ API</label><select value={apiForm.type} onChange={e => setApiForm(f=>({...f,type:e.target.value}))} className="w-full rounded-xl border border-indigo-500/30 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none"><option value="rest">REST</option><option value="graphql">GraphQL</option><option value="soap">SOAP</option><option value="webhook">Webhook</option></select></div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={saveApiIntegration} className="flex-1 rounded-xl bg-indigo-500 text-white py-2.5 font-bold hover:bg-indigo-400 transition">حفظ</button>
                            <button onClick={() => { setApiFormOpen(false); setApiEditId(null); setApiForm({ name:"", label:"", type:"rest", endpoint:"", apiKey:"", secret:"", active:true }); }} className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-white/60 hover:bg-white/10 transition">إلغاء</button>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4">
                        {enterpriseLoading ? (
                          <div className="text-center py-8 text-white/40">جارٍ التحميل...</div>
                        ) : apiIntegrations.length === 0 ? (
                          <div className="text-center py-10 text-white/40 border border-dashed border-white/10 rounded-2xl">لا يوجد أي APIs مضافة حالياً.</div>
                        ) : apiIntegrations.map((api: any) => (
                          <div key={api.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">{api.label} <span className="bg-white/10 text-white/60 text-[10px] px-2 py-0.5 rounded border border-white/20">{api.type?.toUpperCase() || "REST"}</span></h4>
                                <p className="text-xs text-white/40 font-mono mt-1">{api.endpoint || "لم يتم تعيين رابط"}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => testApiConnection(api.id)} disabled={apiTestResults[api.id]?.loading} className="px-3 py-1.5 text-xs rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition disabled:opacity-50">{apiTestResults[api.id]?.loading ? "جارٍ الفحص..." : "اختبار الاتصال"}</button>
                                <button onClick={() => deleteApiIntegration(api.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                            {apiTestResults[api.id] && !apiTestResults[api.id].loading && (
                              <div className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2 ${ apiTestResults[api.id].ok ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-red-500/20 bg-red-500/5 text-red-400" }`}>
                                {apiTestResults[api.id].ok ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <XCircle className="h-4 w-4 mt-0.5" />}
                                <p>{apiTestResults[api.id].message}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Info footer */}
        <div className="mt-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4 text-center text-xs text-emerald-400/80">
          <Database className="mx-auto mb-1 h-4 w-4 text-emerald-400/50" />
          تم ربط هذه اللوحة بنجاح بقاعدة البيانات MySQL. سيتم نشر التغييرات فوراً.
        </div>
      </div>
    </div>
  );
}
