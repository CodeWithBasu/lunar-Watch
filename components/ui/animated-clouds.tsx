"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedClouds = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cloud 1 - Top, slow */}
      <motion.div
        className="absolute top-[10%] opacity-40"
        initial={{ x: "-150%" }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <CloudIcon className="w-64 h-auto text-slate-100" />
      </motion.div>

      {/* Cloud 2 - Middle, faster, delayed */}
      <motion.div
        className="absolute top-[35%] opacity-30"
        initial={{ x: "-150%" }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
          delay: 15,
        }}
      >
        <CloudIcon className="w-80 h-auto text-slate-100/80" />
      </motion.div>

      {/* Cloud 3 - Lower, very slow */}
      <motion.div
        className="absolute top-[65%] opacity-50"
        initial={{ x: "-150%" }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
      >
        <CloudIcon className="w-56 h-auto text-slate-100" />
      </motion.div>
    </div>
  );
};

const CloudIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.5 19c2.76 0 5-2.24 5-5s-2.24-5-5-5c-.21 0-.42.02-.62.05C16.23 5.43 13.84 3 11 3 7.69 3 5 5.69 5 9c0 .16.01.32.03.47C2.22 9.94 0 12.18 0 15c0 3.31 2.69 6 6 6h11.5z" />
  </svg>
);
