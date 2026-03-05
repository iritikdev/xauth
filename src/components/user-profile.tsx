"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import { User, MapPin, Building2, ShieldCheck, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type KYCFormData = z.infer<typeof kycSchema>

const sections = [
  {
    title: "Personal Information",
    icon: <User className="w-5 h-5 text-emerald-600" />,
    fields: [
      { label: "Full Name", name: "name", disabled: true, placeholder: "As per Aadhaar" },
      { label: "Mobile No.", name: "mobile", disabled: true, placeholder: "10-digit number" },
      { label: "Email Address", name: "email", placeholder: "example@mail.com" },
      { label: "Father's Name", name: "fatherName", placeholder: "Enter father's name" },
      { label: "Mother's Name", name: "motherName", placeholder: "Enter mother's name" },
    ]
  },
  {
    title: "Communication Address",
    icon: <MapPin className="w-5 h-5 text-emerald-600" />,
    fields: [
      { label: "Full Address", name: "address", placeholder: "House/Flat No, Street, Landmark" },
      { label: "District", name: "district", placeholder: "Enter district" },
      { label: "State", name: "state", placeholder: "Enter state" },
      { label: "Pin Code", name: "pincode", placeholder: "6-digit area code" },
    ]
  },
  {
    title: "Banking & Identity",
    icon: <Building2 className="w-5 h-5 text-emerald-600" />,
    fields: [
      { label: "Account Number", name: "accountNo", placeholder: "Enter bank account number" },
      { label: "IFSC Code", name: "ifsc", placeholder: "11-digit IFSC code" },
      { label: "Branch Name", name: "branch", placeholder: "Enter bank branch" },
      { label: "PAN Card Number", name: "panNumber", placeholder: "ABCDE1234F" },
      { label: "Aadhaar Number", name: "aadharNo", placeholder: "12-digit Aadhaar number" },
    ]
  }
];

export default function UserProfile() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<Partial<KYCFormData> | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: { name: "", mobile: "", email: "" },
  })

  const username = (session?.user as any)?.username

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && username) {
        try {
          const res = await fetch(`/api/user/${username}`)
          if (!res.ok) throw new Error("Failed to fetch user")
          const data = await res.json()
          setUserData(data)
        } catch (err) {
          console.error("Error fetching user:", err)
        }
      }
    }
    fetchUser()
  }, [status, username])

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name ?? "",
        mobile: userData.mobile ?? "",
        email: userData.email ?? "",
        fatherName: userData.fatherName ?? "",
        motherName: userData.motherName ?? "",
        address: userData.address ?? "",
        district: userData.district ?? "",
        state: userData.state ?? "",
        pincode: userData.pincode ?? "",
        accountNo: userData.accountNo ?? "",
        ifsc: userData.ifsc ?? "",
        branch: userData.branch ?? "",
        panNumber: userData.panNumber ?? "",
        aadharNo: userData.aadharNo ?? ""
      })
    }
  }, [userData, reset])

  const onSubmit = async (data: KYCFormData) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Submission failed")
      toast.success("Profile updated — you're good to go!")
    } catch (err) {
      toast.error("Something went wrong. Please retry.");
    } finally {
      setLoading(false)
    }
  }

  if (!userData) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner className="w-10 h-10 text-emerald-600" />
      <p className="text-slate-500 font-medium animate-pulse text-sm">Loading Swadeshi Profile...</p>
    </div>
  )

  return (
    <div className="mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Profile</h1>
          <p className="text-slate-500 font-medium">Complete your profile to unlock full benefits.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Secure Indian Gateway</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {sections.map((section, sectionIdx) => (
          <motion.div
            key={sectionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
          >
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
              <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center gap-3">
                {section.icon}
                <h2 className="font-bold text-slate-800 uppercase tracking-widest text-xs">{section.title}</h2>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-tight">
                        {field.label}
                      </Label>
                      <div className="relative">
                        <Input 
                          {...register(field.name as keyof KYCFormData)} 
                          disabled={field.disabled}
                          placeholder={field.placeholder}
                          className={cn(
                            "h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-emerald-500 transition-all",
                            field.disabled && "bg-slate-100/50 cursor-not-allowed opacity-70"
                          )}
                        />
                        {field.disabled && <CheckCircle2 className="absolute right-3 top-3.5 w-5 h-5 text-emerald-600" />}
                      </div>
                      {errors[field.name as keyof KYCFormData] && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase italic">
                          {errors[field.name as keyof KYCFormData]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end pt-4"
        >
          <Button 
            type="submit" 
            disabled={loading}
            className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-lg font-bold shadow-xl transition-all hover:scale-[1.02]"
          >
            {loading ? <Spinner className="mr-2 h-5 w-5" /> : null}
            {loading ? "Verifying..." : "Update Swadeshi Profile"}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}