'use client'

import React, { useState, useEffect } from "react"
import { PanelLeft, Bell, Settings, ShoppingCart } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/ecommerce/cart-drawer"
import UserDropdown from "./dashboard/user-dropdown"
import { NotificationDrawer } from "./dashboard/notification-drawer"
import { SettingsDrawer } from "./dashboard/settings-drawer"
import Link from "next/link"

export function UserDashboardHeader() {
  const { toggleSidebar, state } = useSidebar()
  const { data: session } = useSession()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const cart = useCart()
  useEffect(() => { setMounted(true) }, [])
  const cartCount = mounted ? cart.items.length : 0

  /* ── shared icon-button style ── */
  const iconBtn = cn(
    "relative h-8 w-8 rounded-xl border flex items-center justify-center transition-all duration-150",
    "border-zinc-200 bg-white text-zinc-400 shadow-sm",
    "hover:bg-zinc-950 hover:text-white hover:border-zinc-950",
    "active:scale-90"
  )

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        
      >
        <div className="bg-white/90 backdrop-blur-xl border-b border-zinc-100 shadow-[0_1px_0_rgba(9,9,11,0.04)]">
          <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-[1600px] mx-auto">

            {/* ── LEFT ── */}
            <div className="flex items-center gap-3">
              {/* Sidebar toggle */}
              <button
                onClick={toggleSidebar}
                title="Toggle sidebar"
                className={iconBtn}
              >
                <PanelLeft className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  state === "collapsed" ? "rotate-180" : "rotate-0"
                )} />
              </button>

              <div className="h-4 w-px bg-zinc-100 hidden sm:block" />

              {/* Brand */}
              <div className="flex items-center gap-2.5 group cursor-pointer">
                <Link href="/">

                  <div className="relative h-8 w-8 rounded-xl flex items-center justify-center shadow-sm overflow-hidden transition-shadow group-hover:shadow-md">
                    <Image src="/amaze-logo.png" alt="Amaze Ayurveda" fill className="object-contain p-1" />
                    <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/8 transition-colors duration-200" />
                  </div>
                </Link>
                <div className="hidden md:flex flex-col leading-none">
                  <span
                    className="text-sm font-black text-zinc-900 tracking-tight leading-none"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    Amaze <span className="text-emerald-500">Ayurveda</span>
                  </span>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-0.5">
                    Associate Portal
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="flex items-center gap-1.5">

              {/* Cart */}
              <button onClick={() => setIsCartOpen(true)} className={iconBtn} title="Cart">
                <ShoppingCart className="h-3.5 w-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className={cn(iconBtn, "relative")}
                title="Notifications"
              >
                <Bell className="h-3.5 w-3.5" />
                {/* unread dot */}
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-white" />
              </button>

              {/* Settings */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={cn(iconBtn, "hidden sm:flex")}
                title="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>

              <div className="h-5 w-px bg-zinc-100 mx-1 hidden sm:block" />
              <UserDropdown user={session?.user} />
            </div>
          </div>
        </div>

        {/* emerald bottom hairline */}
        <div className="h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent pointer-events-none" />
      </header>

      <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />
      <NotificationDrawer open={isNotifOpen} setOpen={setIsNotifOpen} />
      <SettingsDrawer open={isSettingsOpen} setOpen={setIsSettingsOpen} />
    </>
  )
}