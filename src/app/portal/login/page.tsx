"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, MapPin, Clock, Building2, Plane, AlertCircle } from "lucide-react";

// Same storage key used by the admin panel
const STORAGE_KEY = "alqadi_admin_content";
const SESSION_KEY = "alqadi_portal_session";

type Employee = {
  name: string;
  username: string;
  password: string;
  phone: string;
  role: string;
  branch: string;
  shift: string;
  active: boolean;
};

async function loadEmployees(): Promise<Employee[]> {
  try {
    const res = await fetch("/api/admin/content");
    if (res.ok) {
      const data = await res.json();
      return data.employees ?? [];
    }
  } catch { /* ignore */ }
  // Fallback defaults — passwords are masked; real auth should come from the API/DB
  return [
    { name: "أحمد القاضي", username: "ahmed.alqadi", password: "", phone: "", role: "supervisor", branch: "hq", shift: "morning", active: true },
    { name: "محمد علي", username: "mohammed.ali", password: "", phone: "", role: "booking", branch: "sanaa", shift: "morning", active: true },
    { name: "عبدالله سعيد", username: "abdallah.saeed", password: "", phone: "", role: "booking", branch: "sanafer", shift: "evening", active: true },
  ];
}

const BRANCHES: Record<string, string> = {
  hq: "الإدارة العامة",
  sanaa: "فرع صنعاء",
  sanafer: "عدن - السنافر",
  mansoura: "عدن - المنصورة (فلاي مي)",
  khormaksar: "عدن - خور مكسر",
};

export default function PortalLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [shift, setShift] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(async () => {
      const employees = await loadEmployees();

      // Find employee by username (case-insensitive)
      const emp = employees.find(
        (e) => e.username?.toLowerCase() === username.trim().toLowerCase()
      );

      if (!emp) {
        setError("اسم المستخدم غير موجود في النظام.");
        setIsLoading(false);
        return;
      }

      if (!emp.active) {
        setError("هذا الحساب موقوف. تواصل مع مدير النظام.");
        setIsLoading(false);
        return;
      }

      if (emp.password !== password) {
        setError("كلمة المرور غير صحيحة.");
        setIsLoading(false);
        return;
      }

      // Save session to localStorage
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          name: emp.name,
          username: emp.username,
          role: emp.role,
          branch: branch || emp.branch,
          shift: shift || emp.shift,
          workLocation,
          loginTime: new Date().toISOString(),
        }));
      } catch { /* ignore */ }

      // Route based on role
      if (emp.role === "supervisor") {
        router.push("/portal/dashboard");
      } else {
        router.push("/portal/workspace");
      }
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/portal-bg.jpg')" }}
      />
      <div className="absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="z-10 w-full max-w-md p-6 sm:p-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Plane className="h-8 w-8 text-gold-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">بوابة الموظفين</h1>
            <p className="mt-2 text-sm text-slate-300">مجموعة القاضي الذهبية للسفريات</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Username */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                suppressHydrationWarning
                value={username}
                onChange={e => { setUsername(e.target.value); setError(null); }}
                placeholder="اسم المستخدم (Username)"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 font-mono text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-gold-500/50 focus:bg-white/10 focus:ring-1 focus:ring-gold-500/50"
                dir="ltr"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                required
                suppressHydrationWarning
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                placeholder="كلمة المرور"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 font-mono text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-gold-500/50 focus:bg-white/10 focus:ring-1 focus:ring-gold-500/50"
                dir="ltr"
                autoComplete="current-password"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Branch */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  suppressHydrationWarning
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-4 pr-10 text-xs text-white outline-none transition-all focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                  dir="rtl"
                >
                  <option value="" disabled>الفرع...</option>
                  {Object.entries(BRANCHES).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Shift */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  suppressHydrationWarning
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-4 pr-10 text-xs text-white outline-none transition-all focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                  dir="rtl"
                >
                  <option value="" disabled>الشفت...</option>
                  <option value="morning">صباحي</option>
                  <option value="evening">مسائي</option>
                  <option value="night">ليلي</option>
                </select>
              </div>
            </div>

            {/* Work Location */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <select
                suppressHydrationWarning
                value={workLocation}
                onChange={e => setWorkLocation(e.target.value)}
                required
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-4 pr-10 text-sm text-white outline-none transition-all focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                dir="rtl"
              >
                <option value="" disabled>مكان العمل الحالي...</option>
                <option value="office">من المكتب (On-site)</option>
                <option value="home">من المنزل (Remote)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 py-3 text-sm font-bold text-slate-900 transition-all hover:from-gold-500 hover:to-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري التحقق...
                </span>
              ) : "تسجيل الدخول"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <p className="flex items-center justify-center gap-1 text-[10px] text-white/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              هذا النظام مراقب ويتم مزامنة البيانات تلقائياً مع السحابة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
