"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Download, ShieldCheck, Loader2, CheckCircle,
  Leaf, FileText, Eye,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

/* ── Botanical leaf SVG (used in letter + UI) ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Letter canvas — A4 proportions, print-safe
───────────────────────────────────────────── */
const LetterCanvas = React.forwardRef<HTMLDivElement, { userData: any }>(
  ({ userData }, ref) => (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        position: "relative",
        padding: "22mm 24mm 32mm",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Watermark ── */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.025, pointerEvents: "none" }}>
        <img src="/amaze-logo.png" alt="" style={{ width: "160mm" }} />
      </div>

      {/* ── Saffron top border ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "linear-gradient(90deg, #1c3320, #e8a020 40%, #c8860a 60%, #1c3320)" }} />

      {/* ── Top-right corner leaf watermark ── */}
      <div style={{ position: "absolute", top: "12mm", right: "12mm", width: "40mm", opacity: 0.06, pointerEvents: "none" }}>
        <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="#1c3320" opacity="0.8"/>
          <path d="M60 170 L60 5" stroke="#1c3320" strokeWidth="2" opacity="0.6"/>
          <path d="M60 60 C40 50 25 55 15 70" stroke="#1c3320" strokeWidth="1.5" opacity="0.5"/>
          <path d="M60 90 C80 78 95 82 105 95" stroke="#1c3320" strokeWidth="1.5" opacity="0.5"/>
        </svg>
      </div>

      {/* ════════════════════════════
          HEADER
      ════════════════════════════ */}
      <table style={{ width: "100%", marginBottom: "0", paddingBottom: "18px", borderBottom: "1.5px solid #1c3320" }}>
        <tbody>
          <tr>
            {/* Logo + brand */}
            <td style={{ verticalAlign: "middle" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <img src="/amaze-logo.png" alt="Logo" style={{ width: "54px", height: "54px", objectFit: "contain" }} />
                <div>
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#1c3320", lineHeight: 1, letterSpacing: "-0.5px" }}>
                    AMAZE AYURVEDA
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "8px", fontWeight: 800, color: "#e8a020", letterSpacing: "4px" }}>
                    PRIVATE LIMITED
                  </p>
                </div>
              </div>
            </td>
            {/* Company info */}
            <td style={{ textAlign: "right", verticalAlign: "top" }}>
              <div style={{ fontSize: "8px", color: "#94a3b8", fontWeight: 700, lineHeight: 1.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <p style={{ margin: 0 }}>CIN: U82990BR2023PTC066853</p>
                <p style={{ margin: 0 }}>ISO 9001:2015 Certified</p>
                <p style={{ margin: 0 }}>AYUSH Registered</p>
                <p style={{ margin: 0, color: "#1c6634", fontWeight: 800 }}>www.amazeayurveda.in</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ════════════════════════════
          DATE + SUBJECT STRIP
      ════════════════════════════ */}
      <div style={{ marginTop: "20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "3px", height: "14px", background: "#e8a020", borderRadius: "2px" }} />
          <p style={{ margin: 0, fontSize: "8px", fontWeight: 900, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase" }}>
            Date of Issue: {userData?.joiningDate ?? "—"}
          </p>
        </div>
        <div style={{ background: "#1c3320", color: "#e8a020", fontSize: "8px", fontWeight: 900, letterSpacing: "2px", padding: "4px 12px", borderRadius: "20px" }}>
          OFFICIAL DOCUMENT
        </div>
      </div>

      {/* ════════════════════════════
          RECIPIENT BLOCK
      ════════════════════════════ */}
      <div style={{ marginBottom: "28px", borderLeft: "3px solid #e8a020", paddingLeft: "18px", paddingTop: "4px", paddingBottom: "4px" }}>
        <p style={{ margin: "0 0 6px", fontSize: "8px", fontWeight: 900, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase" }}>
          Addressed To
        </p>
        <p style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#1c3320", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.3px" }}>
          {userData?.name ?? "Associate"}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
          Associate ID:{" "}
          <span style={{ color: "#1c6634", fontWeight: 900 }}>{userData?.username}</span>
          {userData?.mobile && (
            <span style={{ marginLeft: "16px", color: "#94a3b8" }}>📱 {userData.mobile}</span>
          )}
        </p>
      </div>

      {/* ════════════════════════════
          SUBJECT LINE
      ════════════════════════════ */}
      <div style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "10px 0", marginBottom: "24px" }}>
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 900, color: "#1c3320", letterSpacing: "0.5px" }}>
          <span style={{ color: "#94a3b8", fontWeight: 700 }}>SUBJECT: </span>
          OFFICIAL ONBOARDING & WELCOME LETTER
        </p>
      </div>

      {/* ════════════════════════════
          BODY
      ════════════════════════════ */}
      <div style={{ fontSize: "13px", lineHeight: "1.85", color: "#334155", textAlign: "justify" }}>
        <p style={{ marginTop: 0 }}>
          Dear <strong style={{ color: "#1c3320" }}>{userData?.name}</strong>,
        </p>
        <p>
          We are delighted to welcome you as a verified Independent Business Partner of{" "}
          <strong style={{ color: "#1c3320" }}>Amaze Ayurveda Private Limited</strong>. Your
          association marks the beginning of a journey rooted in the{" "}
          <strong>Swadeshi Movement</strong> — one that unites health, prosperity, and the pride
          of a self-reliant India.
        </p>

        {/* Info box */}
        <div style={{ background: "#f8fbf8", border: "1px solid #d1fae5", borderRadius: "14px", padding: "18px 22px", margin: "22px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "33%", paddingRight: "12px", borderRight: "1px solid #e2f5ec" }}>
                  <p style={{ margin: 0, fontSize: "8px", fontWeight: 900, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase" }}>Sponsor</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 800, color: "#1c3320" }}>
                    {userData?.sponsorName || "Direct"}
                  </p>
                </td>
                <td style={{ width: "33%", paddingLeft: "12px", paddingRight: "12px", borderRight: "1px solid #e2f5ec" }}>
                  <p style={{ margin: 0, fontSize: "8px", fontWeight: 900, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase" }}>Plan Type</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 800, color: "#1c6634" }}>Generation Plan</p>
                </td>
                <td style={{ width: "33%", paddingLeft: "12px" }}>
                  <p style={{ margin: 0, fontSize: "8px", fontWeight: 900, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase" }}>Status</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 900, color: "#059669" }}>✓ Active</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Your partnership status is now <strong>Active</strong>. We encourage you to lead with
          integrity as you build your genealogy network and promote authentic Ayurvedic wellness
          across the nation. Your success is our collective pride.
        </p>

        {/* Tagline */}
        <p style={{ fontWeight: 900, marginTop: "28px", color: "#1c3320", fontSize: "16px", letterSpacing: "1px", textAlign: "center", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
          🌿 Be Indian &nbsp;•&nbsp; Buy Indian &nbsp;•&nbsp; Grow Indian
        </p>
      </div>

      {/* ════════════════════════════
          FOOTER  (pinned to bottom)
      ════════════════════════════ */}
      <div style={{ position: "absolute", bottom: "28mm", left: "24mm", right: "24mm" }}>
        {/* Divider */}
        <div style={{ borderTop: "1px solid #e2e8f0", marginBottom: "18px" }} />

        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              {/* Left: verified badge */}
              <td style={{ verticalAlign: "bottom" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "24px", height: "24px", background: "#1c3320", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#e8a020", fontSize: "12px" }}>✓</span>
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: 900, color: "#1c3320", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Verified Associate Partner
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "8px", color: "#94a3b8", lineHeight: 1.5, maxWidth: "200px" }}>
                  *This is a computer-generated onboarding document. Valid without physical signature.
                </p>
              </td>

              {/* Right: signature */}
              <td style={{ textAlign: "center", verticalAlign: "bottom" }}>
                <img src="/signature.png" alt="Signature" style={{ width: "130px", height: "auto", objectFit: "contain", display: "block", margin: "0 auto 6px" }} />
                <div style={{ width: "130px", height: "1px", background: "#1c3320", opacity: 0.15, margin: "0 auto 8px" }} />
                <p style={{ margin: 0, fontSize: "11px", fontWeight: 900, color: "#1c3320" }}>Managing Director</p>
                <p style={{ margin: "2px 0 0", fontSize: "8px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
                  AMAZE AYURVEDA PVT. LTD.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Bottom URL strip ── */}
      <div style={{ position: "absolute", bottom: "8mm", left: 0, right: 0, textAlign: "center" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #e8a020 30%, #1c3320 50%, #e8a020 70%, transparent)", marginBottom: "6px" }} />
        <p style={{ margin: 0, fontSize: "8px", fontWeight: 900, letterSpacing: "4px", color: "#94a3b8", opacity: 0.5 }}>
          WWW.AMAZEAYURVEDA.IN
        </p>
      </div>
    </div>
  )
);
LetterCanvas.displayName = "LetterCanvas";

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
const WelcomeLetter = () => {
  const { data: session }     = useSession();
  const username              = (session?.user as any)?.username;
  const { data: userData, isLoading } = useUser(username);
  const letterRef             = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!letterRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 800,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, 0, 210, 297);
      pdf.save(`Welcome_Letter_${userData?.username}.pdf`);
      toast.success("Document downloaded successfully.", {
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      });
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  /* Loading */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center gap-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-[#1c3320] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#e8a020] fill-[#e8a020] animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-[#e8a020]/30 animate-ping" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/35">
          Preparing your document…
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f0e8] relative overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page texture ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4  w-[500px] h-[500px] rounded-full bg-[#e8a020]/6  blur-[130px]" />
        <div className="absolute -bottom-32 right-0  w-[450px] h-[450px] rounded-full bg-[#1c3320]/5  blur-[110px]" />
        <LeafDecor className="absolute top-10 right-8  w-32 text-[#1c3320] opacity-[0.04]" />
        <LeafDecor className="absolute bottom-10 left-4 w-20 text-[#c8860a] opacity-[0.05] rotate-[18deg]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-10 pb-20">

        {/* ══════════════════════════════════════
            ACTION BAR
        ══════════════════════════════════════ */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[210mm]"
        >
          <div className="relative bg-[#1c3320] rounded-2xl overflow-hidden shadow-[0_16px_60px_rgba(28,50,32,0.22)]">
            {/* Decor */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-[#e8a020]/10 blur-[60px]" />
              <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
              <LeafDecor className="absolute -bottom-2 right-32 w-16 text-emerald-300 opacity-20 rotate-6" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-7 py-5">

              {/* Left: identity */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e8a020]/15 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#e8a020]" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/70 mb-0.5">
                    Official Document
                  </p>
                  <h2
                    className="text-base font-black text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Onboarding Welcome Letter
                  </h2>
                  <p className="text-[10px] font-medium text-white/30 mt-0.5">
                    {userData?.name} &nbsp;·&nbsp; ID: {userData?.username}
                  </p>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Preview hint */}
                <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <Eye className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">Preview below</span>
                </div>

                {/* Download button */}
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 h-11 px-7 rounded-xl bg-[#e8a020] hover:bg-[#d4911a] disabled:bg-[#e8a020]/50 text-[#1c3320] font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(232,160,32,0.3)] hover:shadow-[0_6px_28px_rgba(232,160,32,0.45)] active:scale-[0.97] transition-all duration-200"
                >
                  {isDownloading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Capturing…</>
                    : <><Download className="w-3.5 h-3.5" /> Download PDF</>
                  }
                </button>
              </div>
            </div>

            {/* Gold bottom hairline */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a020]/40 to-transparent" />
          </div>
        </motion.div>

        {/* Status chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { icon: ShieldCheck, label: "Verified Document" },
            { icon: Leaf,        label: "AYUSH Certified"  },
            { icon: CheckCircle, label: "Auto-Generated"   },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 bg-white border border-[#1c3320]/8 px-3 py-1.5 rounded-full shadow-sm">
              <Icon className="w-3 h-3 text-[#1c6634]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#1c3320]/45">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════
            LETTER PREVIEW
        ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="w-full flex justify-center"
        >
          {/* Scale wrapper: shrinks on smaller screens */}
          <div
            className="origin-top shadow-[0_32px_80px_rgba(28,50,32,0.2)] rounded-sm"
            style={{
              transform: "scale(var(--letter-scale, 1))",
            }}
          >
            <style>{`
              :root { --letter-scale: 1; }
              @media (max-width: 900px)  { :root { --letter-scale: 0.75; } }
              @media (max-width: 680px)  { :root { --letter-scale: 0.52; } }
              @media (max-width: 480px)  { :root { --letter-scale: 0.38; } }
            `}</style>
            <LetterCanvas ref={letterRef} userData={userData} />
          </div>
        </motion.div>

        {/* Bottom instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-12 bg-[#1c3320]/10" />
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/25 text-center">
            Scroll to preview · Click Download to save as PDF
          </p>
          <div className="h-px w-12 bg-[#1c3320]/10" />
        </motion.div>

      </div>
    </div>
  );
};

export default WelcomeLetter;