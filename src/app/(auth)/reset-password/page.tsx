"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updatePassword } from "@/app/actions/auth";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (password !== confirmPassword) {
    return toast.error("Passwords match nahi ho rahe!");
  }

  if (password.length < 8) {
    return toast.error("Password kam se kam 8 characters ka hona chahiye.");
  }

  setIsLoading(true);

  try {
    const result = await updatePassword(token as string, password);

    if (result.success) {
      toast.success("Aapka password secure ho gaya hai!");
      router.push("/sign-in");
    } else {
      toast.error(result.error);
    }
  } catch (error) {
    toast.error("An unexpected error occurred.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[450px]">
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 bg-[#0f172a] text-white text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-black italic tracking-tight">New Password</CardTitle>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Set your secure credentials</p>
          </CardHeader>

          <CardContent className="p-10 space-y-6">
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-6 pr-12 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50"
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

              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 pl-6 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50"
                required
              />

              <Button 
                disabled={isLoading || !token}
                className="w-full h-14 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}