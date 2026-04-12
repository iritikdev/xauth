"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "@/lib/actions/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const result = await sendPasswordResetEmail(email);

  if (result.success) {
    setIsSubmitted(true);
    toast.success("Security link dispatched!");
  } else {
    toast.error(result.error || "Something went wrong.");
  }
  setIsLoading(false);
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] relative z-10"
      >
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 bg-[#0f172a] text-white text-center relative">
            <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-black italic tracking-tight">
              Account Recovery
            </CardTitle>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Amaze Ayurveda Security Portal
            </p>
          </CardHeader>

          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center mb-4">
                    <p className="text-sm text-slate-500 font-bold">
                      Enter your registered email address to receive a secure password reset link.
                    </p>
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                    />
                  </div>

                  <Button
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Recovery Link <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <Link href="/sign-in" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors pt-4">
                    <ArrowLeft className="w-3 h-3" /> Back to Login
                  </Link>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900">Check Your Email</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">
                      We've sent a secure reset link to <br />
                      <span className="text-slate-900 font-black">{email}</span>
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="h-12 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500"
                    >
                      Didn't get it? Try again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer Credit */}
        <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
          © 2026 Amaze Ayurveda Pvt. Ltd.
        </p>
      </motion.div>
    </div>
  );
}