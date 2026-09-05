"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type HorizontalThemeWipeToggleProps = {
  className?: string;
  direction?: "left" | "right";
};

export const HorizontalThemeWipeToggle = ({
  className,
  direction = "left",
}: HorizontalThemeWipeToggleProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    const syncTheme = () =>
      setDarkMode(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    if (!document.startViewTransition) {
        const toggled = !darkMode;
        setDarkMode(toggled);
        document.documentElement.classList.toggle("dark", toggled);
        localStorage.setItem("theme", toggled ? "dark" : "light");
        return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        const toggled = !darkMode;
        setDarkMode(toggled);
        document.documentElement.classList.toggle("dark", toggled);
        localStorage.setItem("theme", toggled ? "dark" : "light");
      });
    }).ready;

    if (direction === "left") {
      document.documentElement.animate(
        {
          clipPath: [
            "inset(0 100% 0 0)",
            "inset(0 0 0 0)",
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    } else if (direction === "right") {
      document.documentElement.animate(
        {
          clipPath: [
            "inset(0 0 0 100%)",
            "inset(0 0 0 0)",
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }
  }, [darkMode, direction]);

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label="Switch theme"
      className={cn(
        "flex items-center justify-center p-2 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer",
        className,
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-white"
          >
            <Sun />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-black dark:text-white"
          >
            <Moon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
