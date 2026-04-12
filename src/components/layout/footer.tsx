"use client";

import React from "react";
import {
  Instagram, Twitter, Youtube, Facebook,
  MapPin, Phone, Mail, ShieldCheck, Leaf, Award
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ── Botanical leaf SVG (shared design-system asset) ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15" />
  </svg>
);

const exploreLinks = ["About Us", "Business Plan", "Shop", "Careers", "T&C", "Privacy Policy"];

const socials = [
  { Icon: Instagram, href: "https://www.instagram.com/amazeayurveda", label: "Instagram" },
  { Icon: Twitter,   href: "https://twitter.com/amazeayurveda", label: "Twitter"   },
  { Icon: Youtube,   href: "https://www.youtube.com/@amazeayurvedapvtltd", label: "YouTube"   },
  { Icon: Facebook,  href: "https://www.facebook.com/share/1Jw3ZvZapn", label: "Facebook"  },
];

const trustBadges = [
  { icon: <ShieldCheck size={15} />, label: "ISO Certified"  },
  { icon: <Leaf        size={15} />, label: "100% Organic"   },
  { icon: <Award       size={15} />, label: "Ayush Dept."    },
  { icon: <Award       size={15} />, label: "GMP Certified"  },
];

export const Footer = () => {
  return (
    <footer
      className="relative bg-[#1c3320] overflow-hidden pt-20 pb-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40  w-[480px] h-[480px] rounded-full bg-[#c8860a]/8  blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-emerald-500/6 blur-[100px]" />

        {/* Subtle dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Decorative leaves */}
        <LeafDecor className="absolute top-6  right-12  w-32 text-emerald-400  opacity-60" />
        <LeafDecor className="absolute bottom-10 left-6  w-20 text-[#c8860a] opacity-50 rotate-[20deg]" />
        <LeafDecor className="absolute top-1/2 right-5  w-14 text-emerald-300 opacity-40 -rotate-12" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ══════════════════════════════════════
            TOP  —  Brand + Nav grid
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-white/8">

          {/* ── Brand column ── */}
          <div className="lg:col-span-4 space-y-7">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative w-14 h-14 rounded-xl bg-white/8 border border-white/10 overflow-hidden flex-shrink-0">
                <Image
                  src="/amaze-logo.png"
                  alt="Amaze Ayurveda"
                  fill
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h3
                  className="text-xl font-black text-white leading-none tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Amaze <span className="text-[#e8a020] italic">Ayurveda</span>
                </h3>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.35em] mt-1.5">
                  Pvt. Ltd.
                </p>
              </div>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-medium italic border-l-2 border-[#e8a020]/30 pl-4">
              "Authentic Ayurvedic wisdom, sustainable opportunities, and a vision for a stronger, healthier India."
            </p>

            {/* Socials */}
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:bg-[#e8a020] hover:text-[#1c3320] hover:border-[#e8a020] hover:-translate-y-1 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Reach Us ── */}
          <div className="lg:col-span-3 space-y-6">
            <SectionHeading>Reach Us</SectionHeading>
            <div className="space-y-5">
              <ContactItem icon={<MapPin  size={15} />} label="Location" value="Saraiya, Bihar, India 843106" />
              <ContactItem icon={<Phone   size={15} />} label="Call"     value="+91 9204260719"            href="tel:+919204260719" />
              <ContactItem icon={<Mail    size={15} />} label="Email"    value="support@amazeayurveda.in"  href="mailto:support@amazeayurveda.in" />
            </div>
          </div>

          {/* ── Explore ── */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeading>Explore</SectionHeading>
            <ul className="space-y-3.5">
              {exploreLinks.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group flex items-center gap-2.5 text-white/45 hover:text-[#e8a020] text-sm font-medium transition-all duration-200"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#e8a020] group-hover:w-3 transition-all duration-200 flex-shrink-0" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Trust Badges ── */}
          <div className="lg:col-span-3 space-y-6">
            <SectionHeading>Trust &amp; Safety</SectionHeading>
            <div className="grid grid-cols-2 gap-2.5">
              {trustBadges.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-[#e8a020]/30 transition-all text-center group"
                >
                  <span className="text-[#e8a020]/70 group-hover:text-[#e8a020] transition-colors">
                    {icon}
                  </span>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider leading-none group-hover:text-white/50 transition-colors">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BOTTOM BAR
        ══════════════════════════════════════ */}
        <div className="pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest">
            © 2026 Amaze Ayurveda Pvt. Ltd.&nbsp;&nbsp;·&nbsp;&nbsp;CIN: U82990BR2023PTC066853
          </p>

          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#e8a020]/30" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.22em]">
              Proudly Made in Bharat
            </span>
            <span className="text-base leading-none">🇮🇳</span>
            <div className="h-px w-8 bg-[#e8a020]/30" />
          </div>
        </div>

      </div>
    </footer>
  );
};

/* ─────────── Sub-components ─────────── */

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-black text-white/35 uppercase tracking-[0.28em]">
      {children}
    </span>
    <div className="h-px flex-1 bg-white/8" />
  </div>
);

const ContactItem = ({
  icon, label, value, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex items-start gap-3 group">
    <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-[#e8a020]/60 group-hover:bg-[#e8a020]/10 group-hover:border-[#e8a020]/20 group-hover:text-[#e8a020] transition-all flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-0.5">{label}</p>
      {href ? (
        <a href={href} className="text-sm font-medium text-white/55 hover:text-[#e8a020] transition-colors">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-white/55">{value}</p>
      )}
    </div>
  </div>
);