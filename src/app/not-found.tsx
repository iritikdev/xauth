"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50/50 px-6 dark:bg-black overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <div className="h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="text-center max-w-xl">
        {/* Animated 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[150px] font-black leading-none tracking-tighter text-slate-200 dark:text-slate-800"
        >
          404
        </motion.h1>

        {/* Floating Icon Container */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative -mt-16 mb-8 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
        >
          <Search size={40} className="text-emerald-600" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Lost in the <span className="text-emerald-600">Herbal Garden?</span>
          </h2>
          <p className="text-slate-500 text-lg">
            The page you are looking for has been moved, deleted, or never existed in the first place. Don't worry, we'll help you find your way back.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="h-14 w-full sm:w-auto rounded-2xl border-2 border-slate-200 bg-white px-8 font-bold hover:bg-slate-50 dark:bg-transparent dark:border-slate-800 sm:min-w-[160px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>

          <Button
            asChild
            className="h-14 w-full sm:w-auto rounded-2xl bg-[#0f172a] px-8 font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-600 active:scale-95 sm:min-w-[180px]"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Take Me Home
            </Link>
          </Button>
        </motion.div>

        {/* Support Link */}
        <p className="mt-12 text-sm text-slate-400">
          Think this is a mistake?{" "}
          <Link href="/contact" className="font-bold text-emerald-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}