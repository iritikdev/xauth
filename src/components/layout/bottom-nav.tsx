"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Store, Flame, ShoppingCart, User, LogIn } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onCartClick: () => void;
}

export const BottomNav = ({ onCartClick }: BottomNavProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cart = useCart();

  // Client hydration check for cart count
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cart.items.length : 0;

  // Account Redirection Target based on User Role
  const userRole = (session?.user as any)?.role || "DISTRIBUTOR";
  const accountLink = session
    ? userRole === "ADMIN"
      ? "/admin/dashboard"
      : userRole === "FRANCHISE"
      ? "/franchise/dashboard"
      : "/distributor/dashboard"
    : `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`;

  // Mobile Bottom Tabs Configuration
  const MOBILE_TABS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
    { label: "Deals", href: "/deals", icon: Flame },
    {
      label: "Cart",
      isCart: true,
      icon: ShoppingCart,
      badge: cartCount,
    },
    {
      label: session ? "Account" : "Login",
      href: accountLink,
      icon: session ? User : LogIn,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] block lg:hidden bg-[#1c3320]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {MOBILE_TABS.map((tab, idx) => {
          const Icon = tab.icon;

          // 🛒 Special Handling for Cart Drawer Trigger
          if (tab.isCart) {
            return (
              <button
                key="bottom-tab-cart"
                onClick={onCartClick}
                className="relative flex flex-col items-center justify-center py-1 px-3 text-white/50 hover:text-[#e8a020] transition-colors group"
              >
                <div className="relative">
                  <Icon size={20} className="transition-transform group-active:scale-90" />
                  {!!tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#e8a020] text-[#1c3320] text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[#1c3320] animate-in zoom-in">
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

          // 📍 Route Active Logic
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
              <span
                className={cn(
                  "text-[9px] uppercase tracking-wider mt-1",
                  isActive ? "font-black text-[#e8a020]" : "font-bold text-white/50"
                )}
              >
                {tab.label}
              </span>

              {/* Glowing Active Indicator Pill */}
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-5 bg-[#e8a020] rounded-full shadow-[0_0_8px_#e8a020]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};