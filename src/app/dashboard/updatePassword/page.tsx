"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, RefreshCw, LogOut, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { FormInput } from "@/components/ui/form-input";
import { passwordUpdateSchema } from "@/lib/validations/register-user";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import { useSession, signOut } from "next-auth/react";

type PasswordFormData = z.infer<typeof passwordUpdateSchema>;

export default function PasswordSection() {
  const [showPass, setShowPass] = useState(false);
  const { data: session } = useSession();
  const username = (session?.user as any)?.username;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordUpdateSchema),
    mode: "onChange" // Better UX for matching passwords
  });

  const mutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const res = await fetch(`/api/user/${username}/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update security credentials");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Security Updated!", {
        description: "Logging you out for a fresh secure session...",
      });
      
      setTimeout(() => {
        signOut({ callbackUrl: "/sign-in" });
      }, 2000);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    mutation.mutate(data);
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Security & Access
          </h2>
        </div>
        <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-400 gap-1 uppercase">
            <ShieldAlert className="w-3 h-3 text-orange-500" /> 
            High Security Area
        </Badge>
      </div>

      <Card className="border-none shadow-2xl bg-white p-8 md:p-12 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 pointer-events-none" />
        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start relative z-10"
        >
          {/* Current Password Field */}
          <div className="relative">
            <FormInput
              type={showPass ? "text" : "password"}
              label="Current Password"
              placeholder="••••••••"
              {...register("currentPassword")}
              error={errors.currentPassword?.message}
              className="pr-12 h-14 bg-slate-50/50 border-none rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-[42px] text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password Field */}
          <FormInput
            type="password"
            label="New Password"
            placeholder="Min 6 characters"
            {...register("newPassword")}
            error={errors.newPassword?.message}
            className="h-14 bg-slate-50/50 border-none rounded-2xl"
          />

          {/* Confirm & Submit Section */}
          <div className="flex flex-col gap-6 lg:mt-0">
            <FormInput
              type="password"
              label="Confirm New Password"
              placeholder="Repeat new password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              className="h-14 bg-slate-50/50 border-none rounded-2xl"
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-14 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-slate-200 group"
            >
              {mutation.isPending ? (
                <RefreshCw className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              )}
              {mutation.isPending ? "Securing..." : "Update & Logout"}
            </Button>
          </div>
        </form>
      </Card>
      
     
    </section>
  );
}