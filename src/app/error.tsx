"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or Logtail
    console.error("System Crash:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-slate-950">
      <div className="text-center max-w-lg">
        {/* Animated Error Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/20"
        >
          <AlertCircle size={40} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            System <span className="text-red-600">Interruption</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Something went wrong while processing this request. This might be a temporary connection issue or a server-side glitch.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            className="h-14 w-full sm:w-auto rounded-2xl bg-emerald-600 px-8 font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-700 active:scale-95"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>

          <Button
            variant="outline"
            asChild
            className="h-14 w-full sm:w-auto rounded-2xl border-2 border-slate-200 px-8 font-bold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Go to Home
            </Link>
          </Button>
        </div>

        {/* Error Code/Digest (Useful for support) */}
        {error.digest && (
          <p className="mt-12 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}