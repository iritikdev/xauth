"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updatePassword } from "@/lib/actions/auth";

// --- HELPERS ---
const calculateStrength = (pass: string) => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

const getStrengthDetails = (score: number) => {
  if (score === 0) return { label: "Too Short", color: "bg-slate-200", text: "text-slate-400" };
  if (score <= 2) return { label: "Weak", color: "bg-red-500", text: "text-red-500" };
  if (score === 3) return { label: "Medium", color: "bg-orange-500", text: "text-orange-500" };
  return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
};

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Strength Logic
  const strength = useMemo(() => calculateStrength(password), [password]);
  const { label, color, text } = getStrengthDetails(strength);
  const isReady = strength >= 3 && password === confirmPassword && password.length >= 8;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      const result = await updatePassword(token as string, password);

      if (result.success) {
        setIsSuccess(true);
        // Auto redirect after animation
        setTimeout(() => router.push("/sign-in"), 3000);
      } else {
        toast.error(result.error || "Token expired or invalid.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      
      <div className="w-full max-w-[450px] relative z-10">
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <CardHeader className="p-10 bg-[#0f172a] text-white text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-3xl font-black italic tracking-tight">New Password</CardTitle>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Set your secure credentials</p>
                </CardHeader>

                <CardContent className="p-10 space-y-6">
                  <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-14 pl-6 pr-12 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* STRENGTH METER */}
                      <div className="px-2 pt-1 space-y-2">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={cn(
                                "flex-1 rounded-full transition-all duration-500",
                                strength >= step ? color : "bg-slate-100"
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={cn("text-[9px] font-black uppercase tracking-widest", text)}>
                            {label}
                          </p>
                          {strength >= 3 && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                        </div>
                      </div>
                    </div>

                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 pl-6 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      required
                    />

                    {/* Requirements Checklist */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                       <RequirementItem met={password.length >= 8} label="8+ Characters" />
                       <RequirementItem met={strength >= 3} label="Medium/Strong Intensity" />
                       <RequirementItem met={password === confirmPassword && password !== ""} label="Passwords Match" />
                    </div>

                    <Button
                      disabled={isLoading || !token || !isReady}
                      className="w-full h-14 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : "Secure My Account"}
                    </Button>
                  </form>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-12 text-center space-y-6"
              >
                <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic text-slate-900 tracking-tight">Success!</h2>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    Your password has been updated. <br />
                    Redirecting you to the sign-in portal...
                  </p>
                </div>
                <div className="pt-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "h-3.5 w-3.5 rounded-full flex items-center justify-center transition-colors",
        met ? "bg-emerald-500" : "bg-slate-200"
      )}>
        {met ? <Check className="w-2 h-2 text-white" /> : <X className="w-2 h-2 text-slate-400" />}
      </div>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-tight",
        met ? "text-slate-900" : "text-slate-400"
      )}>
        {label}
      </span>
    </div>
  );
}