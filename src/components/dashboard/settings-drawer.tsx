'use client'

import React, { useState } from "react"
import {
  X, Settings, Moon, Sun, Bell, Shield,
  Globe, ChevronRight, LogOut, Trash2,
  Volume2, VolumeX, Eye, EyeOff, Smartphone,
  Mail, Lock, UserCircle2, Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"

/* ─── toggle ──────────────────────────────────────────────────── */
function Toggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        value ? "bg-emerald-500" : "bg-zinc-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          value ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

/* ─── section header ──────────────────────────────────────────── */
function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-50/80 border-b border-zinc-50">
      <div className="flex h-5 w-5 items-center justify-center text-zinc-400">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-400">{title}</span>
    </div>
  )
}

/* ─── setting row ─────────────────────────────────────────────── */
function SettingRow({
  label,
  description,
  children,
  destructive,
}: {
  label: string
  description?: string
  children: React.ReactNode
  destructive?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-zinc-50 last:border-0">
      <div className="min-w-0">
        <p className={cn(
          "text-[13px] font-medium leading-snug",
          destructive ? "text-red-600" : "text-zinc-800"
        )}>
          {label}
        </p>
        {description && (
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

/* ─── nav row ─────────────────────────────────────────────────── */
function NavRow({
  label,
  description,
  icon,
  onClick,
  destructive,
}: {
  label: string
  description?: string
  icon?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-50 last:border-0 transition-colors text-left",
        destructive ? "hover:bg-red-50" : "hover:bg-zinc-50"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className={cn(
            "h-7 w-7 rounded-xl flex items-center justify-center shrink-0",
            destructive ? "bg-red-50 text-red-500" : "bg-zinc-100 text-zinc-500"
          )}>
            {icon}
          </div>
        )}
        <div>
          <p className={cn("text-[13px] font-medium", destructive ? "text-red-600" : "text-zinc-800")}>
            {label}
          </p>
          {description && (
            <p className="text-[11px] text-zinc-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight size={14} className={cn("shrink-0", destructive ? "text-red-300" : "text-zinc-300")} strokeWidth={2} />
    </button>
  )
}

/* ─── main component ──────────────────────────────────────────── */
export function SettingsDrawer({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  /* state */
  const [darkMode,         setDarkMode]         = useState(false)
  const [soundEnabled,     setSoundEnabled]     = useState(true)
  const [pushNotif,        setPushNotif]        = useState(true)
  const [emailNotif,       setEmailNotif]       = useState(false)
  const [incomeNotif,      setIncomeNotif]      = useState(true)
  const [networkNotif,     setNetworkNotif]     = useState(true)
  const [orderNotif,       setOrderNotif]       = useState(true)
  const [twoFactor,        setTwoFactor]        = useState(false)
  const [profileVisible,   setProfileVisible]   = useState(true)
  const [language,         setLanguage]         = useState("English")

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <motion.div
            key="settings-drawer"
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
                  <Settings size={15} strokeWidth={2} />
                </div>
                <div>
                  <h2
                    className="text-[15px] font-black text-zinc-900 leading-none"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    Settings
                  </h2>
                  <p className="text-[10px] font-medium text-zinc-400 mt-0.5">
                    Manage your preferences
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-xl border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 flex items-center justify-center transition-all"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* ── scrollable body ── */}
            <div className="flex-1 overflow-y-auto">

              {/* ── Appearance ── */}
              <SectionHead icon={<Sun size={13} strokeWidth={2} />} title="Appearance" />
              <SettingRow
                label="Dark Mode"
                description="Switch between light and dark interface"
              >
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon size={13} className="text-zinc-400" /> : <Sun size={13} className="text-zinc-400" />}
                  <Toggle value={darkMode} onChange={setDarkMode} />
                </div>
              </SettingRow>
              <SettingRow label="Interface Language" description="Portal display language">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="h-7 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-[11px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 cursor-pointer"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bengali</option>
                </select>
              </SettingRow>
              <SettingRow label="Sound Effects" description="UI sounds and alerts">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={13} className="text-zinc-400" /> : <VolumeX size={13} className="text-zinc-400" />}
                  <Toggle value={soundEnabled} onChange={setSoundEnabled} />
                </div>
              </SettingRow>

              {/* ── Notifications ── */}
              <SectionHead icon={<Bell size={13} strokeWidth={2} />} title="Notifications" />
              <SettingRow label="Push Notifications" description="In-app alerts">
                <Toggle value={pushNotif} onChange={setPushNotif} />
              </SettingRow>
              <SettingRow label="Email Notifications" description="Digest sent to your email">
                <Toggle value={emailNotif} onChange={setEmailNotif} />
              </SettingRow>
              <SettingRow label="Income & BV Alerts" description="When commission is credited">
                <Toggle value={incomeNotif} onChange={setIncomeNotif} />
              </SettingRow>
              <SettingRow label="Network Activity" description="New team member joins">
                <Toggle value={networkNotif} onChange={setNetworkNotif} />
              </SettingRow>
              <SettingRow label="Order Updates" description="Shipping and delivery status">
                <Toggle value={orderNotif} onChange={setOrderNotif} />
              </SettingRow>

              {/* ── Privacy ── */}
              <SectionHead icon={<Shield size={13} strokeWidth={2} />} title="Privacy & Security" />
              <SettingRow label="Two-Factor Auth" description="Extra security for your account">
                <Toggle value={twoFactor} onChange={setTwoFactor} />
              </SettingRow>
              <SettingRow label="Profile Visibility" description="Allow your profile in network tree">
                <div className="flex items-center gap-2">
                  {profileVisible ? <Eye size={13} className="text-zinc-400" /> : <EyeOff size={13} className="text-zinc-400" />}
                  <Toggle value={profileVisible} onChange={setProfileVisible} />
                </div>
              </SettingRow>
              <NavRow
                label="Change Password"
                description="Update your login credentials"
                icon={<Lock size={13} strokeWidth={2} />}
              />
              <NavRow
                label="Active Sessions"
                description="View all logged-in devices"
                icon={<Smartphone size={13} strokeWidth={2} />}
              />

              {/* ── Account ── */}
              <SectionHead icon={<UserCircle2 size={13} strokeWidth={2} />} title="Account" />
              <NavRow
                label="Edit Profile"
                description="Update KYC and personal details"
                icon={<UserCircle2 size={13} strokeWidth={2} />}
              />
              <NavRow
                label="Linked Email"
                description="Manage your email address"
                icon={<Mail size={13} strokeWidth={2} />}
              />
              <NavRow
                label="Sign Out"
                description="Log out of your account"
                icon={<LogOut size={13} strokeWidth={2} />}
                destructive
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              />
              <NavRow
                label="Delete Account"
                description="Permanently remove your account"
                icon={<Trash2 size={13} strokeWidth={2} />}
                destructive
              />

              {/* bottom spacer */}
              <div className="h-4" />
            </div>

            {/* ── footer ── */}
            <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400">Amaze Ayurveda</span>
              </div>
              <span className="text-[10px] text-zinc-300">v2.0.1</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}