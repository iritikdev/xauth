"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Menu, X, User, LogIn, ShoppingCart, 
  ChevronDown, LayoutDashboard, Leaf, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { useSession } from "next-auth/react";
import UserDropdown from "./dashboard/user-dropdown";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cart = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemCount = mounted ? cart.items.length : 0;

  const NAV_LINKS = [
    { label: "Shop Swadeshi", href: "/shop", icon: Leaf },
    { label: "Our Story", href: "/about", icon: Info },
    { label: "Business Plan", href: "/plan", icon: LayoutDashboard },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-[50] w-full transition-all duration-500",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 py-2 shadow-sm"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          
          {/* 1. Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/amaze-logo.png" alt="Amaze Ayurveda" className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform group-hover:rotate-12" />
              <div className="absolute -inset-2 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-[1000] text-slate-900 leading-none text-lg md:text-xl uppercase italic tracking-tighter">
                Amaze <span className="text-emerald-600">Ayurveda</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Swadeshi Movement</span>
            </div>
          </Link>

          {/* 2. Middle Navigation (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/20">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" className="h-9 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 hover:bg-white transition-all">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* 3. Actions Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Trigger (Icon Only) */}
            <Button variant="ghost" size="icon" className="hidden md:flex h-10 w-10 rounded-xl hover:bg-emerald-50 text-slate-600">
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart Button */}
            <Button
              onClick={() => setIsCartOpen(true)}
              variant="ghost"
              className="relative h-11 px-3 md:px-4 rounded-xl hover:bg-emerald-50 group transition-all border border-transparent hover:border-emerald-100"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />
              <span className="hidden md:block ml-2 text-[11px] font-black uppercase tracking-widest">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-lg border-2 border-white animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Button>

            <div className="hidden md:block w-px h-6 bg-slate-200 mx-1" />

            {/* Auth/User Section */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <UserDropdown user={session?.user} />
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] px-6 h-11 shadow-lg shadow-slate-900/10">
                      Join
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-xl bg-slate-100">
                  <Menu className="h-6 w-6 text-slate-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] p-0 border-none bg-white">
                <div className="flex flex-col h-full">
                  <div className="p-8 bg-slate-900 text-white">
                    <SheetTitle className="text-white text-2xl font-black italic uppercase italic">Amaze <span className="text-emerald-400">Ayurveda</span></SheetTitle>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Associate Portal v3.0</p>
                  </div>
                  
                  <div className="flex-1 px-6 py-8 space-y-8 overflow-y-auto">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quick Navigation</p>
                      {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <Button variant="outline" className="my-1 w-full justify-start h-14 rounded-2xl border-slate-100 gap-4 font-bold text-slate-700">
                            <link.icon className="w-5 h-5 text-emerald-500" /> {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Account Access</p>
                       <Link href="/sign-in" className="block">
                          <Button className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-black uppercase text-xs tracking-widest">Login to Portal</Button>
                       </Link>
                       <Link href="/sign-up" className="block">
                          <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-widest">Register Yourself</Button>
                       </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />
      {/* Spacer to prevent content jump due to fixed nav */}
      <div className="h-20" />
    </>
  );
};