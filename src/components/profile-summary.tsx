"use client";

import React, { useRef, useState } from "react";
import {
  ShieldCheck, User, MapPin, CheckCircle2,
  Edit3, Loader2, Phone, Mail,
  Fingerprint, Landmark, Sparkles, Download,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface UserProfileSummaryProps {
  userData: any;
  onEdit: () => void;
}

/* ─── corner marks (screen only) ─────────────────────────────── */
const Corners = () => (
  <>
    {(["tl","tr","bl","br"] as const).map((p) => (
      <span key={p} className={cn(
        "absolute h-5 w-5 border-emerald-400/25",
        p==="tl" && "top-4 left-4 border-t-2 border-l-2 rounded-tl",
        p==="tr" && "top-4 right-4 border-t-2 border-r-2 rounded-tr",
        p==="bl" && "bottom-4 left-4 border-b-2 border-l-2 rounded-bl",
        p==="br" && "bottom-4 right-4 border-b-2 border-r-2 rounded-br",
      )} />
    ))}
  </>
);

/* ─── main ────────────────────────────────────────────────────── */
export default function UserProfileSummary({
  userData,
  onEdit,
}: UserProfileSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const downloadKYCPDF = async () => {
    const el = summaryRef.current;
    if (!el) return;
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        // ensure the full element is captured
        scrollX: 0,
        scrollY: 0,
        width: el.scrollWidth,
        height: el.scrollHeight,
        onclone: (doc) => {
          // make sure fonts are embedded in the clone
          const style = doc.createElement("style");
          style.innerHTML = `
            * { font-family: 'Inter', system-ui, sans-serif !important; }
            .manrope { font-family: 'Manrope', system-ui, sans-serif !important; }
          `;
          doc.head.appendChild(style);
        },
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, h);
      pdf.save(`UserProfile_${userData?.username || "Associate"}.pdf`);
    } catch (e) {
      console.error("PDF Export failed", e);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div
      className="space-y-6 pb-20"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >

      {/* ══════════════════════════════════════════
          CAPTURABLE AREA
          ─ MUST have bg-white + explicit padding
          ─ All inner text uses inline style for PDF
      ══════════════════════════════════════════ */}
      <div
        ref={summaryRef}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 24,
          border: "1px solid #f4f4f5",
          padding: 32,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >

        {/* ── PDF brand header (visible in PDF, styled inline) ── */}
        <div style={{
          backgroundColor: "#09090b",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* ambient orb */}
          <div style={{
            position: "absolute", top: -64, right: -64,
            width: 220, height: 220, borderRadius: "50%",
            background: "rgba(52,211,153,0.06)", filter: "blur(60px)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            {/* left */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* auth badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)",
                borderRadius: 99, padding: "5px 14px", width: "fit-content",
              }}>
                <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "#34d399" }}>
                  ✦ Authenticated Swadeshi Associate
                </span>
              </div>

              {/* name */}
              <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", lineHeight: 1.1, fontFamily: "'Manrope', system-ui, sans-serif" }} className="manrope">
                {userData?.name}
              </div>

              {/* meta pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[`ID: ${userData?.username}`, `Sponsor: ${userData?.sponsorName || "Direct"}`].map((t) => (
                  <span key={t} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 99, padding: "4px 12px",
                    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.12em",
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* BV */}
              {userData?.personalBv && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "rgba(5,46,22,0.60)", border: "1px solid rgba(52,211,153,0.20)",
                  borderRadius: 16, padding: "10px 16px", width: "fit-content",
                }}>
                  <span style={{ fontSize: 13, color: "#34d399" }}>✦</span>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: 2 }}>
                      Personal BV
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#6ee7b7", lineHeight: 1, fontFamily: "'Manrope', system-ui, sans-serif" }} className="manrope">
                      {userData.personalBv} BV
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 120, height: 120, borderRadius: 22,
                border: "2px solid rgba(255,255,255,0.10)",
                overflow: "hidden", background: "#27272a",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {userData?.photoUrl ? (
                  <Image src={userData.photoUrl} alt="Profile" width={120} height={120} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                ) : (
                  <span style={{ fontSize: 48, color: "#52525b" }}>👤</span>
                )}
              </div>
              {/* verified badge */}
              <div style={{
                position: "absolute", bottom: -8, right: -8,
                background: "#22c55e", borderRadius: 12, border: "3px solid #09090b",
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 14, color: "#fff" }}>✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── data grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <PdfSection
            title="Personal & Identity"
            icon="☞"
            items={[
              { label: "Father's Name",  value: userData?.fatherName },
              { label: "Email Address",  value: userData?.email },
              { label: "Mobile Number",  value: userData?.mobile },
              { label: "Aadhaar Card",   value: `XXXX-XXXX-${userData?.aadharNo?.slice(-4)}`, verified: true },
              { label: "PAN Card",       value: userData?.panNumber, verified: true },
            ]}
          />
          <PdfSection
            title="Banking & Payouts"
            icon="₹"
            items={[
              { label: "Bank Name",   value: userData?.branch?.split("-")[0] || "Verified Bank" },
              { label: "Account No", value: userData?.accountNo },
              { label: "UPI ID",     value: userData?.upiId,  verified: true },
              { label: "IFSC Code",  value: userData?.ifsc,   verified: true },
              { label: "Branch",     value: userData?.branch?.split("-")[1] || "Main Branch" },
            ]}
          />
          <PdfSection
            title="Succession & Nominee"
            icon="◎"
            items={[
              { label: "Nominee Name",   value: userData?.nomineeName },
              { label: "Relationship",   value: userData?.nomineeRelation },
              { label: "Mobile Number",  value: userData?.nomineeMobile },
              { label: "Aadhaar Number", value: `XXXX-XXXX-${userData?.nomineeAadhaar?.slice(-4)}`, verified: true },
            ]}
          />
          <PdfSection
            title="Registered Address"
            icon="📍"
            items={[
              { label: "Permanent Address", value: userData?.address },
              { label: "City & District",   value: userData?.district },
              { label: "State & Pincode",   value: `${userData?.state} - ${userData?.pincode}`, verified: true },
            ]}
          />
        </div>

        {/* ── slogan footer ── */}
        <div style={{
          marginTop: 28, paddingTop: 20,
          borderTop: "1px solid #f4f4f5",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: 0.18,
        }}>
          {["Be Indian","Buy Indian","Grow Indian"].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#09090b", display: "inline-block" }} />}
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.45em", textTransform: "uppercase", color: "#09090b" }}>{s}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── actions (excluded from PDF ref) ── */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 no-print">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 h-12 px-7 rounded-2xl border border-zinc-200 bg-white text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600 hover:bg-zinc-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm w-full sm:w-auto"
        >
          <Edit3 size={14} strokeWidth={2} /> Edit Profile
        </button>

        <button
          onClick={downloadKYCPDF}
          disabled={isPrinting}
          className={cn(
            "flex items-center justify-center gap-2 h-12 px-9 rounded-2xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all w-full sm:w-auto",
            isPrinting
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm shadow-zinc-900/20 active:scale-[0.98]"
          )}
        >
          {isPrinting
            ? <><Loader2 size={14} className="animate-spin" /> Securing PDF…</>
            : <><Download size={14} strokeWidth={2} /> Download Profile PDF</>}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PdfSection — fully inline-styled so html2canvas renders it
───────────────────────────────────────────────────────────── */
function PdfSection({
  title, icon, items,
}: {
  title: string;
  icon: string;
  items: { label: string; value?: string; verified?: boolean }[];
}) {
  return (
    <div style={{
      borderRadius: 20, border: "1px solid #f4f4f5",
      background: "rgba(250,250,250,0.6)", padding: "20px 22px",
    }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 9,
          background: "#ffffff", border: "1px solid #e4e4e7",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: "#71717a",
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a1a1aa" }}>
          {title}
        </span>
      </div>

      {/* items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item, i) => (
          <div key={i}>
            {/* divider */}
            {i > 0 && <div style={{ height: 1, background: "#f4f4f5", margin: "10px 0" }} />}

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a1a1aa", marginBottom: 3 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#09090b", lineHeight: 1.3, wordBreak: "break-all", fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  {item.value || "—"}
                </div>
              </div>

              {item.verified && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 3, flexShrink: 0,
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 10, padding: "3px 8px", marginTop: 12,
                }}>
                  <span style={{ fontSize: 9, color: "#22c55e" }}>✓</span>
                  <span style={{ fontSize: 8, fontWeight: 900, color: "#059669", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}