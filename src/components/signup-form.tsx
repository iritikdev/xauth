'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signUpSchema } from "@/lib/validations/signup"
import { Spinner } from "./ui/spinner"
import { CheckCircle2, ArrowRight, Leaf, Loader2, Search, Sparkles } from "lucide-react"

type FormData = z.infer<typeof signUpSchema>

/* ─────────────────────── decorative SVG leaf ─────────────────────── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15" />
  </svg>
)

/* ─────────────────────── main component ─────────────────────── */
export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [successData, setSuccessData] = useState<{ name: string; username: string } | null>(null)
  const [sponsorInfo, setSponsorInfo] = useState<{ name: string; mobile: string } | null>(null)
  const [sponsorLoading, setSponsorLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { sponsorId: "", name: "", mobile: "", password: "" },
  })

  const handleSponsorBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.target.value.trim()
    if (!id) { setSponsorInfo(null); return }
    setSponsorLoading(true)
    try {
      const res = await fetch(`/api/user/${id}`)
      const data = await res.json()
      if (res.ok) {
        setSponsorInfo({ name: data.name, mobile: data.mobile })
        toast.success("Sponsor verified.")
      } else {
        setSponsorInfo(null)
        toast.error(data.message || "Sponsor not found.")
      }
    } catch {
      setSponsorInfo(null)
      toast.error("Failed to fetch sponsor info.")
    } finally {
      setSponsorLoading(false)
    }
  }

  const onSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessData({ name: data.name, username: data.username })
        toast.success("Registration successful!")
        setSignupSuccess(true)
      } else {
        toast.error(data.message || "Registration failed.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center p-4 sm:p-8",
        className,
      )}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      {...props}
    >
      {/* ── Outer card ── */}
      <div className="w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(20,50,20,0.18)] grid md:grid-cols-[1fr_420px]">

        {/* ══════════════════════════════════
            LEFT  —  Brand Hero Panel
        ══════════════════════════════════ */}
        <div className="relative hidden md:flex flex-col justify-between bg-[#1c3320] p-12 overflow-hidden">

          {/* Botanical texture orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#c8860a]/10 blur-[80px]" />
            <div className="absolute -bottom-32 -right-10 w-80 h-80 rounded-full bg-emerald-400/10 blur-[80px]" />
            {/* Decorative leaves */}
            <LeafDecor className="absolute top-8 right-8 w-24 text-emerald-400" />
            <LeafDecor className="absolute bottom-12 left-6 w-16 text-[#c8860a] rotate-[30deg]" />
            <LeafDecor className="absolute top-1/2 right-4 w-10 text-emerald-300 -rotate-12" />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 inline-flex items-center gap-2 self-start bg-white/5 border border-white/10 rounded-full px-4 py-2"
          >
            <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a020]">Amaze Ayurveda</span>
          </motion.div>

          {/* Main hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 space-y-6 my-auto"
          >
            {/* Logo */}
            <div className="relative w-20 h-20 rounded-2xl bg-white/10 border border-white/10 overflow-hidden flex items-center justify-center">
              <Image src="/amaze-logo.png" alt="Amaze Ayurveda" fill className="object-contain p-3" />
            </div>

            <div className="space-y-3">
              <p className="text-[#c8a060]/70 text-xs font-semibold uppercase tracking-[0.25em]">Welcome to</p>
              <h2
                className="text-5xl font-black text-white leading-[1.05]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                BE INDIAN<br />
                <span className="text-[#e8a020] italic font-medium">BUY INDIAN</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Join thousands who trust Amaze Ayurveda for authentic, nature-forward wellness — rooted in Bharat.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { value: "50K+", label: "Members" },
                { value: "100%", label: "Ayurvedic" },
                { value: "₹0", label: "Hidden Fees" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
                  <p className="text-[#e8a020] text-lg font-black">{s.value}</p>
                  <p className="text-white/40 text-[10px] font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 flex items-center gap-2"
          >
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-white/25 text-[10px] uppercase tracking-widest">🌿 Vocal for Local</p>
            <div className="h-px flex-1 bg-white/10" />
          </motion.div>
        </div>

        {/* ══════════════════════════════════
            RIGHT  —  Form Panel
        ══════════════════════════════════ */}
        <div className="bg-white flex flex-col justify-center px-8 py-10 sm:px-10">
          <AnimatePresence mode="wait">

            {/* ── Registration Form ── */}
            {!signupSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28 }}
                className="space-y-7"
              >
                {/* Header */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e8a020]">New Account</p>
                  <h1
                    className="text-3xl font-black text-[#1c3320] tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Register
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Already a member?{" "}
                    <Link href="/sign-in" className="text-[#1c6634] font-semibold hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Sponsor ID */}
                    <FormField
                      control={form.control}
                      name="sponsorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Sponsor ID
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="AMZ251100123"
                                onBlur={handleSponsorBlur}
                                className={cn(
                                  "h-12 rounded-xl border-slate-200 bg-[#fafaf8] text-slate-900 font-medium text-sm",
                                  "focus-visible:border-[#1c6634]/40 focus-visible:ring-2 focus-visible:ring-[#1c6634]/10 pr-10",
                                  "transition-all placeholder:text-slate-300",
                                )}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                                {sponsorLoading
                                  ? <Loader2 className="w-4 h-4 animate-spin text-[#1c6634]" />
                                  : <Search className="w-4 h-4" />
                                }
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-400 font-medium" />

                          {/* Sponsor verified pill */}
                          <AnimatePresence>
                            {sponsorInfo && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 6 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                                    {sponsorInfo.name}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormItem>
                      )}
                    />

                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John Doe"
                              className="h-12 rounded-xl border-slate-200 bg-[#fafaf8] font-medium text-sm text-slate-900 focus-visible:border-[#1c6634]/40 focus-visible:ring-2 focus-visible:ring-[#1c6634]/10 placeholder:text-slate-300 transition-all"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-400 font-medium" />
                        </FormItem>
                      )}
                    />

                    {/* Mobile */}
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="10-digit number"
                              maxLength={10}
                              className="h-12 rounded-xl border-slate-200 bg-[#fafaf8] font-medium text-sm text-slate-900 focus-visible:border-[#1c6634]/40 focus-visible:ring-2 focus-visible:ring-[#1c6634]/10 placeholder:text-slate-300 transition-all"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-400 font-medium" />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="••••••••"
                              className="h-12 rounded-xl border-slate-200 bg-[#fafaf8] font-medium text-sm text-slate-900 focus-visible:border-[#1c6634]/40 focus-visible:ring-2 focus-visible:ring-[#1c6634]/10 placeholder:text-slate-300 transition-all"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-400 font-medium" />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <div className="pt-2 space-y-3">
                      <Button
                        type="submit"
                        disabled={!sponsorInfo || loading}
                        className={cn(
                          "w-full h-13 rounded-xl font-bold text-[11px] uppercase tracking-[0.18em]",
                          "bg-[#1c3320] hover:bg-[#1c6634] text-white",
                          "shadow-[0_4px_20px_rgba(28,50,32,0.25)] hover:shadow-[0_4px_28px_rgba(28,102,52,0.35)]",
                          "transition-all duration-200 active:scale-[0.98] disabled:opacity-40",
                          "flex items-center justify-center gap-2"
                        )}
                      >
                        {loading
                          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Registering…</>
                          : <><span>Complete Registration</span><ArrowRight className="w-3.5 h-3.5" /></>
                        }
                      </Button>

                      <p className="text-center text-[10px] text-slate-300 leading-relaxed">
                        By registering, you agree to our{" "}
                        <a href="#" className="text-slate-500 underline underline-offset-2 hover:text-[#1c6634]">Terms</a>
                        {" "}and{" "}
                        <a href="#" className="text-slate-500 underline underline-offset-2 hover:text-[#1c6634]">Privacy Policy</a>.
                      </p>
                    </div>
                  </form>
                </Form>
              </motion.div>

            ) : (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex flex-col items-center text-center space-y-6 py-8"
              >
                {/* Animated check */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border border-dashed border-emerald-200"
                  />
                </motion.div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e8a020]">
                    Welcome aboard
                  </p>
                  <h2
                    className="text-3xl font-black text-[#1c3320]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {successData?.name}!
                  </h2>
                  <p className="text-slate-400 text-sm">Your account is ready.</p>
                </div>

                {/* Username card */}
                <div className="w-full bg-[#1c3320] rounded-2xl p-5 text-center space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Your Login ID
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e8a020]" />
                    <p className="text-2xl font-black text-[#e8a020] tracking-widest">
                      {successData?.username}
                    </p>
                    <Sparkles className="w-4 h-4 text-[#e8a020]" />
                  </div>
                  <p className="text-white/30 text-[10px]">Save this ID to sign in.</p>
                </div>

                <Link href="/sign-in" className="w-full">
                  <Button
                    className="w-full h-12 rounded-xl bg-[#1c6634] hover:bg-[#1c3320] text-white font-bold text-[11px] uppercase tracking-[0.18em] transition-all"
                  >
                    Go to Dashboard →
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}