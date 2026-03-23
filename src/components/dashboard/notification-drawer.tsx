'use client'

import React, { useState } from "react"
import {
  X, Bell, CheckCircle2, Coins, Users,
  ShoppingBag, AlertCircle, BellOff, Check,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

/* ─── notification types ──────────────────────────────────────── */
type NotifType = "income" | "order" | "network" | "system" | "alert"

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
}

/* ─── mock data (replace with real API) ─────────────────────────*/
const MOCK: Notification[] = [
  { id:"1", type:"income",  read:false, time:"2 min ago",  title:"Income Credited",           body:"₹450 binary bonus has been added to your wallet." },
  { id:"2", type:"network", read:false, time:"15 min ago", title:"New Team Member",            body:"Priya Sharma joined your Level 1 downline." },
  { id:"3", type:"order",   read:false, time:"1 hr ago",   title:"Order Dispatched",           body:"Order #A9F3C2E1 has been handed to courier." },
  { id:"4", type:"income",  read:true,  time:"3 hr ago",   title:"Repurchase Incentive",       body:"₹320 incentive earned from your Level 3 team." },
  { id:"5", type:"system",  read:true,  time:"Yesterday",  title:"KYC Approved",               body:"Your KYC documents have been verified successfully." },
  { id:"6", type:"alert",   read:true,  time:"2 days ago", title:"Low Wallet Balance",         body:"Your wallet balance is below ₹100. Add funds." },
  { id:"7", type:"network", read:true,  time:"3 days ago", title:"Level 2 Team Active",        body:"Raj Kumar completed first purchase and is now active." },
  { id:"8", type:"order",   read:true,  time:"4 days ago", title:"Order Delivered",            body:"Order #D1F890B2 delivered successfully. BV credited." },
]

/* ─── icon + style per type ──────────────────────────────────── */
const TYPE_CFG: Record<NotifType, {
  icon: React.ElementType
  iconCls: string
  bg: string
  border: string
}> = {
  income:  { icon: Coins,        iconCls:"text-emerald-600", bg:"bg-emerald-50",  border:"border-emerald-100" },
  order:   { icon: ShoppingBag,  iconCls:"text-blue-600",    bg:"bg-blue-50",     border:"border-blue-100"    },
  network: { icon: Users,        iconCls:"text-violet-600",  bg:"bg-violet-50",   border:"border-violet-100"  },
  system:  { icon: CheckCircle2, iconCls:"text-zinc-500",    bg:"bg-zinc-100",    border:"border-zinc-200"    },
  alert:   { icon: AlertCircle,  iconCls:"text-amber-600",   bg:"bg-amber-50",    border:"border-amber-100"   },
}

const FILTERS = ["All","Income","Orders","Network","System"] as const

/* ─── component ───────────────────────────────────────────────── */
export function NotificationDrawer({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const [notifs, setNotifs]     = useState<Notification[]>(MOCK)
  const [filter, setFilter]     = useState<typeof FILTERS[number]>("All")

  const unreadCount = notifs.filter(n => !n.read).length

  const filtered = notifs.filter(n => {
    if (filter === "All")     return true
    if (filter === "Income")  return n.type === "income"
    if (filter === "Orders")  return n.type === "order"
    if (filter === "Network") return n.type === "network"
    if (filter === "System")  return n.type === "system" || n.type === "alert"
    return true
  })

  const markAllRead   = () => setNotifs(notifs.map(n => ({ ...n, read: true })))
  const markRead      = (id: string) => setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss       = (id: string) => setNotifs(notifs.filter(n => n.id !== id))

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <motion.div
            key="notif-drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            {/* ── header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                  <Bell size={15} strokeWidth={2} />
                </div>
                <div>
                  <h2
                    className="text-[15px] font-black text-zinc-900 leading-none"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <p className="text-[10px] font-medium text-zinc-400 mt-0.5">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 h-7 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <Check size={10} strokeWidth={3} /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-xl border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 flex items-center justify-center transition-all"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* ── filter tabs ── */}
            <div className="flex gap-1 px-5 py-3 border-b border-zinc-50 overflow-x-auto scrollbar-hide">
              {FILTERS.map((f) => {
                const count = f === "All" ? unreadCount
                  : notifs.filter(n => !n.read && (
                    f==="Income" ? n.type==="income"
                    : f==="Orders" ? n.type==="order"
                    : f==="Network" ? n.type==="network"
                    : n.type==="system"||n.type==="alert"
                  )).length
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "flex items-center gap-1.5 h-7 rounded-xl px-3 text-[11px] font-bold whitespace-nowrap transition-all shrink-0",
                      filter === f
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-500 hover:bg-zinc-100"
                    )}
                  >
                    {f}
                    {count > 0 && (
                      <span className={cn(
                        "min-w-[16px] h-4 rounded-full text-[9px] font-black flex items-center justify-center px-1",
                        filter === f ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* ── notification list ── */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                      <BellOff size={18} className="text-zinc-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400">
                      All caught up!
                    </p>
                  </div>
                ) : (
                  filtered.map((n, i) => {
                    const cfg = TYPE_CFG[n.type]
                    const Icon = cfg.icon
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "group flex items-start gap-3 px-5 py-4 border-b border-zinc-50 cursor-pointer transition-colors",
                          n.read ? "hover:bg-zinc-50/60" : "bg-emerald-50/30 hover:bg-emerald-50/50"
                        )}
                      >
                        {/* icon */}
                        <div className={cn(
                          "h-9 w-9 rounded-2xl flex items-center justify-center border shrink-0 mt-0.5",
                          cfg.bg, cfg.border
                        )}>
                          <Icon size={15} className={cfg.iconCls} strokeWidth={2} />
                        </div>

                        {/* content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-[13px] leading-snug",
                              n.read ? "font-medium text-zinc-700" : "font-black text-zinc-900"
                            )}
                              style={{ fontFamily: n.read ? undefined : "'Manrope', system-ui, sans-serif" }}
                            >
                              {n.title}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                              {!n.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                              )}
                              <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap">
                                {n.time}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] font-medium text-zinc-400 mt-1 leading-snug line-clamp-2">
                            {n.body}
                          </p>
                        </div>

                        {/* dismiss on hover */}
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all shrink-0 mt-0.5"
                        >
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>

            {/* ── footer ── */}
            <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/60">
              <p className="text-[10px] font-medium text-zinc-400 text-center">
                Notifications are retained for 30 days
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}