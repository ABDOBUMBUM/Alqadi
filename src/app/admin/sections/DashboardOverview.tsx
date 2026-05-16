"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "@/hooks/useAdminData";
import {
  DollarSign, Plane, Briefcase, Users, TrendingUp,
  MoreHorizontal, Calendar, Plus,
  RefreshCw, AlertTriangle, Image as ImageIcon, MapPin, 
  Check, ArrowUpRight, ArrowDownRight
} from "lucide-react";

// Types matching the API response
type DashboardData = {
  counts: {
    clients: number; bookings: number; jobs: number; hotels: number;
    visas: number; employees: number; openTickets: number; leads: number;
  };
  revenue: { total: number; paid: number; outstanding: number };
  bookingsByStatus: { status: string; _count: { id: number }; _sum: { totalAmount: number | null } }[];
  bookingsByService: { serviceType: string; _count: { id: number }; _sum: { totalAmount: number | null } }[];
  monthlyRevenue: { month: string; revenue: number; count: number }[];
  recentBookings: {
    id: string; client: string; employee: string; serviceType: string;
    status: string; totalAmount: number; currency: string; createdAt: string;
  }[];
  recentLogs: {
    id: string; action: string; entity: string; entityId: string;
    employee: string; createdAt: string;
  }[];
};

const SERVICE_LABELS: Record<string, string> = {
  FLIGHT: "طيران", HOTEL: "فندق", VISA: "تأشيرة", MANPOWER: "استقدام", PACKAGE: "باقة",
  flight: "طيران", hotel: "فندق", visa: "تأشيرة", manpower: "استقدام", package: "باقة",
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: "مؤكد", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  pending: { label: "معلق", color: "text-orange-500", bg: "bg-orange-500/10" },
  cancelled: { label: "ملغي", color: "text-red-500", bg: "bg-red-500/10" },
  completed: { label: "مكتمل", color: "text-blue-500", bg: "bg-blue-500/10" },
};

const MONTH_NAMES = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}
function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}

// Loading skeleton
function Skeleton({ className = "", isDark }: { className?: string; isDark: boolean }) {
  return <div className={`animate-pulse rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'} ${className}`} />;
}

export function DashboardOverview({ isDark = true }: { isDark?: boolean }) {
  const { data, loading, error, refetch } = useAdminData<DashboardData>("/api/admin/dashboard");
  const [activeTab, setActiveTab] = useState("الكل");

  const card = isDark ? "bg-[#110f0c] border border-[#2a261c] shadow-2xl" : "bg-white border border-[#e5dfd3] shadow-sm";
  const textPrimary = isDark ? "text-white" : "text-[#1a1610]";
  const subtext = isDark ? "text-white/50" : "text-[#8a8174]";
  const muted = isDark ? "text-white/40" : "text-[#b0a89d]";
  const tableRow = isDark ? "border-[#2a261c] hover:bg-white/[0.02]" : "border-[#f5f1e8] hover:bg-[#fcfbf9]";

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${card} p-10 rounded-[2rem]`}>
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-red-400 font-bold">خطأ في تحميل البيانات: {error}</p>
        <button onClick={refetch} className="flex items-center gap-2 px-6 py-3 bg-[#c5a059] text-white rounded-xl font-black hover:bg-[#b08d4a] transition-colors">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const stats = data ? [
    { label: "إجمالي الإيرادات", value: `${formatAmount(data.revenue.total)}`, currency: "ر.س", badge: "+18.4%", badgeUp: true, icon: DollarSign },
    { label: "نشاط السياحة", value: `${data.bookingsByService.find(s => s.serviceType?.toLowerCase().includes("flight") || s.serviceType?.toLowerCase().includes("package"))?._count.id || 0}`, currency: "رحلة", badge: "+12 حجز", badgeUp: true, icon: Plane },
    { label: "طلبات الاستقدام", value: `${data.counts.jobs}`, currency: "مرشح", badge: "-2.1%", badgeUp: false, icon: Briefcase },
    { label: "قاعدة العملاء", value: `${formatAmount(data.counts.clients)}`, currency: "عميل", badge: "+5 جديد", badgeUp: true, icon: Users },
  ] : [];

  const maxRevenue = data ? Math.max(...data.monthlyRevenue.map(m => m.revenue), 1) : 1;

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${subtext} flex items-center gap-2 mb-2`}>
            <span className="w-8 h-[1px] bg-[#c5a059]"></span>
            OVERVIEW REPORT
          </p>
          <div className="flex items-center gap-4">
            <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>
              {isDark ? "نظام القاضي الذهبي - التدقيق الاحترافي" : "نظام القاضي الذهبي - النمط النهاري الفاخر"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isDark ? "border-[#2a261c] text-white bg-[#1a1813] hover:bg-[#201d16]" : "border-[#e5dfd3] text-black bg-white hover:bg-[#f5f1e8]"} text-sm font-bold transition-all shadow-sm`}>
            <Calendar className="h-4 w-4 text-[#c5a059]" /> آخر 30 يوم
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c5a059] text-white font-black hover:bg-[#b08d4a] transition-all shadow-lg shadow-[#c5a059]/20">
            <Plus className="h-5 w-5" /> إضافة معاملة
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} isDark={isDark} className="h-32" />)
        ) : (
          stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl ${card} relative overflow-hidden group`}>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <span className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full ${stat.badgeUp ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") : (isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}`}>
                  {stat.badgeUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.badge}
                </span>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5 text-white' : 'bg-[#f4f2ee] text-black'} group-hover:bg-[#c5a059] group-hover:text-white transition-all duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="relative z-10 text-right">
                <p className={`text-xs font-bold mb-1 ${subtext}`}>{stat.label}</p>
                <p className="flex items-baseline justify-end gap-2">
                  <span className={`text-3xl font-black tracking-tight ${textPrimary}`}>{stat.value}</span>
                  <span className={`text-sm font-bold ${muted}`}>{stat.currency}</span>
                </p>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#c5a059]/5 rounded-full blur-2xl group-hover:bg-[#c5a059]/10 transition-colors pointer-events-none" />
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className={`p-6 rounded-3xl ${card} flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-black text-lg ${textPrimary}`}>اتجاهات الأداء</h3>
            <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors ${muted}`}>
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          {loading ? <Skeleton isDark={isDark} className="flex-1 min-h-[200px]" /> : (
            <div className="flex-1 flex flex-col justify-end">
              <div className="h-48 flex items-end gap-2 pb-4">
                {(data?.monthlyRevenue || []).map((m, i) => {
                  const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 5;
                  const isMax = m.revenue === maxRevenue && m.revenue > 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar relative h-full justify-end">
                      <div className={`absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all font-black text-[10px] px-2 py-1 rounded-md z-10 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} whitespace-nowrap shadow-xl transform translate-y-2 group-hover/bar:translate-y-0`}>
                        {m.revenue.toLocaleString()} KWD
                      </div>
                      <div className={`w-full rounded-md transition-all duration-500 ${isMax ? 'bg-[#c5a059]' : (isDark ? 'bg-[#c5a059]/20 group-hover/bar:bg-[#c5a059]/40' : 'bg-[#e5dfd3] group-hover/bar:bg-[#c5a059]/40')}`}
                        style={{ height: `${Math.max(height, 5)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className={`flex justify-between border-t pt-4 ${isDark ? 'border-[#2a261c]' : 'border-[#e5dfd3]'}`}>
                {(data?.monthlyRevenue || []).filter((_, i) => i % 2 === 0).map((m, i) => {
                  const monthIdx = parseInt(m.month.split("-")[1]) - 1;
                  return <span key={i} className={`text-[10px] font-bold ${subtext}`}>{MONTH_NAMES[monthIdx]}</span>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Operations Table */}
        <div className={`lg:col-span-2 p-8 rounded-3xl ${card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className={`font-black text-xl mb-1 ${textPrimary}`}>إدارة العمليات الجارية</h3>
              <p className={`text-xs ${subtext}`}>متابعة فورية لكافة المعاملات</p>
            </div>
            <div className={`flex p-1 rounded-xl ${isDark ? 'bg-[#1a1813] border border-[#2a261c]' : 'bg-[#f4f2ee] border border-[#e5dfd3]'}`}>
              {["الكل", "السياحة", "HR"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? (isDark ? 'bg-[#c5a059] text-black shadow-md' : 'bg-white text-[#c5a059] shadow-sm') : `${muted} hover:text-[#c5a059]`}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#2a261c]' : 'border-[#e5dfd3]'}`}>
                  <th className={`pb-4 text-xs font-black ${subtext}`}>المعرف</th>
                  <th className={`pb-4 text-xs font-black ${subtext}`}>العمل / الطلب</th>
                  <th className={`pb-4 text-xs font-black ${subtext} text-center`}>النجاح</th>
                  <th className={`pb-4 text-xs font-black ${subtext} text-center`}>الحالة</th>
                  <th className={`pb-4 text-xs font-black ${subtext} text-left`}>القيمة</th>
                  <th className={`pb-4 text-xs font-black ${subtext} text-left`}>خيارات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-3"><Skeleton isDark={isDark} className="h-12 w-full" /></td>
                    </tr>
                  ))
                ) : data?.recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`py-12 text-center font-bold ${subtext}`}>لا توجد عمليات نشطة حالياً</td>
                  </tr>
                ) : (
                  data?.recentBookings.slice(0, 4).map((op) => {
                    const st = STATUS_LABELS[op.status.toLowerCase()] || STATUS_LABELS.pending;
                    return (
                      <tr key={op.id} className={`border-b last:border-0 ${tableRow} transition-colors group`}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-[#f4f2ee]'}`}>
                              <Briefcase className={`h-4 w-4 ${muted}`} />
                            </div>
                            <span className={`text-sm font-black font-mono ${textPrimary}`}>{op.id.slice(0, 7).toUpperCase()}#</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className={`font-black text-sm mb-1 ${textPrimary}`}>{op.client}</p>
                          <p className={`text-[10px] ${subtext}`}>{op.serviceType} • {timeSince(op.createdAt)}</p>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex justify-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${op.status === 'confirmed' ? 'bg-emerald-500 text-white' : (isDark ? 'bg-white/10 text-white/40' : 'bg-black/10 text-black/40')}`}>
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${st.bg} ${st.color}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {st.label}
                          </span>
                        </td>
                        <td className="py-4 text-left font-black text-sm text-[#c5a059]">
                          {op.totalAmount.toLocaleString()} ر.س
                        </td>
                        <td className="py-4 text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/70' : 'bg-[#f4f2ee] hover:bg-[#e5dfd3] text-black'} transition-colors`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Log */}
        <div className={`p-8 rounded-3xl ${card}`}>
          <h3 className={`font-black text-xl mb-6 ${textPrimary}`}>سجل النشاط الموحد</h3>
          <div className="relative border-r-2 border-[#c5a059]/20 pr-6 space-y-8">
            {loading ? (
               Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} isDark={isDark} className="h-16" />)
            ) : data?.recentLogs.length === 0 ? (
              <p className={`font-bold ${subtext} py-4`}>لا توجد سجلات</p>
            ) : (
              data?.recentLogs.slice(0, 3).map((log, idx) => (
                <div key={log.id} className="relative">
                  <div className="absolute -right-[33px] top-1 h-4 w-4 rounded-full border-4 border-[#c5a059] bg-[#110f0c]" />
                  <p className={`font-black text-sm mb-1 ${textPrimary}`}>
                    {log.action === "CREATE" ? "تم إنشاء" : log.action === "UPDATE" ? "تم تحديث" : log.action === "DELETE" ? "تم حذف" : log.action} {log.entity}
                  </p>
                  <p className={`text-xs ${subtext} mb-2`}>{log.employee} • {log.entityId.slice(0, 6)}</p>
                  <p className={`text-[10px] font-bold text-[#c5a059]`}>{timeSince(log.createdAt)}</p>
                </div>
              ))
            )}
            
            <button className={`w-full py-3 mt-4 rounded-xl border font-bold text-sm transition-colors ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'}`}>
              تحميل السجل الكامل
            </button>
          </div>
        </div>

        {/* CMS Quick Edit */}
        <div className={`lg:col-span-2 p-8 rounded-3xl ${card} relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`font-black text-xl mb-1 ${textPrimary}`}>تحرير محتوى الموقع العام</h3>
              <p className={`text-xs ${subtext}`}>تحديث مباشر للمحتوى الرئيسي</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <MapPin className="h-3 w-3" /> SEO سكور (92/100)
              </div>
              <button className="px-6 py-2 rounded-xl bg-[#c5a059] text-white font-black hover:bg-[#b08d4a] transition-all shadow-lg shadow-[#c5a059]/20">
                نشر التحديث
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Image Uploader */}
            <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${isDark ? 'border-[#2a261c] hover:border-[#c5a059]/50 bg-white/[0.01]' : 'border-[#e5dfd3] hover:border-[#c5a059]/50 bg-black/[0.01]'}`}>
              <div className="h-16 w-16 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] mb-4">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h4 className={`font-black text-sm mb-2 ${textPrimary}`}>تغيير الصورة الرئيسية</h4>
              <p className={`text-xs ${subtext} mb-6`}>HD Image Recommended (Max 5MB)</p>
              
              <div className="flex gap-2">
                <button className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors ${isDark ? 'border-[#2a261c] text-white hover:bg-white/5' : 'border-[#e5dfd3] text-black hover:bg-black/5'}`}>
                  <Plus className="h-5 w-5" />
                </button>
                <div className="h-10 w-10 rounded-xl bg-[#c5a059] shadow-inner" />
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-black mb-2 ${subtext}`}>عنوان البطل (HERO TITLE)</label>
                <input 
                  type="text" 
                  defaultValue="بناء إرث من التفوق المؤسسي" 
                  className={`w-full px-5 py-4 rounded-xl border text-sm font-bold focus:outline-none transition-colors ${isDark ? 'bg-transparent border-[#2a261c] text-white focus:border-[#c5a059]' : 'bg-transparent border-[#e5dfd3] text-black focus:border-[#c5a059]'}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-black mb-2 ${subtext}`}>الرسالة الفرعية</label>
                <textarea 
                  rows={3}
                  defaultValue="نحن في مجموعة القاضي الذهبية نلتزم بتقديم أعلى مستويات الخدمة والخبرة في إدارة الاستثمارات الفاخرة."
                  className={`w-full px-5 py-4 rounded-xl border text-sm font-bold focus:outline-none transition-colors resize-none ${isDark ? 'bg-transparent border-[#2a261c] text-white focus:border-[#c5a059]' : 'bg-transparent border-[#e5dfd3] text-black focus:border-[#c5a059]'}`}
                />
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#c5a059]/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
