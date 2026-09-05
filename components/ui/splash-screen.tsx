"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Aesthetic Minimalist Moon Animation */}
          <motion.div
            className="relative w-32 h-32"
            initial={{ scale: 0.9, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Deep Glowing Aura */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/5 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Elegant Crescent */}
            <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {/* Dark base to block out aura if needed */}
              <circle cx="50" cy="50" r="40" className="fill-black" />
              
              <motion.path
                d="M50 10 A40 40 0 1 0 50 90 A25 40 0 1 1 50 10 Z"
                className="fill-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              
              {/* Subtle orbiting light particle */}
              <motion.circle
                cx="50"
                cy="10"
                r="1.5"
                className="fill-white drop-shadow-[0_0_5px_white]"
                animate={{
                  transformOrigin: "50px 50px",
                  rotate: 360
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </svg>
          </motion.div>

          {/* Elegant Typography */}
          <div className="mt-12 overflow-hidden">
            <motion.h1
              className="text-2xl font-mono tracking-[0.4em] text-white/90 uppercase font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            >
              Lunar
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
