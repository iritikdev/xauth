"use client";

import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, History,
  Loader2, Download, FileText, ChevronDown,
  Sparkles, TrendingUp, TrendingDown, Calendar,
  Filter, X,
} from "lucide-react";
import { toast } from "sonner";
import { getWalletData } from "@/lib/actions/wallet";
import { WithdrawMoneyModal } from "./withdraw-money-modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── types ───────────────────────────────────────────────────── */
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
}

/* ─── month helpers ───────────────────────────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getMonthLabel(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function groupByMonth(txns: Transaction[]) {
  const map = new Map<string, Transaction[]>();
  txns.forEach((t) => {
    const d = new Date(t.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  });
  // sorted newest first
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

/* ─── PDF statement ───────────────────────────────────────────── */
function downloadMonthStatement(key: string, txns: Transaction[], balance: number) {
  const pdf = new jsPDF("p", "mm", "a4");
  const label = monthLabel(key);
  const w = pdf.internal.pageSize.getWidth();

  // Header bar
  pdf.setFillColor(9, 9, 11);
  pdf.roundedRect(10, 10, w - 20, 28, 4, 4, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Amaze Ayurveda — Wallet Statement", 18, 22);
  pdf.setFontSize(8);
  pdf.setTextColor(100, 200, 120);
  pdf.text(label, 18, 30);
  pdf.setTextColor(180, 180, 180);
  pdf.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, w - 18, 30, { align: "right" });

  // Summary
  const credits  = txns.filter(t => t.type === "CREDIT").reduce((a,t) => a + t.amount, 0);
  const debits   = txns.filter(t => t.type === "DEBIT").reduce((a,t) => a + t.amount, 0);
  const net      = credits - debits;

  const summaryY = 46;
  const cols = [[
    `Credits: ₹${credits.toLocaleString("en-IN")}`,
    `Debits: ₹${debits.toLocaleString("en-IN")}`,
    `Net: ₹${net.toLocaleString("en-IN")}`,
    `Balance: ₹${balance.toLocaleString("en-IN")}`,
  ]];
  autoTable(pdf, {
    startY: summaryY,
    head: [["Credits","Debits","Net Change","Closing Balance"]],
    body: [[
      `₹${credits.toLocaleString("en-IN")}`,
      `₹${debits.toLocaleString("en-IN")}`,
      `${net >= 0 ? "+" : ""}₹${net.toLocaleString("en-IN")}`,
      `₹${balance.toLocaleString("en-IN")}`,
    ]],
    headStyles: { fillColor: [5, 46, 22], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles:  { fontSize: 9, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    margin: { left: 10, right: 10 },
  });

  // Transactions table
  const rows = txns.map((t) => {
    const d = new Date(t.createdAt);
    return [
      d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
      d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12: true }),
      t.description,
      t.type,
      t.status,
      `${t.type === "CREDIT" ? "+" : "-"}₹${t.amount.toLocaleString("en-IN")}`,
    ];
  });

  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 8,
    head: [["Date","Time","Description","Type","Status","Amount"]],
    body: rows,
    headStyles: { fillColor: [9, 9, 11], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      5: { fontStyle: "bold" },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 3) {
        data.cell.styles.textColor = data.cell.raw === "CREDIT" ? [5,150,105] : [220,38,38];
      }
      if (data.section === "body" && data.column.index === 5) {
        data.cell.styles.textColor = data.cell.raw?.startsWith("+") ? [5,150,105] : [9,9,11];
      }
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 10, right: 10 },
  });

  // Footer
  const pageH = pdf.internal.pageSize.getHeight();
  pdf.setFontSize(7);
  pdf.setTextColor(180,180,180);
  pdf.text("Amaze Ayurveda Pvt. Ltd. | Be Indian · Buy Indian · Grow Indian", w / 2, pageH - 8, { align: "center" });

  pdf.save(`Wallet_Statement_${key}.pdf`);
  toast.success(`Statement for ${label} downloaded!`);
}

