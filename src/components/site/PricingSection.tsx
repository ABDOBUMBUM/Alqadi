"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const packages = [
  {
    name: "الباقة الأساسية",
    price: "150",
    desc: "للمسافرين الباحثين عن الاقتصاد والراحة السريعة.",
    features: [
      "حجز تذاكر طيران اقتصادية",
      "المساعدة في استخراج التأشيرة",
      "دعم العملاء خلال أوقات العمل",
    ],
    popular: false,
  },
  {
    name: "الباقة الذهبية",
    price: "350",
    desc: "تجربة سفر متكاملة توفر لك أقصى درجات الراحة.",
    features: [
      "حجز طيران على درجة الأعمال",
      "استقبال وتوديع في المطار",
      "حجز فنادق 5 نجوم",
      "دعم مخصص على مدار 24/7",
    ],
    popular: true,
  },
  {
    name: "باقة النخبة (VIP)",
    price: "850",
    desc: "للباحثين عن الرفاهية المطلقة والخصوصية التامة.",
    features: [
      "حجز طيران درجة أولى / طيران خاص",
      "خدمة الكونسيرج الشخصي الفاخرة",
      "سيارة مع سائق خاص طوال الرحلة",
      "إدارة شاملة لبرنامج الرحلة",
      "تأمين سفر لكبار الشخصيات",
    ],
    popular: false,
  },
];

import { useCurrency } from "@/context/CurrencyContext";
import { useState, useEffect } from "react";

export function PricingSection() {
  const { formatPrice } = useCurrency();
  const [waPhone, setWaPhone] = useState("96598765432");

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.company?.whatsapp) setWaPhone(String(data.company.whatsapp));
      })
      .catch(() => {});
  }, []);
  return (
    <section
      id="pricing"
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--section-alt-bg)", color: "var(--page-text)" }}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, #C9A84C 0%, transparent 70%)" }} />
      
      <div className="mx-auto max-w-7xl px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.35em] text-gold-400 mb-3">EXCLUSIVE PACKAGES</p>
          <h2 className="text-3xl font-black md:text-5xl" style={{ color: "var(--page-text)" }}>
            باقات السفر والخدمات
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "var(--page-text-muted)" }}>
            اختر الباقة التي تتناسب مع احتياجاتك. نقدم أسعاراً تنافسية مع أعلى معايير الجودة والرفاهية.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
            {packages.map((pkg, idx) => {
            const formattedPrice = formatPrice(Number(pkg.price));
            return (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className={`relative rounded-3xl border ${
                pkg.popular
                  ? "border-gold-500/50 shadow-[0_0_40px_rgba(201,168,76,0.15)] md:-translate-y-4"
                  : ""
              } p-8 backdrop-blur-md`}
              style={{
                borderColor: pkg.popular ? "rgba(201,162,39,0.45)" : "var(--page-border-subtle)",
                background: pkg.popular
                  ? "linear-gradient(180deg, rgba(201,162,39,0.10) 0%, var(--page-surface) 65%, var(--page-surface) 100%)"
                  : "var(--page-surface)",
              }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-600 to-gold-400 text-black text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-black" /> الأكثر طلباً
                </div>
              )}

              <h3 className="text-xl font-bold text-center mb-2" style={{ color: "var(--page-text)" }}>
                {pkg.name}
              </h3>
              <p className="text-center text-sm h-10 mb-6" style={{ color: "var(--page-text-muted)" }}>
                {pkg.desc}
              </p>
              
              <div className="text-center mb-8 flex justify-center items-end gap-1" dir="ltr">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">
                  {formattedPrice}
                </span>
                <span className="text-sm mb-2 mr-2" dir="rtl" style={{ color: "var(--page-text-dim)" }}>
                  ابتداءً من
                </span>
              </div>

              <div className="space-y-4 mb-10">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-gold-500/20 p-1 shrink-0">
                      <Check className="w-3 h-3 text-gold-400" />
                    </div>
                    <span className="text-sm" style={{ color: "var(--page-text-muted)" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 flex justify-center">
                <MagneticButton>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(
                      `مرحباً، أود الاستفسار عن باقة: ${pkg.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 rounded-full font-bold text-center transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]"
                        : "hover:bg-gold-500/10"
                    }`}
                    style={
                      pkg.popular
                        ? undefined
                        : {
                            background: "var(--page-surface)",
                            color: "var(--page-text)",
                            border: "1px solid var(--page-border-subtle)",
                          }
                    }
                  >
                    طلب الباقة
                  </a>
                </MagneticButton>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
