"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, X, User, LogIn, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "radix-ui";

export const Navbar = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const formatted = now.toLocaleDateString("en-US", options)
        .replace(/,/g, "")
        .replace(/(\w{3}) (\w{3}) (\d+)/, "$1 | $2 $3 |");
      setCurrentTime(formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-300",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-2" 
        : "bg-white border-b border-transparent py-4"
    )}>
      <div className="container mx-auto flex items-center justify-between px-6">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="relative">
            <img
              src="/amaze-logo.png"
              alt="Amaze Ayurveda"
              className="h-14 w-14 object-contain"
            />
            <div className="absolute -inset-1 bg-emerald-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-none tracking-tighter text-lg md:text-xl uppercase italic">
              Amaze Ayurveda
            </span>
            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
              Pvt. Ltd.
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop (Sleeker Design) */}
        {/* <div className="hidden flex-1 px-12 lg:flex max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              type="search"
              placeholder="Search by Associate ID or Product..."
              className="w-full h-11 pl-12 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 placeholder:text-xs"
            />
          </div>
        </div> */}

        {/* Action Section - Desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          {/* System Time Badge */}
          <Badge variant="secondary" className="bg-slate-100/80 text-slate-500 border-none font-bold text-[10px] px-4 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-3 h-3 text-emerald-600" />
            {currentTime || "Tue | Mar 3 | 09:19 PM"}
          </Badge>

          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] px-8 h-11 shadow-xl shadow-slate-900/10 transition-all active:scale-95">
                Join Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile View Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" size="icon" className="text-slate-500 rounded-full hover:bg-slate-100">
            <Search className="h-6 w-6" />
          </Button>

         <Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
      <Menu className="h-6 w-6 text-slate-900" />
    </Button>
  </SheetTrigger>
  
  {/* The Fix: Change w-full to w-[70%] and remove max-w-md */}
  <SheetContent 
    side="right" 
    className="w-[80%] sm:w-[400px] border-none p-0 shadow-2xl transition-transform duration-500 ease-in-out"
  >
    <VisuallyHidden.Root>
      <SheetTitle>Mobile Navigation</SheetTitle>
    </VisuallyHidden.Root>
    
    <div className="h-full flex flex-col bg-white">
      {/* Mobile Menu Header - Adjusted for 70% width */}
      <div className="p-6 bg-[#0f172a] text-white relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <img src="/amaze-logo.png" className="h-10 w-10 brightness-200" alt="Logo" />
            <div className="hidden xs:block"> {/* Hide text on very small screens if needed */}
              <p className="font-black text-sm tracking-tighter italic uppercase leading-none">
                Amaze <span className="text-emerald-400">Ayurveda</span>
              </p>
            </div>
          </div>
          
          <SheetClose className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <X className="h-5 w-5" />
          </SheetClose>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Portal Access</label>
          <div className="grid gap-3">
            <Link href="/sign-in" className="block">
              <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-slate-100 px-5 text-[11px] font-black group transition-all">
                <span className="flex items-center gap-3 text-slate-700">
                  <LogIn className="w-4 h-4 text-emerald-500" /> SIGN IN
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-all" />
              </Button>
            </Link>
            
            <Link href="/sign-up" className="block">
              <Button className="w-full justify-between h-14 rounded-2xl bg-[#0f172a] px-5 text-[11px] font-black group transition-all shadow-lg shadow-slate-900/10">
                <span className="flex items-center gap-3">
                  <User className="w-4 h-4 text-emerald-400" /> PARTNER JOIN
                </span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Time Card - Scaled for 70% width */}
        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
          <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2">
            <Clock className="w-3 h-3 text-emerald-500" /> System Time
          </p>
          <p className="text-sm font-black text-slate-900 mt-2 font-mono tracking-tight">
            {currentTime || "SUN | MAR 08"}
          </p>
        </div>
      </div>
      
      <div className="p-6 text-center border-t bg-slate-50/50">
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Growth Engine</p>
      </div>
    </div>
  </SheetContent>
</Sheet>
        </div>
      </div>
    </nav>
  );
};