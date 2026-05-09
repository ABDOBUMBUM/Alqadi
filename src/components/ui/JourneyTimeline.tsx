"use client";

import { motion } from "framer-motion";

const STEPS = [
  { title: "استكشاف", desc: "تحديد الوجهة أو نوع الكادر المطلوب." },
  { title: "تصميم", desc: "عرض سعر وخطة زمنية واضحة." },
  { title: "تنفيذ", desc: "حجوزات، عقود، ومتابعة لحظية." },
  { title: "رعاية", desc: "دعم أثناء الرحلة أو فترة التعاقد." },
];

export function JourneyTimeline() {
  return (
    <ol className="relative space-y-8 border-s border-gold-500/25 ps-8" data-reveal>
      {STEPS.map((s, i) => (
        <motion.li
          key={s.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="relative"
        >
          <span className="absolute -start-[9px] top-1 h-3 w-3 rounded-full bg-gold-500 shadow-[0_0_12px_var(--gold-glow)]" />
          <h3 className="text-lg font-semibold text-gold-400">{s.title}</h3>
          <p className="mt-1 text-sm text-muted">{s.desc}</p>
        </motion.li>
      ))}
    </ol>
  );
}
