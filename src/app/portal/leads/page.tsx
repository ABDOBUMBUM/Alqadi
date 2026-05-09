"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, TrendingUp, ShieldCheck, DollarSign,
  Plane, LogOut, Bell, Moon, Sun, Menu, X, BarChart3, MessageSquare,
  Clock, MapPin, Building2, CheckCircle, Phone, Mail, FileText,
  AlertCircle
} from "lucide-react";

const SESSION_KEY = "alqadi_portal_session";

type Session = {
  name: string; username: string; role: string;
  branch: string; shift: string; workLocation: string; loginTime: string;
};

const BRANCH_LABELS: Record<string, string> = {
  hq: "الإدارة العامة", sanaa: "فرع صنعاء",
  sanafer: "عدن - السنافر", mansoura: "عدن - المنصورة",
  khormaksar: "عدن - خور مكسر",
};
const SHIFT_LABELS: Record<string, string> = {
  morning: "الشفت الصباحي", evening: "الشفت المسائي", night: "الشفت الليلي",
};

export default function LeadsInboxPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState("");
  
  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) { router.replace("/portal/login"); return; }
      setSession(JSON.parse(raw));
    } catch {
      router.replace("/portal/login");
    }

    const tick = () => setNow(new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [router]);

  // Fetch leads
  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const updateLeadStatus = async (id: string, status: string) => {
    const previous = [...leads];
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (e) {
      alert("حدث خطأ أثناء تحديث الحالة");
      setLeads(previous);
    }
  };

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch { /**/ }
    router.replace("/portal/login");
  }

  if (!session) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">جاري التحميل...</div>;

  const filteredLeads = leads.filter(l => l.status === activeTab);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white" dir="rtl">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-white/5 bg-slate-900 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 border border-gold-500/30">
            <Plane className="h-5 w-5 text-gold-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">القاضي الذهبية</p>
            <p className="text-[10px] text-white/40">نظام الإدارة الداخلي</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="mr-auto md:hidden">
            <X className="h-5 w-5 text-white/40" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {[
            { icon: LayoutDashboard, label: "لوحة القيادة", active: false, href: "/portal/dashboard" },
            { icon: Plane, label: "مساحة العمل", active: false, href: "/portal/workspace" },
            { icon: Users, label: "الموظفون", active: false, href: "#" },
            { icon: MessageSquare, label: "صندوق الطلبات", active: true, href: "/portal/leads" },
            { icon: BarChart3, label: "التقارير", active: false, href: "#" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.href)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${item.active ? "bg-gold-500/10 border border-gold-500/20 text-gold-300" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Session info */}
        <div className="border-t border-white/5 p-4">
          <div className="rounded-xl bg-white/[0.03] p-3 text-xs">
            <p className="font-semibold text-white">{session.name}</p>
            <p className="mt-0.5 text-white/40">@{session.username}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-white/30">
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{BRANCH_LABELS[session.branch] ?? session.branch}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{SHIFT_LABELS[session.shift] ?? session.shift}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.workLocation === "office" ? "المكتب" : "منزل"}</span>
            </div>
          </div>
          <button onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="h-5 w-5 text-white/60" />
            </button>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gold-400" />
                صندوق الطلبات الواردة (Leads Inbox)
              </h1>
              <p className="text-xs text-white/40">إدارة ومتابعة طلبات العملاء من الموقع الإلكتروني</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-white/40 sm:block">{now}</span>
            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition">
              <Bell className="h-4 w-4 text-white/60" />
              {leads.filter(l => l.status === "new").length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <button 
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-xl text-sm transition font-medium flex items-center gap-2 ${activeTab === "new" ? "bg-gold-500/15 text-gold-300 border border-gold-500/30" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
              >
                جديد 
                <span className="bg-red-500/20 text-red-400 py-0.5 px-2 rounded-full text-[10px]">
                  {leads.filter(l => l.status === "new").length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab("contacted")}
                className={`px-4 py-2 rounded-xl text-sm transition font-medium flex items-center gap-2 ${activeTab === "contacted" ? "bg-blue-500/15 text-blue-300 border border-blue-500/30" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
              >
                تم التواصل
                <span className="bg-blue-500/20 text-blue-400 py-0.5 px-2 rounded-full text-[10px]">
                  {leads.filter(l => l.status === "contacted").length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab("closed")}
                className={`px-4 py-2 rounded-xl text-sm transition font-medium flex items-center gap-2 ${activeTab === "closed" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
              >
                مغلق
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20 text-white/40 text-sm">جاري جلب الطلبات...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-3xl bg-slate-900/50 border-dashed">
                <CheckCircle className="h-10 w-10 text-white/10 mb-3" />
                <p className="text-white/40 text-sm">لا توجد طلبات في هذه الفئة حالياً</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredLeads.map(lead => (
                  <div key={lead.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      
                      {/* Client Info */}
                      <div>
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                          {lead.name}
                          {activeTab === "new" && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full">جديد</span>}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/60">
                          <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gold-400" /> {lead.email}</span>
                          {lead.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gold-400" /> {lead.phone}</span>}
                          {lead.service && <span className="flex items-center gap-1.5"><Plane className="h-3.5 w-3.5 text-gold-400" /> {lead.service}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {activeTab === "new" && (
                          <>
                            <a 
                              href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-4 py-2 rounded-xl text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                            >
                              <Phone className="h-3.5 w-3.5" /> واتساب
                            </a>
                            <button 
                              onClick={() => updateLeadStatus(lead.id, "contacted")}
                              className="px-4 py-2 rounded-xl text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition"
                            >
                              تحديد كـ "تم التواصل"
                            </button>
                          </>
                        )}
                        {activeTab === "contacted" && (
                          <button 
                            onClick={() => updateLeadStatus(lead.id, "closed")}
                            className="px-4 py-2 rounded-xl text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
                          >
                            تحديد كـ "مغلق" (اكتملت المهمة)
                          </button>
                        )}
                        {activeTab === "closed" && (
                          <button 
                            onClick={() => updateLeadStatus(lead.id, "new")}
                            className="px-4 py-2 rounded-xl text-xs bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 transition"
                          >
                            إعادة فتح الطلب
                          </button>
                        )}
                      </div>
                    </div>

                    {lead.message && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> رسالة العميل:</p>
                        <p className="text-sm text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">{lead.message}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between text-[10px] text-white/30">
                      <span>تاريخ الطلب: {new Date(lead.createdAt).toLocaleString("ar-YE")}</span>
                      <span>المصدر: {lead.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
