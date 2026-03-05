'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, ShieldCheck } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export default function AppBreadcrumb() {
    const pathname = usePathname();
    const router = useRouter();
    
   

    const segments = pathname.split('/').filter(Boolean);
    
    // Don't render on the root dashboard/home page if preferred
    if (segments.length === 0 || pathname === '/dashboard') return null;

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = decodeURIComponent(segment).replace(/-/g, ' ');
        return { label, href };
    });

    return (
        <div className='mx-6 my-5'>
            <div className="container mx-auto flex items-center gap-3">
                
                {/* --- Actionable Back Button --- */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95 group"
                    title="Go Back"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1 hidden xs:block" />

                <Breadcrumb>
                    <BreadcrumbList className="flex items-center gap-1.5 sm:gap-2">
                        {/* Root / Home */}
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link 
                                    href="/dashboard" 
                                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline-block">
                                        Bharat
                                    </span>
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            
                            return (
                                <React.Fragment key={crumb.href}>
                                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full border border-slate-800 shadow-lg shadow-slate-200/50">
                                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                                <span className="text-[10px] font-black uppercase  whitespace-nowrap">
                                                  {formatLabel(crumb.label)}
                                                </span>
                                            </div>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link 
                                                    href={crumb.href}
                                                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase  whitespace-nowrap"
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
        </div>
    );
}

/**
 * Handles specialized Indian branding and acronyms
 */
function formatLabel(str: string): string {
    if (!str) return '';
    const upperCaseWords = ['kyc', 'mlm', 'pan', 'bv', 'upi', 'id', 'ifsc'];
    return str.split(' ').map(word => 
        upperCaseWords.includes(word.toLowerCase()) 
            ? word.toUpperCase() 
            : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}