"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { kycSchema } from "@/lib/validations/register-user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { FormInput } from "@/components/ui/form-input";
import { PhotoUpload } from "@/components/dashboard/photo-upload";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
  User,
  Building2,
  ShieldCheck,
  Home,
  Loader2,
  Camera,
  Save,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "./admin/page-header";

type KYCFormData = z.infer<typeof kycSchema>;

export default function UserProfileForm() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const username = (session?.user as any)?.username;

  const { data: userData, isLoading: isUserLoading } = useUser(username);

  // States for individual section loading
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);

  const {
    register,
    getValues,
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

  // --- PARTIAL UPDATE LOGIC ---
  const handleSectionUpdate = async (
    sectionName: string,
    fields: (keyof KYCFormData)[],
  ) => {
    setLoadingSection(sectionName);
    try {
      const currentValues = getValues();
      const payload = fields.reduce(
        (acc, key) => ({ ...acc, [key]: currentValues[key] }),
        {},
      );

      const res = await fetch(`/api/user/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      queryClient.invalidateQueries({ queryKey: ["user", username] });
      toast.success(`${sectionName} Updated Successfully!`);
    } catch (error) {
      toast.error(`Failed to update ${sectionName}`);
    } finally {
      setLoadingSection(null);
    }
  };

  // --- AUTO-FETCH LOGIC (Bank & Address) ---
  useEffect(() => {
    if (watchedIFSC?.length === 11) {
      const fetchBank = async () => {
        setFetchingBank(true);
        try {
          const res = await fetch(
            `https://ifsc.razorpay.com/${watchedIFSC.toUpperCase()}`,
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
      };
      fetchBank();
    }
  }, [watchedIFSC, setValue]);

  useEffect(() => {
    if (watchedPincode?.length === 6) {
      const fetchAddr = async () => {
        setFetchingAddress(true);
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${watchedPincode}`,
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
      };
      fetchAddr();
    }
  }, [watchedPincode, setValue]);

  if (isUserLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  // REUSABLE SECTION HEADER COMPONENT
  const SectionTitle = ({ icon: Icon, title, sectionKey, fields }: any) => (
    <div className="flex items-center justify-between ml-4 mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-emerald-600" />
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </h2>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={loadingSection === sectionKey}
        onClick={() => handleSectionUpdate(sectionKey, fields)}
        className="h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-[10px] px-4"
      >
        {loadingSection === sectionKey ? (
          <Loader2 className="w-3 h-3 animate-spin mr-2" />
        ) : (
          <Save className="w-3 h-3 mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  );

  return (
    <div className="px-6 bg-slate-50/30 rounded-[3rem] pb-20">
      <header className="flex justify-between items-center mb-8 border-b pb-10">
        <PageHeader
          title="Manage"
          highlight="Profile"
          description="Update specific sections of your profile securely."
        />
        <ShieldCheck className="w-10 h-10 text-emerald-600 opacity-20" />
      </header>

      <section className="flex flex-col items-center mb-12">
        <PhotoUpload username={username} currentPhoto={userData?.photoUrl} />
      </section>

      <div className="space-y-12">
        {/* PERSONAL SECTION */}
        <section>
          <SectionTitle
            icon={User}
            title="Basic Identity"
            sectionKey="Identity"
            fields={["name", "fatherName", "motherName", "email"]}
          />
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FormInput
                label="Full Name"
                {...register("name")}
                disabled
                className="bg-slate-50 font-bold"
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
              <FormInput
                label="Email"
                {...register("email")}
                error={errors.email?.message}
              />
              <FormInput
                label="Mobile Number"
                {...register("mobile")}
                error={errors.mobile?.message}
              />
            </div>
          </Card>
        </section>

        {/* ADDRESS SECTION */}
        <section>
          <SectionTitle
            icon={Home}
            title="Postal Address"
            sectionKey="Address"
            fields={["address", "pincode", "district", "state"]}
          />
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
                maxLength={6}
                icon={
                  fetchingAddress && (
                    <Loader2 className="animate-spin w-4 h-4" />
                  )
                }
              />
              <FormInput
                label="District"
                {...register("district")}
                readOnly
                className="bg-slate-50"
              />
              <FormInput
                label="State"
                {...register("state")}
                readOnly
                className="bg-slate-50"
              />
            </div>
          </Card>
        </section>

        {/* NOMINEE & SUCCESSION SECTION */}
        <section>
          <SectionTitle
            icon={ShieldCheck}
            title="Nominee & Succession Details"
            sectionKey="Nominee"
            fields={[
              "nomineeName",
              "nomineeRelation",
              "nomineeMobile",
              "nomineeAadhaar",
            ]}
          />
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Nominee Name */}
              <FormInput
                label="Nominee Full Name"
                {...register("nomineeName")}
                error={errors.nomineeName?.message}
                placeholder="As per Aadhaar"
              />

              {/* Relation Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Relationship
                </label>
                <select
                  {...register("nomineeRelation")}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="">Select Relation</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Wife">Wife</option>
                  <option value="Husband">Husband</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                </select>
                {errors.nomineeRelation && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 italic">
                    {errors.nomineeRelation.message}
                  </p>
                )}
              </div>

              {/* Nominee Mobile */}
              <FormInput
                label="Nominee Mobile"
                {...register("nomineeMobile")}
                error={errors.nomineeMobile?.message}
                maxLength={10}
                placeholder="Contact Number"
              />

              {/* Nominee Aadhaar */}
              <FormInput
                label="Nominee Aadhaar"
                {...register("nomineeAadhaar")}
                error={errors.nomineeAadhaar?.message}
                maxLength={12}
                className="font-mono tracking-widest"
                placeholder="12-digit number"
              />
            </div>

            <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <p className="text-[11px] text-emerald-800 leading-relaxed italic">
                <strong>Note:</strong> Nominee details are vital for the legal
                transfer of your Amaze Ayurveda Business ID. Ensure the name
                matches their Government ID exactly to avoid future succession
                disputes.
              </p>
            </div>
          </Card>
        </section>
        {/* BANKING SECTION */}
        <section>
          <SectionTitle
            icon={Building2}
            title="Banking & ID"
            sectionKey="Bank"
            fields={[
              "panNumber",
              "aadharNo",
              "accountNo",
              "ifsc",
              "branch",
              "upiId",
            ]}
          />
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="PAN Number"
                {...register("panNumber")}
                className="uppercase"
              />
              <FormInput
                label="Aadhaar Number"
                {...register("aadharNo")}
                maxLength={12}
              />
              <FormInput label="UPI ID" {...register("upiId")} />
              <FormInput label="Account Number" {...register("accountNo")} />
              <FormInput
                label="IFSC Code"
                {...register("ifsc")}
                icon={
                  fetchingBank && <Loader2 className="animate-spin w-4 h-4" />
                }
              />
              <FormInput
                label="Bank Branch"
                {...register("branch")}
                readOnly
                className="bg-slate-50 md:col-span-2"
              />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
