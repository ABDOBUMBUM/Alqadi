"use client";
import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { Hotel, Globe2, Briefcase, Plus, Trash2, Save, CheckCircle2, RefreshCw } from "lucide-react";

const Skeleton = ({ className = "" }: { className?: string }) => <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-gold-500" : "bg-white/10"}`}>
    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? "left-6" : "left-1"}`} />
  </button>
);

// ─── Hotels ──────────────────────────────────────────────────────────────────
type HotelType = {
  id: string; name: string; nameEn: string | null; city: string; country: string;
  stars: number; priceFrom: number; currency: string; active: boolean; featured: boolean;
};

export function HotelsSection({ isDark }: { isDark?: boolean }) {
  const { data: hotels, loading, refetch } = useAdminData<HotelType[]>("/api/hotels?admin=true");
  const [saving, setSaving] = useState(false);

  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      await fetch("/api/hotels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: !value }),
      });
      refetch();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفندق؟")) return;
    try {
      await fetch(`/api/hotels?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  const handleAdd = async () => {
    try {
      await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "فندق جديد", city: "—", country: "—", stars: 4, priceFrom: 100 }),
      });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><Hotel className="h-7 w-7 text-gold-500" /> الفنادق المعتمدة</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${hotels?.length || 0} فندق في قاعدة البيانات`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة فندق</button>
        </div>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(hotels || []).map(h => (
            <div key={h.id} className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500"><Hotel className="h-5 w-5" /></div>
                <div className="flex items-center gap-2">
                  <Toggle value={h.active} onChange={() => handleToggle(h.id, "active", h.active)} />
                  <button onClick={() => handleDelete(h.id)} className="text-red-400/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="font-black text-white text-base mb-1">{h.name}</p>
              {h.nameEn && <p className="text-[11px] text-white/30 font-mono mb-1">{h.nameEn}</p>}
              <p className="text-xs text-white/40 mb-4">{h.city}, {h.country} • {"★".repeat(h.stars)}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[10px] text-white/30 font-black uppercase">من {h.currency}</span>
                <span className="font-black text-gold-400">{h.priceFrom.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Visas ───────────────────────────────────────────────────────────────────
type VisaType = {
  id: string; country: string; countryEn: string | null; type: string;
  price: number; currency: string; processingDays: number; active: boolean;
};

export function VisasSection({ isDark }: { isDark?: boolean }) {
  const { data: visas, loading, refetch } = useAdminData<VisaType[]>("/api/visas?admin=true");

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await fetch("/api/visas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      refetch();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه التأشيرة؟")) return;
    try {
      await fetch(`/api/visas?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  const handleAdd = async () => {
    try {
      await fetch("/api/visas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "دولة جديدة", type: "tourism", price: 0, processingDays: 14 }),
      });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><Globe2 className="h-7 w-7 text-gold-500" /> خدمات التأشيرات</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${visas?.length || 0} تأشيرة في النظام`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة تأشيرة</button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {(visas || []).map(v => (
            <div key={v.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 py-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-base">{v.country}</p>
                {v.countryEn && <p className="text-[11px] text-white/30 font-mono">{v.countryEn}</p>}
              </div>
              <div className="flex items-center gap-6 text-center flex-shrink-0">
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1">النوع</p>
                  <p className="text-sm font-bold text-white/70">{v.type === "tourism" ? "سياحية" : v.type === "business" ? "عمل" : v.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1">الرسوم {v.currency}</p>
                  <p className="font-black text-gold-400">{v.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1">المعالجة</p>
                  <p className="text-sm font-bold text-white/50">{v.processingDays} يوم</p>
                </div>
                <Toggle value={v.active} onChange={() => handleToggle(v.id, v.active)} />
                <button onClick={() => handleDelete(v.id)} className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {(visas || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">لا توجد تأشيرات</div>}
        </div>
      )}
    </div>
  );
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
type JobType = {
  id: string; title: string; titleEn: string | null; category: string;
  country: string; salary: number; currency: string; active: boolean;
};

export function JobsSection({ isDark }: { isDark?: boolean }) {
  const { data: jobs, loading, refetch } = useAdminData<JobType[]>("/api/jobs?admin=true");

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await fetch("/api/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      refetch();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;
    try {
      await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  const handleAdd = async () => {
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "وظيفة جديدة", country: "—", category: "general", salary: 0 }),
      });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><Briefcase className="h-7 w-7 text-gold-500" /> القوى العاملة والوظائف</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${jobs?.length || 0} وظيفة في النظام`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة وظيفة</button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {(jobs || []).map(j => (
            <div key={j.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 py-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-base">{j.title}</p>
                {j.titleEn && <p className="text-[11px] text-white/30 font-mono">{j.titleEn}</p>}
                <p className="text-xs text-white/40">{j.country} • {j.category}</p>
              </div>
              <div className="flex items-center gap-6 text-center flex-shrink-0">
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase mb-1">الراتب</p>
                  <p className="font-black text-gold-400">{j.salary.toLocaleString()} {j.currency}</p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${j.active ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-white/30 bg-white/5 border border-white/10"}`}>
                  {j.active ? "نشطة" : "متوقفة"}
                </span>
                <Toggle value={j.active} onChange={() => handleToggle(j.id, j.active)} />
                <button onClick={() => handleDelete(j.id)} className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {(jobs || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">لا توجد وظائف</div>}
        </div>
      )}
    </div>
  );
}

// ─── Destinations ─────────────────────────────────────────────────────────────
type DestinationType = { id: string; name: string; country: string; priceKWD: number; lat?: number | null; lng?: number | null; active: boolean; };

export function DestinationsSection({ isDark }: { isDark?: boolean }) {
  const { data: dests, loading, refetch } = useAdminData<DestinationType[]>("/api/destinations?admin=true");

  const add = async () => {
    try {
      await fetch("/api/destinations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "وجهة جديدة", country: "—", priceKWD: 0 }) });
      refetch();
    } catch {}
  };
  const upd = async (id: string, key: string, val: any) => {
    try {
      await fetch("/api/destinations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [key]: val }) });
      refetch();
    } catch {}
  };
  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`/api/destinations?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><Globe2 className="h-7 w-7 text-gold-500" /> الوجهات السياحية</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${dests?.length || 0} وجهة في قاعدة البيانات`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة</button>
        </div>
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(dests || []).map(d => (
          <div key={d.id} className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <input value={d.name} onChange={e => upd(d.id, "name", e.target.value)}
                  className="font-black text-white text-lg bg-transparent border-b border-white/10 focus:border-gold-500 outline-none w-full mb-1 transition-colors" />
                <input value={d.country} onChange={e => upd(d.id, "country", e.target.value)}
                  className="text-xs text-white/50 bg-transparent outline-none w-full" placeholder="الدولة" />
              </div>
              <button onClick={() => del(d.id)} className="text-red-400/50 hover:text-red-400 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30 font-black uppercase">KWD</span>
                <input type="number" value={d.priceKWD} onChange={e => upd(d.id, "priceKWD", parseFloat(e.target.value) || 0)}
                  className="font-black text-gold-400 text-lg bg-transparent outline-none w-20" />
              </div>
              <Toggle value={d.active} onChange={() => upd(d.id, "active", !d.active)} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                value={d.lat ?? ""}
                onChange={e => upd(d.id, "lat", e.target.value === "" ? null : parseFloat(e.target.value))}
                className="bg-white/5 rounded-lg px-2 py-1 text-xs text-white outline-none"
                placeholder="Latitude"
              />
              <input
                type="number"
                step="0.0001"
                value={d.lng ?? ""}
                onChange={e => upd(d.id, "lng", e.target.value === "" ? null : parseFloat(e.target.value))}
                className="bg-white/5 rounded-lg px-2 py-1 text-xs text-white outline-none"
                placeholder="Longitude"
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

// ─── Packages ──────────────────────────────────────────────────────────────
type PackageType = { id: string; title: string; nights: number; price: number; discount: string | null; active: boolean; };

export function PackagesSection({ isDark }: { isDark?: boolean }) {
  const { data: pkgs, loading, refetch } = useAdminData<PackageType[]>("/api/packages?admin=true");

  const add = async () => {
    try {
      // Need a default destinationId to create a package successfully, assume destinationId handles it or we should add a selector.
      // For now, let's just use empty string or a dummy destinationId. The API should ideally accept it if destination is optional, but it's required in schema.
      // Better to fetch destinations first. 
      const destResponse = await fetch("/api/destinations?admin=true");
      const destinations = await destResponse.json();
      const firstDest = destinations.length > 0 ? destinations[0].id : "dummy";
      
      await fetch("/api/packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "باقة جديدة", destinationId: firstDest, days: 8, nights: 7, price: 1000, discount: "" }) });
      refetch();
    } catch {}
  };
  const upd = async (id: string, key: string, val: any) => {
    try {
      await fetch("/api/packages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [key]: val }) });
      refetch();
    } catch {}
  };
  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`/api/packages?id=${id}`, { method: "DELETE" });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><Globe2 className="h-7 w-7 text-gold-500" /> العروض والباقات</h2>
          <p className="text-white/40 text-sm mt-1">{loading ? "جاري التحميل..." : `${pkgs?.length || 0} باقة في قاعدة البيانات`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-black rounded-xl font-bold text-sm hover:bg-gold-400 transition-all"><Plus className="h-4 w-4" /> إضافة</button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
      <div className="space-y-3">
        {(pkgs || []).map(p => (
          <div key={p.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 py-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
            <input value={p.title} onChange={e => upd(p.id, "title", e.target.value)}
              className="flex-1 font-black text-white bg-transparent border-b border-white/10 focus:border-gold-500 outline-none text-base transition-colors min-w-0" />
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-center">
                <p className="text-[10px] text-white/30 font-black uppercase mb-1">ليالي</p>
                <input type="number" value={p.nights} onChange={e => upd(p.id, "nights", parseInt(e.target.value) || 0)}
                  className="w-12 text-center font-black text-white bg-white/5 rounded-lg p-1 outline-none text-sm" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/30 font-black uppercase mb-1">السعر KWD</p>
                <input type="number" value={p.price} onChange={e => upd(p.id, "price", parseFloat(e.target.value) || 0)}
                  className="w-20 text-center font-black text-gold-400 bg-white/5 rounded-lg p-1 outline-none text-sm" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/30 font-black uppercase mb-1">خصم</p>
                <input value={p.discount || ""} onChange={e => upd(p.id, "discount", e.target.value)}
                  className="w-16 text-center font-black text-emerald-400 bg-white/5 rounded-lg p-1 outline-none text-sm" />
              </div>
              <Toggle value={p.active} onChange={() => upd(p.id, "active", !p.active)} />
              <button onClick={() => del(p.id)} className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {(pkgs || []).length === 0 && <div className="text-center py-16 text-white/30 font-bold">لا توجد باقات</div>}
      </div>
      )}
    </div>
  );
}
