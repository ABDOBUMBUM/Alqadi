"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, TrendingUp, ShieldCheck, DollarSign,
  Plane, LogOut, Bell, Moon, Sun, Menu, X, BarChart3, MessageSquare,
  ArrowUpRight, ArrowDownRight, Clock, MapPin, Building2,
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

// Mock KPI data
const KPI = [
  { label: "إيرادات اليوم", value: "$4,280", sub: "+12% عن أمس", up: true, icon: DollarSign, color: "from-gold-600/20 to-gold-400/10 border-gold-500/25 text-gold-400" },
  { label: "التذاكر المباعة", value: "38", sub: "+5 عن أمس", up: true, icon: Plane, color: "from-blue-600/20 to-blue-400/10 border-blue-500/25 text-blue-400" },
  { label: "الموافقات الأمنية", value: "22", sub: "-2 عن أمس", up: false, icon: ShieldCheck, color: "from-emerald-600/20 to-emerald-400/10 border-emerald-500/25 text-emerald-400" },
  { label: "نسبة التعادل", value: "74%", sub: "+3% عن الهدف", up: true, icon: TrendingUp, color: "from-purple-600/20 to-purple-400/10 border-purple-500/25 text-purple-400" },
];

// Mock branch sales data
const BRANCH_SALES = [
  { branch: "فرع صنعاء", sales: 18, revenue: 1820 },
  { branch: "السنافر", sales: 9, revenue: 890 },
  { branch: "المنصورة", sales: 7, revenue: 760 },
  { branch: "خور مكسر", sales: 4, revenue: 380 },
  { branch: "الإدارة العامة", sales: 0, revenue: 430 },
];

const RECENT_BOOKINGS = [
  { id: "TK-2841", client: "محمد أحمد ناصر", destination: "القاهرة", amount: "$135", status: "مؤكد", branch: "صنعاء" },
  { id: "TK-2840", client: "فاطمة علي حسن", destination: "إسطنبول", amount: "$190", status: "معلق", branch: "السنافر" },
  { id: "TK-2839", client: "عبدالله محمد", destination: "دبي", amount: "$90", status: "مؤكد", branch: "المنصورة" },
  { id: "TK-2838", client: "أحمد سالم", destination: "لندن", amount: "$280", status: "مؤكد", branch: "صنعاء" },
  { id: "TK-2837", client: "مريم حسين", destination: "القاهرة", amount: "$135", status: "ملغى", branch: "خور مكسر" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState("");

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

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch { /**/ }
    router.replace("/portal/login");
  }

  if (!session) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">جاري التحميل...</div>;

  const maxSales = Math.max(...BRANCH_SALES.map(b => b.sales));

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
            { icon: LayoutDashboard, label: "لوحة القيادة", active: true, href: "/portal/dashboard" },
            { icon: Plane, label: "مساحة العمل", active: false, href: "/portal/workspace" },
            { icon: Users, label: "الموظفون", active: false, href: "#" },
            { icon: MessageSquare, label: "صندوق الطلبات", active: false, href: "/portal/leads" },
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
      <main className="flex-1 overflow-auto">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="h-5 w-5 text-white/60" />
            </button>
            <div>
              <h1 className="text-base font-bold text-white">لوحة القيادة</h1>
              <p className="text-xs text-white/40">{new Date().toLocaleDateString("ar-YE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-white/40 sm:block">{now}</span>
            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition">
              <Bell className="h-4 w-4 text-white/60" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold-400" />
            </button>
            <button onClick={() => setDarkMode(d => !d)} className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition">
              {darkMode ? <Sun className="h-4 w-4 text-white/60" /> : <Moon className="h-4 w-4 text-white/60" />}
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/30 text-xs font-bold text-gold-400">
              {session.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">

          {/* Welcome */}
          <div className="rounded-2xl border border-gold-500/15 bg-gradient-to-l from-gold-500/5 to-transparent p-5">
            <p className="text-lg font-bold text-white">مرحباً، {session.name} 👋</p>
            <p className="text-sm text-white/40">
              {session.role === "supervisor" ? "🔑 مشرف" : "📋 موظف حجز"} — {BRANCH_LABELS[session.branch]} — {SHIFT_LABELS[session.shift]}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {KPI.map(k => (
              <div key={k.label} className={`rounded-2xl border bg-gradient-to-br p-5 ${k.color}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/50">{k.label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{k.value}</p>
                    <p className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-emerald-400" : "text-red-400"}`}>
                      {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {k.sub}
                    </p>
                  </div>
                  <k.icon className="h-8 w-8 opacity-50" />
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid gap-4 lg:grid-cols-2">

            {/* Branch sales bar chart */}
            <div className="rounded-2xl border border-white/5 bg-slate-900 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">مبيعات الفروع — اليوم</h2>
              <div className="space-y-3">
                {BRANCH_SALES.map(b => (
                  <div key={b.branch} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-xs text-white/50">{b.branch}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-white/5 h-5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-700"
                        style={{ width: `${maxSales > 0 ? (b.sales / maxSales) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs font-bold text-gold-400">{b.sales}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by branch */}
            <div className="rounded-2xl border border-white/5 bg-slate-900 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">الإيرادات بالدولار — اليوم</h2>
              <div className="space-y-2.5">
                {BRANCH_SALES.map(b => (
                  <div key={b.branch} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5">
                    <span className="text-sm text-white/70">{b.branch}</span>
                    <span className="font-mono text-sm font-bold text-white">${b.revenue.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-gold-500/10 border border-gold-500/20 px-4 py-2.5">
                  <span className="text-sm font-bold text-gold-300">الإجمالي</span>
                  <span className="font-mono text-sm font-bold text-gold-400">${BRANCH_SALES.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent bookings table */}
          <div className="rounded-2xl border border-white/5 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">أحدث الحجوزات</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-white/30">
                    <th className="pb-3 text-right font-medium">رقم</th>
                    <th className="pb-3 text-right font-medium">العميل</th>
                    <th className="pb-3 text-right font-medium">الوجهة</th>
                    <th className="pb-3 text-right font-medium">الفرع</th>
                    <th className="pb-3 text-right font-medium">المبلغ</th>
                    <th className="pb-3 text-right font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {RECENT_BOOKINGS.map(b => (
                    <tr key={b.id} className="text-white/70 hover:bg-white/[0.02] transition">
                      <td className="py-3 font-mono text-xs text-white/40">{b.id}</td>
                      <td className="py-3 font-medium text-white">{b.client}</td>
                      <td className="py-3">{b.destination}</td>
                      <td className="py-3 text-white/50">{b.branch}</td>
                      <td className="py-3 font-mono font-bold text-gold-400">{b.amount}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          b.status === "مؤكد" ? "bg-emerald-500/15 text-emerald-400" :
                          b.status === "معلق" ? "bg-amber-500/15 text-amber-400" :
                          "bg-red-500/15 text-red-400"
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
