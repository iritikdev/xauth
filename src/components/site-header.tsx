'use client'

import React, { useState, useEffect } from "react" // Added useState, useEffect
import { 
  PanelLeft, Bell, Settings, ShieldCheck, LayoutDashboard, 
  Wallet, Key, ShoppingCart // Added ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignOut } from "@/components/sign-out"

// IMPORT CART HOOK AND DRAWER
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/ecommerce/cart-drawer"
import UserDropdown from "./dashboard/user-dropdown"

export function SiteHeader() {
  const { toggleSidebar, state } = useSidebar()
  const { data: session } = useSession()
  
  // CART STATE & HOOK
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const cart = useCart()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const cartItemCount = mounted ? cart.items.length : 0

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          
          {/* Left Side: Toggle & Brand */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-9 w-9 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
            >
              <PanelLeft className={cn(
                "h-5 w-5 transition-transform duration-300",
                state === "collapsed" ? "rotate-180" : "rotate-0"
              )} />
            </Button>

            <Separator orientation="vertical" className="h-6 bg-slate-200 hidden xs:block" />

            <div className="flex items-center gap-2 px-2 group cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105">
                 <Image src="/amaze-logo.png" alt="A" width={32} height={32} />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 leading-none">AMAZE</span>
                <span className="text-[9px] font-bold text-[#059669] uppercase tracking-widest leading-none mt-1">Ayurveda</span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions & Profile */}
          <div className="flex items-center gap-3">
            
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl mr-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings:</span>
              <span className="text-xs font-bold text-slate-900">₹0.00</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* --- ADD TO CART BUTTON --- */}
              <Button 
                onClick={() => setIsCartOpen(true)}
                variant="ghost" 
                size="icon" 
                className="relative text-slate-500 h-9 w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-lg bg-emerald-600 text-[9px] font-black text-white border-2 border-white shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="text-slate-500 h-9 w-9 rounded-xl relative hover:bg-orange-50 hover:text-orange-600 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-orange-500 border-2 border-white" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-slate-500 h-9 w-9 rounded-xl hover:bg-slate-100 transition-colors hidden sm:flex">
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8 bg-slate-200 mx-1 hidden xs:block" />

            {/* User Profile Dropdown */}
            <UserDropdown user={session?.user} />
          </div>
        </div>
      </header>

      {/* RENDER THE DRAWER COMPONENT */}
      <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />
    </>
  )
}