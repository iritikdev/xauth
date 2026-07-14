"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Loader2, User, Lock,
  ChevronRight, ShieldCheck, Shield, Users, Building
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LOADING_TIPS } from "@/lib/constants";
import AppLoader from "@/components/app-loader";

// Available roles constraint definition
type UserRole = "ADMIN" | "DISTRIBUTOR" | "FRANCHISE";

const loginSchema = z.object({
  username: z.string().min(3, "Associate ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [randomTip, setRandomTip] = useState("");
  const [isPending, setIsPending] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/shop";
  
  // 💡 Selected Role State (Default to Distributor)
  const [selectedRole, setSelectedRole] = useState<UserRole>("DISTRIBUTOR");

  useEffect(() => {
    if (isPending) {
      const randomIndex = Math.floor(Math.random() * (LOADING_TIPS?.length || 0));
      setRandomTip(LOADING_TIPS ? LOADING_TIPS[randomIndex] : "Securing your connection...");
    }
  }, [isPending]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // Dynamic placeholder generation based on selected role context
  const getUsernamePlaceholder = () => {
    switch (selectedRole) {
      case "ADMIN": return "ADMXXXXX";
      case "FRANCHISE": return "FRNXXXXX";
      default: return "AMZXXXXX";
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    try {
      const res = await signIn("credentials", {
        username: data.username.trim().toUpperCase(), 
        password: data.password,
        role: selectedRole, // 💡 Passing selected role contextual parameter safely to NextAuth configuration
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid Credentials", {
          description: `Verify your ${selectedRole.toLowerCase()} parameters or credentials.`
        });
        setIsPending(false);
        return;
      }

      toast.success(`Welcome back, ${selectedRole.toLowerCase()} partner!`);
      
      // Dynamic client dashboard router target redirection routing pipeline
      if (selectedRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (selectedRole === "FRANCHISE") {
        router.push("/franchise/dashboard");
      } else {
        router.push("/distributor/dashboard");
      }
      
      router.refresh();
    } catch (err) {
      toast.error("Network Error. Try again.");
      setIsPending(false);
    }
  };

  return (
    <>

      <AppLoader isPending={!isPending}/>

      {/* 💡 Role Selection Tabs Grid layout control matrix */}
      <div className="mb-6 space-y-2 select-none">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
          Select Portal Role
        </label>
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          {(["DISTRIBUTOR", "FRANCHISE", "ADMIN"] as UserRole[]).map((role) => {
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                disabled={isPending}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 gap-1",
                  isActive
                    ? "bg-white text-zinc-900 shadow-sm font-black border border-zinc-200/40"
                    : "text-slate-400 font-bold hover:text-slate-600 hover:bg-white/40"
                )}
              >
                {role === "ADMIN" && <Shield size={14} className={isActive ? "text-emerald-600" : ""} />}
                {role === "DISTRIBUTOR" && <Users size={14} className={isActive ? "text-emerald-600" : ""} />}
                {role === "FRANCHISE" && <Building size={14} className={isActive ? "text-emerald-600" : ""} />}
                <span className="text-[9px] uppercase tracking-wider">{role}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            
            {/* Associate ID - Auto Uppercase */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                    {selectedRole} Associate ID
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                        <User size={18} />
                      </div>
                      <Input
                        {...field}
                        placeholder={getUsernamePlaceholder()}
                        className={cn(
                          "h-14 pl-12 rounded-2xl bg-slate-50 border-none font-black tracking-widest text-slate-900 placeholder:font-medium placeholder:tracking-normal transition-all uppercase",
                          "focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:bg-white shadow-sm"
                        )}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold tracking-tight" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Password
                    </FormLabel>
                    <Link href="/forgot-password" className="text-[9px] font-black uppercase text-emerald-600 tracking-tighter hover:underline">
                      Reset?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                        <Lock size={18} />
                      </div>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={cn(
                          "h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 transition-all",
                          "focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:bg-white shadow-sm"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold tracking-tight" />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full h-15 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl active:scale-95 py-7",
                "bg-slate-900 hover:bg-emerald-600 text-white shadow-emerald-900/10"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Login As {selectedRole}</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignInForm;