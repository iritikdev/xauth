"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: ReactNode;
  showBackButton?: boolean; // New prop
}

export function PageHeader({
  title,
  highlight,
  description,
  buttonText,
  buttonLink,
  subtitle,
  icon,
  showBackButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      {/* Left Content */}
      <div className="flex items-start gap-4 max-w-2xl">
        {/* Back Button Implementation */}
        {showBackButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mt-1 h-10 w-10 shrink-0 rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        )}
        <div className="">
          
          <div className="space-y-1.5">
            {subtitle && (
              <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600/80">
                  {subtitle}
                </span>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-[1.1] ">
              {title}{" "}
              {highlight && (
                <span className="text-emerald-600 not-italic">{highlight} </span>
              )}
            </h1>
            {description && (
              <p className="text-slate-500 text-sm md:text-sm font-medium leading-relaxed max-w-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {buttonText && buttonLink && (
        <div className="w-full md:w-auto self-end md:self-center">
          <Button
            asChild
            className="w-full md:w-auto bg-[#1c3320] hover:bg-emerald-700 text-white rounded-2xl px-8 h-12 md:h-14 font-bold uppercase tracking-wider text-xs shadow-xl shadow-emerald-900/10 transition-all active:scale-95"
          >
            <Link
              href={buttonLink}
              className="flex items-center justify-center gap-3"
            >
              {icon}
              {buttonText}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
