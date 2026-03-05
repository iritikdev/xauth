'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Leaf } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

function AppBreadcrumb() {
    const pathname = usePathname();
    
    // Generate segments and filter out empty strings
    const segments = pathname.split('/').filter(Boolean);
    
    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        // Handle URL encoding and remove hyphens
        const label = decodeURIComponent(segment).replace(/-/g, ' ');
        return { label, href };
    });

    return (
        <Breadcrumb className="mb-8 px-4 py-2 bg-white/40 backdrop-blur-md border border-slate-200/50 rounded-2xl w-fit shadow-sm">
            <BreadcrumbList className="flex items-center gap-2">
                {/* Home Item with Icon */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link 
                            href="/" 
                            className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors duration-200 group"
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
                                Bharat
                            </span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    
                    return (
                        <React.Fragment key={crumb.href}>
                            <BreadcrumbSeparator className="text-slate-300">
                                <ChevronRight className="w-4 h-4" />
                            </BreadcrumbSeparator>
                            
                            <BreadcrumbItem>
                                {isLast ? (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100/50">
                                        <Leaf className="w-3 h-3 text-emerald-600" />
                                        <span className="text-xs font-black text-emerald-700 uppercase tracking-tighter">
                                            {formatLabel(crumb.label)}
                                        </span>
                                    </div>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link 
                                            href={crumb.href}
                                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
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
    );
}

/**
 * Enhanced formatter for Swadeshi branding
 * Capitalizes first letter and handles specific brand casing
 */
function formatLabel(str: string): string {
    if (!str) return '';
    // Custom handling for acronyms like KYC or MLM
    const upperCaseWords = ['kyc', 'mlm', 'id', 'ifsc'];
    
    return str
        .split(' ')
        .map(word => 
            upperCaseWords.includes(word.toLowerCase()) 
                ? word.toUpperCase() 
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(' ');
}

export default AppBreadcrumb;