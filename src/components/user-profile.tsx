"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { kycSchema } from "@/lib/validations/register-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { FormInput } from "@/components/ui/form-input";
import { PhotoUpload } from "@/components/dashboard/photo-upload"; // Import the photo component
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
  User,
  Building2,
  ShieldCheck,
  Home,
  Loader2,
  Camera,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type KYCFormData = z.infer<typeof kycSchema>;

export default function UserProfileForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const username = (session?.user as any)?.username;

  const { data: userData, isLoading: isUserLoading } = useUser(username);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);

  console.log("Fetched user data:", userData); // Debug log to check fetched data
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: "onTouched",
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
      onSuccess(); // Switch back to summary view
    },
    onError: () => toast.error("Update failed. Please retry."),
  });

  // --- AUTO-FETCH LOGIC (Bank & Address) ---
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
          <h1 className="text-4xl font-black text-[#0f172a]">Edit Profile</h1>
          <p className="text-slate-500 font-medium mt-1">
            Update your Swadeshi Associate credentials
          </p>
        </div>
        <ShieldCheck className="w-10 h-10 text-emerald-600 opacity-20" />
      </header>

      {/* PHOTO UPLOAD SECTION - Positioned at the top for emphasis */}
      <section className="flex flex-col items-center mb-12">
        <PhotoUpload username={username} currentPhoto={userData?.photoUrl} />
        <div className="mt-4 flex items-center gap-2 text-slate-400">
          <Camera className="w-3 h-3" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Click camera to change avatar
          </span>
        </div>
      </section>

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
                label="Pin Code"
                {...register("pincode")}
                error={errors.pincode?.message}
                maxLength={6}
                verified={watchedPincode?.length === 6 && !errors.pincode}
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

        {/* NOMINEE SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Nominee & Succession Details
            </h2>
          </div>
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FormInput
                label="Nominee Name"
                {...register("nomineeName")}
                error={errors.nomineeName?.message}
                placeholder="Full Name"
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Relation
                </label>
                <select
                  {...register("nomineeRelation")}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 appearance-none"
                >
                  <option value="">Select Relation</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Son">Son</option>
                  <option value="Wife">Wife</option>
                </select>
                {errors.nomineeRelation && (
                  <p className="text-xs text-red-500 font-bold ml-2">
                    {errors.nomineeRelation.message}
                  </p>
                )}
              </div>

              <FormInput
                label="Nominee Mobile"
                {...register("nomineeMobile")}
                error={errors.nomineeMobile?.message}
                maxLength={10}
                placeholder="10-digit number"
              />

              <FormInput
                label="Nominee Aadhaar"
                {...register("nomineeAadhaar")}
                error={errors.nomineeAadhaar?.message}
                maxLength={12}
                className="font-mono tracking-widest"
                placeholder="1234 5678 9012"
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
              <FormInput
                label="PAN Number"
                {...register("panNumber")}
                onChange={(e) =>
                  setValue("panNumber", e.target.value.toUpperCase(), {
                    shouldValidate: true,
                  })
                }
                error={errors.panNumber?.message}
                maxLength={10}
                className="uppercase font-bold tracking-widest"
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
              {/* NEW UPI ID FIELD */}
              <FormInput
                label="UPI ID (VPA)"
                {...register("upiId")}
                error={errors.upiId?.message}
                placeholder="username@bank"
                className="lowercase"
                onChange={(e) =>
                  setValue("upiId", e.target.value.toLowerCase())
                }
              />
              <FormInput
                label="IFSC Code"
                {...register("ifsc")}
                onChange={(e) =>
                  setValue("ifsc", e.target.value.toUpperCase(), {
                    shouldValidate: true,
                  })
                }
                error={errors.ifsc?.message}
                verified={watchedIFSC?.length === 11 && !errors.ifsc}
                icon={
                  fetchingBank && (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  )
                }
                maxLength={11}
                className="uppercase font-bold tracking-widest"
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
