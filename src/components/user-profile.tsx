"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { kycSchema } from "@/lib/validations/register-user";
import { useSession } from "next-auth/react";
import { FormInput } from "@/components/ui/form-input";
import { PhotoUpload } from "@/components/dashboard/photo-upload";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
  User, Building2, ShieldCheck, Home,
  Loader2, Save, Camera, AlertCircle,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type KYCFormData = z.infer<typeof kycSchema>;

/* ─── shared field token ──────────────────────────────────────── */
const fieldCls = cn(
  "w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900",
  "placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400",
  "transition-all"
);
const readonlyCls = "bg-zinc-50 text-zinc-500 cursor-default focus:ring-0 focus:border-zinc-200";
const disabledCls = "bg-zinc-50 text-zinc-400 cursor-not-allowed opacity-70";

/* ─── label token ─────────────────────────────────────────────── */
const labelCls = "block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400 mb-1.5";

/* ─── section wrapper ─────────────────────────────────────────── */
function Section({
  icon,
  title,
  hint,
  sectionKey,
  fields,
  loading,
  onSave,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  sectionKey: string;
  fields: string[];
  loading: string | null;
  onSave: (key: string, fields: any[]) => void;
  children: React.ReactNode;
}) {
  const saving = loading === sectionKey;
  return (
    <div className="space-y-4">
      {/* section header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
            {icon}
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
            {title}
          </h2>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(sectionKey, fields)}
          className={cn(
            "flex items-center gap-1.5 h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-[0.12em] transition-all",
            saving
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
          )}
        >
          {saving
            ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
            : <><Save size={11} strokeWidth={2.5} /> Save Changes</>}
        </button>
      </div>

      {/* card */}
      <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 md:p-8 shadow-sm space-y-5">
        {children}

        {/* optional note */}
        {hint && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 mt-2">
            <AlertCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── field grid ──────────────────────────────────────────────── */
const Grid = ({ cols = 2, children }: { cols?: number; children: React.ReactNode }) => (
  <div className={cn(
    "grid gap-5",
    cols === 1 && "grid-cols-1",
    cols === 2 && "grid-cols-1 sm:grid-cols-2",
    cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  )}>
    {children}
  </div>
);

/* ─── field wrapper ───────────────────────────────────────────── */
const Field = ({
  label, error, suffix, children, span,
}: {
  label: string;
  error?: string;
  suffix?: React.ReactNode;
  children: React.ReactNode;
  span?: boolean;
}) => (
  <div className={cn("space-y-1.5", span && "sm:col-span-2")}>
    <label className={labelCls}>{label}</label>
    <div className="relative">
      {children}
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {suffix}
        </div>
      )}
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>}
  </div>
);

