"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSiteExperience } from "@/context/SiteExperienceContext";

/**
 * Premium Preloader — Crown animation with gold bar fill
 * Matches the reference alqadi_website.html preloader pattern
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const { colorMode } = useSiteExperience();

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: colorMode === "light" ? "#ffffff" : "#050505",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 18px 60px rgba(201,162,39,0.18))" }}
          >
            <Image
              src="/brand/alqadi-logo.png"
              alt="مجموعة القاضي الذهبية للسفريات والسياحة"
              width={220}
              height={220}
              priority
            />
          </motion.div>

          {/* Brand text */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              fontFamily: "var(--font-cairo), system-ui, sans-serif",
              color: "var(--gold-500)",
              letterSpacing: "0.08em",
              fontSize: 14,
              marginTop: 20,
            }}
          >
            مجموعة القاضي الذهبية للسفريات والسياحة
          </motion.div>

          {/* Loading bar */}
          <div
            style={{
              width: 200,
              height: 1,
              background: "rgba(201,168,76,0.2)",
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              style={{
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, #C9A84C, transparent)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
