"use client";

import { motion } from "framer-motion";

export const AnimatedLogo = () => {
  return (
    <div className="relative flex items-center justify-center w-12 h-12 mx-auto mb-4">
      {/* Outer Glow */}
      <motion.div
        className="absolute w-full h-full rounded-full bg-yellow-400/20 dark:bg-yellow-200/10 blur-md"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Moon Base */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Full Dark Moon */}
        <circle cx="50" cy="50" r="40" className="fill-neutral-200 dark:fill-neutral-900" />
        
        {/* Animated Crescent / Phase */}
        <motion.path
          d="M50 10 A40 40 0 1 0 50 90 A25 40 0 1 1 50 10 Z"
          className="fill-yellow-400 dark:fill-yellow-500"
          initial={{ d: "M50 10 A40 40 0 1 0 50 90 A40 40 0 1 1 50 10 Z" }} // Full Moon
          animate={{
            d: [
              "M50 10 A40 40 0 1 0 50 90 A40 40 0 1 1 50 10 Z", // Full
              "M50 10 A40 40 0 1 0 50 90 A15 40 0 1 1 50 10 Z", // Gibbous
              "M50 10 A40 40 0 1 0 50 90 A0 40 0 1 1 50 10 Z",  // Quarter
              "M50 10 A40 40 0 1 0 50 90 A-25 40 0 1 1 50 10 Z",// Crescent
              "M50 10 A40 40 0 1 0 50 90 A-40 40 0 1 0 50 10 Z",// New Moon (Dark)
              "M50 10 A40 40 0 1 0 50 90 A-25 40 0 1 0 50 10 Z",// Crescent (Waxing)
              "M50 10 A40 40 0 1 0 50 90 A0 40 0 1 0 50 10 Z",  // Quarter
              "M50 10 A40 40 0 1 0 50 90 A40 40 0 1 1 50 10 Z", // Full
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
      
      {/* Orbiting Star */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute top-0 left-[10%] w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_5px_white]" />
      </motion.div>
    </div>
  );
};
