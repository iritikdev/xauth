"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Loader2, User, Lock,
  AlertCircle, ChevronRight, ShieldCheck, Sparkles
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

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    try {
      const res = await signIn("credentials", {
        username: data.username.trim().toUpperCase(), // Force Uppercase for DB
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid Credentials", {
          description: "Please check your Associate ID or Password."
        });
        setIsPending(false);
        return;
      }

      toast.success("Welcome back, Partner!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Network Error. Try again.");
      setIsPending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl animate-pulse" />
              <img src="/logo.png" className="w-20 h-20 relative z-10" alt="Logo" />
              <div className="absolute -inset-4 border-2 border-dashed border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite]" />
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-xs space-y-4"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                 <Sparkles size={14} className="text-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600/60">Amaze Intelligence</span>
              </div>
              <p className="text-xl font-serif italic text-slate-900 leading-tight">"{randomTip}"</p>
              
              <div className="pt-6 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Encrypting Session...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-4">
            {/* Associate ID - Auto Uppercase */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                    Associate ID
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                        <User size={18} />
                      </div>
                      <Input
                        {...field}
                        placeholder="AMZXXXXX"
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
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Security Key
                    </FormLabel>
                    <Link href="/forgot-password"  className="text-[9px] font-black uppercase text-emerald-600 tracking-tighter hover:underline">
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
                  <span>Open Dashboard</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              )}
            </Button>
          </div>

          {/* Trusted Badges */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
             <div className="flex items-center gap-5 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <ShieldCheck size={16} />
                <div className="h-4 w-px bg-slate-300" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">End-to-End Encrypted</span>
             </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignInForm;