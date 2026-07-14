"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import React from "react";

interface BackButtonProps {
  /** Optional fallback URL if history is empty */
  fallbackUrl?: string;
  /** Optional label text */
  label?: string;
  /** Extra classNames for styling */
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackUrl,
  label = "Back",
  className = "",
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackUrl) {
      router.push(fallbackUrl);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 h-8 rounded-2xl border border-zinc-200 bg-white px-3 text-[10px] font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-all shadow-sm ${className}`}
    >
      <ChevronLeft size={14} strokeWidth={2.5} />
      {label}
    </button>
  );
};
