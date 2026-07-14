"use client";

import { AnimatePresence, motion } from "framer-motion";

interface AppLoaderProps  {
  isPending: boolean;
  brandName?: string;
  logoSrc?: string;
  message?: string;
}

export default function AppLoader({
  isPending,
  brandName = "Amaze Ayurveda",
  logoSrc = "/amaze-logo.png",
  message = "Preparing your workspace",
}: AppLoaderProps) {
  return (
    <AnimatePresence>
      {!isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/30 backdrop-blur-md"
        >
          <div className="flex flex-col items-center">
            {/* Logo */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm"
            >
              <img
                src={logoSrc}
                alt={brandName}
                className="h-9 w-9 object-contain"
              />
            </motion.div>

            {/* Brand */}
            <p className="mt-5 text-sm font-semibold text-zinc-900">
              {brandName}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{message}</p>

            {/* Loading Dots */}
            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-emerald-500"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
