"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { kycSchema } from "@/lib/validations/register-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { FormInput } from "@/components/ui/form-input";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronRight,
  Home,
  Loader2,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type KYCFormData = z.infer<typeof kycSchema>;

export default function UserProfileForm({onSuccess}: { onSuccess: () => void }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const username = (session?.user as any)?.username;

  const { data: userData, isLoading: isUserLoading } = useUser(username);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: "onTouched", // Shows errors as soon as user interacts with a field
  });

  const watchedPincode = useWatch({ control, name: "pincode" });
  const watchedIFSC = useWatch({ control, name: "ifsc" });

  useEffect(() => {
    if (userData) reset(userData);
  }, [userData, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: KYCFormData) => {
      const res = await fetch(`/api/user/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", username] });
      toast.success("Profile Authenticated Successfully!");
    },
    onError: () => toast.error("Update failed. Please retry."),
  });

  // --- AUTO-FETCH LOGIC (Pincode & IFSC) ---
  useEffect(() => {
    const fetchBank = async (code: string) => {
      if (code.length === 11) {
        setFetchingBank(true);
        try {
          const res = await fetch(
            `https://ifsc.razorpay.com/${code.toUpperCase()}`,
          );
          if (res.ok) {
            const data = await res.json();
            setValue("branch", `${data.BANK} - ${data.BRANCH}`, {
              shouldValidate: true,
            });
          }
        } finally {
          setFetchingBank(false);
        }
      }
    };
    fetchBank(watchedIFSC || "");
  }, [watchedIFSC, setValue]);

  useEffect(() => {
    const fetchAddr = async (pin: string) => {
      if (pin?.length === 6) {
        setFetchingAddress(true);
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${pin}`,
          );
          const data = await res.json();
          if (data[0]?.Status === "Success") {
            const po = data[0].PostOffice[0];
            setValue("district", po.District, { shouldValidate: true });
            setValue("state", po.State, { shouldValidate: true });
          }
        } finally {
          setFetchingAddress(false);
        }
      }
    };
    fetchAddr(watchedPincode || "");
  }, [watchedPincode, setValue]);

  if (isUserLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className="py-12 px-6 bg-slate-50/30 rounded-[3rem]">
      <header className="flex justify-between items-center mb-12 border-b pb-10">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a]">Your Profile</h1>
          <p className="text-slate-500 font-medium mt-1">
            Verified Swadeshi Associate Portal
          </p>
        </div>
        <ShieldCheck className="w-10 h-10 text-emerald-600 opacity-20" />
      </header>

      <form
        onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
        className="space-y-12"
      >
        {/* PERSONAL SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-4">
            <User className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Basic Identity
            </h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FormInput
                label="Full Name"
                {...register("name")}
                error={errors.name?.message}
                disabled
                className="bg-slate-50 font-bold"
              />
              <FormInput
                label="Mobile Number"
                {...register("mobile")}
                error={errors.mobile?.message}
                disabled
                className="bg-slate-50 font-bold"
              />
              <FormInput
                label="Email Address"
                {...register("email")}
                error={errors.email?.message}
              />
              <FormInput
                label="Father's Name"
                {...register("fatherName")}
                error={errors.fatherName?.message}
              />
              <FormInput
                label="Mother's Name"
                {...register("motherName")}
                error={errors.motherName?.message}
              />
            </div>
          </Card>
        </section>

        {/* ADDRESS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-4">
            <Home className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Postal Address
            </h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
            <FormInput
              label="Full Delivery Address"
              {...register("address")}
              error={errors.address?.message}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormInput
                verified={watchedPincode?.length === 6 && !errors.pincode}
                label="Pin Code"
                {...register("pincode")}
                error={errors.pincode?.message}
                maxLength={6}
                icon={
                  fetchingAddress && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )
                }
              />

              <FormInput
                label="District"
                {...register("district")}
                error={errors.district?.message}
                readOnly
                className="bg-slate-50"
                verified={watchedPincode?.length === 6 && !errors.pincode}
              />
              <FormInput
                label="State"
                {...register("state")}
                error={errors.state?.message}
                readOnly
                className="bg-slate-50"
                verified={watchedPincode?.length === 6 && !errors.pincode}
              />
            </div>
          </Card>
        </section>

        {/* BANKING SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-4">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Banking & ID
            </h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PAN Number Field */}
              <FormInput
                label="PAN Number"
                {...register("panNumber")}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setValue("panNumber", val, { shouldValidate: true });
                }}
                error={errors.panNumber?.message}
                maxLength={10}
                className="uppercase font-bold tracking-widest"
                placeholder="ABCDE1234F"
              />
              <FormInput
                label="Aadhaar Number"
                {...register("aadharNo")}
                error={errors.aadharNo?.message}
                maxLength={12}
                className="font-mono tracking-widest"
              />
              <FormInput
                label="Account Number"
                {...register("accountNo")}
                error={errors.accountNo?.message}
              />
              {/* IFSC Code Field */}
              <FormInput
                label="IFSC Code"
                {...register("ifsc")}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setValue("ifsc", val, { shouldValidate: true });
                }}
                error={errors.ifsc?.message}
                verified={watchedIFSC?.length === 11 && !errors.ifsc}
                icon={
                  fetchingBank && (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  )
                }
                maxLength={11}
                className="uppercase font-bold tracking-widest"
                placeholder="SBIN0001234"
              />
              <FormInput
                label="Bank Branch"
                {...register("branch")}
                error={errors.branch?.message}
                readOnly
                className="bg-slate-50 md:col-span-2"
                verified={watchedIFSC?.length === 11 && !errors.ifsc}
              />
            </div>
          </Card>
        </section>

        <div className="flex justify-end p-4 pb-12">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg transition-all shadow-2xl"
          >
            {updateMutation.isPending
              ? "Securing Data..."
              : "Update Swadeshi Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
