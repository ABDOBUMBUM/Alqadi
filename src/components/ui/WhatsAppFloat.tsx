"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { useSiteContent } from "@/hooks/useSiteContent";

export function WhatsAppFloat() {
  const { content } = useSiteContent();
  const WHATSAPP_NUMBER = content?.company?.whatsapp || "96598765432";
  const MESSAGE =
    content?.cms_home?.whatsappMessage ||
    "مرحباً مجموعة القاضي، أود الاستفسار عن باقات السفر.";
  
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="backdrop-blur-md border text-xs px-4 py-2 rounded-2xl shadow-xl pointer-events-auto origin-bottom-right"
        style={{
          background: "color-mix(in oklab, var(--page-bg) 75%, black 25%)",
          borderColor: "var(--page-border-subtle)",
          color: "var(--page-text)",
        }}
      >
        {content?.cms_home?.whatsappHint || "كيف يمكننا مساعدتك اليوم؟"}
      </motion.div>
      
      <MagneticButton>
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="pointer-events-auto bg-[#25D366] hover:bg-[#20b858] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all flex items-center justify-center hover:scale-110"
          aria-label="تواصل معنا عبر واتساب"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </MagneticButton>
    </div>
  );
}
