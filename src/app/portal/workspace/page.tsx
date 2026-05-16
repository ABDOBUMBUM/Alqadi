"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plane, LogOut, User, MapPin, Phone, DollarSign,
  Calculator, MessageSquare, Send, Bot, ChevronDown,
  Building2, Clock, LayoutDashboard,
} from "lucide-react";

const SESSION_KEY = "alqadi_portal_session";

type Session = {
  name: string; username: string; role: string;
  branchId: string; branchName: string; shift: string; title: string; workLocation: string; loginTime: string;
};
type PricingRow = { destination: string; ticketPrice: string; securityApproval: string; visaFee: string; };



async function loadPricing(): Promise<PricingRow[]> {
  try {
    const res = await fetch("/api/admin/content");
    if (res.ok) {
      const data = await res.json();
      if (data.pricing?.length) return data.pricing;
    }
  } catch { /**/ }
  return [
    { destination: "القاهرة", ticketPrice: "120", securityApproval: "15", visaFee: "25" },
    { destination: "اسطنبول", ticketPrice: "145", securityApproval: "15", visaFee: "30" },
    { destination: "لندن", ticketPrice: "210", securityApproval: "20", visaFee: "50" },
    { destination: "دبي", ticketPrice: "80", securityApproval: "10", visaFee: "0" },
  ];
}

type ChatMessage = { role: "user" | "ai"; text: string; };

