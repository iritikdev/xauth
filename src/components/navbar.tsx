"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export const Navbar = () => {
  const [currentTime, setCurrentTime] = useState("");

  // Update clock to match your specific timestamp format
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      // Matching format: Tue | Mar 3, 2026, 09:19 PM
      const formatted = now
        .toLocaleDateString("en-US", options)
        .replace(/,([^,]*)$/, " |$1")
        .replace(/(\w{3}) (\w{3}) (\d+)/, "$1 | $2 $3,");
      setCurrentTime(formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img
            src="/amaze-logo.png"
            alt="Amaze Ayurveda"
            className="h-16 w-16 object-contain"
          />
          <span className="hidden font-bold text-slate-900 lg:inline-block leading-tight">
            Amaze Ayurveda
            <br />
            <span className="text-emerald-600 text-sm">Pvt. Ltd.</span>
          </span>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 px-8 lg:flex max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 rounded-xl bg-slate-50 border-slate-200 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Time and Auth - Desktop */}
        <div className="hidden items-center gap-6 lg:flex">
          <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
            {currentTime || "Tue | Mar 3, 2026, 09:19 PM"}
          </span>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-xl border-slate-200">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-xl bg-slate-900 hover:bg-emerald-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile View Navigation */}
        <div className="flex items-center gap-4 lg:hidden">
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Search className="h-8 w-8" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-10 w-full sm:w-[350px]">
              <div className="flex flex-col gap-8 py-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Account
                  </p>
                  <Link href="/sign-in" className="mb-8">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <LogIn className="h-5 w-5" /> Login
                  </Button>
                  </Link>
                  <Link href="/sign-up">
                  <Button className="w-full justify-start gap-3 rounded-xl h-12 bg-slate-900">
                    <User className="h-5 w-5" /> Sign Up
                  </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    System Time
                  </p>
                  <p className="text-sm text-slate-600 font-mono">
                    {currentTime || "Mar 3, 2026, 09:19 PM"}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
