"use client"

import Link from "next/link"
import { LayoutDashboard, ShieldCheck, Wallet, Key } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {SignOut} from "@/components/sign-out"

interface UserDropdownProps {
  user?: {
    name?: string | null
    email?: string | null
    photoUrl?: string | null
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {

  const initials =
    user?.name?.substring(0, 2).toUpperCase() || "AU"

  const baseDashboardUrl = "/distributor/dashboard"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-11 flex items-center gap-3 px-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
        >
          <Avatar className="h-8 w-8 rounded-xl border-2 border-emerald-100 shadow-sm">
            <AvatarImage
              src={user?.photoUrl || "/default-avatar.png"}
              alt={user?.name || "User"}
            />
            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-xs font-black text-slate-900 leading-none">
              {user?.name || "Member"}
            </span>

            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">
              Star Partner
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60 p-2 rounded-[1.5rem] shadow-2xl border-slate-100 mt-2"
        align="end"
      >
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black text-slate-900">
              {user?.name}
            </p>

            <p className="text-[10px] font-medium text-slate-500">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-2" />

        <DropdownMenuGroup className="p-1">
          <Link href={baseDashboardUrl}>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
              <LayoutDashboard className="mr-3 h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">
                Dashboard
              </span>
            </DropdownMenuItem>
          </Link>

          <Link href={baseDashboardUrl + "/kycVerification"}>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
              <ShieldCheck className="mr-3 h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700">
                KYC Verification
              </span>
            </DropdownMenuItem>
          </Link>

          <Link href={baseDashboardUrl + "/wallet"}>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
              <Wallet className="mr-3 h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-700">
                My Wallets
              </span>
            </DropdownMenuItem>
          </Link>

          <Link href={baseDashboardUrl + "/updatePassword"}>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
              <Key className="mr-3 h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-700">
                Update Password
              </span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-2" />

        <div className="p-1">
          <SignOut />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}