export default function WorkspacePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [pricing, setPricing] = useState<PricingRow[]>([]);

  // Client form
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [notes, setNotes] = useState("");

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "مرحباً! أنا مساعدك الذكي. يمكنني مساعدتك في توليد ردود احترافية وعروض أسعار لعملائك. 🤖" },
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    import("next-auth/react").then(({ getSession }) => {
      getSession().then(sessionData => {
        if (!sessionData?.user) {
          router.replace("/portal/login");
          return;
        }
        
        const user = sessionData.user as any;
        const localRaw = localStorage.getItem(SESSION_KEY);
        let extraInfo: any = {};
        if (localRaw) {
          try { extraInfo = JSON.parse(localRaw); } catch { /* ignore */ }
        }
        
        setSession({
          name: user.name || "",
          username: extraInfo.username || user.email || "",
          role: user.role || "agent",
          branchId: user.branchId || "",
          branchName: user.branchName || "",
          shift: user.shift || "",
          title: user.title || "",
          workLocation: extraInfo.workLocation || "office",
          loginTime: extraInfo.loginTime || new Date().toISOString(),
        } as Session);
      });
    });
    loadPricing().then(setPricing);
  }, [router]);

  const selectedPricing = pricing.find(p => p.destination === destination);
  const unitTotal = selectedPricing
    ? Number(selectedPricing.ticketPrice) + Number(selectedPricing.securityApproval) + Number(selectedPricing.visaFee)
    : 0;
  const grandTotal = unitTotal * Number(passengers || 1);

  function logout() {
    import("next-auth/react").then(({ signOut }) => {
      try { localStorage.removeItem(SESSION_KEY); } catch { /**/ }
      signOut({ callbackUrl: "/portal/login" });
    });
  }

  function generateQuote() {
    if (!clientName || !destination || unitTotal === 0) return;
    const msg = `✈️ عرض سعر — ${destination}\n\nالعميل: ${clientName}\nعدد المسافرين: ${passengers}\n\nالتفاصيل:\n• سعر التذكرة: $${selectedPricing?.ticketPrice} × ${passengers} = $${Number(selectedPricing?.ticketPrice) * Number(passengers)}\n• الموافقة الأمنية: $${selectedPricing?.securityApproval} × ${passengers} = $${Number(selectedPricing?.securityApproval) * Number(passengers)}\n• رسوم التأشيرة: $${selectedPricing?.visaFee} × ${passengers} = $${Number(selectedPricing?.visaFee) * Number(passengers)}\n\n💰 الإجمالي الكلي: $${grandTotal}\n\nللحجز والاستفسار: مجموعة القاضي الذهبية 🌟`;
    setMessages(m => [...m, { role: "ai", text: msg }]);
  }

  function generateReply() {
    if (!clientName || !destination) return;
    const reply = `مرحباً ${clientName} 😊\n\nشكراً لتواصلك مع مجموعة القاضي الذهبية للسفريات.\n\nبخصوص استفساركم عن رحلة ${destination}، يسعدنا إخبارك بأن لدينا أفضل العروض المتاحة بأسعار تنافسية.\n\nالسعر الإجمالي للشخص: $${unitTotal}\n\nنحن هنا لخدمتك ونتطلع لتلبية كافة احتياجاتك. 🌍✈️\n\nفريق خدمة العملاء — القاضي الذهبية`;
    setMessages(m => [...m, { role: "ai", text: reply }]);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: `تم استلام رسالتك: "${userMsg}"\n\nسيتم ربط هذا الحقل بنموذج الذكاء الاصطناعي قريباً. حالياً يمكنك استخدام أزرار التوليد السريع أعلاه. 🤖` }]);
    }, 800);
  }

  if (!session) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">جاري التحميل...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white" dir="rtl">

      {/* Top Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-slate-900/80 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/20 border border-gold-500/30">
            <Plane className="h-4 w-4 text-gold-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">مساحة العمل</p>
            <p className="text-[10px] text-white/40">{session.branchName} — {session.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.role === "supervisor" && (
            <>
              <button onClick={() => router.push("/portal/dashboard")}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 transition">
                <LayoutDashboard className="h-3.5 w-3.5" /> لوحة القيادة
              </button>
              <button onClick={() => router.push("/portal/leads")}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 transition">
                <MessageSquare className="h-3.5 w-3.5" /> صندوق الطلبات
              </button>
            </>
          )}
          <button onClick={logout} className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
        </div>
      </header>

      {/* Split workspace */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

        {/* LEFT — Client data + Calculator (60%) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 lg:w-[60%]">

          {/* Client Info */}
          <div className="rounded-2xl border border-white/5 bg-slate-900 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <User className="h-4 w-4 text-gold-400" /> بيانات العميل
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/40">اسم العميل</label>
                <input suppressHydrationWarning value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="الاسم الكامل..." dir="rtl"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <input suppressHydrationWarning value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    placeholder="+967..." dir="ltr"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-4 pr-10 font-mono text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">الوجهة</label>
                <div className="relative">
                  <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <select suppressHydrationWarning value={destination} onChange={e => setDestination(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 py-2.5 pl-8 pr-4 text-sm text-white outline-none focus:border-gold-500/50 transition" dir="rtl">
                    <option value="">اختر الوجهة...</option>
                    {pricing.map(p => <option key={p.destination} value={p.destination}>{p.destination}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">عدد المسافرين</label>
                <input suppressHydrationWarning type="number" min="1" value={passengers} onChange={e => setPassengers(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 transition" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-white/40">ملاحظات</label>
                <textarea suppressHydrationWarning value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="أي تفاصيل إضافية..." rows={2} dir="rtl"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 transition resize-none" />
              </div>
            </div>
          </div>

          {/* Pricing Calculator */}
          <div className="rounded-2xl border border-white/5 bg-slate-900 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Calculator className="h-4 w-4 text-gold-400" /> حاسبة التسعير
            </h2>
            {selectedPricing ? (
              <div className="space-y-2">
                {[
                  { label: "سعر التذكرة", unit: selectedPricing.ticketPrice },
                  { label: "الموافقة الأمنية", unit: selectedPricing.securityApproval },
                  { label: "رسوم التأشيرة", unit: selectedPricing.visaFee },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-white/60">{row.label}</span>
                    <div className="flex items-center gap-3 font-mono text-sm">
                      <span className="text-white/30">${row.unit} × {passengers}</span>
                      <span className="font-bold text-white">${Number(row.unit) * Number(passengers)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl border border-gold-500/25 bg-gold-500/10 px-4 py-3">
                  <span className="font-bold text-gold-300">الإجمالي الكلي</span>
                  <span className="font-mono text-xl font-black text-gold-400">${grandTotal}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 py-8 text-sm text-white/30">
                <MapPin className="ml-2 h-4 w-4" /> اختر وجهة لعرض الأسعار
              </div>
            )}
          </div>

          {/* Quick action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={generateReply}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 py-3 text-sm font-bold text-blue-300 hover:bg-blue-500/20 transition">
              <MessageSquare className="h-4 w-4" /> توليد رد احترافي
            </button>
            <button onClick={generateQuote}
              className="flex items-center justify-center gap-2 rounded-xl border border-gold-500/25 bg-gold-500/10 py-3 text-sm font-bold text-gold-300 hover:bg-gold-500/20 transition">
              <DollarSign className="h-4 w-4" /> توليد عرض سعر
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden w-px bg-white/5 lg:block" />

        {/* RIGHT — AI Chat (40%) */}
        <div className="flex flex-col border-t border-white/5 lg:border-t-0 lg:w-[40%]">
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
            <Bot className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-semibold text-white">المساعد الذكي</span>
            <span className="mr-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">متصل</span>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md bg-white/10 text-white/80"
                    : "rounded-bl-md bg-gold-500/10 border border-gold-500/20 text-white"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-white/5 p-4">
            <div className="flex gap-2">
              <input
                suppressHydrationWarning
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="اكتب رسالتك..."
                dir="rtl"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition"
              />
              <button onClick={sendChat}
                className="flex items-center justify-center rounded-xl bg-gold-500 p-2.5 text-black hover:bg-gold-400 transition">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
