import SignInForm from "./signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Leaf, Shield } from "lucide-react";
import MinimalFooter from "@/components/layout/minimal-footer";

/* ─────────── Decorative SVGs ─────────── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
  </svg>
);

const RingDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
    <circle cx="150" cy="150" r="110" stroke="currentColor" strokeWidth="0.6" opacity="0.15"/>
    <circle cx="150" cy="150" r="80"  stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
    <circle cx="150" cy="150" r="50"  stroke="currentColor" strokeWidth="0.4" opacity="0.08"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
      <line
        key={deg}
        x1="150" y1="10" x2="150" y2="40"
        stroke="currentColor" strokeWidth="0.6" opacity="0.12"
        transform={`rotate(${deg} 150 150)`}
      />
    ))}
  </svg>
);

const pillars = [
  "100% Ayush Certified",
  "15-Level Income Plan",
  "1M+ Associates",
  "Made in Bharat",
];

const Page = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div
      className="min-h-screen w-full bg-[#1c3320] relative overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ══════════════════════════════════════════════
          FULL-BLEED HERO — top 62vh
      ══════════════════════════════════════════════ */}
      <div className="relative h-[62vh] min-h-[480px] overflow-hidden">

        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=1800"
          alt="Ayurveda"
          fill
          priority
          className="object-cover object-center opacity-20 grayscale"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c3320]/50 via-[#1c3320]/30 to-[#1c3320]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c3320]/70 via-transparent to-[#1c3320]/50" />

        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/3  w-[500px] h-[500px] rounded-full bg-[#c8860a]/10 blur-[120px]" />
          <div className="absolute bottom-0   right-0   w-[400px] h-[400px] rounded-full bg-emerald-400/8  blur-[100px]" />
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Botanical leaves */}
          <LeafDecor className="absolute top-6  right-[8%] w-40 text-emerald-300 opacity-30" />
          <LeafDecor className="absolute bottom-0 left-[4%] w-28 text-[#c8860a]  opacity-25 rotate-[22deg]" />
          {/* Mandala rings */}
          <RingDecor className="absolute -top-10 -right-10 w-72 text-[#e8a020] opacity-20" />
          <RingDecor className="absolute -bottom-20 left-[28%] w-56 text-emerald-300 opacity-10" />
        </div>

        {/* Back link */}
        <div className="absolute top-8 left-6 md:left-10 z-20">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 hover:text-[#e8a020] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-10 z-10">

          {/* Brand eyebrow */}
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/80">
              Amaze Ayurveda
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.92] tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Associate{" "}
            <span className="text-[#e8a020] italic">Portal</span>
          </h1>

          <p className="text-white/40 text-sm md:text-base font-medium max-w-xs md:max-w-sm leading-relaxed mb-8">
            Sign in to manage your Swadeshi business, track income, and grow your network.
          </p>

          {/* Pillar pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {pillars.map((p) => (
              <div
                key={p}
                className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full"
              >
                <CheckCircle2 className="w-3 h-3 text-[#e8a020] flex-shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FLOATING FORM CARD — overlaps hero
      ══════════════════════════════════════════════ */}
      <div className="relative z-20 flex justify-center px-4 -mt-16 pb-20">
        <div className="w-full max-w-[460px]">

          <div className="relative bg-[#f5f0e8] rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)]">

            {/* Saffron top hairline */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#e8a020] to-transparent" />

            {/* Leaf watermark */}
            <LeafDecor className="absolute -top-6 -right-4 w-32 text-[#1c3320] opacity-[0.04] rotate-6 pointer-events-none" />

            <div className="relative z-10 px-8 pt-9 pb-8 space-y-6">

              {/* Card header — logo inline */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl bg-white border border-[#1c3320]/8 shadow-[0_4px_20px_rgba(28,50,32,0.1)] overflow-hidden flex-shrink-0 group">
                  <Image
                    src="/amaze-logo.png"
                    alt="Amaze Ayurveda"
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]">
                    Secure Login
                  </p>
                  <h2
                    className="text-xl font-black text-[#1c3320] tracking-tight leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Welcome Back
                  </h2>
                  <p className="text-[#1c3320]/35 text-xs mt-0.5">
                    Enter your credentials to continue.
                  </p>
                </div>
              </div>

              {/* Ornamental divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#1c3320]/8" />
                <div className="flex gap-1">
                  <div className="h-1 w-1 rounded-full bg-[#e8a020]/30" />
                  <div className="h-1 w-3 rounded-full bg-[#e8a020]/50" />
                  <div className="h-1 w-1 rounded-full bg-[#e8a020]/30" />
                </div>
                <div className="h-px flex-1 bg-[#1c3320]/8" />
              </div>

              {/* Form */}
              <SignInForm />

              {/* Register CTA */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#1c3320]/8" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#1c3320]/25 whitespace-nowrap">
                    New here?
                  </span>
                  <div className="h-px flex-1 bg-[#1c3320]/8" />
                </div>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-11 rounded-xl border border-[#1c3320]/10 bg-white/50 hover:bg-white hover:border-[#1c3320]/18 text-[#1c3320]/40 hover:text-[#1c6634] font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                  <Link href="/sign-up">Create Swadeshi Account</Link>
                </Button>
              </div>
            </div>

            {/* Footer strip inside card */}
            <div className="bg-[#1c3320]/4 border-t border-[#1c3320]/6 px-8 py-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <Shield className="w-3 h-3 text-[#1c3320]/20 flex-shrink-0" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1c3320]/22">
                Verified Secure · End-to-End Encrypted
              </span>
              <div className="h-1 w-1 rounded-full bg-[#e8a020]/30" />
              <span className="text-[9px] font-bold text-[#1c3320]/20 uppercase tracking-widest">
                🌿 Vocal for Local
              </span>
            </div>
          </div>
        </div>
      </div>

      
     <MinimalFooter/>

    </div>
  );
};

export default Page;