'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, ShieldCheck, LayoutGrid } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AppBreadcrumb() {
    const pathname = usePathname();
    const router = useRouter();

    const segments = pathname.split('/').filter(Boolean);
    
    // Dashboard root par breadcrumb hide karna hi better hai clean look ke liye
    if (segments.length === 0 || pathname === '/dashboard') return null;

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = decodeURIComponent(segment).replace(/-/g, ' ');
        return { label, href };
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='sticky top-0 z-[25] px-4 md:px-8 py-3 bg-white/60 backdrop-blur-md border-b border-slate-100/50'
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    {/* --- Navigation Back --- */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center h-8 w-8 md:h-9 md:w-9 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-90 group"
                        title="Back"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="h-4 w-px bg-slate-200 hidden xs:block" />

                    {/* --- Breadcrumb List --- */}
                    <Breadcrumb className="overflow-hidden">
                        <BreadcrumbList className="flex items-center flex-nowrap whitespace-nowrap gap-1">
                            {/* Home Segment */}
                            <BreadcrumbItem className="shrink-0">
                                <BreadcrumbLink asChild>
                                    <Link 
                                        href="/dashboard" 
                                        className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors group"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline-block">
                                            Amaze Portal
                                        </span>
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            {breadcrumbs.map((crumb, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                
                                return (
                                    <React.Fragment key={crumb.href}>
                                        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 mx-0.5" />
                                        <BreadcrumbItem className={cn(isLast ? "min-w-0 overflow-hidden" : "shrink-0")}>
                                            {isLast ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/20">
                                                    <ShieldCheck className="w-3 h-3 shrink-0" />
                                                    <span className="text-[10px] font-black uppercase truncate max-w-[120px] md:max-w-none">
                                                        {formatLabel(crumb.label)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link 
                                                        href={crumb.href}
                                                        className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-tight"
                                                    >
                                                        {formatLabel(crumb.label)}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* --- Quick Status (Optional Branding) --- */}
                <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Live</span>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Enhanced Formatting for Indian Context
 */
function formatLabel(str: string): string {
    if (!str) return '';
    const upperCaseWords = ['kyc', 'mlm', 'pan', 'bv', 'upi', 'id', 'ifsc', 'gst', 'tds'];
    return str.split(' ').map(word => 
        upperCaseWords.includes(word.toLowerCase()) 
            ? word.toUpperCase() 
            : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}