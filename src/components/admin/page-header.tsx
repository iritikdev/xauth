import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: ReactNode;
}

export function PageHeader({
  title,
  highlight,
  description,
  buttonText,
  buttonLink,
  subtitle,
  icon,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      
      {/* Left Content */}
      <div className="space-y-2 max-w-xl">

        {subtitle && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
              {subtitle}
            </span>
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
          {title}{" "}
          {highlight && (
            <span className="text-emerald-600">{highlight}</span>
          )}
        </h1>

        {description && (
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      {buttonText && buttonLink && (
        <div className="w-full md:w-auto">
          <Button
            asChild
            className="w-full md:w-auto bg-[#0f172a] hover:bg-emerald-600 rounded-xl px-6 h-11 md:h-12 transition-all"
          >
            <Link href={buttonLink} className="flex items-center justify-center gap-2">
              {icon}
              {buttonText}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}