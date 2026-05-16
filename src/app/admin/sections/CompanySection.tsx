"use client";
import { useEffect, useState } from "react";
import { Globe2, Save, CheckCircle2 } from "lucide-react";

const DEFAULT = {
  nameAr: "مجموعة القاضي الذهبية", nameEn: "Golden Al'Qadi Group",
  phone: "+96598765432", email: "info@alqadigroup.com",
  address: "الكويت — مجمع القاضي، شارع الخليج العربي",
  whatsapp: "96598765432", foundedYear: "1980",
  taglineAr: "السفريات والسياحة وخدمات الأيادي العاملة",
  taglineEn: "Travel, Tourism & Manpower Services",
};

const DEFAULT_STATS = {
  clients: "860,000+",
  experience: "45+",
  countries: "75+",
  satisfaction: "98%",
};

export function CompanySection({ isDark }: { isDark?: boolean }) {
  const [data, setData] = useState(DEFAULT);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((content) => {
        if (content?.company) setData({ ...DEFAULT, ...content.company });
        if (content?.stats) setStats({ ...DEFAULT_STATS, ...content.stats });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: data, stats }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("تعذر حفظ التغييرات");
    }
  };

  const field = (label: string, key: keyof typeof DEFAULT, dir = "rtl") => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</label>
      <input dir={dir} value={data[key]} onChange={e => setData(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Globe2 className="h-7 w-7 text-gold-500" /> بيانات المجموعة
          </h2>
          <p className="text-white/40 text-sm mt-1">تعديل المعلومات الأساسية للشركة</p>
        </div>
        <button
          onClick={save}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black rounded-xl font-black hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10 disabled:opacity-50"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "تم الحفظ!" : "حفظ التعديلات"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-8 rounded-[2rem] border border-white/5 bg-white/5">
        <div className="md:col-span-2">
          <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest mb-6">الهوية الرسمية</h3>
        </div>
        {field("الاسم بالعربية", "nameAr")}
        {field("الاسم بالإنجليزية", "nameEn", "ltr")}
        {field("الشعار بالعربية", "taglineAr")}
        {field("الشعار بالإنجليزية", "taglineEn", "ltr")}
        {field("سنة التأسيس", "foundedYear", "ltr")}
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-8 rounded-[2rem] border border-white/5 bg-white/5">
        <div className="md:col-span-2">
          <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest mb-6">بيانات التواصل</h3>
        </div>
        {field("رقم الهاتف", "phone", "ltr")}
        {field("البريد الإلكتروني", "email", "ltr")}
        {field("واتساب", "whatsapp", "ltr")}
        {field("العنوان", "address")}
      </div>

      <div className="grid md:grid-cols-4 gap-6 p-8 rounded-[2rem] border border-white/5 bg-white/5">
        <div className="md:col-span-4">
          <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest mb-6">إحصائيات الموقع</h3>
        </div>
        {(
          [
            { k: "clients", label: "عدد العملاء" },
            { k: "experience", label: "سنوات الخبرة" },
            { k: "countries", label: "عدد الدول" },
            { k: "satisfaction", label: "نسبة الرضا" },
          ] as const
        ).map((f) => (
          <div key={f.k} className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{f.label}</label>
            <input
              dir="ltr"
              value={(stats as any)[f.k] ?? ""}
              onChange={(e) => setStats((p) => ({ ...(p as any), [f.k]: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
