"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {/* 
        This is an Awwwards-style page transition. 
        It will run every time the route changes in the App Router.
      */}
      {children}
    </motion.div>
  );
}
