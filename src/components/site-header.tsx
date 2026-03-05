'use client'

import { PanelLeft, Bell, Settings, ShieldCheck, LayoutDashboard, Wallet } from "lucide-react"
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

export function SiteHeader() {
  const { toggleSidebar, state } = useSidebar()
  const { data: session } = useSession()

  return (
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

          {/* Branded Identity Section */}
          <div className="flex items-center gap-2 px-2 group cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl  shadow-lg transition-transform group-hover:scale-105">
               <Image src="/amaze-logo.png" alt="A" width={32} height={32} className="" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-black tracking-tight text-slate-900 leading-none">AMAZE</span>
              <span className="text-[9px] font-bold text-[#059669] uppercase tracking-widest leading-none mt-1">Ayurveda</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Stats: Wallet (Visible on Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl mr-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings:</span>
            <span className="text-xs font-bold text-slate-900">₹0.00</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 flex items-center gap-3 px-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <Avatar className="h-8 w-8 rounded-xl border-2 border-emerald-100 shadow-sm">
                  <AvatarImage src="/aalogoc.png" alt={session?.user?.name || "User"} />
                  <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    {session?.user?.name?.substring(0, 2).toUpperCase() || "AU"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-xs font-black text-slate-900 leading-none">{session?.user?.name || "Member"}</span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">Star Partner</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2 rounded-[1.5rem] shadow-2xl border-slate-100 mt-2" align="end">
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-black text-slate-900">{session?.user?.name}</p>
                  <p className="text-[10px] font-medium text-slate-500">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-2" />
              <DropdownMenuGroup className="p-1">
                <Link href="/dashboard">
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">Business Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/kyc">
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
                    <ShieldCheck className="mr-3 h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700">Identity & KYC</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/wallet">
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 lg:hidden">
                    <Wallet className="mr-3 h-4 w-4 text-orange-500" />
                    <span className="text-xs font-bold text-slate-700">My Wallet</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="mx-2" />
              <div className="p-1">
                <SignOut />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}