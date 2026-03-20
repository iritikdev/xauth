"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Menu, ShoppingCart,
  LayoutDashboard, Leaf, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { useSession } from "next-auth/react";
import UserDropdown from "./dashboard/user-dropdown";
import Image from "next/image";

/* ── Botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
  </svg>
);

const NAV_LINKS = [
  { label: "Shop Swadeshi", href: "/shop",  icon: Leaf          },
  { label: "Our Story",     href: "/about", icon: Info          },
  { label: "Business Plan", href: "/plan",  icon: LayoutDashboard },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled]   = useState(false);
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [mounted,    setMounted]      = useState(false);

  const cart              = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = mounted ? cart.items.length : 0;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          isScrolled
            ? "bg-[#1c3320]/95 backdrop-blur-xl border-b border-white/8 py-2 shadow-[0_4px_30px_rgba(28,50,32,0.25)]"
            : "bg-[#1c3320] py-3"
        )}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Leaf watermark — visible only when not scrolled */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500",
            isScrolled ? "opacity-0" : "opacity-100"
          )}
        >
          <LeafDecor className="absolute -top-4 right-20 w-16 text-emerald-400 opacity-30" />
          <LeafDecor className="absolute -bottom-6 left-10 w-12 text-[#c8860a] opacity-20 rotate-[20deg]" />
        </div>

        <div className="relative z-10 container mx-auto flex items-center justify-between px-5 md:px-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/8 border border-white/10 overflow-hidden flex-shrink-0">
              <Image
                src="/amaze-logo.png"
                alt="Amaze Ayurveda"
                fill
                className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gold glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-[#e8a020]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span
                className="font-black text-white leading-none text-lg tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Amaze <span className="text-[#e8a020] italic">Ayurveda</span>
              </span>
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.38em] mt-1">
                Swadeshi Movement
              </span>
            </div>
          </Link>

          {/* ── Desktop nav pill ── */}
          <div className="hidden lg:flex items-center gap-0.5 bg-white/5 border border-white/8 p-1 rounded-2xl">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200">
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </button>
              </Link>
            ))}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-1.5 md:gap-2">

            {/* Search */}
            <button className="hidden md:flex h-9 w-9 rounded-xl bg-white/5 border border-white/8 items-center justify-center text-white/40 hover:text-[#e8a020] hover:border-[#e8a020]/30 hover:bg-[#e8a020]/8 transition-all">
              <Search className="w-4 h-4" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 h-9 px-3 rounded-xl bg-white/5 border border-white/8 text-white/50 hover:text-[#e8a020] hover:border-[#e8a020]/30 hover:bg-[#e8a020]/8 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#e8a020] text-[#1c3320] text-[8px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-[#1c3320]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-white/10 mx-1" />

            {/* Auth — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <UserDropdown user={session?.user} />
              ) : (
                <>
                  <Link href="/sign-in">
                    <button className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/45 hover:text-white hover:bg-white/8 transition-all">
                      Login
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="h-9 px-5 rounded-xl bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] font-black text-[10px] uppercase tracking-[0.18em] transition-all shadow-[0_0_20px_rgba(232,160,32,0.25)] hover:shadow-[0_0_28px_rgba(232,160,32,0.4)] active:scale-[0.97]">
                      Join
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/12 transition-all">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[82%] max-w-sm p-0 border-none bg-[#1c3320] overflow-hidden"
              >
                {/* Sheet header */}
                <div className="relative px-7 pt-8 pb-7 border-b border-white/8 overflow-hidden">
                  <LeafDecor className="absolute -top-4 right-4 w-20 text-emerald-400 opacity-20" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl bg-white/8 border border-white/10 overflow-hidden flex-shrink-0">
                      <Image src="/amaze-logo.png" alt="Logo" fill className="object-contain p-1.5" />
                    </div>
                    <div>
                      <SheetTitle
                        className="text-white text-lg font-black tracking-tight leading-none"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Amaze <span className="text-[#e8a020] italic">Ayurveda</span>
                      </SheetTitle>
                      <p className="text-[8px] font-bold text-white/25 uppercase tracking-[0.35em] mt-1">
                        Associate Portal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sheet body */}
                <div className="flex flex-col h-[calc(100%-105px)] px-5 py-7 space-y-7 overflow-y-auto">

                  {/* Nav links */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.28em] px-1 mb-3">
                      Navigation
                    </p>
                    {NAV_LINKS.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href}>
                          <div className="flex items-center gap-3.5 h-13 px-4 py-3.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-[#e8a020]/20 transition-all group cursor-pointer">
                            <link.icon className="w-4 h-4 text-[#e8a020]/60 group-hover:text-[#e8a020] transition-colors" />
                            <span className="text-sm font-medium text-white/55 group-hover:text-white transition-colors">
                              {link.label}
                            </span>
                          </div>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/8" />

                  {/* Account CTA */}
                  <div className="space-y-2.5">
                    <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.28em] px-1 mb-3">
                      Account
                    </p>
                    <SheetClose asChild>
                      <Link href="/sign-in">
                        <button className="w-full h-12 rounded-xl border border-white/12 bg-white/5 hover:bg-white/8 text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all mb-2">
                          Login to Portal
                        </button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/sign-up">
                        <button className="w-full h-12 rounded-xl bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(232,160,32,0.2)]">
                          Register Yourself
                        </button>
                      </Link>
                    </SheetClose>
                  </div>

                  {/* Bottom tagline */}
                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/8" />
                    <p className="text-[8px] text-white/20 uppercase tracking-widest">🌿 Vocal for Local</p>
                    <div className="h-px flex-1 bg-white/8" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />
      <div className="h-[68px]" />
    </>
  );
};