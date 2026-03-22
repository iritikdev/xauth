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
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   LetterCanvas — ALL inline styles, zero Tailwind, zero
   Framer. html2canvas only reads computed styles; Tailwind
   classes that aren't in the stylesheet at capture time will
   silently fall back to browser defaults.
───────────────────────────────────────────────────────────── */
const LetterCanvas = React.forwardRef<HTMLDivElement, { userData: any }>(
  ({ userData }, ref) => {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });

    /* ── shared style objects ── */
    const s = {
      page: {
        width: "794px",           // 210mm @ 96dpi — matches html2canvas render
        minHeight: "1123px",      // 297mm @ 96dpi
        backgroundColor: "#ffffff",
        position: "relative" as const,
        padding: "64px 72px 120px",
        boxSizing: "border-box" as const,
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden" as const,
      },
      topBar: {
        position: "absolute" as const, top: 0, left: 0, right: 0,
        height: "6px",
        background: "linear-gradient(90deg, #064e3b, #22c55e 40%, #15803d 60%, #064e3b)",
      },
      wm: {
        position: "absolute" as const, top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", opacity: 0.025, pointerEvents: "none" as const,
        width: "460px",
      },
      leafWm: {
        position: "absolute" as const, top: "36px", right: "36px",
        width: "110px", opacity: 0.05, pointerEvents: "none" as const,
      },
      /* Header */
      headerRow: {
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: "18px",
        borderBottom: "2px solid #064e3b",
        marginBottom: "20px",
      },
      brandCol: { display: "flex", alignItems: "center", gap: "14px" },
      brandName: {
        margin: 0, fontSize: "22px", fontWeight: 900,
        color: "#064e3b", lineHeight: 1, letterSpacing: "-0.5px",
        fontFamily: "Arial Black, Arial, sans-serif",
      },
      brandSub: {
        margin: "4px 0 0", fontSize: "8px", fontWeight: 800,
        color: "#16a34a", letterSpacing: "4px",
      },
      infoCol: {
        textAlign: "right" as const, fontSize: "8px",
        color: "#94a3b8", fontWeight: 700, lineHeight: 1.8,
        textTransform: "uppercase" as const, letterSpacing: "0.5px",
      },
      /* Date + badge row */
      dateBadgeRow: {
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: "22px",
      },
      dateTag: {
        display: "flex", alignItems: "center", gap: "8px",
        fontSize: "8px", fontWeight: 900, color: "#94a3b8",
        letterSpacing: "2px", textTransform: "uppercase" as const,
      },
      accentBar: {
        width: "3px", height: "14px", background: "#22c55e", borderRadius: "2px",
      },
      officialBadge: {
        background: "#064e3b", color: "#22c55e", fontSize: "8px",
        fontWeight: 900, letterSpacing: "2px", padding: "4px 14px",
        borderRadius: "20px",
      },
      /* Recipient */
      recipientBlock: {
        marginBottom: "26px", borderLeft: "3px solid #22c55e",
        paddingLeft: "18px", paddingTop: "4px", paddingBottom: "4px",
      },
      recipientLabel: {
        margin: "0 0 6px", fontSize: "8px", fontWeight: 900,
        color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase" as const,
      },
      recipientName: {
        margin: 0, fontSize: "26px", fontWeight: 900, color: "#064e3b",
        lineHeight: 1.1, textTransform: "uppercase" as const,
        fontFamily: "Arial Black, Arial, sans-serif",
      },
      recipientMeta: {
        margin: "6px 0 0", fontSize: "11px", fontWeight: 700, color: "#64748b",
      },
      /* Subject */
      subjectRow: {
        borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9",
        padding: "10px 0", marginBottom: "24px",
        fontSize: "11px", fontWeight: 900, color: "#064e3b", letterSpacing: "0.5px",
      },
      /* Body text */
      bodyText: {
        fontSize: "13px", lineHeight: "1.88", color: "#334155",
        textAlign: "justify" as const, marginBottom: "16px",
      },
      /* Info box */
      infoBox: {
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: "14px", padding: "18px 22px", margin: "22px 0",
      },
      infoBoxTable: { width: "100%", borderCollapse: "collapse" as const },
      infoBoxLabel: {
        margin: 0, fontSize: "8px", fontWeight: 900, color: "#94a3b8",
        letterSpacing: "1.5px", textTransform: "uppercase" as const,
      },
      infoBoxVal: {
        margin: "4px 0 0", fontSize: "13px", fontWeight: 800, color: "#064e3b",
      },
      infoBoxValGreen: {
        margin: "4px 0 0", fontSize: "13px", fontWeight: 800, color: "#16a34a",
      },
      infoBoxValActive: {
        margin: "4px 0 0", fontSize: "13px", fontWeight: 900, color: "#059669",
      },
      /* Tagline */
      tagline: {
        fontWeight: 900, marginTop: "28px", color: "#064e3b",
        fontSize: "15px", letterSpacing: "1px", textAlign: "center" as const,
        borderTop: "1px solid #f1f5f9", paddingTop: "20px",
      },
      /* Footer */
      footer: {
        position: "absolute" as const,
        bottom: "64px", left: "72px", right: "72px",
      },
      footerDivider: { borderTop: "1px solid #e2e8f0", marginBottom: "18px" },
      footerTable: { width: "100%", borderCollapse: "collapse" as const },
      verifiedBadge: {
        display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px",
      },
      verifiedIcon: {
        width: "24px", height: "24px", background: "#064e3b", borderRadius: "6px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", color: "#22c55e",
      },
      verifiedLabel: {
        fontSize: "9px", fontWeight: 900, color: "#064e3b",
        letterSpacing: "1.5px", textTransform: "uppercase" as const,
      },
      disclaimer: {
        margin: 0, fontSize: "8px", color: "#94a3b8",
        lineHeight: 1.5, maxWidth: "240px",
      },
      sigCol: { textAlign: "center" as const, verticalAlign: "bottom" as const },
      sigLine: {
        width: "130px", height: "1px", background: "#064e3b",
        opacity: 0.15, margin: "0 auto 8px",
      },
      sigName: { margin: 0, fontSize: "11px", fontWeight: 900, color: "#064e3b" },
      sigTitle: {
        margin: "2px 0 0", fontSize: "8px", fontWeight: 700,
        color: "#94a3b8", letterSpacing: "0.5px",
      },
      /* Bottom strip */
      bottomStrip: {
        position: "absolute" as const, bottom: "24px", left: 0, right: 0,
        textAlign: "center" as const,
      },
      stripLine: {
        height: "3px",
        background: "linear-gradient(90deg, transparent, #22c55e 30%, #064e3b 50%, #22c55e 70%, transparent)",
        marginBottom: "6px",
      },
      stripText: {
        margin: 0, fontSize: "8px", fontWeight: 900,
        letterSpacing: "4px", color: "#94a3b8", opacity: 0.5,
      },
    };

    return (
      <div ref={ref} style={s.page}>
        {/* top border */}
        <div style={s.topBar} />

        {/* watermark */}
        <div style={s.wm}>
          <img src="/amaze-logo.png" alt="" style={{ width: "100%" }} />
        </div>

        {/* leaf watermark */}
        <div style={s.leafWm}>
          <svg viewBox="0 0 120 180" fill="none">
            <path d="M60 170C60 170 10 120 10 70C10 30 35 5 60 5C85 5 110 30 110 70C110 120 60 170 60 170Z" fill="#064e3b" opacity="0.8"/>
            <path d="M60 170L60 5" stroke="#064e3b" strokeWidth="2" opacity="0.6"/>
          </svg>
        </div>

        {/* ── Header ── */}
        <div style={s.headerRow}>
          <div style={s.brandCol}>
            <img src="/amaze-logo.png" alt="Logo" style={{ width: "54px", height: "54px", objectFit: "contain" }} />
            <div>
              <p style={s.brandName}>AMAZE AYURVEDA</p>
              <p style={s.brandSub}>PRIVATE LIMITED</p>
            </div>
          </div>
          <div style={s.infoCol}>
            <p style={{ margin: 0 }}>CIN: U82990BR2023PTC066853</p>
            <p style={{ margin: 0 }}>ISO 9001:2015 Certified</p>
            <p style={{ margin: 0 }}>AYUSH Registered</p>
            <p style={{ margin: 0, color: "#16a34a", fontWeight: 800 }}>www.amazeayurveda.in</p>
          </div>
        </div>

        {/* ── Date + badge ── */}
        <div style={s.dateBadgeRow}>
          <div style={s.dateTag}>
            <div style={s.accentBar} />
            Date of Issue: {userData?.joiningDate ?? today}
          </div>
          <div style={s.officialBadge}>OFFICIAL DOCUMENT</div>
        </div>

        {/* ── Recipient ── */}
        <div style={s.recipientBlock}>
          <p style={s.recipientLabel}>Addressed To</p>
          <p style={s.recipientName}>{userData?.name ?? "Associate"}</p>
          <p style={s.recipientMeta}>
            Associate ID:{" "}
            <span style={{ color: "#16a34a", fontWeight: 900 }}>{userData?.username}</span>
            {userData?.mobile && (
              <span style={{ marginLeft: "16px", color: "#94a3b8" }}>
                📱 {userData.mobile}
              </span>
            )}
          </p>
        </div>

        {/* ── Subject ── */}
        <div style={s.subjectRow}>
          <span style={{ color: "#94a3b8", fontWeight: 700 }}>SUBJECT: </span>
          OFFICIAL ONBOARDING & WELCOME LETTER
        </div>

        {/* ── Body ── */}
        <p style={{ ...s.bodyText, marginTop: 0 }}>
          Dear <strong style={{ color: "#064e3b" }}>{userData?.name}</strong>,
        </p>
        <p style={s.bodyText}>
          We are delighted to welcome you as a verified Independent Business Partner of{" "}
          <strong style={{ color: "#064e3b" }}>Amaze Ayurveda Private Limited</strong>. Your
          association marks the beginning of a journey rooted in the{" "}
          <strong>Swadeshi Movement</strong> — one that unites health, prosperity, and the pride
          of a self-reliant India.
        </p>

        {/* Info box */}
        <div style={s.infoBox}>
          <table style={s.infoBoxTable}>
            <tbody>
              <tr>
                <td style={{ width: "33%", paddingRight: "16px", borderRight: "1px solid #a7f3d0", verticalAlign: "top" }}>
                  <p style={s.infoBoxLabel}>Sponsor</p>
                  <p style={s.infoBoxVal}>{userData?.sponsorName || "Direct"}</p>
                </td>
                <td style={{ width: "33%", paddingLeft: "16px", paddingRight: "16px", borderRight: "1px solid #a7f3d0", verticalAlign: "top" }}>
                  <p style={s.infoBoxLabel}>Plan Type</p>
                  <p style={s.infoBoxValGreen}>Generation Plan</p>
                </td>
                <td style={{ width: "33%", paddingLeft: "16px", verticalAlign: "top" }}>
                  <p style={s.infoBoxLabel}>Status</p>
                  <p style={s.infoBoxValActive}>✓ Active</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={s.bodyText}>
          Your partnership status is now <strong>Active</strong>. We encourage you to lead with
          integrity as you build your genealogy network and promote authentic Ayurvedic wellness
          across the nation. Your success is our collective pride.
        </p>

        <p style={{ ...s.bodyText, marginTop: "8px" }}>
          As part of the Amaze family, you now have access to our complete product line at
          partner pricing, your personal BV dashboard, and a growing community of like-minded
          wellness entrepreneurs. Please keep this document safe — it serves as proof of your
          verified association with us.
        </p>

        {/* Tagline */}
        <p style={s.tagline}>🌿 Be Indian &nbsp;•&nbsp; Buy Indian &nbsp;•&nbsp; Grow Indian</p>

        {/* ── Footer ── */}
        <div style={s.footer}>
          <div style={s.footerDivider} />
          <table style={s.footerTable}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: "bottom" }}>
                  <div style={s.verifiedBadge}>
                    <div style={s.verifiedIcon}>✓</div>
                    <span style={s.verifiedLabel}>Verified Associate Partner</span>
                  </div>
                  <p style={s.disclaimer}>
                    *This is a computer-generated onboarding document. Valid without physical signature.
                  </p>
                </td>
                <td style={s.sigCol}>
                  <img
                    src="/signature.png"
                    alt="Signature"
                    style={{ width: "130px", height: "60px", objectFit: "contain", display: "block", margin: "0 auto 6px" }}
                  />
                  <div style={s.sigLine} />
                  <p style={s.sigName}>Managing Director</p>
                  <p style={s.sigTitle}>AMAZE AYURVEDA PVT. LTD.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Bottom URL strip ── */}
        <div style={s.bottomStrip}>
          <div style={s.stripLine} />
          <p style={s.stripText}>WWW.AMAZEAYURVEDA.IN</p>
        </div>
      </div>
    );
  }
);
LetterCanvas.displayName = "LetterCanvas";

