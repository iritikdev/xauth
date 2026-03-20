'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid, Leaf } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/* ── Label formatter ── */
function formatLabel(str: string): string {
  if (!str) return '';
  const upper = ['kyc', 'mlm', 'pan', 'bv', 'upi', 'id', 'ifsc', 'gst', 'tds'];
  return str.split(' ').map(w =>
    upper.includes(w.toLowerCase())
      ? w.toUpperCase()
      : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const router   = useRouter();

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0 || pathname === '/dashboard') return null;

  const crumbs = segments.map((seg, i) => ({
    label: formatLabel(decodeURIComponent(seg).replace(/-/g, ' ')),
    href:  '/' + segments.slice(0, i + 1).join('/'),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-[25]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Glass bar */}
      <div className="bg-[#f5f0e8]/80 backdrop-blur-xl border-b border-[#1c3320]/8 shadow-[0_1px_0_rgba(28,50,32,0.05)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between gap-4">

          {/* ── Left: back + crumbs ── */}
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">

            {/* Back button */}
            <button
              onClick={() => router.back()}
              title="Go back"
              className="group flex-shrink-0 h-7 w-7 rounded-lg border border-[#1c3320]/10 bg-white/70 hover:bg-[#1c3320] text-[#1c3320]/40 hover:text-white hover:border-[#1c3320] transition-all duration-200 active:scale-90 flex items-center justify-center shadow-[0_1px_4px_rgba(28,50,32,0.07)]"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>

            {/* Hairline divider */}
            <div className="h-4 w-px bg-[#1c3320]/10 flex-shrink-0" />

            {/* Crumb trail */}
            <nav className="flex items-center gap-0.5 overflow-hidden min-w-0" aria-label="Breadcrumb">
              <ol className="flex items-center flex-nowrap whitespace-nowrap gap-0.5 overflow-hidden">

                {/* Root — Amaze Portal */}
                <li className="flex-shrink-0">
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[#1c3320]/35 hover:text-[#1c3320] hover:bg-[#1c3320]/4 transition-all duration-150"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:inline">
                      Dashboard
                    </span>
                  </Link>
                </li>

                {crumbs.map((crumb, i) => {
                  const isLast = i === crumbs.length - 1;

                  return (
                    <React.Fragment key={crumb.href}>
                      {/* Separator */}
                      <li className="flex-shrink-0" aria-hidden>
                        <ChevronRight className="w-3 h-3 text-[#1c3320]/20 mx-0.5" />
                      </li>

                      <li className={cn("flex-shrink-0", isLast && "min-w-0 overflow-hidden")}>
                        {isLast ? (
                          /* Active crumb */
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1c3320] text-[#e8a020] max-w-[140px] sm:max-w-[220px] overflow-hidden">
                            <Leaf className="w-2.5 h-2.5 fill-[#e8a020] flex-shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] truncate">
                              {crumb.label}
                            </span>
                          </span>
                        ) : (
                          /* Ancestor crumb */
                          <Link
                            href={crumb.href}
                            className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] text-[#1c3320]/40 hover:text-[#1c3320] hover:bg-[#1c3320]/4 transition-all duration-150"
                          >
                            {crumb.label}
                          </Link>
                        )}
                      </li>
                    </React.Fragment>
                  );
                })}
              </ol>
            </nav>
          </div>

          {/* ── Right: live status pill ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 bg-white/60 border border-[#1c3320]/8 px-3 py-1.5 rounded-full shadow-[0_1px_4px_rgba(28,50,32,0.05)]">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#1c3320]/30">
              System Live
            </span>
          </div>

        </div>
      </div>

      {/* Saffron-to-transparent hairline under the bar */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e8a020]/20 to-transparent pointer-events-none" />
    </motion.div>
  );
}