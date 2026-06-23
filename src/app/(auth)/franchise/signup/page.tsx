"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, Landmark, ArrowRight,
  ArrowLeft, ShieldCheck, Loader2, UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { franchiseSignupSchema, FranchiseSignupValues } from "@/lib/validations/franchise";

// Hooks Isolation Layer
import { usePincodeAutoFill } from "@/hooks/use-pincode-autofill";
import { useIfscAutoFill } from "@/hooks/use-ifsc-autofill";

export default function FranchiseSignupWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FranchiseSignupValues>({
    resolver: zodResolver(franchiseSignupSchema),
    mode: "all",
    defaultValues: {
      franchiseType: "DISTRICT_FRANCHISE",
      name: "Amaze Ayurveda Muzaffarpur",
      ownerName: "Rohit Kumar",
      mobile: "9876543210",
      email: "rohit.franchise@example.com",
      panNo: "ABCDE1234F",
      gstNo: "10ABCDE1234F1Z5",
      address: "Kalambagh Road, Muzaffarpur",
      pinCode: "",
      state: "",
      district: "",
      username: "rohit_franchise",
      password: "Test@12345",
      
      branch: "",
      accountNo: "123456789012",
      ifsc: "",
      agreeTerms: true,
    }
  });

  const { setValue, control, handleSubmit, trigger } = form;

  /* ══════════════════════════════════════════════
     AUTOMATED GEO & BANK DATA COUPLING LAYER
  ══════════════════════════════════════════════ */
  const pinCodeValue = useWatch({ control, name: "pinCode" });
  const ifscValue = useWatch({ control, name: "ifsc" });

  const { isFetchingGeo } = usePincodeAutoFill({
    pincode: pinCodeValue,
    setValue,
  });

  const { isFetchingBank } = useIfscAutoFill({
    ifsc: ifscValue,
    setValue,
  });

  const validateAndNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ["franchiseType", "name", "ownerName", "mobile", "email", "panNo"];
    } else if (step === 2) {
      fieldsToValidate = ["address", "pinCode", "state", "district", "username", "password"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
  };

  const onSubmit = async (data: FranchiseSignupValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting secure payload:", data);
      toast.success("Registration Successful!", {
        description: "Your franchise application has been sent for verification.",
      });
    } catch (err) {
      toast.error("Registration failed. Please check network parameters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[2rem] border border-zinc-200/60 p-5 sm:p-8 shadow-xl text-zinc-900 font-sans select-none relative overflow-hidden">
      
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#e8a020] to-transparent pointer-events-none" />

      {/* Stepper Wizard Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
        {[
          { num: 1, label: "Profile", icon: Building2 },
          { num: 2, label: "Location", icon: MapPin },
          { num: 3, label: "Banking", icon: Landmark }
        ].map((item) => (
          <div key={item.num} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center border text-xs font-black transition-all ${
              step >= item.num
                ? "bg-zinc-950 border-zinc-950 text-white shadow-md shadow-zinc-950/10"
                : "bg-zinc-50 border-zinc-200 text-zinc-400"
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider hidden sm:inline ${
              step >= item.num ? "text-zinc-900" : "text-zinc-400"
            }`}>{item.label}</span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">

            {/* ─── STEP 1: BASIC INFORMATION ─── */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 8 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -8 }} 
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={control} name="franchiseType" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Select Franchise *</FormLabel>
                      <select {...field} className="w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-zinc-800">
                        <option value="HOME_SHOPEE">Home Shopee</option>
                        <option value="DISTRICT_FRANCHISE">Franchise (Town)</option>
                        <option value="DEPO">C & F (Depo)</option>
                      </select>
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                  
                  <FormField control={control} name="name" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Franchise Name *</FormLabel>
                      <Input {...field} placeholder="Amaze Wellness Hub" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10 focus-visible:bg-white" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={control} name="ownerName" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Owner Full Name *</FormLabel>
                    <Input {...field} placeholder="John Doe" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10 focus-visible:bg-white" />
                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={control} name="mobile" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Mobile Number *</FormLabel>
                      <Input {...field} placeholder="9876543210" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                  
                  <FormField control={control} name="email" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Email Address *</FormLabel>
                      <Input {...field} type="email" placeholder="partner@amaze.com" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={control} name="panNo" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">PAN Number *</FormLabel>
                      <Input {...field} placeholder="ABCDE1234F" className="h-12 rounded-xl bg-zinc-50 text-xs font-black uppercase tracking-wider border-zinc-200 focus-visible:ring-emerald-500/10" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                  
                  <FormField control={control} name="gstNo" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">GST Number (Optional)</FormLabel>
                      <Input {...field} placeholder="22AAAAA0000A1Z5" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold uppercase border-zinc-200 focus-visible:ring-emerald-500/10" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                    </FormItem>
                  )} />
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: REGIONAL ADDRESS & SECURITY ─── */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 8 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -8 }} 
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <FormField control={control} name="address" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Full Commercial Address *</FormLabel>
                    <textarea {...field} rows={2} placeholder="Shop No, Building Name, Street Param..." className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border-zinc-200 text-zinc-800" />
                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                  </FormItem>
                )} />

                <div className="grid grid-cols-3 gap-3">
                  <FormField control={control} name="pinCode" render={({ field }) => (
                    <FormItem className="space-y-1.5 col-span-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                        <span>Pin Code *</span>
                        {isFetchingGeo && <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={6} placeholder="400001" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10" />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />

                  <FormField control={control} name="state" render={({ field }) => (
                    <FormItem className="space-y-1.5 col-span-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">State *</FormLabel>
                      <Input {...field} readOnly placeholder="Auto Filled" className="h-12 rounded-xl bg-zinc-100/80 border-zinc-200 text-xs font-bold text-zinc-500 cursor-not-allowed select-none" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />

                  <FormField control={control} name="district" render={({ field }) => (
                    <FormItem className="space-y-1.5 col-span-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">City / District *</FormLabel>
                      <Input {...field} readOnly placeholder="Auto Filled" className="h-12 rounded-xl bg-zinc-100/80 border-zinc-200 text-xs font-bold text-zinc-500 cursor-not-allowed select-none" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-50 pt-4">
                  <FormField control={control} name="username" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Choose Username *</FormLabel>
                      <Input {...field} placeholder="amaze_franchise" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                  
                  <FormField control={control} name="password" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Account Password *</FormLabel>
                      <Input {...field} type="password" placeholder="••••••••" className="h-12 rounded-xl bg-zinc-50 text-xs font-bold border-zinc-200 focus-visible:ring-emerald-500/10" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: FINANCIAL SETTLEMENTS & KYC FILE UPLOADS ─── */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 8 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -8 }} 
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={control} name="ifsc" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                        <span>Bank IFSC Code *</span>
                        {isFetchingBank && <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={11} placeholder="SBIN0001234" className="h-12 rounded-xl bg-zinc-50 text-xs font-mono font-black uppercase tracking-wider border-zinc-200 focus-visible:ring-emerald-500/10" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />

                  
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={control} name="branch" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Branch Name *</FormLabel>
                      <Input {...field} readOnly placeholder="Auto Filled" className="h-12 rounded-xl bg-zinc-100/80 border-zinc-200 text-xs font-bold text-zinc-500 cursor-not-allowed select-none" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />

                  <FormField control={control} name="accountNo" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Account Number *</FormLabel>
                      <Input {...field} placeholder="123456789012" className="h-12 rounded-xl bg-zinc-50 text-xs font-mono font-bold tracking-wider border-zinc-200 focus-visible:ring-emerald-500/10" />
                      <FormMessage className="text-[10px] font-bold text-rose-500" />
                    </FormItem>
                  )} />
                </div>

                {/* Documents Grid */}
                <div className="pt-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">Required KYC Documents Upload</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {["Aadhar Card Copy", "Pan Card Copy"].map((doc) => (
                      <div key={doc} className="border border-dashed border-zinc-200 bg-zinc-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-100/60 hover:border-zinc-300 transition-all group">
                        <UploadCloud className="h-5 w-5 text-zinc-400 group-hover:text-emerald-500 transition-colors mb-1" />
                        <span className="text-[9px] font-bold text-zinc-600">{doc}</span>
                        <span className="text-[8px] font-medium text-zinc-400 mt-0.5">Max size 2MB</span>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField control={control} name="agreeTerms" render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/40 p-3 select-none mt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5 border-zinc-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-md h-4 w-4" />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <Label className="text-[10px] font-bold text-zinc-600 cursor-pointer">I explicitly agree to all Franchise Partnership Terms & operational Policies.</Label>
                      <FormMessage className="text-[9px] font-bold text-rose-500" />
                    </div>
                  </FormItem>
                )} />
              </motion.div>
            )}

            {/* Controller Action Row */}
            <div className="flex gap-3 pt-4 border-t border-zinc-100">
              {step > 1 && (
                <Button type="button" variant="ghost" className="h-11 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 px-4 transition-colors" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="mr-1.5 h-4 w-4 stroke-[2.5]" /> Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" className="h-11 flex-1 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ml-auto transition-colors shadow-sm" onClick={validateAndNext}>
                  Continue <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="h-11 flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 ml-auto shadow-lg shadow-emerald-500/10 transition-all disabled:opacity-50">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing Matrix...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 stroke-[2.5]" /> Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>

          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
}