/* ─────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────── */
const LeafDecorSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none">
    <path d="M60 170C60 170 10 120 10 70C10 30 35 5 60 5C85 5 110 30 110 70C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
  </svg>
);

const WelcomeLetter = () => {
  const { data: session }              = useSession();
  const username                       = (session?.user as any)?.username;
  const { data: userData, isLoading }  = useUser(username);
  const letterRef                      = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    const el = letterRef.current;
    if (!el) return;
    setIsDownloading(true);
    try {
      // Capture at the natural pixel width of the letter (794px)
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        // windowWidth must match the element's declared width for correct layout
        windowWidth: 794,
        width: 794,
        height: el.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (doc) => {
          // force fonts in the clone so text renders correctly
          const st = doc.createElement("style");
          st.innerHTML = `* { font-family: Arial, Helvetica, sans-serif !important; }`;
          doc.head.appendChild(st);
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const A4_W = 210;
      const A4_H = 297;

      // How tall is the canvas in mm?
      const canvasH_mm = (canvas.height / canvas.width) * A4_W;

      if (canvasH_mm <= A4_H) {
        // Single page — fits perfectly
        pdf.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, 0, A4_W, canvasH_mm);
      } else {
        // Multi-page — slice the canvas into A4-height chunks
        const pageH_px  = Math.floor((A4_H / A4_W) * canvas.width);
        let   yOffset   = 0;
        let   pageIndex = 0;

        while (yOffset < canvas.height) {
          const sliceH = Math.min(pageH_px, canvas.height - yOffset);
          const slice  = document.createElement("canvas");
          slice.width  = canvas.width;
          slice.height = sliceH;
          slice.getContext("2d")!.drawImage(canvas, 0, -yOffset);

          if (pageIndex > 0) pdf.addPage();
          const sliceH_mm = (sliceH / canvas.width) * A4_W;
          pdf.addImage(slice.toDataURL("image/png", 1.0), "PNG", 0, 0, A4_W, sliceH_mm);

          yOffset   += pageH_px;
          pageIndex += 1;
        }
      }

      pdf.save(`Welcome_Letter_${userData?.username ?? "Associate"}.pdf`);
      toast.success("Welcome letter downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  /* Loading */
  if (isLoading) return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f9fafb" }}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center">
          <Leaf size={22} className="text-emerald-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 animate-ping" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
        Preparing your document…
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", }}
    >
      {/* bg orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[130px]" />
        <div className="absolute -bottom-32 right-0 w-[450px] h-[450px] rounded-full bg-zinc-900/5 blur-[110px]" />
        <LeafDecorSvg className="absolute top-10 right-8 w-32 text-emerald-900 opacity-[0.04]" />
        <LeafDecorSvg className="absolute bottom-10 left-4 w-20 text-emerald-700 opacity-[0.05] rotate-[18deg]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-10 pb-24">

        {/* ── Action bar ── */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="w-full max-w-[794px]"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 shadow-xl">
            {/* corner marks */}
            {["tl","tr","bl","br"].map((p) => (
              <span key={p} className={cn(
                "absolute h-5 w-5 border-emerald-400/25",
                p==="tl"&&"top-4 left-4 border-t-2 border-l-2 rounded-tl",
                p==="tr"&&"top-4 right-4 border-t-2 border-r-2 rounded-tr",
                p==="bl"&&"bottom-4 left-4 border-b-2 border-l-2 rounded-bl",
                p==="br"&&"bottom-4 right-4 border-b-2 border-r-2 rounded-br",
              )} />
            ))}
            <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-emerald-400/6 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-6 sm:px-8 py-6">
              {/* identity */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-emerald-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-400/70 mb-0.5">
                    Official Document
                  </p>
                  <h2
                    className="text-base font-black text-white leading-tight"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    Onboarding Welcome Letter
                  </h2>
                  <p className="text-[10px] font-medium text-zinc-500 mt-0.5">
                    {userData?.name} · ID: {userData?.username}
                  </p>
                </div>
              </div>

              {/* actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <Eye size={13} className="text-white/30" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">
                    Preview below
                  </span>
                </div>

                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={cn(
                    "flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl",
                    "text-[10px] font-black uppercase tracking-[0.18em] transition-all active:scale-[0.98]",
                    isDownloading
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-lg shadow-emerald-400/20"
                  )}
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {isDownloading
                    ? <><Loader2 size={13} className="animate-spin" /> Capturing…</>
                    : <><Download size={13} strokeWidth={2.5} /> Download PDF</>}
                </button>
              </div>
            </div>

            {/* emerald bottom hairline */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
          </div>
        </motion.div>

        {/* status chips */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { Icon: ShieldCheck, label: "Verified Document" },
            { Icon: Leaf,        label: "AYUSH Certified"  },
            { Icon: CheckCircle, label: "Auto-Generated"   },
          ].map(({ Icon, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm">
              <Icon size={11} className="text-emerald-600" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Letter preview ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1], delay: 0.15 }}
          className="w-full flex justify-center"
        >
          {/*
            The LetterCanvas is 794px wide. We use CSS scale() to shrink it
            on smaller screens while keeping it at native size for html2canvas.
            The outer container uses a calculated height to prevent collapsing.
          */}
          <style>{`
            .letter-scaler { --s: 1; transform: scale(var(--s)); transform-origin: top center; }
            .letter-wrapper { overflow: visible; }
            @media (max-width: 900px)  { .letter-scaler { --s: 0.78; } }
            @media (max-width: 680px)  { .letter-scaler { --s: 0.55; } }
            @media (max-width: 480px)  { .letter-scaler { --s: 0.40; } }
          `}</style>

          <div className="letter-wrapper" style={{ height: "calc(1123px * var(--scale, 1))" }}>
            <div
              className="letter-scaler shadow-[0_32px_80px_rgba(5,46,22,0.15)] rounded-sm"
            >
              <LetterCanvas ref={letterRef} userData={userData} />
            </div>
          </div>
        </motion.div>

        {/* bottom hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-10 bg-zinc-300" />
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400 text-center">
            Scroll to preview · Click Download to save as PDF
          </p>
          <div className="h-px w-10 bg-zinc-300" />
        </motion.div>

      </div>
    </div>
  );
};

export default WelcomeLetter;