"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Settings, Phone, Globe2, Users,
  Briefcase, Hotel, Plane, LogOut,
  DollarSign, Building, Tag, ShieldCheck, Database,
  Search, Calendar, UserPlus,
  Layers, Network, Bell, Menu, ChevronRight, LayoutDashboard,
  Moon, Sun, LogOutIcon, ArrowRightLeft, User
} from "lucide-react";
import { signOut } from "next-auth/react";

import { ApiIntegrationsSection } from "./ApiIntegrationsSection";
import { DynamicDbSection } from "./DynamicDbSection";
import { CompanySection } from "./sections/CompanySection";
import { CRMSection } from "./sections/CRMSection";
import { BookingsSection, SupportTicketsSection } from "./sections/BookingsSupportSections";
import { DestinationsSection, PackagesSection, HotelsSection, VisasSection, JobsSection } from "./sections/ProductSections";
import { PricingSection, EmployeesSection, BranchesSection, CMSSection, AuditLogSection, SettingsSection, BookingPortalCMSSection } from "./sections/SystemSections";
import { DashboardOverview } from "./sections/DashboardOverview";

// --- Design Tokens & Constants ---
// Access control is enforced server-side (middleware + NextAuth role=admin).

type Section = 
  | "dashboard" | "company" | "crm" | "bookings" | "support_tickets" 
  | "destinations" | "packages" | "hotels" | "visas" | "jobs" 
  | "pricing" | "employees" | "branches" | "cms" | "booking_portal_cms"
  | "dynamic_db" | "audit_log" | "api_integrations" | "settings";

