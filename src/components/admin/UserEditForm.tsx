"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Save, User, Landmark, ShieldCheck,
  Heart, MapPin,
  CreditCard,
  EyeOff,
  Eye,
  ShieldAlert,
  Lock
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn, formatAadhaar } from "@/lib/utils";
import { updateUserDetails, updateUserPassword } from "@/lib/actions/admin";
import { PageHeader } from "./page-header";
import { usePincodeAutoFill } from "@/hooks/use-pincode-autofill";
import { useIfscAutoFill } from "@/hooks/use-ifsc-autofill";

type StepId = "personal" | "address" | "banking" | "nominee" | "kyc" | "security";

const STEPS: { id: StepId; label: string; icon: any }[] = [
  { id: "personal", label: "Profile", icon: User },
  { id: "address", label: "Location", icon: MapPin },
  { id: "banking", label: "Banking", icon: Landmark },
  { id: "nominee", label: "Nominee", icon: Heart },
  { id: "kyc", label: "KYC", icon: ShieldCheck },
  { id: "security", label: "Security", icon: ShieldAlert },
];

export function UserEditForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<StepId>("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user.name || "",
      fatherName: user.fatherName || "",
      motherName: user.motherName || "",
      mobile: user.mobile || "",
      email: user.email || "",
      address: user.address || "",
      district: user.district || "",
      state: user.state || "",
      pincode: user.pincode || "",
      accountNo: user.accountNo || "",
      ifsc: user.ifsc || "",
      upiId: user.upiId || "",
      branch: user.branch || "",
      nomineeName: user.nomineeName || "",
      nomineeMobile: user.nomineeMobile || "",
      nomineeAadhaar: user.nomineeAadhaar || "",
      nomineeRelation: user.nomineeRelation || "",
      kycData: {
        panNumber: user.kycDocument?.panNumber || "",
        aadharNo: user.kycDocument?.aadharNo || "",

      },
    },
  });

  // --- Auto-Fetch Logic ---
  const pincode = useWatch({ control, name: "pincode" });
  const ifsc = useWatch({ control, name: "ifsc" });

  const { isFetchingGeo } = usePincodeAutoFill({
    pincode,
    setValue,
  });

  const { isFetchingBank } = useIfscAutoFill({
    ifsc,
    setValue,
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await updateUserDetails(user.id, data);
      if (res.success) toast.success("Profile synchronized successfully");
      else toast.error(res.message || "Update failed");
    } catch (err) { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const currentStepIdx = STEPS.findIndex((s) => s.id === activeTab);
  const progressValue = ((currentStepIdx + 1) / STEPS.length) * 100;

  const handlePasswordUpdate = async () => {
    if (newPass.length < 6) return toast.error("Password must be at least 6 characters");

    setPassLoading(true);
    const res = await updateUserPassword(user.id, newPass);
    if (res.success) {
      toast.success("Security Credentials Updated");
      setNewPass("");
    } else {
      toast.error(res.message);
    }
    setPassLoading(false);
  };

  return (
    <div className="pb-20">
      <div className="mb-8 space-y-4 px-2">
        <PageHeader
          title="Edit Partner"
          highlight="Profile"
          description="Review and update partner's information across multiple categories. Ensure data accuracy and completeness for seamless operations."

        />
        <Progress value={progressValue} className="h-1.5 bg-slate-100" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StepId)} className="w-full px-2">

          <TabsList className="w-full flex justify-start h-auto p-0 bg-transparent border-b border-slate-200 rounded-none mb-8 overflow-x-auto no-scrollbar">
            {STEPS.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className="relative flex items-center gap-2 px-6 pb-4 pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 transition-all"
              >
                <step.icon size={14} />
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* --- PERSONAL --- */}
              <TabsContent value="personal" className="mt-0">
                <FormSection title="Identity" description="Verify and update partner's lineage">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="Full Name" error={errors.name} required>
                      <Input {...register("name", { required: "Name required" })} className="h-12 rounded-xl bg-slate-50/50" />
                    </FormField>
                    <FormField label="Mobile Number" error={errors.mobile} required>
                      <Input {...register("mobile", { required: "Required" })} className="h-12 rounded-xl bg-slate-50/50" />
                    </FormField>
                    <FormField label="Father's Name">
                      <Input {...register("fatherName")} className="h-12 rounded-xl bg-slate-50/50" />
                    </FormField>
                    <FormField label="Mother's Name">
                      <Input {...register("motherName")} className="h-12 rounded-xl bg-slate-50/50" />
                    </FormField>
                    <FormField label="Email Address">
                      <Input {...register("email")} className="h-12 rounded-xl bg-slate-50/50" />
                    </FormField>
                  </div>
                </FormSection>
              </TabsContent>

              {/* --- ADDRESS --- */}
              <TabsContent value="address" className="mt-0">
                <FormSection title="Address" description="Automatic address fetching enabled via Pincode">
                  <div className="space-y-6">
                    <FormField label="Street Address" required>
                      <Input {...register("address")} placeholder="Door no, Area..." className="h-12 rounded-xl bg-slate-50/50" />
                    </FormField>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      <FormField label="Pincode" required>
                        <div className="relative">
                          <Input
                            {...register("pincode")}
                            maxLength={6}
                            placeholder="6-digit"
                            className="h-12 rounded-xl bg-slate-50/50 pr-10 font-mono"
                          />
                          {isFetchingGeo && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-emerald-600" />}
                        </div>
                      </FormField>
                      <FormField label="District">
                        <Input {...register("district")} readOnly className="h-12 rounded-xl bg-slate-100/50 text-slate-500 cursor-not-allowed" />
                      </FormField>
                      <FormField label="State">
                        <Input {...register("state")} readOnly className="h-12 rounded-xl bg-slate-100/50 text-slate-500 cursor-not-allowed" />
                      </FormField>
                    </div>
                  </div>
                </FormSection>
              </TabsContent>


              {/* ─── BANKING CONTENT ─── */}
              <TabsContent value="banking" className="mt-0">
                <FormSection
                  title="Banking Infrastructure"
                  description="Automated branch verification via IFSC protocol"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="Account Number" required>
                      <div className="relative">
                        <Landmark className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <Input
                          {...register("accountNo", { required: "Required" })}
                          placeholder="000000000000"
                          className="h-12 rounded-xl bg-slate-50/50 pl-10 font-mono tracking-wider"
                        />
                      </div>
                    </FormField>

                    <FormField label="IFSC Code" required>
                      <div className="relative">
                        <Input
                          {...register("ifsc", {
                            required: "Required",
                            pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC Format" }
                          })}
                          maxLength={11}
                          placeholder="SBIN000XXXX"
                          className="h-12 rounded-xl bg-slate-50/50 uppercase font-mono pr-10"
                          onChange={(e) => setValue("ifsc", e.target.value.toUpperCase())}
                        />
                        {isFetchingBank && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-emerald-600" />}
                      </div>
                    </FormField>

                    <FormField label="Bank Branch (Auto-filled)">
                      <Input
                        {...register("branch")}
                        readOnly
                        placeholder="Verified via IFSC"
                        className="h-12 rounded-xl bg-slate-100/50 text-emerald-700 font-bold italic cursor-not-allowed border-dashed"
                      />
                    </FormField>

                    <FormField label="UPI VPA ID">
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <Input
                          {...register("upiId")}
                          placeholder="username@bank"
                          className="h-12 rounded-xl bg-emerald-50/20 pl-10 border-emerald-100 text-emerald-900 placeholder:text-emerald-200"
                        />
                      </div>
                    </FormField>
                  </div>
                </FormSection>
              </TabsContent>

              {/* --- NOMINEE --- */}

              <TabsContent value="nominee" className="mt-0">
                <FormSection
                  title="Legacy & Nominee"
                  description="Beneficiary details for account succession"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="Nominee Full Name">
                      <Input
                        {...register("nomineeName")}
                        placeholder="As per Government ID"
                        className="h-12 rounded-xl bg-slate-50/50"
                      />
                    </FormField>

                    <FormField label="Relationship">
                      <Input
                        {...register("nomineeRelation")}
                        placeholder="e.g. Father, Spouse, Sibling"
                        className="h-12 rounded-xl bg-slate-50/50"
                      />
                    </FormField>

                    <FormField label="Nominee Mobile">
                      <Input
                        {...register("nomineeMobile")}
                        maxLength={10}
                        placeholder="10-digit mobile"
                        className="h-12 rounded-xl bg-slate-50/50"
                      />
                    </FormField>

                    <FormField label="Nominee Aadhaar Number">
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <Input
                          {...register("nomineeAadhaar")}
                          onChange={(e) => {
                            const formatted = formatAadhaar(e.target.value);
                            setValue("nomineeAadhaar", formatted, { shouldDirty: true });
                          }}
                          maxLength={12}
                          placeholder="12 Digit Unique ID"
                          className="h-12 rounded-xl bg-slate-50/50 pl-10 font-mono tracking-[0.2em]"
                        />
                      </div>
                    </FormField>
                  </div>
                </FormSection>
              </TabsContent>

              {/* --- KYC --- */}
              <TabsContent value="kyc" className="mt-0">
                <FormSection title="KYC Identity" description="Regulatory document records">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="PAN Number">
                      <Input {...register("kycData.panNumber")} className="h-12 rounded-xl bg-slate-50/50 uppercase font-mono" />
                    </FormField>
                    <FormField label="Aadhaar ID">
                      <Input {...register("kycData.aadharNo")}
                        onChange={(e) => {
                          const formatted = formatAadhaar(e.target.value);
                          setValue("kycData.aadharNo", formatted, { shouldDirty: true });
                        }}
                        maxLength={15}
                        placeholder="12 Digit Unique ID"
                        className="h-12 rounded-xl bg-slate-50/50 font-mono" />
                    </FormField>
                  </div>
                </FormSection>
              </TabsContent>

              {/* Password */}
              <TabsContent value="security" className="mt-0">
                <FormSection
                  title="Security & Access"
                  description="Manage partner's login credentials and account security"
                >
                  <div className="max-w-md space-y-6">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                      <ShieldAlert className="text-amber-600 shrink-0" size={18} />
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-tight leading-relaxed">
                        Warning: Updating the password will not log out the user currently,
                        but they must use the new password for their next login.
                      </p>
                    </div>

                    <FormField label="New Account Password">
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Enter strong password"
                          className="h-12 rounded-xl bg-slate-50/50 pl-10 pr-10 font-mono tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormField>

                    <Button
                      type="button"
                      disabled={passLoading || !newPass}
                      onClick={handlePasswordUpdate}
                      className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-black transition-all"
                    >
                      {passLoading ? <Loader2 className="animate-spin" /> : <ShieldAlert size={16} />}
                      Override Password
                    </Button>
                  </div>
                </FormSection>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        {/* --- Floating Action Footer --- */}
        <div className=" flex justify-center px-4">
          <div className="w-full max-w-4xl bg-slate-900 text-white rounded-[2rem] p-4 shadow-2xl flex justify-between items-center ring-4 ring-white">
            <div className="hidden md:block pl-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                {isDirty ? "Unsaved Progress" : "Database Synced"}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter">
                {isDirty ? "Ready to commit changes" : "No changes detected"}
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex-1 md:flex-none text-slate-400 hover:text-white"
              >
                Exit
              </Button>
              <Button
                type="submit"
                disabled={loading || !isDirty}
                className="flex-1 md:flex-none h-12 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest text-[10px] gap-2 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="mb-8 relative z-10">
        <h3 className="text-xl font-black italic tracking-tighter uppercase text-slate-900">{title}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, error, required, children }: { label: string; error?: any; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ml-1">
        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {error && (
          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
            {error.message}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}