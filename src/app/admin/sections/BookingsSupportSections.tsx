"use client";
import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { Calendar, Search, Plane, Hotel, Briefcase, RefreshCw, Clock, Tag } from "lucide-react";

type Booking = {
  id: string; clientId: string; serviceType: string; status: string;
  totalAmount: number; paidAmount: number; currency: string; details: any;
  createdAt: string; client?: { name: string; phone?: string };
};

const STATUS: Record<string, { label: string; color: string }> = {
  confirmed: { label: "مؤكد", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  pending: { label: "معلق", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  completed: { label: "مكتمل", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  cancelled: { label: "ملغي", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};
const SERVICE_ICONS: Record<string, any> = { flight: Plane, hotel: Hotel, manpower: Briefcase, visa: Tag, FLIGHT: Plane, HOTEL: Hotel, MANPOWER: Briefcase, VISA: Tag };
const SERVICE_LABELS: Record<string, string> = { flight: "طيران", hotel: "فندق", visa: "تأشيرة", manpower: "استقدام", package: "باقة", FLIGHT: "طيران", HOTEL: "فندق", VISA: "تأشيرة", MANPOWER: "استقدام", PACKAGE: "باقة" };

const Skeleton = ({ className = "" }: { className?: string }) => <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;

export function BookingsSection({ isDark }: { isDark?: boolean }) {
  const { data: bookings, loading, refetch } = useAdminData<Booking[]>("/api/admin/bookings");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = (bookings || []).filter(b =>
    (statusFilter === "all" || b.status === statusFilter) &&
    (b.client?.name?.includes(search) || b.id.includes(search) || b.serviceType.includes(search))
  );

  const total = (bookings || []).reduce((a, b) => a + (b.totalAmount || 0), 0);

  const statusCounts = Object.keys(STATUS).reduce((acc, key) => {
    acc[key] = (bookings || []).filter(b => b.status === key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Calendar className="h-7 w-7 text-gold-500" /> محرك الحجز
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {loading ? "جاري التحميل..." : `${bookings?.length || 0} حجز — إجمالي: ${total.toLocaleString()} KWD`}
          </p>
        </div>
        <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(STATUS).map(([key, val]) => (
          <div key={key} className="p-5 rounded-2xl border border-white/5 bg-white/5 text-center">
            <p className="text-2xl font-black text-white">{loading ? "—" : statusCounts[key] || 0}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${val.color.split(" ")[0]}`}>{val.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالعميل أو الخدمة..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all" />
        </div>
        <div className="flex gap-2">
          {["all", ...Object.keys(STATUS)].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${statusFilter === f ? "bg-gold-500 text-black" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
              {f === "all" ? "الكل" : STATUS[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => {
            const Icon = SERVICE_ICONS[booking.serviceType] || Plane;
            const st = STATUS[booking.status] || { label: booking.status, color: "text-white/30 bg-white/5 border-white/10" };
            return (
              <div key={booking.id} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
                <div className="h-12 w-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-white text-sm">{booking.client?.name || "—"}</span>
                    <span className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-0.5 rounded">{booking.id.slice(0, 10)}</span>
                    <span className="text-[10px] font-bold text-white/40">{SERVICE_LABELS[booking.serviceType] || booking.serviceType}</span>
                  </div>
                  <p className="text-xs text-white/50 font-bold">{new Date(booking.createdAt).toLocaleDateString("ar-SA")}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-emerald-400 text-sm mb-1">{booking.totalAmount.toLocaleString()} {booking.currency}</p>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${st.color} uppercase tracking-wider`}>{st.label}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30 font-bold">لا توجد حجوزات {statusFilter !== "all" ? `بحالة "${STATUS[statusFilter]?.label}"` : ""}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Support Tickets ─────────────────────────────────────────────────────
type Ticket = {
  id: string; subject: string; description: string; status: string;
  priority: string; createdAt: string; client?: { name: string };
};

const PRIORITY: Record<string, string> = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  urgent: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};
const TICKET_STATUS: Record<string, { label: string; color: string }> = {
  open: { label: "مفتوح", color: "text-red-400" },
  in_progress: { label: "جاري", color: "text-orange-400" },
  resolved: { label: "تم الحل", color: "text-emerald-400" },
  closed: { label: "مغلق", color: "text-white/30" },
};

function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}

export function SupportTicketsSection({ isDark }: { isDark?: boolean }) {
  const { data: tickets, loading, refetch } = useAdminData<Ticket[]>("/api/admin/tickets");

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      refetch();
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Clock className="h-7 w-7 text-gold-500" /> الدعم الفني
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {loading ? "جاري التحميل..." : `${(tickets || []).filter(t => t.status === "open").length} تذاكر مفتوحة من أصل ${tickets?.length || 0}`}
          </p>
        </div>
        <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold-500 transition-all">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="space-y-3">
          {(tickets || []).map(t => {
            const st = TICKET_STATUS[t.status] || { label: t.status, color: "text-white/30" };
            return (
              <div key={t.id} className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-gold-500/10 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-black text-white">{t.subject}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${PRIORITY[t.priority] || PRIORITY.medium} uppercase`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/40 font-bold uppercase tracking-wide">
                      <span>{t.client?.name || "—"}</span>
                      <span>•</span>
                      <span>{t.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span>{timeSince(t.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-black uppercase ${st.color}`}>{st.label}</span>
                    {t.status === "open" && (
                      <button onClick={() => handleStatusChange(t.id, "resolved")}
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 font-black text-[10px] uppercase tracking-widest text-emerald-400 transition-all">
                        حل التذكرة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {(tickets || []).length === 0 && (
            <div className="text-center py-16 text-white/30 font-bold">لا توجد تذاكر دعم</div>
          )}
        </div>
      )}
    </div>
  );
}
