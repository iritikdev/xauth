"use client";

import React, { useMemo, useState } from "react";
import {
  Eye, EyeOff, Lock, RefreshCw, LogOut, ShieldAlert,
  CheckCircle2, XCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { FormInput } from "@/components/ui/form-input";
import { passwordUpdateSchema } from "@/lib/validations/register-user";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";

type PasswordFormData = z.infer<typeof passwordUpdateSchema>;

export default function PasswordSection() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: session } = useSession();
  const username = (session?.user as any)?.username;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordUpdateSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const generator = useMemo(() => ({
    generateStrong() {
      const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const lower = "abcdefghijkmnopqrstuvwxyz";
      const nums = "23456789";
      const syms = "!@#$%^&*()-_=+";
      const all = upper + lower + nums + syms;

      const pick = (set: string, n = 1) =>
        Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");

      let pwd = pick(upper, 2) + pick(lower, 6) + pick(nums, 3) + pick(syms, 3);
      // Shuffle
      pwd = pwd.split("").sort(() => Math.random() - 0.5).join("");
      return pwd;
    },
  }), []);

  const strength = useMemo(() => {
    const lengthScore = newPassword.length >= 12 ? 2 : newPassword.length >= 8 ? 1 : 0;
    const upper = /[A-Z]/.test(newPassword);
    const lower = /[a-z]/.test(newPassword);
    const num = /[0-9]/.test(newPassword);
    const sym = /[^A-Za-z0-9]/.test(newPassword);
    const diversityScore = [upper, lower, num, sym].filter(Boolean).length;

    const score = lengthScore + diversityScore; // 0..6
    const pct = Math.min(100, Math.round((score / 6) * 100));
    const label =
      score >= 5 ? "Strong" :
      score >= 3 ? "Fair" :
      newPassword.length ? "Weak" : "—";

    return {
      pct,
      label,
      reqs: {
        len8: newPassword.length >= 8,
        len12: newPassword.length >= 12,
        upper,
        lower,
        num,
        sym,
      }
    };
  }, [newPassword]);

  const mutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      if (!username) throw new Error("You must be signed in to update your password.");
      const res = await fetch(`/api/user/${username}/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update security credentials");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Password updated", {
        description: "You’ll be logged out to start a new secure session.",
      });
      // Immediate sign-out keeps session fresh and reduces risk surface
      signOut({ callbackUrl: "/sign-in" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    mutation.mutate(data);
  };

  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === newPassword;

  const disableForm = !username;
  const disableSubmit = disableForm || mutation.isPending || !isValid;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-2">
    <Lock className="h-4 w-4 text-emerald-600" />
    <div>
      <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Security & Access
      </h2>
      <p className="text-[11px] text-slate-500">
        Update your password to keep your account secure. You'll be signed out after the password is changed.
      </p>
    </div>
  </div>

  
</div>
      {/* Card */}
      <Card className="border-none overflow-hidden">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Current Password */}
          <div className="relative">
            <FormInput
              type={showCurrent ? "text" : "password"}
              label="Current Password"
              placeholder="••••••••"
              disabled={disableForm}
              {...register("currentPassword")}
              error={errors.currentPassword?.message}
              className="h-14 bg-slate-50/70 border-none rounded-2xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? "Hide current password" : "Show current password"}
              className="absolute right-4 top-[42px] text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {!disableForm && (
              <p className="mt-2 text-[11px] text-slate-500">
                Make sure this is your latest password.
              </p>
            )}
          </div>

          {/* New Password + Strength */}
          <div className="relative">
            <FormInput
              type={showNew ? "text" : "password"}
              label="New Password"
              placeholder="At least 12 characters recommended"
              disabled={disableForm}
              {...register("newPassword")}
              error={errors.newPassword?.message}
              className="h-14 bg-slate-50/70 border-none rounded-2xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? "Hide new password" : "Show new password"}
              className="absolute right-4 top-[42px] text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {/* Strength Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">
                  Strength
                </span>
                <span
                  className={cn(
                    "font-bold",
                    strength.label === "Strong" && "text-emerald-600",
                    strength.label === "Fair" && "text-amber-600",
                    strength.label === "Weak" && "text-rose-600",
                    strength.label === "—" && "text-slate-400"
                  )}
                >
                  {strength.label}
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    strength.pct >= 70 ? "bg-emerald-500" :
                    strength.pct >= 40 ? "bg-amber-500" :
                    strength.pct > 0 ? "bg-rose-500" : "bg-transparent"
                  )}
                  style={{ width: `${strength.pct}%` }}
                />
              </div>

              {/* Requirements */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <RequirementItem ok={strength.reqs.len8} label="≥ 8 characters" />
                <RequirementItem ok={strength.reqs.len12} label="≥ 12 characters" />
                <RequirementItem ok={strength.reqs.upper} label="Uppercase" />
                <RequirementItem ok={strength.reqs.lower} label="Lowercase" />
                <RequirementItem ok={strength.reqs.num} label="Number" />
                <RequirementItem ok={strength.reqs.sym} label="Symbol" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={disableForm}
                  onClick={() => {
                    const strong = generator.generateStrong();
                    reset({ currentPassword, newPassword: strong, confirmPassword: strong });
                    toast.info("Generated a strong password", { description: "You can customize it before saving." });
                  }}
                >
                  Generate strong password
                </Button>
              </div>
            </div>
          </div>

          {/* Confirm & Actions */}
          <div className="flex flex-col gap-6">
            <div className="relative">
              <FormInput
                type={showConfirm ? "text" : "password"}
                label="Confirm New Password"
                placeholder="Repeat new password"
                disabled={disableForm}
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                className="h-14 bg-slate-50/70 border-none rounded-2xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                className="absolute right-4 top-[42px] text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {confirmPassword.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  {passwordsMatch ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span
                    className={cn(
                      "font-semibold",
                      passwordsMatch ? "text-emerald-700" : "text-rose-600"
                    )}
                  >
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={disableSubmit}
                className={cn(
                  "h-12 flex-1 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-xl",
                  "hover:bg-emerald-600",
                  disableSubmit && "opacity-60 cursor-not-allowed"
                )}
              >
                {mutation.isPending ? (
                  <>
                    <RefreshCw className="animate-spin mr-2 w-4 h-4" />
                    Securing...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Update & Logout
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl"
                onClick={() => reset()}
                disabled={mutation.isPending}
              >
                Reset
              </Button>
            </div>

            {disableForm && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl bg-amber-50 border border-amber-200 text-amber-700 p-3 text-[12px]"
              >
                You must be signed in to update your password.
              </div>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
}

/* ——— Helpers ——— */

function RequirementItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5">
      {ok ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-slate-400" />
      )}
      <span className={cn("text-[11px] font-semibold", ok ? "text-slate-900" : "text-slate-500")}>
        {label}
      </span>
    </div>
  );
}

/* Tailwind cn helper; remove if already available globally */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}