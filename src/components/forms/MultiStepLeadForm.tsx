"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "alqadi_lead_draft";

type Step = 0 | 1 | 2;

export function MultiStepLeadForm() {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<"travel" | "manpower" | "other">(
    "travel",
  );
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, unknown>;
      if (typeof d.name === "string") setName(d.name);
      if (typeof d.email === "string") setEmail(d.email);
      if (typeof d.phone === "string") setPhone(d.phone);
      if (d.service === "travel" || d.service === "manpower" || d.service === "other")
        setService(d.service);
      if (typeof d.message === "string") setMessage(d.message);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ name, email, phone, service, message }),
        );
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [name, email, phone, service, message]);

  const submit = async () => {
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("service", service);
      fd.append("message", message);
      if (file) fd.append("file", file);

      const res = await fetch("/api/lead", { method: "POST", body: fd });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-xs text-muted">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={
              step === i
                ? "font-semibold text-gold-400"
                : step > i
                  ? "text-gold-500/70"
                  : "opacity-50"
            }
          >
            {i + 1}. {["بيانات", "الخدمة", "إرسال"][i]}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="s0"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="text-sm text-muted">
              الاسم
              <input
                className="mt-1 w-full rounded-xl border border-gold-500/25 bg-bg-deep/80 px-3 py-2 text-foreground outline-none focus:border-gold-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                suppressHydrationWarning
              />
            </label>
            <label className="text-sm text-muted">
              البريد
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-gold-500/25 bg-bg-deep/80 px-3 py-2 text-foreground outline-none focus:border-gold-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
              />
            </label>
            <label className="md:col-span-2 text-sm text-muted">
              الجوال
              <input
                className="mt-1 w-full rounded-xl border border-gold-500/25 bg-bg-deep/80 px-3 py-2 text-foreground outline-none focus:border-gold-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                suppressHydrationWarning
              />
            </label>
          </motion.div>
        ) : null}

        {step === 1 ? (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="space-y-4"
          >
            <label className="text-sm text-muted">
              نوع الخدمة
              <select
                className="mt-1 w-full rounded-xl border border-gold-500/25 bg-bg-deep/80 px-3 py-2 text-foreground outline-none focus:border-gold-400"
                value={service}
                onChange={(e) =>
                  setService(e.target.value as typeof service)
                }
              >
                <option value="travel">سفر وسياحة</option>
                <option value="manpower">أيادي عاملة</option>
                <option value="other">أخرى</option>
              </select>
            </label>
            <label className="text-sm text-muted">
              تفاصيل الطلب
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-xl border border-gold-500/25 bg-bg-deep/80 px-3 py-2 text-foreground outline-none focus:border-gold-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <label className="text-sm text-muted">
              مرفق (اختياري — سيتم فحص النوع والحجم على الخادم)
              <input
                type="file"
                className="mt-1 w-full text-sm text-muted file:me-3 file:rounded-lg file:border-0 file:bg-gold-500/20 file:px-3 file:py-2 file:text-foreground"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </motion.div>
        ) : null}

        {step === 2 ? (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-gold-500/20 bg-bg-deep/60 p-4 text-sm text-muted"
          >
            <p>مراجعة سريعة قبل الإرسال.</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>{name}</li>
              <li>{email}</li>
              <li>{service}</li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
            className="rounded-full border border-gold-500/40 px-5 py-2 text-sm text-foreground"
            suppressHydrationWarning
          >
            السابق
          </button>
        ) : null}
        {step < 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s < 2 ? ((s + 1) as Step) : s))}
            className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-bg-deep"
            suppressHydrationWarning
          >
            التالي
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={status === "sending"}
            className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-bg-deep disabled:opacity-50"
            suppressHydrationWarning
          >
            {status === "sending" ? "جاري الإرسال…" : "إرسال"}
          </button>
        )}
      </div>
      {status === "ok" ? (
        <p className="text-sm text-gold-400">تم استلام الطلب بنجاح.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-red-400">تعذر الإرسال. حاول لاحقاً.</p>
      ) : null}
    </div>
  );
}
