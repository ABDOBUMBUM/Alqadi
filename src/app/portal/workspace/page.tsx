"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plane, LogOut, User, MapPin, Phone, DollarSign,
  Calculator, MessageSquare, Send, Bot, ChevronDown,
  Building2, Clock, LayoutDashboard, Globe, FileText,
  CreditCard, Calendar, CheckCircle2, AlertCircle, FilePlus, ShieldCheck, Ticket
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

  // Comprehensive Client CRM
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [passportNo, setPassportNo] = useState("");
  
  // Trip Details
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [travelDate, setTravelDate] = useState("");
  const [requiresHotel, setRequiresHotel] = useState(false);
  const [requiresVisa, setRequiresVisa] = useState(true);
  const [notes, setNotes] = useState("");

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "مرحباً! أنا مساعدك الذكي في بيئة العمل الشاملة. يمكنني مساعدتك في إصدار عروض أسعار، إنشاء ملفات العملاء، والتواصل الفعال. 🤖" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Stats / Dashboard Overview
  const [activeTab, setActiveTab] = useState<"crm" | "history">("crm");

  useEffect(() => {
    import("next-auth/react").then(({ getSession }) => {
      getSession().then(sessionData => {
        if (!sessionData?.user) {
          router.replace("/portal/login");
          return;
        }
        
        const user = sessionData.user as any;
        const allowedRoles = ["admin", "supervisor", "agent", "booking_agent"];
        if (!allowedRoles.includes(user.role || "agent")) {
          router.replace("/portal/login?error=AccessDenied");
          return;
        }

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
  const ticketTotal = selectedPricing ? Number(selectedPricing.ticketPrice) * Number(passengers) : 0;
  const securityTotal = selectedPricing ? Number(selectedPricing.securityApproval) * Number(passengers) : 0;
  const visaTotal = (selectedPricing && requiresVisa) ? Number(selectedPricing.visaFee) * Number(passengers) : 0;
  const hotelEstimated = requiresHotel ? 150 * Number(passengers) : 0; // Fake base rate
  
  const grandTotal = ticketTotal + securityTotal + visaTotal + hotelEstimated;

  function logout() {
    import("next-auth/react").then(({ signOut }) => {
      try { localStorage.removeItem(SESSION_KEY); } catch { /**/ }
      signOut({ callbackUrl: "/portal/login" });
    });
  }

  function generateQuote() {
    if (!clientName || !destination) return;
    const msg = `✈️ عرض سعر متكامل — ${destination}\n\nالعميل: ${clientName}\nتاريخ السفر المفضل: ${travelDate || 'غير محدد'}\nعدد المسافرين: ${passengers}\n\nتفاصيل التسعير:\n• تذاكر الطيران: $${ticketTotal}\n• الموافقة الأمنية: $${securityTotal}\n${requiresVisa ? `• رسوم التأشيرة: $${visaTotal}\n` : ''}${requiresHotel ? `• حجوزات فندقية (مقدرة): $${hotelEstimated}\n` : ''}\n💰 الإجمالي الكلي: $${grandTotal}\n\nللحجز والاستفسار: مجموعة القاضي الذهبية 🌟`;
    setMessages(m => [...m, { role: "ai", text: msg }]);
  }

  function generateReply() {
    if (!clientName || !destination) return;
    const reply = `مرحباً ${clientName} 😊\n\nشكراً لتواصلك مع مجموعة القاضي الذهبية للسفريات.\n\nبخصوص استفساركم عن رحلة ${destination}، يسعدنا إخبارك بأن لدينا أفضل العروض المتاحة بأسعار تنافسية. السعر الإجمالي المقدر لكامل الخدمات هو $${grandTotal}.\n\nنحن هنا لخدمتك ونتطلع لتلبية كافة احتياجاتك. 🌍✈️\n\nفريق خدمة العملاء — القاضي الذهبية`;
    setMessages(m => [...m, { role: "ai", text: reply }]);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: `تم استلام رسالتك: "${userMsg}"\n\nجارٍ العمل على تنفيذ طلبك في النظام الجديد. 🤖` }]);
    }, 800);
  }

  if (!session) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">جاري التحميل...</div>;

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-200 font-cairo overflow-hidden" dir="rtl">
      
      {/* Top Header */}
      <header className="shrink-0 flex items-center justify-between border-b border-white/5 bg-slate-900/80 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_15px_rgba(176,141,87,0.3)]">
            <Plane className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">مساحة العمل الشاملة</h1>
            <p className="text-xs text-gold-400 font-medium">نظام التشغيل — {session.branchName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {session.role === "admin" && (
            <button onClick={() => router.push("/admin")}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 transition border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              <ShieldCheck className="h-4 w-4" /> الإدارة المركزية
            </button>
          )}
          <button onClick={() => router.push("/portal/booking")}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition border border-white/10">
            <Globe className="h-4 w-4 text-gold-400" /> بوابة الحجز الذكي
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-2 mr-2">
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-white">{session.name}</p>
              <p className="text-[10px] text-white/50">{session.role.toUpperCase()}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center cursor-pointer">
              <User className="h-4 w-4 text-white/70" />
            </div>
          </div>
          <button onClick={logout} className="ml-2 flex items-center justify-center rounded-xl bg-white/5 p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Nav (Optional/Mini) */}
        <div className="w-16 flex-col items-center py-4 bg-slate-900 border-l border-white/5 hidden lg:flex gap-4">
          <button onClick={() => setActiveTab("crm")} className={`p-3 rounded-xl transition ${activeTab === 'crm' ? 'bg-gold-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}>
            <FilePlus className="h-5 w-5" />
          </button>
          <button onClick={() => setActiveTab("history")} className={`p-3 rounded-xl transition ${activeTab === 'history' ? 'bg-gold-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}>
            <Clock className="h-5 w-5" />
          </button>
        </div>

        {/* Middle Column — CRM & Pricing (60%) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          
          {activeTab === "crm" ? (
            <>
              {/* Client Info Card */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2 text-base font-bold text-white">
                    <User className="h-5 w-5 text-gold-400" /> الملف التعريفي للعميل
                  </h2>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                    طلب جديد
                  </span>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">الاسم الكامل</label>
                    <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="اسم العميل..." 
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">رقم الهاتف</label>
                    <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+965..." dir="ltr"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">رقم الجواز (اختياري)</label>
                    <input value={passportNo} onChange={e => setPassportNo(e.target.value)} placeholder="A0000000" dir="ltr"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition" />
                  </div>
                </div>
              </div>

              {/* Trip Configuration */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm">
                <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-white">
                  <Plane className="h-5 w-5 text-gold-400" /> تفاصيل الرحلة والخدمات
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">الوجهة المقصودة</label>
                    <div className="relative">
                      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <select value={destination} onChange={e => setDestination(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-8 pr-4 text-sm text-white outline-none focus:border-gold-500/50 transition">
                        <option value="">اختر الوجهة...</option>
                        {pricing.map(p => <option key={p.destination} value={p.destination}>{p.destination}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">تاريخ السفر</label>
                    <input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">عدد المسافرين</label>
                    <input type="number" min="1" value={passengers} onChange={e => setPassengers(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50 transition" dir="ltr" />
                  </div>
                </div>

                {/* Additional Services */}
                <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-white/5 bg-black/20">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${requiresVisa ? 'bg-gold-500 border-gold-500' : 'border-white/20 group-hover:border-white/40'}`}>
                      {requiresVisa && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={requiresVisa} onChange={e => setRequiresVisa(e.target.checked)} />
                    <span className="text-sm font-medium text-slate-300">إصدار تأشيرة دخول</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${requiresHotel ? 'bg-gold-500 border-gold-500' : 'border-white/20 group-hover:border-white/40'}`}>
                      {requiresHotel && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={requiresHotel} onChange={e => setRequiresHotel(e.target.checked)} />
                    <span className="text-sm font-medium text-slate-300">حجز فندقي (تقريبي)</span>
                  </label>
                </div>
              </div>

              {/* Advanced Pricing Calculator */}
              <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-b from-gold-500/5 to-transparent p-6">
                <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-white">
                  <Calculator className="h-5 w-5 text-gold-400" /> عرض السعر الشامل
                </h2>
                
                {selectedPricing ? (
                  <div className="space-y-3">
                    {/* Invoice Items */}
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Ticket className="w-4 h-4 text-white/40" /> <span>تذاكر الطيران</span>
                      </div>
                      <div className="font-mono">${ticketTotal} <span className="text-xs text-white/30 ml-2">(${selectedPricing.ticketPrice} × {passengers})</span></div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <ShieldCheck className="w-4 h-4 text-white/40" /> <span>الموافقة الأمنية</span>
                      </div>
                      <div className="font-mono">${securityTotal} <span className="text-xs text-white/30 ml-2">(${selectedPricing.securityApproval} × {passengers})</span></div>
                    </div>

                    {requiresVisa && (
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2 text-slate-300">
                          <FileText className="w-4 h-4 text-white/40" /> <span>تأشيرة الدخول</span>
                        </div>
                        <div className="font-mono">${visaTotal} <span className="text-xs text-white/30 ml-2">(${selectedPricing.visaFee} × {passengers})</span></div>
                      </div>
                    )}

                    {requiresHotel && (
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Building2 className="w-4 h-4 text-white/40" /> <span>الحجز الفندقي</span>
                        </div>
                        <div className="font-mono">${hotelEstimated} <span className="text-xs text-white/30 ml-2">(تقديري)</span></div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="mt-6 pt-4 flex items-center justify-between rounded-xl border border-gold-500/30 bg-gold-500/10 px-5 py-4">
                      <div>
                        <span className="block font-bold text-gold-300 text-lg">الإجمالي الكلي</span>
                        <span className="block text-xs text-gold-400/60">يشمل الضرائب والرسوم الأساسية</span>
                      </div>
                      <span className="font-mono text-3xl font-black text-white">${grandTotal}</span>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                      <button onClick={generateReply} className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-slate-700 transition">
                        <MessageSquare className="h-4 w-4 text-blue-400" /> رسالة نصية
                      </button>
                      <button onClick={generateQuote} className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-slate-700 transition">
                        <FileText className="h-4 w-4 text-emerald-400" /> مسودة عرض
                      </button>
                      <button className="flex items-center justify-center gap-2 rounded-xl bg-gold-500/20 py-3 text-sm font-bold text-gold-300 hover:bg-gold-500/30 transition border border-gold-500/30 md:col-span-2">
                        <CreditCard className="h-4 w-4" /> إنشاء رابط دفع وإرسال
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-slate-500">
                    <MapPin className="h-8 w-8 mb-3 opacity-50" />
                    <p>الرجاء تحديد الوجهة من الأعلى لعرض التفاصيل المادية</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">سجل العمليات فارغ</h3>
                <p className="text-sm text-slate-500 mt-2">لم تقم بإصدار أي حجوزات مؤخراً.</p>
              </div>
            </div>
          )}
          
        </div>

        {/* Right Column — AI Assistant & Quick Knowledge (40%) */}
        <div className="hidden lg:flex w-[40%] max-w-md flex-col border-r border-white/5 bg-slate-900/30">
          
          <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4 bg-slate-900/50">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">مساعد القاضي الذكي</h3>
              <p className="text-xs text-slate-400">متصل وجاهز للمساعدة</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-slate-800 text-slate-200"
                    : "rounded-bl-sm bg-gold-500/10 border border-gold-500/20 text-white"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-4 bg-slate-900/50 border-t border-white/5">
            <div className="relative flex items-center">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="اطلب من المساعد الذكي أي شيء..."
                dir="rtl"
                className="w-full rounded-full border border-white/10 bg-slate-950 py-3.5 pl-14 pr-5 text-sm text-white outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition shadow-inner"
              />
              <button onClick={sendChat}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-slate-950 hover:bg-gold-400 hover:scale-105 transition-all shadow-md">
                <Send className="h-4 w-4 -ml-0.5" />
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 hover:bg-white/10 transition">شروط تأشيرة دبي</button>
              <button className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 hover:bg-white/10 transition">أسعار العمرة</button>
              <button className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 hover:bg-white/10 transition">سياسة الاسترجاع</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

