"use client"

import React, { useEffect, useState } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { z } from "zod"
import { kycSchema } from "@/lib/validations/register-user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { 
  User, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  ChevronRight,
  Home,
  Award,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

type KYCFormData = z.infer<typeof kycSchema>

export default function KYCForm() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetchingAddress, setFetchingAddress] = useState(false)
  const [userData, setUserData] = useState<Partial<KYCFormData> | null>(null)
  const [showAadhaar, setShowAadhaar] = useState(false)

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: { name: "", mobile: "", email: "", aadharNo: "", pincode: "" },
  })

  const username = (session?.user as any)?.username
  const watchedPincode = useWatch({ control, name: "pincode" });

  // --- SAFE MASKING LOGIC ---
  const formatAadhaar = (value: string | undefined | null) => {
    if (!value) return "";
    const digits = value.toString().replace(/\D/g, "").slice(0, 12);
    let result = digits;
    if (!showAadhaar) {
      const masked = digits.slice(0, 8).replace(/\d/g, "•");
      result = masked + digits.slice(8);
    }
    return result.replace(/(.{4})(?=.+)/g, "$1 ");
  };

  // --- AUTO-FILL ADDRESS BY PINCODE ---
  useEffect(() => {
    const fetchAddress = async (pin: string | undefined | null) => {
      if (pin && pin.length === 6 && /^\d+$/.test(pin)) {
        setFetchingAddress(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          if (data && data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setValue("district", postOffice.District);
            setValue("state", postOffice.State);
            toast.success(`Location identified: ${postOffice.District}`);
          }
        } catch (error) {
          console.error("Pincode error:", error);
        } finally {
          setFetchingAddress(false);
        }
      }
    };
    fetchAddress(watchedPincode);
  }, [watchedPincode, setValue]);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && username) {
        try {
          const res = await fetch(`/api/user/${username}`)
          if (!res.ok) throw new Error("Failed to fetch user")
          const data = await res.json()
          setUserData(data)
        } catch (err) { console.error(err) }
      }
    }
    fetchUser()
  }, [status, username])

  useEffect(() => {
    if (userData) { reset(userData) }
  }, [userData, reset])

  const onSubmit = async (data: KYCFormData) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Submission failed")
      toast.success("Profile Authenticated Successfully!")
    } catch (err) {
      toast.error("Update failed. Please retry.");
    } finally { setLoading(false) }
  }

  if (!userData) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner className="w-10 h-10 text-emerald-600" />
      <p className="text-slate-500 font-medium animate-pulse tracking-widest uppercase text-xs">Initializing Secure Indian Gateway...</p>
    </div>
  )

  return (
    <div className=" mx-auto py-12 px-6 bg-slate-50/30 rounded-[3rem]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-slate-200/60 pb-10 px-4">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">Your Profile</h1>
          <p className="text-slate-500 font-medium mt-2">Verified Associate Portal • Be Indian, Buy Indian</p>
        </div>
        <div className="flex items-center gap-3 bg-white shadow-sm border border-emerald-100 px-6 py-4 rounded-2xl">
          <ShieldCheck className="w-6 h-6 text-[#059669]" />
          <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Verified Secure</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-4">
            <User className="w-4 h-4 text-[#059669]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Basic Identity</h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: "Full Name", name: "name", disabled: true, verified: true },
                { label: "Verified Mobile", name: "mobile", disabled: true, verified: true },
                { label: "Email Address", name: "email" },
                { label: "Father's Name", name: "fatherName" },
                { label: "Mother's Name", name: "motherName" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{field.label}</Label>
                  <div className="relative">
                    <Input {...register(field.name as keyof KYCFormData)} disabled={field.disabled} className={cn("h-12 rounded-xl border-slate-200", field.disabled && "bg-slate-50 font-bold opacity-80")} />
                    {field.verified && <CheckCircle2 className="absolute right-3 top-3.5 w-5 h-5 text-[#059669]" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* SECTION 2: COMMUNICATION ADDRESS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2 ml-4 mr-8">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-[#059669]" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Postal Address</h2>
            </div>
            {fetchingAddress && <span className="text-[10px] font-bold text-emerald-600 animate-pulse flex items-center gap-1"><Spinner className="w-3 h-3" /> Fetching...</span>}
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
            <CardContent className="p-10 space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Delivery Address</Label>
                <Input {...register("address")} className="h-12 rounded-xl border-slate-200" placeholder="House/Flat No, Street, Landmark" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Pin Code</Label>
                  <Input {...register("pincode")} maxLength={6} className="h-12 rounded-xl border-slate-200 font-bold" placeholder="6-digit" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">District</Label>
                  <Input {...register("district")} className="h-12 rounded-xl border-slate-200 bg-slate-50/50" placeholder="Auto-filled" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">State</Label>
                  <Input {...register("state")} className="h-12 rounded-xl border-slate-200 bg-slate-50/50" placeholder="Auto-filled" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 3: NOMINEE DETAILS */}
        {/* <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-4">
            <Users className="w-4 h-4 text-[#059669]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Nominee for Inheritance</h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden bg-white border-l-4 border-orange-400">
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nominee Name</Label>
                <Input {...register("nomineeName")} className="h-12 rounded-xl border-slate-200" placeholder="Full name of beneficiary" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Relationship</Label>
                <Input {...register("nomineeRelation")} className="h-12 rounded-xl border-slate-200" placeholder="e.g. Spouse, Son, Mother" />
              </div>
            </CardContent>
          </Card>
        </section> */}

        {/* SECTION 4: BANKING & IDENTITY */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-4">
            <Building2 className="w-4 h-4 text-[#059669]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Identity & Banking</h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Aadhaar Card Number</Label>
                <div className="relative">
                  <Controller name="aadharNo" control={control} render={({ field: { onChange, value } }) => (
                    <Input value={formatAadhaar(value)} onChange={(e) => { const raw = e.target.value.replace(/\D/g, ""); if (raw.length <= 12) onChange(raw); }} className="h-12 rounded-xl border-slate-200 font-mono tracking-[0.1em]" placeholder="XXXX XXXX XXXX" />
                  )} />
                  <button type="button" onClick={() => setShowAadhaar(!showAadhaar)} className="absolute right-4 top-3.5 text-slate-400 hover:text-[#059669] transition-colors">{showAadhaar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">PAN Number</Label>
                <Input {...register("panNumber")} className="h-12 rounded-xl border-slate-200 uppercase" placeholder="ABCDE1234F" />
              </div>
              {[ { label: "Account No", name: "accountNo" }, { label: "IFSC Code", name: "ifsc" }, { label: "Bank Branch", name: "branch" }].map((f) => (
                <div key={f.name} className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{f.label}</Label>
                  <Input {...register(f.name as keyof KYCFormData)} className="h-12 rounded-xl border-slate-200" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 px-4 pb-12">
          <p className="text-[11px] text-slate-400 max-w-sm text-center md:text-left font-medium">By updating, you declare these details are accurate per your Government ID.</p>
          <Button type="submit" disabled={loading} className="w-full md:w-auto h-16 px-16 rounded-2xl bg-[#0f172a] hover:bg-[#059669] text-white font-black text-lg transition-all shadow-xl group">
            {loading ? <Spinner className="mr-2" /> : <ChevronRight className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            {loading ? "Securing Data..." : "Update Swadeshi Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}