/* ─── main component ──────────────────────────────────────────── */
export default function UserProfileForm() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const username = (session?.user as any)?.username;

  const { data: userData, isLoading } = useUser(username);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [fetchingAddr, setFetchingAddr] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);

  const {
    register, getValues, reset, control, setValue,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: "onTouched",
  });

  const watchedPincode = useWatch({ control, name: "pincode" });
  const watchedIFSC    = useWatch({ control, name: "ifsc" });

  useEffect(() => { if (userData) reset(userData); }, [userData, reset]);

  /* auto-fetch bank from IFSC */
  useEffect(() => {
    if (watchedIFSC?.length !== 11) return;
    setFetchingBank(true);
    fetch(`https://ifsc.razorpay.com/${watchedIFSC.toUpperCase()}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setValue("branch", `${d.BANK} - ${d.BRANCH}`, { shouldValidate: true }); })
      .finally(() => setFetchingBank(false));
  }, [watchedIFSC, setValue]);

  /* auto-fetch address from pincode */
  useEffect(() => {
    if (watchedPincode?.length !== 6) return;
    setFetchingAddr(true);
    fetch(`https://api.postalpincode.in/pincode/${watchedPincode}`)
      .then((r) => r.json())
      .then((d) => {
        if (d[0]?.Status === "Success") {
          const po = d[0].PostOffice[0];
          setValue("district", po.District, { shouldValidate: true });
          setValue("state",    po.State,    { shouldValidate: true });
        }
      })
      .finally(() => setFetchingAddr(false));
  }, [watchedPincode, setValue]);

  const handleSectionUpdate = async (sectionName: string, fields: (keyof KYCFormData)[]) => {
    setLoadingSection(sectionName);
    try {
      const vals = getValues();
      const payload = fields.reduce((acc, k) => ({ ...acc, [k]: vals[k] }), {});
      const res = await fetch(`/api/user/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: ["user", username] });
      toast.success(`${sectionName} updated!`);
    } catch {
      toast.error(`Failed to update ${sectionName}.`);
    } finally {
      setLoadingSection(null);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <Spinner />
    </div>
  );

  return (
    <div
      className="space-y-8 pb-20"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
            Account Settings
          </p>
          <h1
            className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            Manage Profile
          </h1>
          <p className="mt-1.5 text-sm font-medium text-zinc-400">
            Update specific sections of your profile securely.
          </p>
        </div>
        <ShieldCheck size={28} className="text-zinc-200 shrink-0 mt-1" strokeWidth={1.5} />
      </div>

      {/* ── Photo upload ── */}
      <div className="rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 shrink-0">
          <Camera size={14} strokeWidth={2} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-0.5">
            Profile Photo
          </p>
          <p className="text-xs font-medium text-zinc-400">
            Shown on your distributor card and network profile.
          </p>
        </div>
        <PhotoUpload username={username} currentPhoto={userData?.photoUrl} />
      </div>

      {/* ══════════════════════════════════
          PERSONAL IDENTITY
      ══════════════════════════════════ */}
      
      <Section
        icon={<User size={13} strokeWidth={2} />}
        title="Basic Identity"
        sectionKey="Identity"
        fields={["name","fatherName","motherName","email","mobile"]}
        loading={loadingSection}
        onSave={handleSectionUpdate}
      >
        <Grid cols={3}>
          <Field label="Full Name">
            <input {...register("name")} disabled
              className={cn(fieldCls, disabledCls, "pr-4")} />
          </Field>
          <Field label="Father's Name" error={errors.fatherName?.message}>
            <input {...register("fatherName")} className={fieldCls} placeholder="As per Aadhaar" />
          </Field>
          <Field label="Mother's Name" error={errors.motherName?.message}>
            <input {...register("motherName")} className={fieldCls} placeholder="As per Aadhaar" />
          </Field>
          <Field label="Email Address" error={errors.email?.message}>
            <input {...register("email")} type="email" className={fieldCls} placeholder="you@email.com" />
          </Field>
          <Field label="Mobile Number" error={errors.mobile?.message}>
            <input {...register("mobile")} maxLength={10} className={fieldCls} placeholder="10-digit number" />
          </Field>
        </Grid>
      </Section>

      {/* ══════════════════════════════════
          POSTAL ADDRESS
      ══════════════════════════════════ */}
      <Section
        icon={<Home size={13} strokeWidth={2} />}
        title="Postal Address"
        sectionKey="Address"
        fields={["address","pincode","district","state"]}
        loading={loadingSection}
        onSave={handleSectionUpdate}
      >
        <Grid cols={1}>
          <Field label="Full Delivery Address" error={errors.address?.message}>
            <input {...register("address")} className={fieldCls} placeholder="House no., Street, Area…" />
          </Field>
        </Grid>
        <Grid cols={3}>
          <Field label="Pin Code" suffix={fetchingAddr && <Loader2 size={13} className="animate-spin text-emerald-500" />}>
            <input {...register("pincode")} maxLength={6} className={cn(fieldCls, "pr-10")} placeholder="6-digit code" />
          </Field>
          <Field label="District">
            <input {...register("district")} readOnly className={cn(fieldCls, readonlyCls)} />
          </Field>
          <Field label="State">
            <input {...register("state")} readOnly className={cn(fieldCls, readonlyCls)} />
          </Field>
        </Grid>
      </Section>

      {/* ══════════════════════════════════
          NOMINEE
      ══════════════════════════════════ */}
      <Section
        icon={<ShieldCheck size={13} strokeWidth={2} />}
        title="Nominee & Succession"
        sectionKey="Nominee"
        fields={["nomineeName","nomineeRelation","nomineeMobile","nomineeAadhaar"]}
        loading={loadingSection}
        onSave={handleSectionUpdate}
        hint="Nominee details are vital for the legal transfer of your Amaze Ayurveda Business ID. Ensure the name matches their Government ID exactly to avoid succession disputes."
      >
        <Grid cols={4}>
          <Field label="Nominee Full Name" error={errors.nomineeName?.message}>
            <input {...register("nomineeName")} className={fieldCls} placeholder="As per Aadhaar" />
          </Field>

          {/* relationship select */}
          <Field label="Relationship" error={errors.nomineeRelation?.message}>
            <select
              {...register("nomineeRelation")}
              className={cn(fieldCls, "appearance-none cursor-pointer pr-8")}
            >
              <option value="">Select relation</option>
              {["Mother","Father","Wife","Husband","Son","Daughter","Brother"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>

          <Field label="Nominee Mobile" error={errors.nomineeMobile?.message}>
            <input {...register("nomineeMobile")} maxLength={10} className={fieldCls} placeholder="Contact number" />
          </Field>
          <Field label="Nominee Aadhaar" error={errors.nomineeAadhaar?.message}>
            <input {...register("nomineeAadhaar")} maxLength={12} className={cn(fieldCls,"tracking-widest font-mono")} placeholder="12-digit number" />
          </Field>
        </Grid>
      </Section>

      {/* ══════════════════════════════════
          BANKING
      ══════════════════════════════════ */}
      <Section
        icon={<Building2 size={13} strokeWidth={2} />}
        title="Banking & Payouts"
        sectionKey="Bank"
        fields={["accountNo","ifsc","branch","upiId"]}
        loading={loadingSection}
        onSave={handleSectionUpdate}
      >
        <Grid cols={2}>
          <Field label="UPI ID">
            <input {...register("upiId")} className={fieldCls} placeholder="name@bank" />
          </Field>
          <Field label="Account Number">
            <input {...register("accountNo")} className={fieldCls} placeholder="Enter account number" />
          </Field>
          <Field
            label="IFSC Code"
            suffix={fetchingBank && <Loader2 size={13} className="animate-spin text-emerald-500" />}
          >
            <input {...register("ifsc")} className={cn(fieldCls, "uppercase pr-10")} placeholder="e.g. SBIN0001234" />
          </Field>
          <Field label="Bank Branch" span>
            <input {...register("branch")} readOnly className={cn(fieldCls, readonlyCls)} placeholder="Auto-filled from IFSC" />
          </Field>
        </Grid>
      </Section>
    </div>
  );
}