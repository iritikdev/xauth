'use client'

import React, { useState, useEffect } from "react"
import { PanelLeft, Bell, Settings, ShoppingCart, Leaf, TrendingUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/ecommerce/cart-drawer"
import UserDropdown from "./dashboard/user-dropdown"

export function SiteHeader() {
  const { toggleSidebar, state } = useSidebar()
  const { data: session }        = useSession()


  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted,    setMounted]    = useState(false)
  const cart = useCart()

  useEffect(() => { setMounted(true) }, [])
  const cartCount = mounted ? cart.items.length : 0

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Glass bar ── */}
        <div className="bg-[#f5f0e8]/85 backdrop-blur-xl border-b border-[#1c3320]/8 shadow-[0_1px_0_rgba(28,50,32,0.05)]">
          <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-[1600px] mx-auto">

            {/* ══════════════════════
                LEFT — toggle + brand
            ══════════════════════ */}
            <div className="flex items-center gap-3">

              {/* Sidebar toggle */}
              <button
                onClick={toggleSidebar}
                title="Toggle sidebar"
                className="group h-8 w-8 rounded-lg border border-[#1c3320]/10 bg-white/60 hover:bg-[#1c3320] text-[#1c3320]/40 hover:text-white hover:border-[#1c3320] transition-all duration-200 active:scale-90 flex items-center justify-center shadow-[0_1px_4px_rgba(28,50,32,0.06)]"
              >
                <PanelLeft className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  state === "collapsed" ? "rotate-180" : "rotate-0"
                )} />
              </button>

              {/* Divider */}
              <div className="h-4 w-px bg-[#1c3320]/10 hidden xs:block" />

              {/* Brand mark */}
              <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="relative h-8 w-8 rounded-xl bg-[#1c3320] border border-[#1c3320]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(28,50,32,0.2)] group-hover:shadow-[0_4px_14px_rgba(28,50,32,0.28)] transition-shadow overflow-hidden">
                  <Image src="/amaze-logo.png" alt="Amaze Ayurveda" fill className="object-contain p-1" />
                  {/* Gold shimmer on hover */}
                  <div className="absolute inset-0 bg-[#e8a020]/0 group-hover:bg-[#e8a020]/10 transition-colors duration-300" />
                </div>
                <div className="hidden md:flex flex-col leading-none">
                  <span
                    className="text-sm font-black text-[#1c3320] tracking-tight leading-none"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Amaze <span className="text-emerald-500 italic">Ayurveda</span>
                  </span>
                  <span className="text-[8px] font-bold text-[#1c3320]/30 uppercase tracking-[0.3em] mt-0.5">
                    Associate Portal
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════════════════
                RIGHT — actions
            ══════════════════════ */}
            <div className="flex items-center gap-2">

              {/* Earnings chip — desktop */}
              {/* <div className="hidden lg:flex items-center gap-2 bg-white/60 border border-[#1c3320]/8 px-3 py-1.5 rounded-full mr-1 shadow-[0_1px_4px_rgba(28,50,32,0.05)]">
                <TrendingUp className="w-3 h-3 text-[#1c6634]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#1c3320]/35">Earnings</span>
                <div className="h-3 w-px bg-[#1c3320]/10" />
                <span className="text-[11px] font-black text-[#1c3320]">₹0.00</span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
              </div> */}

              {/* ── Icon actions ── */}
              <div className="flex items-center gap-1">

                {/* Cart */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative group h-8 w-8 rounded-lg border border-[#1c3320]/10 bg-white/60 hover:bg-[#1c3320] text-[#1c3320]/40 hover:text-white hover:border-[#1c3320] transition-all duration-200 flex items-center justify-center shadow-[0_1px_4px_rgba(28,50,32,0.06)]"
                  title="Cart"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8a020] text-[#1c3320] text-[8px] font-black border-2 border-[#f5f0e8] shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <button
                  className="relative group h-8 w-8 rounded-lg border border-[#1c3320]/10 bg-white/60 hover:bg-[#1c3320] text-[#1c3320]/40 hover:text-white hover:border-[#1c3320] transition-all duration-200 flex items-center justify-center shadow-[0_1px_4px_rgba(28,50,32,0.06)]"
                  title="Notifications"
                >
                  <Bell className="h-3.5 w-3.5" />
                  {/* Unread dot */}
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#e8a020] border border-[#f5f0e8]" />
                </button>

                {/* Settings */}
                <button
                  className="group h-8 w-8 rounded-lg border border-[#1c3320]/10 bg-white/60 hover:bg-[#1c3320] text-[#1c3320]/40 hover:text-white hover:border-[#1c3320] transition-all duration-200 hidden sm:flex items-center justify-center shadow-[0_1px_4px_rgba(28,50,32,0.06)]"
                  title="Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-[#1c3320]/10 mx-1 hidden xs:block" />

              {/* User dropdown */}
              <UserDropdown user={session?.user} />
            </div>
          </div>
        </div>

        {/* Saffron gradient hairline */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e8a020]/25 to-transparent pointer-events-none" />
      </header>

      <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />
    </>
  )
}