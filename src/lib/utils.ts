import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name?: string): string => {
  if (!name) return ''
  const words = name.trim().split(' ')
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// utils/dateFormat.ts
export function formatDateTime(
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
  locale: string = "en-IN" // default locale (India English)
): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error("Invalid date string:", isoString);
    return isoString; // fallback to raw string
  }
}