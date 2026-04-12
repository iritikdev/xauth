"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Smooth path animation for the circle
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      // 300px scroll hone par dikhao
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // ✅ Native smooth scroll
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-10 right-10 z-[999]"
        >
          <button
            onClick={scrollToTop}
            className={cn(
              "relative h-14 w-14 rounded-full flex items-center justify-center",
              "bg-[#1c3320] text-[#e8a020] shadow-2xl shadow-emerald-950/20",
              "hover:scale-110 active:scale-90 transition-transform duration-300 group"
            )}
          >
            {/* --- Circular Progress SVG --- */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="4"
              />
              {/* Dynamic Animated Path */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e8a020" // Gold Progress
                strokeWidth="4"
                strokeDasharray="283" // 2 * PI * R (approx)
                style={{ pathLength: scrollYProgress }}
                strokeLinecap="round"
              />
            </svg>

            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}