const SECTIONS = [
  { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard, group: "الرئيسية" },
  { id: "destinations", label: "السياحة والسفر", icon: Plane, group: "الكيانات الأساسية", badge: "12 طلب" },
  { id: "jobs", label: "الموارد البشرية", icon: Users, group: "الكيانات الأساسية" },
  { id: "company", label: "الاستثمارات", icon: DollarSign, group: "الكيانات الأساسية" },
  { id: "crm", label: "إدارة العملاء CRM", icon: Briefcase, group: "الكيانات الأساسية" },
  // ═══ PORTAL SECTION ═════════════════════════════
  { id: "booking_portal_cms", label: "🚀 بوابة الحجز الذكي", icon: Globe2, group: "البوابة الداخلية", badge: "جديد" },
  // ═══ ANALYTICS ═════════════════════════════════
  { id: "pricing", label: "التحليلات المالية", icon: Database, group: "التحليلات والتقارير" },
  { id: "cms", label: "إدارة المحتوى CMS", icon: Layers, group: "التحليلات والتقارير" },
  { id: "employees", label: "الموظفين والصلاحيات", icon: UserPlus, group: "الإدارة والرقابة" },
  { id: "branches", label: "الفروع والمكاتب", icon: Building, group: "الإدارة والرقابة" },
  { id: "audit_log", label: "سجل المراقبة", icon: ShieldCheck, group: "الإدارة والرقابة" },
  { id: "settings", label: "إعدادات النظام", icon: Settings, group: "الإدارة والرقابة" },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState<boolean>(true); // Default to dark on server
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("alqadi_admin_theme");
    if (saved === "light") setIsDark(false);
    else if (saved === "dark") setIsDark(true);
  }, []);

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    if (typeof window !== "undefined") {
      localStorage.setItem("alqadi_admin_theme", dark ? "dark" : "light");
    }
  };

  // --- Theme Variables ---
  const bgMain = isDark ? "bg-[#0b0a08]" : "bg-[#f4f2ee]";
  const bgSidebar = isDark ? "bg-[#14120e]" : "bg-[#fefdfb]";
  const textMain = isDark ? "text-white" : "text-[#1a1610]";
  const textMuted = isDark ? "text-white/50" : "text-[#8a8174]";
  const borderCol = isDark ? "border-[#2a261c]" : "border-[#e5dfd3]";
  const hoverBg = isDark ? "hover:bg-[#201d16]" : "hover:bg-[#f5f1e8]";
  const activeBg = isDark ? "bg-[#c5a059] text-black" : "bg-[#eae3d1] text-[#7a602c] shadow-sm";

  if (!mounted) return <div className="min-h-screen bg-[#0b0a08]" />;

  return (
    <div className={`min-h-screen flex font-sans ${bgMain} ${textMain}`} dir="rtl">
      
      {/* --- RIGHT SIDEBAR --- */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={`fixed inset-y-0 right-0 z-50 flex flex-col border-l ${bgSidebar} ${borderCol} shadow-xl transition-all duration-300`}
      >
        <div className={`h-24 flex flex-col justify-center px-6 border-b ${borderCol}`}>
          {isSidebarOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <h2 className="font-black tracking-tight text-2xl leading-tight">القاضي</h2>
              <p className="text-[10px] text-[#8a8174] font-black tracking-widest uppercase mt-1">GOLD GROUP ENTERPRISE</p>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <h2 className="font-black text-2xl">ق</h2>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-6">
          {["الرئيسية", "الكيانات الأساسية", "البوابة الداخلية", "التحليلات والتقارير", "الإدارة والرقابة"].map((groupName) => {
            const groupSections = SECTIONS.filter(s => s.group === groupName);
            if(groupSections.length === 0) return null;

            return (
              <div key={groupName}>
                {isSidebarOpen && (
                  <p className={`px-4 mb-2 text-[9px] font-black uppercase tracking-widest ${textMuted}`}>{groupName}</p>
                )}
                <div className="space-y-1">
                  {groupSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as Section)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                        activeSection === section.id ? activeBg : `${textMuted} ${hoverBg}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className={`h-5 w-5 min-w-[20px] ${activeSection === section.id ? "" : ""}`} />
                        {isSidebarOpen && <span className="font-bold text-sm">{section.label}</span>}
                      </div>
                      {isSidebarOpen && section.badge && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${activeSection === section.id ? 'bg-black/10' : (isDark ? 'bg-white/10' : 'bg-[#e5dfd3]')}`}>
                          {section.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={`p-4 border-t ${borderCol}`}>
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl ${isDark ? 'bg-[#201d16]' : 'bg-[#f5f1e8]'}`}>
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black ${isDark ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'bg-[#e5dfd3] text-[#7a602c]'}`}>
                  JD
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm leading-tight">جاسم جانس</p>
                  <p className={`text-[10px] ${textMuted}`}>المدير التنفيذي</p>
                </div>
              </div>
            ) : (
              <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center font-black ${isDark ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'bg-[#e5dfd3] text-[#7a602c]'}`}>
                JD
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => signOut({ callbackUrl: "/portal/login" })}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
              >
                <LogOutIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 transition-all duration-300 flex flex-col ${isSidebarOpen ? "mr-[280px]" : "mr-[80px]"}`}>
        
        {/* Top Header Row */}
        <header className={`h-24 sticky top-0 z-40 px-8 flex items-center justify-between ${bgMain}/90 backdrop-blur-xl border-b ${borderCol}`}>
          <div className="flex items-center gap-6 w-full max-w-3xl">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-xl transition-colors ${hoverBg}`}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Bar matching screenshot */}
            <div className={`flex-1 flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${isDark ? 'bg-[#1a1813] border-[#383325] text-white focus-within:border-[#c5a059]' : 'bg-[#e4dcc9] border-transparent focus-within:bg-white focus-within:border-[#c5a059] text-black shadow-inner'}`}>
              <Search className={`h-5 w-5 ${textMuted}`} />
              <input 
                type="text" 
                placeholder="ابحث من عملاء، حجوزات أو تقارير مالية..." 
                className="bg-transparent border-none focus:outline-none w-full font-bold text-sm"
              />
              <div className={`px-2 py-0.5 rounded text-[10px] font-black ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>⌘K</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-4">
            {/* Theme Toggle */}
            <div className={`flex items-center p-1 rounded-full border ${borderCol} ${isDark ? 'bg-[#1a1813]' : 'bg-white'}`}>
              <button onClick={() => setTheme(false)} className={`p-2 rounded-full transition-all ${!isDark ? 'bg-[#f4f2ee] text-[#c5a059] shadow-sm' : textMuted}`}>
                <Sun className="h-4 w-4" />
              </button>
              <button onClick={() => setTheme(true)} className={`p-2 rounded-full transition-all ${isDark ? 'bg-[#2a261c] text-[#c5a059] shadow-sm' : textMuted}`}>
                <Moon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Notifications */}
            <button className={`p-3 rounded-full border ${borderCol} ${isDark ? 'bg-[#1a1813] hover:bg-[#2a261c]' : 'bg-white hover:bg-[#f4f2ee]'} transition-all relative`}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white" />
            </button>
            
            {/* Settings */}
            <button className={`p-3 rounded-full border ${borderCol} ${isDark ? 'bg-[#1a1813] hover:bg-[#2a261c]' : 'bg-white hover:bg-[#f4f2ee]'} transition-all`}>
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="p-8 max-w-[1600px] w-full mx-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "dashboard" && <DashboardOverview isDark={isDark} />}
              {activeSection === "company" && <CompanySection isDark={isDark} />}
              {activeSection === "crm" && <CRMSection isDark={isDark} />}
              {activeSection === "bookings" && <BookingsSection isDark={isDark} />}
              {activeSection === "support_tickets" && <SupportTicketsSection isDark={isDark} />}
              {activeSection === "destinations" && <DestinationsSection isDark={isDark} />}
              {activeSection === "packages" && <PackagesSection isDark={isDark} />}
              {activeSection === "hotels" && <HotelsSection isDark={isDark} />}
              {activeSection === "visas" && <VisasSection isDark={isDark} />}
              {activeSection === "jobs" && <JobsSection isDark={isDark} />}
              {activeSection === "pricing" && <PricingSection isDark={isDark} />}
              {activeSection === "employees" && <EmployeesSection isDark={isDark} />}
              {activeSection === "branches" && <BranchesSection isDark={isDark} />}
              {activeSection === "cms" && <CMSSection isDark={isDark} />}
              {activeSection === "booking_portal_cms" && <BookingPortalCMSSection isDark={isDark} />}
              {activeSection === "audit_log" && <AuditLogSection isDark={isDark} />}
              {activeSection === "settings" && <SettingsSection isDark={isDark} />}
              {activeSection === "api_integrations" && <ApiIntegrationsSection isDark={isDark} />}
              {activeSection === "dynamic_db" && <DynamicDbSection isDark={isDark} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.6);
        }
      `}</style>
    </div>
  );
}

