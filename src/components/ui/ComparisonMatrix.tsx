"use client";

import { motion } from "framer-motion";

const ROWS = [
  { feature: "حجوزات فندقية فاخرة", travel: "✓", manpower: "—" },
  { feature: "برامج عائلية مخصصة", travel: "✓", manpower: "—" },
  { feature: "تنسيق تأشيرات (حسب الوجهة)", travel: "✓", manpower: "حسب العقد" },
  { feature: "فرز وترشيح كوادر", travel: "—", manpower: "✓" },
  { feature: "عقود شفافة ومتابعة", travel: "—", manpower: "✓" },
];

export function ComparisonMatrix() {
  return (
    <div className="overflow-x-auto" data-reveal>
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gold-500/25 text-start text-gold-400">
            <th className="py-3 pr-4 font-semibold">الميزة</th>
            <th className="py-3 font-semibold">باقة السفر</th>
            <th className="py-3 font-semibold">باقة التوظيف</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <motion.tr
              key={row.feature}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-gold-500/10 text-muted"
            >
              <td className="py-3 pr-4 text-foreground/90">{row.feature}</td>
              <td className="py-3">{row.travel}</td>
              <td className="py-3">{row.manpower}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
