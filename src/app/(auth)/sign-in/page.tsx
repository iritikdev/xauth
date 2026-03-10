"use server";

import SignInForm from "./signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, ArrowLeft, Leaf } from "lucide-react";

const Page = async () => {
 

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="w-full max-w-[450px] relative z-10">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to website
        </Link>

        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          
          {/* Subtle Brand Watermark */}
          <Leaf className="absolute -top-6 -right-6 h-32 w-32 text-emerald-500/5 rotate-12" />

          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="w-20 h-20 relative bg-white rounded-3xl shadow-sm p-3 border border-slate-100 mb-2">
              <Image
                src="/amaze-logo.png"
                alt="Amaze Ayurveda Logo"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Please enter your credentials to access your portal.</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Main Login Form */}
            <div className="relative">
              <SignInForm />
            </div>

            <div className="pt-6 text-center border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3">Don't have an account yet?</p>
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700 font-black uppercase tracking-widest text-[11px] transition-all">
                <Link href="/sign-up">Create Swadeshi Account</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Verified Secure Gateway</span>
        </div>
      </div>
    </div>
  );
};

export default Page;