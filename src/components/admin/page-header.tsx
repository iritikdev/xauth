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
    <div className="flex justify-between items-center">
      <div>
        {subtitle && (
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
              {subtitle}
            </span>
          </div>
        )}

        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          {title}{" "}
          {highlight && <span className="text-emerald-600">{highlight}</span>}
        </h1>

        {description && <p className="text-slate-500 text-sm">{description}</p>}
      </div>

      {buttonText && buttonLink && (
        <Button
          asChild
          className="bg-[#0f172a] hover:bg-emerald-600 rounded-xl px-6 h-12 transition-all"
        >
          <Link href={buttonLink}>
            {icon}
            {buttonText}
          </Link>
        </Button>
      )}
    </div>
  );
}
