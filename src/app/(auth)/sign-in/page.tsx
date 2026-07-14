import SignInForm from "./signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Leaf } from "lucide-react";
import MinimalFooter from "@/components/layout/minimal-footer";

/* ─────────── Decorative Micro-Components ─────────── */
const BotanicalVector = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.12" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
  </svg>
);

const MandalaGeometry = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="0.6" opacity="0.15" />
    <circle cx="150" cy="150" r="110" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
    <circle cx="150" cy="150" r="80" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <line
        key={deg}
        x1="150" y1="10" x2="150" y2="30"
        stroke="currentColor" strokeWidth="0.5" opacity="0.1"
        transform={`rotate(${deg} 150 150)`}
      />
    ))}
  </svg>
);

const pillars = [
  "Ayush Certified",
  "15-Level Income Plan",
  "1M+ Partners",
  "Made in Bharat",
];

const Page = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#1c3320] text-zinc-100 flex flex-col justify-between relative antialiased selection:bg-emerald-500/20">
      <div className="absolute top-6 left-6 z-30">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#e8a020] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 duration-150 stroke-[2.5]" />
          Back
        </Link>
      </div>
      {/* ─── HERO BACKGROUND MATRIX (Top 50vh) ─── */}
      <div className="hidden sm:flex relative h-[50vh] min-h-[380px] w-full overflow-hidden select-none flex-col items-center justify-center px-4 text-center">



        {/* Dynamic Soft Core Lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c3320]/40 via-[#1c3320]/80 to-[#1c3320] z-0" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#e8a020]/8 blur-[120px] pointer-events-none" />

        {/* Fine Micro Graphics */}
        <BotanicalVector className="hidden sm:block absolute top-8 right-[10%] w-32 text-emerald-400 opacity-20 pointer-events-none" />
        <MandalaGeometry className="hidden sm:block absolute -top-12 -left-12 w-64 text-[#e8a020] opacity-15 pointer-events-none" />

        {/* Floating Safe Back Navigation */}


        {/* Hero Branding & Content */}
        <div className=" relative z-10 space-y-3.5 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-md">
            <Leaf className="w-3 h-3 text-[#e8a020] fill-[#e8a020]" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#e8a020]/90">
              Amaze Ayurveda
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Associate <span className="text-[#e8a020] font-serif italic font-normal">Portal</span>
          </h1>

          <p className="text-white/40 text-xs sm:text-sm font-medium max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Manage your Swadeshi ecosystem, track yields, and audit network growth matrices seamlessly.
          </p>

          {/* Clean Tag Row */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
            {pillars.map((p) => (
              <div key={p} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#e8a020] shrink-0" />
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-white/40">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FLOATING WHITE CARD INTERFACE (Overlaps Hero) ─── */}
      <div className="relative z-20 flex justify-center px-4 mt-16 pb-14">
        <div className="w-full max-w-[430px]">
          <div className="relative bg-[#f5f0e8] rounded-[2rem] border border-zinc-200/20 shadow-[0_24px_70px_rgba(0,0,0,0.35)] overflow-hidden">

            {/* Top Linear Highlight Strip */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#e8a020] to-transparent pointer-events-none" />

            <div className="p-6 sm:p-8 space-y-5">

              {/* Card Inline Branding Meta */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-0.5 rounded-full bg-gradient-to-b from-emerald-600 to-amber-500 shrink-0" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-100 bg-white p-2 shadow-sm">
                  <img
                    src="/amaze-logo.png"
                    alt="Amaze Ayurveda"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#1c3320]">
                    Welcome back
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Sign in to continue.
                  </p>
                </div>
              </div>

              {/* Clean Ornamental Border Break */}
              <div className="flex items-center gap-2 select-none pointer-events-none">
                <div className="h-px flex-1 bg-[#1c3320]/5" />
                <div className="flex gap-1">
                  <div className="h-1 w-1 rounded-full bg-[#e8a020]/20" />
                  <div className="h-1 w-2.5 rounded-full bg-[#e8a020]/40" />
                  <div className="h-1 w-1 rounded-full bg-[#e8a020]/20" />
                </div>
                <div className="h-px flex-1 bg-[#1c3320]/5" />
              </div>

              {/* Dynamic Authentication Form Module */}
              <SignInForm />

              {/* Modern Minimal SignUp Redirection */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 select-none pointer-events-none">
                  <div className="h-px flex-1 bg-[#1c3320]/5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1c3320]/20 whitespace-nowrap">
                    New Partner?
                  </span>
                  <div className="h-px flex-1 bg-[#1c3320]/5" />
                </div>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-11 rounded-xl border border-[#1c3320]/8 bg-white/40 hover:bg-white text-[#1c3320]/60 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Persistent App Minimal Footer */}
      <div className="hidden sm:block">
        <MinimalFooter />
      </div>

    </div>
  );
};

export default Page;