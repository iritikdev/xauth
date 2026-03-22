'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { signUpSchema } from "@/lib/validations/signup"
import {
  CheckCircle2, ArrowRight, Leaf, Loader2,
  Search, Sparkles, Gift, Link2,
} from "lucide-react"

type FormData = z.infer<typeof signUpSchema>

/* ─── leaf SVG ────────────────────────────────────────────────── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15" />
  </svg>
)

/* ─── field token ─────────────────────────────────────────────── */
const fieldCls = cn(
  "h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 font-medium text-sm",
  "focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/10",
  "placeholder:text-zinc-300 transition-all"
)

/* ─── component ───────────────────────────────────────────────── */
export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()

  const [loading, setLoading]           = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [successData, setSuccessData]   = useState<{ name: string; username: string } | null>(null)
  const [sponsorInfo, setSponsorInfo]   = useState<{ name: string; mobile: string } | null>(null)
  const [sponsorLoading, setSponsorLoading] = useState(false)
  const [refPrefilled, setRefPrefilled] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { sponsorId: "", name: "", mobile: "", password: "" },
  })

  /* ── auto-fill from ?ref= ── */
  useEffect(() => {
    const ref = searchParams.get("ref")
    if (!ref) return
    form.setValue("sponsorId", ref)
    setRefPrefilled(true)
    setSponsorLoading(true)
    fetch(`/api/user/${ref}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) {
          setSponsorInfo({ name: d.name, mobile: d.mobile })
          toast.success(`Referred by ${d.name} — welcome!`)
        } else {
          setSponsorInfo(null)
          form.setValue("sponsorId", "")
          setRefPrefilled(false)
          toast.error("Referral link is invalid or expired.")
        }
      })
      .catch(() => { setSponsorInfo(null); setRefPrefilled(false); toast.error("Could not verify referral.") })
      .finally(() => setSponsorLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── manual sponsor lookup ── */
  const handleSponsorBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.target.value.trim()
    if (!id) { setSponsorInfo(null); return }
    setSponsorLoading(true)
    try {
      const res = await fetch(`/api/user/${id}`)
      const data = await res.json()
      if (res.ok) { setSponsorInfo({ name: data.name, mobile: data.mobile }); toast.success("Sponsor verified.") }
      else { setSponsorInfo(null); toast.error(data.message || "Sponsor not found.") }
    } catch { setSponsorInfo(null); toast.error("Failed to fetch sponsor info.") }
    finally { setSponsorLoading(false) }
  }

  /* ── submit ── */
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
    } catch { toast.error("Something went wrong.") }
    finally { setLoading(false) }
  }

  return (
    <div
      className={cn("min-h-screen w-full flex items-center justify-center p-4 sm:p-8", className)}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      {...props}
    >
      <div className="w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(4,47,46,0.2)] grid md:grid-cols-[1fr_420px]">

        {/* ══════════════ LEFT HERO ══════════════ */}
        <div className="relative hidden md:flex flex-col justify-between bg-zinc-950 p-12 overflow-hidden">
          {["tl","tr","bl","br"].map((p) => (
            <span key={p} className={cn("absolute h-6 w-6 border-emerald-400/30",
              p==="tl"&&"top-5 left-5 border-t-2 border-l-2 rounded-tl-md",
              p==="tr"&&"top-5 right-5 border-t-2 border-r-2 rounded-tr-md",
              p==="bl"&&"bottom-5 left-5 border-b-2 border-l-2 rounded-bl-md",
              p==="br"&&"bottom-5 right-5 border-b-2 border-r-2 rounded-br-md")} />
          ))}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/5 blur-[80px]" />
            <div className="absolute -bottom-32 -right-10 w-80 h-80 rounded-full bg-emerald-600/8 blur-[80px]" />
            <LeafDecor className="absolute top-8 right-8 w-24 text-emerald-400" />
            <LeafDecor className="absolute bottom-12 left-6 w-16 text-emerald-600 rotate-[30deg]" />
            <LeafDecor className="absolute top-1/2 right-4 w-10 text-emerald-300 -rotate-12" />
            <div className="absolute inset-0 opacity-[0.025]" style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
          </div>

          <motion.div initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
            className="relative z-10 inline-flex items-center gap-2 self-start bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Amaze Ayurveda</span>
          </motion.div>

          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
            className="relative z-10 space-y-6 my-auto">
            <div className="relative w-20 h-20 rounded-2xl bg-white/10 border border-white/10 overflow-hidden flex items-center justify-center">
              <Image src="/amaze-logo.png" alt="Amaze Ayurveda" fill className="object-contain p-3" />
            </div>
            <div className="space-y-3">
              <p className="text-emerald-500/70 text-xs font-semibold uppercase tracking-[0.25em]">Welcome to</p>
              <h2 className="text-5xl font-black text-white leading-[1.05]"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                BE INDIAN<br />
                <span className="text-emerald-400 font-extrabold">BUY INDIAN</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Join thousands who trust Amaze Ayurveda for authentic, nature-forward wellness — rooted in Bharat.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[{ value:"50K+",label:"Members" },{ value:"100%",label:"Ayurvedic" },{ value:"₹0",label:"Hidden Fees" }].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/[0.08] rounded-2xl p-3 text-center">
                  <p className="text-emerald-400 text-lg font-black" style={{ fontFamily:"'Manrope',system-ui,sans-serif" }}>{s.value}</p>
                  <p className="text-white/40 text-[10px] font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {/* referral hint */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <Gift size={14} className="text-emerald-400 shrink-0" />
              <p className="text-[11px] text-white/40 leading-snug">
                Have a referral link? It auto-fills your sponsor — just open the link to register.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="relative z-10 flex items-center gap-2">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-white/25 text-[10px] uppercase tracking-widest">🌿 Vocal for Local</p>
            <div className="h-px flex-1 bg-white/10" />
          </motion.div>
        </div>

        {/* ══════════════ RIGHT FORM ══════════════ */}
        <div className="bg-white flex flex-col justify-center px-8 py-10 sm:px-10">
          <AnimatePresence mode="wait">

            {!signupSuccess ? (
              <motion.div key="form"
                initial={{ opacity:0,x:16 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-16 }}
                transition={{ duration:0.28 }} className="space-y-6">

                {/* header */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">New Account</p>
                  <h1 className="text-3xl font-black text-zinc-900 tracking-tight"
                    style={{ fontFamily:"'Manrope',system-ui,sans-serif" }}>Register</h1>
                  <p className="text-zinc-400 text-sm">
                    Already a member?{" "}
                    <Link href="/sign-in" className="text-emerald-700 font-semibold hover:underline">Log in</Link>
                  </p>
                </div>

                {/* ── referral banner ── */}
                <AnimatePresence>
                  {refPrefilled && sponsorInfo && (
                    <motion.div
                      initial={{ opacity:0,y:-8,height:0 }}
                      animate={{ opacity:1,y:0,height:"auto" }}
                      exit={{ opacity:0,height:0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                          <Gift size={15} className="text-emerald-600" strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600 mb-0.5">
                            Referred by
                          </p>
                          <p className="text-sm font-black text-emerald-900 truncate"
                            style={{ fontFamily:"'Manrope',system-ui,sans-serif" }}>
                            {sponsorInfo.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Sponsor ID */}
                    <FormField control={form.control} name="sponsorId" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Sponsor ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} placeholder="AMZ251100123" onBlur={handleSponsorBlur}
                              readOnly={refPrefilled && !!sponsorInfo}
                              className={cn(fieldCls, "pr-10",
                                refPrefilled && sponsorInfo && "border-emerald-200 bg-emerald-50/60 text-emerald-800")} />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300">
                              {sponsorLoading
                                ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                : refPrefilled && sponsorInfo
                                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  : <Search className="w-4 h-4" />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] text-red-400 font-medium" />
                        {/* manual verify pill */}
                        <AnimatePresence>
                          {sponsorInfo && !refPrefilled && (
                            <motion.div initial={{ opacity:0,height:0,marginTop:0 }}
                              animate={{ opacity:1,height:"auto",marginTop:6 }}
                              exit={{ opacity:0,height:0,marginTop:0 }} className="overflow-hidden">
                              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">{sponsorInfo.name}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormItem>
                    )} />

                    {/* Full Name */}
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Full Name</FormLabel>
                        <FormControl><Input {...field} placeholder="John Doe" className={fieldCls} /></FormControl>
                        <FormMessage className="text-[11px] text-red-400 font-medium" />
                      </FormItem>
                    )} />

                    {/* Mobile */}
                    <FormField control={form.control} name="mobile" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Mobile Number</FormLabel>
                        <FormControl><Input {...field} placeholder="10-digit number" maxLength={10} className={fieldCls} /></FormControl>
                        <FormMessage className="text-[11px] text-red-400 font-medium" />
                      </FormItem>
                    )} />

                    {/* Password */}
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Password</FormLabel>
                        <FormControl><Input {...field} type="password" placeholder="••••••••" className={fieldCls} /></FormControl>
                        <FormMessage className="text-[11px] text-red-400 font-medium" />
                      </FormItem>
                    )} />

                    <div className="pt-2 space-y-3">
                      <button type="submit" disabled={!sponsorInfo || loading}
                        className={cn(
                          "w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-[0.18em]",
                          "flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]",
                          "bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm shadow-zinc-900/20",
                          "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}>
                        {loading
                          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Registering…</>
                          : <><span>Complete Registration</span><ArrowRight className="w-3.5 h-3.5" /></>}
                      </button>
                      <p className="text-center text-[10px] text-zinc-300 leading-relaxed">
                        By registering, you agree to our{" "}
                        <a href="#" className="text-zinc-500 underline underline-offset-2 hover:text-emerald-700">Terms</a>
                        {" "}and{" "}
                        <a href="#" className="text-zinc-500 underline underline-offset-2 hover:text-emerald-700">Privacy Policy</a>.
                      </p>
                    </div>
                  </form>
                </Form>
              </motion.div>

            ) : (
              /* ── Success ── */
              <motion.div key="success"
                initial={{ opacity:0,scale:0.94 }} animate={{ opacity:1,scale:1 }}
                transition={{ type:"spring",stiffness:260,damping:22 }}
                className="flex flex-col items-center text-center space-y-5 py-6">

                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:"spring",stiffness:300,damping:18,delay:0.1 }} className="relative">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <motion.div animate={{ rotate:360 }} transition={{ duration:8,repeat:Infinity,ease:"linear" }}
                    className="absolute -inset-2 rounded-full border border-dashed border-emerald-200" />
                </motion.div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">Welcome aboard</p>
                  <h2 className="text-3xl font-black text-zinc-900"
                    style={{ fontFamily:"'Manrope',system-ui,sans-serif" }}>{successData?.name}!</h2>
                  <p className="text-zinc-400 text-sm">Your account is ready.</p>
                </div>

                {/* username card */}
                <div className="w-full bg-zinc-950 rounded-2xl p-5 text-center space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Your Login ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <p className="text-2xl font-black text-emerald-400 tracking-widest"
                      style={{ fontFamily:"'Manrope',system-ui,sans-serif" }}>{successData?.username}</p>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-white/30 text-[10px]">Save this ID to sign in.</p>
                </div>

                {/* referral share nudge */}
                <div className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-4 space-y-2.5 text-left">
                  <div className="flex items-center gap-2">
                    <Gift size={13} className="text-emerald-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
                      Share your referral link
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1 pl-3">
                    <Link2 size={11} className="text-zinc-400 shrink-0" />
                    <span className="flex-1 text-[11px] font-medium text-zinc-400 truncate">
                      amazeayurveda.com/ref/{successData?.username}
                    </span>
                    <button type="button"
                      onClick={() => { navigator.clipboard.writeText(`https://amazeayurveda.com/ref/${successData?.username}`); toast.success("Referral link copied!") }}
                      className="h-7 rounded-lg bg-zinc-950 text-white px-3 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors shrink-0">
                      Copy
                    </button>
                  </div>
                </div>

                <Link href="/sign-in" className="w-full">
                  <button className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-[11px] uppercase tracking-[0.18em] transition-all">
                    Go to Dashboard →
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}