'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signUpSchema } from "@/lib/validations/signup"
import { Spinner } from "./ui/spinner"
import { UserPlus, ShieldCheck, Flag, ArrowRight, CheckCircle2 } from "lucide-react"

type FormData = z.infer<typeof signUpSchema>

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [successData, setSuccessData] = useState<{name: string, username: string} | null>(null)
  const [sponsorInfo, setSponsorInfo] = useState<{ name: string; mobile: string } | null>(null)
  const [sponsorLoading, setSponsorLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  })

  const handleSponsorBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.target.value.trim()
    if (!id) return
    setSponsorLoading(true)
    try {
      const res = await fetch(`/api/user/${id}`)
      const data = await res.json()
      if (res.ok) {
        setSponsorInfo({ name: data.name, mobile: data.mobile })
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

  const onSubmit = async (form: FormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessData({ name: data.name, username: data.username })
        toast.success("Registration successful!")
        setSignupSuccess(true)
      } else {
        toast.error(data.message || "Registration failed.")
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2rem]">
        <CardContent className="grid p-0 md:grid-cols-2 bg-white">
          
          {/* Left Side: Form Container */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {!signupSuccess ? (
                <motion.div 
                  key="signup-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-8"
                >
                  <div className="space-y-2">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                      <UserPlus className="text-emerald-600 w-6 h-6" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 font-medium">Join Amaze Ayurveda and start your journey.</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                      {/* Sponsor Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="sponsorId" className="font-bold text-slate-700">Sponsor ID</Label>
                        <div className="relative">
                          <Input
                            id="sponsorId"
                            className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 bg-slate-50/50"
                            placeholder="AMZ251100123"
                            {...register("sponsorId")}
                            onBlur={handleSponsorBlur}
                          />
                          {sponsorLoading && <Spinner className="absolute right-3 top-4 h-4 w-4 animate-spin text-emerald-600" />}
                        </div>
                        <AnimatePresence>
                          {sponsorInfo && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-emerald-50 p-3 rounded-xl border border-emerald-100"
                            >
                              <p className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Found: {sponsorInfo.name}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Name Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="font-bold text-slate-700">Full Name</Label>
                        <Input id="name" className="h-12 rounded-xl bg-slate-50/50" placeholder="John Doe" {...register("name")} />
                        {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
                      </div>

                      {/* Mobile Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="mobile" className="font-bold text-slate-700">Mobile Number</Label>
                        <Input id="mobile" className="h-12 rounded-xl bg-slate-50/50" placeholder="10-digit number" {...register("mobile")} maxLength={10} />
                        {errors.mobile && <p className="text-xs font-bold text-red-500">{errors.mobile.message}</p>}
                      </div>

                      {/* Password Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                        <Input id="password" type="password" className="h-12 rounded-xl bg-slate-50/50" placeholder="••••••••" {...register("password")} />
                        {errors.password && <p className="text-xs font-bold text-red-500">{errors.password.message}</p>}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-lg font-bold shadow-xl transition-all" 
                      disabled={!sponsorInfo || loading}
                    >
                      {loading ? <Spinner className="mr-2 h-5 w-5" /> : "Complete Registration"}
                      {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>

                    <p className="text-center text-sm font-medium text-slate-500">
                      Already a member? <Link href="/sign-in" className="text-emerald-600 font-bold hover:underline">Log in</Link>
                    </p>
                  </form>
                </motion.div>
              ) : (
                /* Success State */
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900">Welcome, {successData?.name}!</h2>
                    <p className="text-slate-500">Your registration is successful.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border w-full space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username / Login ID</p>
                    <p className="text-2xl font-black text-emerald-600 tracking-wider">{successData?.username}</p>
                  </div>
                  <Link href="/sign-in" className="w-full">
                    <Button className="w-full h-14 rounded-2xl bg-emerald-600 text-lg font-bold">Go to Dashboard</Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Animated Brand Hero */}
          <div className="relative hidden md:flex items-center justify-center p-12 bg-slate-900 overflow-hidden">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]"
            />

            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl"
              >
                <div className="relative w-32 h-32 mb-6 mx-auto">
                   <Image
                    fill
                    src="/amaze-logo.png"
                    alt="Logo"
                    className="object-contain"
                  />
                </div>
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  <Flag className="w-3 h-3 fill-current" /> Vocal for Local
                </div>
                <h3 className="text-3xl font-black text-white leading-tight">BE INDIAN<br/><span className="text-emerald-500 font-serif italic italic font-medium tracking-normal">BUY INDIAN</span></h3>
              </motion.div>
              
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                <p className="text-sm font-medium">100% Secure Ayurvedic Registration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-slate-500 text-center text-xs font-medium px-4">
        By clicking continue, you agree to our <a href="#" className="text-slate-900 underline font-bold">Terms of Service</a> and <a href="#" className="text-slate-900 underline font-bold">Privacy Policy</a>.
      </div>
    </div>
  )
}