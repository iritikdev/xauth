"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  
  // useSpring makes the bar movement feel smooth and "organic" 
  // rather than a robotic linear movement.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};