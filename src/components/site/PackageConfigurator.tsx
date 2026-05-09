"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Plane, Calculator } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const DESTINATIONS = [
  { id: "eu", name: "أوروبا (لندن، باريس، ميونخ)", basePrice: 200 },
  { id: "tr", name: "تركيا (اسطنبول، طرابزون)", basePrice: 120 },
  { id: "ae", name: "الإمارات (دبي، أبوظبي)", basePrice: 80 },
  { id: "mv", name: "المالديف", basePrice: 350 },
];

const FLIGHT_CLASSES = [
  { id: "eco", name: "سياحية", multiplier: 1 },
  { id: "bus", name: "درجة الأعمال", multiplier: 2.5 },
  { id: "fst", name: "الدرجة الأولى", multiplier: 4 },
];

import { useCurrency } from "@/context/CurrencyContext";

export function PackageConfigurator() {
  const { currency, formatPrice } = useCurrency();
  const [dest, setDest] = useState(DESTINATIONS[0]);
  const [duration, setDuration] = useState(5);
  const [people, setPeople] = useState(2);
  const [flightClass, setFlightClass] = useState(FLIGHT_CLASSES[0]);

  // Pricing Logic (Mock)
  const hotelPerNight = dest.basePrice * 0.4;
  const flightCost = dest.basePrice * flightClass.multiplier * people;
  const totalCost = flightCost + (hotelPerNight * duration * people);

  return (
    <div
      className="border border-gold-500/20 rounded-3xl p-6 md:p-10 backdrop-blur-xl relative overflow-hidden"
      style={{ background: "var(--page-surface)", color: "var(--page-text)" }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gold-500/10 rounded-xl text-gold-400">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>
            حاسبة الباقات التفاعلية
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--page-text-muted)" }}>
            صمم باقتك وشاهد التكلفة التقديرية فوراً
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Destination */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-gold-300 font-medium">
                <MapPin className="w-4 h-4" /> الوجهة
              </label>
              <select 
                suppressHydrationWarning
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-colors"
                style={{ background: "var(--input-bg)", color: "var(--page-text)", borderColor: "var(--page-border-subtle)" }}
                value={dest.id}
                onChange={(e) => setDest(DESTINATIONS.find(d => d.id === e.target.value) || DESTINATIONS[0])}
              >
                {DESTINATIONS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Flight Class */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-gold-300 font-medium">
                <Plane className="w-4 h-4" /> درجة الطيران
              </label>
              <select 
                suppressHydrationWarning
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-colors"
                style={{ background: "var(--input-bg)", color: "var(--page-text)", borderColor: "var(--page-border-subtle)" }}
                value={flightClass.id}
                onChange={(e) => setFlightClass(FLIGHT_CLASSES.find(c => c.id === e.target.value) || FLIGHT_CLASSES[0])}
              >
                {FLIGHT_CLASSES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm text-gold-300 font-medium">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> مدة الرحلة</span>
                <span style={{ color: "var(--page-text)" }}>{duration} أيام</span>
              </label>
              <input 
                type="range" min="3" max="30" 
                value={duration} 
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full accent-gold-500"
              />
            </div>

            {/* People */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm text-gold-300 font-medium">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> عدد الأشخاص</span>
                <span style={{ color: "var(--page-text)" }}>{people} أشخاص</span>
              </label>
              <input 
                type="range" min="1" max="10" 
                value={people} 
                onChange={(e) => setPeople(parseInt(e.target.value))}
                className="w-full accent-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="md:col-span-4">
          <div
            className="border border-gold-500/30 rounded-2xl p-6 h-full flex flex-col justify-center text-center"
            style={{
              background: "linear-gradient(135deg, rgba(201,162,39,0.10) 0%, var(--page-surface) 70%)",
              color: "var(--page-text)",
            }}
          >
            <p className="text-sm mb-2" style={{ color: "var(--page-text-muted)" }}>
              التكلفة التقديرية الإجمالية
            </p>
            
            <div className="h-20 flex items-center justify-center overflow-hidden" dir="ltr">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={totalCost}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600"
                >
                  {formatPrice(totalCost)}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-gold-400 text-sm font-bold mb-6">({currency.nameAr})</p>
            
            <ul
              className="text-right text-xs space-y-2 mb-6 border-t pt-4"
              style={{ color: "var(--page-text-muted)", borderColor: "var(--page-border-subtle)" }}
            >
              <li className="flex justify-between"><span>الطيران:</span> <span dir="ltr">{formatPrice(flightCost)}</span></li>
              <li className="flex justify-between"><span>الفندق والخدمات:</span> <span dir="ltr">{formatPrice(totalCost - flightCost)}</span></li>
            </ul>

            <MagneticButton>
              <a 
                suppressHydrationWarning 
                href={`https://api.whatsapp.com/send?phone=96598765432&text=${encodeURIComponent(`مرحباً، أود حجز الباقة التفاعلية التالية:\n\nالوجهة: ${dest.name}\nدرجة الطيران: ${flightClass.name}\nالمدة: ${duration} أيام\nعدد الأشخاص: ${people} أشخاص\n\n*التكلفة التقديرية الإجمالية:* ${formatPrice(totalCost)} ${currency.nameAr}\n\nأرجو المتابعة لإتمام الحجز.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center items-center bg-gold-500 text-black font-bold rounded-xl py-3 hover:bg-gold-400 transition-colors"
              >
                متابعة الحجز
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