/* ─── main component ──────────────────────────────────────────── */
export default function WalletPage() {
  const [data, setData]           = useState<{ balance: number; transactions: Transaction[] } | null>(null);
  const [loading, setLoading]     = useState(true);
  const [filterMonth, setFilterMonth] = useState<string | null>(null);
  const [statementOpen, setStatementOpen] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    const res = await getWalletData();
    if (res.success && res.data) setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getWalletData().then((res) => {
      if (res.success && res.data) setData(res.data);
      else { toast.error(res.error || "Failed to load wallet"); setData({ balance: 0, transactions: [] }); }
    }).catch(() => toast.error("Something went wrong")).finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => groupByMonth(data?.transactions ?? []), [data]);

  const visibleTxns = useMemo(() => {
    if (!filterMonth) return data?.transactions ?? [];
    return (data?.transactions ?? []).filter((t) => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}`;
      return key === filterMonth;
    });
  }, [data, filterMonth]);

  const credits     = visibleTxns.filter(t => t.type === "CREDIT").reduce((a,t) => a + t.amount, 0);
  const withdrawals = visibleTxns.filter(t => t.type === "DEBIT").reduce((a,t) => a + t.amount, 0);

  /* ── loading ── */
  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Loading wallet…
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="space-y-5 pb-20 px-0"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >

      {/* ══ BALANCE HERO ══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-7 sm:p-9"
      >
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
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-400/6 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={11} className="text-emerald-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                  Amaze Wallet Balance
                </p>
              </div>
              <p
                className="text-4xl sm:text-5xl font-black text-white leading-none"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                ₹{data?.balance?.toLocaleString("en-IN") ?? "0"}
              </p>
              <p className="text-[11px] font-medium text-zinc-600 mt-2">
                Available for withdrawal
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Wallet size={20} className="text-white/30" strokeWidth={1.5} />
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-wrap gap-3">
            <WithdrawMoneyModal balance={data?.balance ?? 0} onRefresh={refreshData} />

            {/* Download statement button */}
            <div className="relative">
              <button
                onClick={() => setStatementOpen((v) => !v)}
                className="flex items-center gap-2 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/60 hover:text-white transition-all"
              >
                <FileText size={13} strokeWidth={2} />
                <span className="hidden sm:inline">Download Statement</span>
                <span className="sm:hidden">Statement</span>
                <ChevronDown size={11} className={cn("transition-transform", statementOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {statementOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-13 mt-1 w-56 rounded-2xl border border-zinc-800 bg-zinc-900 p-1.5 z-50 shadow-2xl"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 px-3 py-1.5">
                      Select Month
                    </p>
                    {grouped.length === 0 && (
                      <p className="text-[11px] text-zinc-500 px-3 py-2">No transactions yet.</p>
                    )}
                    {grouped.map(([key, txns]) => (
                      <button
                        key={key}
                        onClick={() => {
                          downloadMonthStatement(key, txns, data?.balance ?? 0);
                          setStatementOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        <span>{monthLabel(key)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500">{txns.length} txn</span>
                          <Download size={11} className="text-zinc-500" />
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══ STATS ROW ══ */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<TrendingUp size={16} strokeWidth={2} className="text-emerald-600" />}
          label={filterMonth ? `${monthLabel(filterMonth)} Credits` : "Total Credits"}
          value={`₹${credits.toLocaleString("en-IN")}`}
          accent="emerald"
        />
        <StatCard
          icon={<TrendingDown size={16} strokeWidth={2} className="text-red-500" />}
          label={filterMonth ? `${monthLabel(filterMonth)} Debits` : "Total Debits"}
          value={`₹${withdrawals.toLocaleString("en-IN")}`}
          accent="red"
        />
      </div>

      {/* ══ TRANSACTION HISTORY ══ */}
      <div className="rounded-[2rem] border border-zinc-100 bg-white overflow-hidden shadow-sm">

        {/* header */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/60 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-400">
              <History size={13} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Transaction History
            </span>
            {filterMonth && (
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                {monthLabel(filterMonth)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* month filter */}
            <div className="relative">
              <select
                value={filterMonth ?? ""}
                onChange={(e) => setFilterMonth(e.target.value || null)}
                className="h-8 appearance-none rounded-xl border border-zinc-200 bg-white pl-8 pr-8 text-[11px] font-medium text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 cursor-pointer"
              >
                <option value="">All months</option>
                {grouped.map(([key]) => (
                  <option key={key} value={key}>{monthLabel(key)}</option>
                ))}
              </select>
              <Calendar size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            {/* clear filter */}
            {filterMonth && (
              <button
                onClick={() => setFilterMonth(null)}
                className="h-8 w-8 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}

            {/* download current filter as PDF */}
            {filterMonth && (
              <button
                onClick={() => {
                  const key = filterMonth;
                  const txns = grouped.find(([k]) => k === key)?.[1] ?? [];
                  downloadMonthStatement(key, txns, data?.balance ?? 0);
                }}
                className="h-8 flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Download size={11} strokeWidth={2.5} />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* list */}
        {visibleTxns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <History size={18} className="text-zinc-300" strokeWidth={1.5} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400">
              {filterMonth ? "No transactions this month" : "No transactions yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            <AnimatePresence>
              {visibleTxns.map((t, i) => {
                const d = new Date(t.createdAt);
                const date = d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
                const time = d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12: true });
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i < 8 ? i * 0.03 : 0 }}
                  >
                    <TxnRow
                      title={t.description}
                      date={date}
                      time={time}
                      amount={`${t.type === "CREDIT" ? "+" : "−"}₹${t.amount.toLocaleString("en-IN")}`}
                      type={t.type}
                      status={t.status}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── stat card ───────────────────────────────────────────────── */
function StatCard({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: string; accent: "emerald"|"red";
}) {
  return (
    <div className={cn(
      "rounded-[2rem] border p-5 sm:p-6 flex items-center gap-4 shadow-sm transition-all hover:shadow-md",
      accent === "emerald" ? "border-zinc-100 bg-white" : "border-zinc-100 bg-white"
    )}>
      <div className={cn(
        "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0",
        accent === "emerald" ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"
      )}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400 mb-1">{label}</p>
        <p
          className="text-xl sm:text-2xl font-black text-zinc-900 leading-none truncate"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── transaction row ─────────────────────────────────────────── */
function TxnRow({ title, date, time, amount, type, status }: {
  title: string; date: string; time: string;
  amount: string; type: "CREDIT"|"DEBIT";
  status: "COMPLETED"|"PENDING"|"FAILED";
}) {
  const statusCfg = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    PENDING:   "bg-amber-50  text-amber-700  border-amber-100",
    FAILED:    "bg-red-50    text-red-600    border-red-100",
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-zinc-50/60 transition-colors">
      {/* icon */}
      <div className={cn(
        "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
        type === "CREDIT" ? "bg-emerald-50 border border-emerald-100" : "bg-zinc-100 border border-zinc-200"
      )}>
        {type === "CREDIT"
          ? <ArrowUpRight size={16} className="text-emerald-600" strokeWidth={2.5} />
          : <ArrowDownLeft size={16} className="text-zinc-600" strokeWidth={2.5} />}
      </div>

      {/* description + meta */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-black text-zinc-900 truncate"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
          {title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[10px] font-medium text-zinc-400">
            {date} · {time}
          </span>
          <span className={cn(
            "text-[8px] font-black uppercase tracking-widest border rounded-full px-2 py-0.5",
            statusCfg[status]
          )}>
            {status}
          </span>
        </div>
      </div>

      {/* amount */}
      <p
        className={cn(
          "text-[15px] font-black tabular-nums shrink-0",
          type === "CREDIT" ? "text-emerald-600" : "text-zinc-900"
        )}
        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
      >
        {amount}
      </p>
    </div>
  );
}