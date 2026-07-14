"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Menu, ShoppingCart,
  LayoutDashboard, Leaf, Info,
  User, LogIn, UserPlus, X, Home, Store, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { useSession } from "next-auth/react";
import UserDropdown from "../dashboard/user-dropdown";
import Image from "next/image";

/* ── Botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
  </svg>
);

const NAV_LINKS = [
  { label: "Products", href: "/shop", icon: Leaf },
  { label: "About Amaze", href: "/about-us", icon: Info },
  { label: "Become a Distributor", href: "/business-plan", icon: LayoutDashboard },
];

export const AppHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const cart = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = mounted ? cart.items.length : 0;

  // Account Redirection Target
  const userRole = (session?.user as any)?.role || "DISTRIBUTOR";
  const accountLink = session 
    ? (userRole === "ADMIN" ? "/admin/dashboard" : userRole === "FRANCHISE" ? "/franchise/dashboard" : "/distributor/dashboard")
    : `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`;

  // Mobile Bottom Tabs Config
  const MOBILE_TABS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
    { label: "Deals", href: "/deals", icon: Flame },
    { 
      label: "Cart", 
      isCart: true,
      icon: ShoppingCart,
      badge: cartCount
    },
    { 
      label: session ? "Account" : "Login", 
      href: accountLink, 
      icon: session ? User : LogIn 
    },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-[60] w-full transition-all duration-500",
          isScrolled
            ? "bg-[#1c3320]/90 backdrop-blur-xl border-b border-white/10 py-2.5 shadow-2xl"
            : "bg-[#1c3320] py-2"
        )}
      >
        {/* Botanical Background Elements */}
        <div className={cn("absolute inset-0 overflow-hidden transition-opacity duration-700", isScrolled ? "opacity-30" : "opacity-100")}>
          <LeafDecor className="absolute -top-10 right-[15%] w-24 text-emerald-500 opacity-20 rotate-12" />
          <LeafDecor className="absolute -bottom-10 left-[10%] w-20 text-amber-500 opacity-10 -rotate-12" />
        </div>

        <div className="relative z-10 container mx-auto flex items-center justify-between px-5 md:px-8">
          
          {/* ── Brand Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-white/10 border border-white/10 p-1.5 transition-transform duration-500 group-hover:scale-105 group-hover:bg-white/15">
              <Image src="/amaze-logo.png" alt="Logo" fill className="object-contain p-2" />
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_15px_rgba(232,160,32,0.2)] group-hover:shadow-[0_0_25px_rgba(232,160,32,0.4)] transition-all" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-white text-xl tracking-tighter uppercase italic leading-none">
                Amaze <span className="text-[#e8a020] not-italic">Ayurveda</span>
              </span>
              <span className="text-[7px] font-black text-emerald-400/50 uppercase tracking-widest mt-1">Ancient Wisdom. Modern Wellness.</span>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-[2rem]">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className="flex items-center gap-2 h-8 px-4 rounded-[1.5rem] text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </button>
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">

            {/* Cart Button (Desktop & Tablet) */}
            {/* <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 h-11 px-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-[#e8a020] hover:bg-white/10 transition-all group"
            >
              <ShoppingCart size={16} />
              <span className="hidden md:block text-[11px] font-bold uppercase tracking-widest">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e8a020] text-[#1c3320] text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#1c3320] animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button> */}

            {/* Auth/User Dropdown */}
            {/* <div className="items-center gap-2 ml-2">
              {session ? (
                <UserDropdown user={session?.user} />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href={`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`}>
                    <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-transparent text-[11px] uppercase tracking-widest font-bold">Login</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-[#e8a020] hover:bg-[#c8860a] text-[#1c3320] rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-amber-900/20">Join</Button>
                  </Link>
                </div>
              )}
            </div> */}

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden h-11 w-11 rounded-2xl bg-[#e8a020] flex items-center justify-center text-[#1c3320] shadow-lg active:scale-90 transition-all ml-1">
                  <Menu size={20} strokeWidth={3} />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[85%] max-w-sm p-0 border-none bg-[#1c3320] text-white z-[100]">
                {/* Mobile Header */}
                <div className="relative p-8 border-b border-white/10 overflow-hidden">
                  <LeafDecor className="absolute -top-6 -right-6 w-32 text-emerald-400 opacity-20" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 p-2 flex items-center justify-center">
                      <Image src="/amaze-logo.png" alt="L" width={40} height={40} className="object-contain" />
                    </div>
                    <div>
                      <SheetTitle className="text-white text-2xl font-black italic tracking-tighter uppercase leading-none">
                        Amaze <span className="text-[#e8a020]">Ayurveda</span>
                      </SheetTitle>
                    </div>
                  </div>
                </div>

                {/* Mobile Links */}
                <div className="px-6 py-10 space-y-8 h-full overflow-y-auto pb-28">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2 mb-4">Main Menu</p>
                    {NAV_LINKS.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-[#e8a020] hover:text-[#1c3320] transition-all group">
                          <div className="flex items-center gap-4">
                            <link.icon size={20} className="text-[#e8a020] group-hover:text-[#1c3320]" />
                            <span className="text-[13px] font-bold uppercase tracking-widest">{link.label}</span>
                          </div>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Mobile Account Section */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2 mb-4">Account Access</p>
                    {session ? (
                      <SheetClose asChild>
                        <Link href={accountLink} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 text-emerald-400">
                          <LayoutDashboard size={20} />
                          <span className="font-bold text-sm uppercase tracking-widest">Go to Dashboard</span>
                        </Link>
                      </SheetClose>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <SheetClose asChild>
                          <Link href={`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`} className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-white/5 border border-white/10 gap-2">
                            <LogIn size={20} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Login</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/sign-up" className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-[#e8a020] text-[#1c3320] gap-2">
                            <UserPlus size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Join Us</span>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>

                  {/* Mobile Footer Tagline */}
                  <div className="pt-10 flex flex-col items-center gap-4 opacity-30">
                    <div className="h-px w-full bg-white/20" />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">🌿 Vocal for Local</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />

      {/* ════════════════════════════════════════════════════════════
          MOBILE BOTTOM TAB NAVIGATOR (Visible on mobile screens)
      ════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-[55] block lg:hidden bg-[#1c3320]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {MOBILE_TABS.map((tab, idx) => {
            const Icon = tab.icon;
            
            if (tab.isCart) {
              return (
                <button
                  key="bottom-tab-cart"
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex flex-col items-center justify-center py-1 px-3 text-white/50 hover:text-[#e8a020] transition-colors group"
                >
                  <div className="relative">
                    <Icon size={20} className="transition-transform group-active:scale-90" />
                    {!!tab.badge && tab.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-[#e8a020] text-[#1c3320] text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[#1c3320]">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-white/50 group-hover:text-[#e8a020]">
                    {tab.label}
                  </span>
                </button>
              );
            }

            const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href || "");

            return (
              <Link
                key={idx}
                href={tab.href || "/"}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative",
                  isActive ? "text-[#e8a020]" : "text-white/50 hover:text-white/80"
                )}
              >
                <Icon size={20} className={cn("transition-transform active:scale-90", isActive && "stroke-[2.5]")} />
                <span className={cn("text-[9px] uppercase tracking-wider mt-1", isActive ? "font-black text-[#e8a020]" : "font-bold text-white/50")}>
                  {tab.label}
                </span>

                {/* Active Pill Glow Indicator */}
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-5 bg-[#e8a020] rounded-full shadow-[0_0_8px_#e8a020]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer to prevent content overlap (Top header + Bottom navbar space) */}
      <div className={cn("transition-all duration-500", isScrolled ? "h-[72px]" : "h-[40px]")} />
    </>
  );
};