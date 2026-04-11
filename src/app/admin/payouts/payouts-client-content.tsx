"use client";

import { useState, useMemo } from "react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
    Clock, Landmark, Copy, History, Check,
    FileSpreadsheet, Calendar as CalendarIcon, FilterX,
    ArrowUpRight, Wallet, Search,
    ArrowDownRight,
    TrendingUp
} from "lucide-react";
import PayoutActions from "./payout-actions";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PayoutChart } from "@/components/admin/payout-chart";

export default function PayoutsClientContent({ initialData = [] }: { initialData?: any[] }) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(() => {
        let data = initialData;
        if (startDate && endDate) {
            data = data.filter((t) => {
                const date = new Date(t.createdAt);
                return isWithinInterval(date, {
                    start: startOfDay(new Date(startDate)),
                    end: endOfDay(new Date(endDate)),
                });
            });
        }
        if (searchQuery) {
            data = data.filter(t =>
                t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return data;
    }, [startDate, endDate, searchQuery, initialData]);

    const { currentMonthTotal, prevMonthTotal, percentageChange } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Current Month Data
        const currentMonthData = initialData.filter(t => {
            const d = new Date(t.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.status === "COMPLETED";
        });

        // Previous Month Data
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        const prevMonthData = initialData.filter(t => {
            const d = new Date(t.createdAt);
            return d.getMonth() === prevMonth && d.getFullYear() === prevYear && t.status === "COMPLETED";
        });

        const currentTotal = currentMonthData.reduce((acc, curr) => acc + curr.amount, 0);
        const prevTotal = prevMonthData.reduce((acc, curr) => acc + curr.amount, 0);

        // Percentage Calculation
        let change = 0;
        if (prevTotal > 0) {
            change = ((currentTotal - prevTotal) / prevTotal) * 100;
        } else if (currentTotal > 0) {
            change = 100;
        }

        return {
            currentMonthTotal: currentTotal,
            prevMonthTotal: prevTotal,
            percentageChange: change
        };
    }, [initialData]);

    const pendingPayouts = filteredData.filter(t => t.status === "PENDING" && t.type === "DEBIT");
    const historyTransactions = filteredData.filter(t => t.status !== "PENDING");

    const totalPendingAmount = pendingPayouts.reduce((acc, curr) => acc + curr.amount, 0);

    const exportToExcel = () => {
        const dataToExport = filteredData.map(t => ({
            Date: format(new Date(t.createdAt), "dd-MM-yyyy"),
            Associate: t.user.name,
            ID: t.user.username,
            Amount: t.amount,
            Status: t.status,
            Bank_AC: t.user.accountNo,
            IFSC: t.user.ifsc,
            UPI: t.user.upiId
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payouts");
        XLSX.writeFile(wb, `Amaze_Payouts_${format(new Date(), "dd_MMM")}.xlsx`);
        toast.success("Financial report exported!");
    };

    return (
        <div className="min-h-screen pb-20 font-sans">

            {/* --- SaaS STATS HEADER --- */}
            <div className=" pb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl md:text-7xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-none mb-4"
                    >
                        Payout <span className="text-emerald-500">Hub</span>
                    </motion.h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        System Live • {filteredData.length} records in view
                    </p>
                </div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex items-center justify-between"
                >
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Queue Volume</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{totalPendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <Wallet size={24} />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
                {/* Decorative Background Icon */}
                <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 -rotate-12" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                            <History size={20} />
                        </div>

                        {/* Trend Badge */}
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1",
                            percentageChange >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {percentageChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(percentageChange).toFixed(1)}%
                        </div>
                    </div>

                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">
                        Monthly Volume
                    </p>
                    <p className="text-4xl font-[1000] text-slate-900 tracking-tighter italic">
                        ₹{currentMonthTotal.toLocaleString()}
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Vs Last Month: <span className="text-slate-900 ml-1">₹{prevMonthTotal.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </motion.div>
            <div className="col-span-2 bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Weekly Volume</p>
                        <p className="text-xs font-bold text-slate-900 mt-1">Transaction trends (Last 7 Days)</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Real-time
                    </div>
                </div>
                <PayoutChart transactions={filteredData} />
            </div>
            </div>
           

          

            {/* --- FLOATING FILTER BAR --- */}
            <div className="sticky top-6 z-50 mb-12">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-3 flex flex-col xl:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full xl:w-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Associate Name or ID..."
                            className="w-full h-14 pl-14 pr-6 rounded-full bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full xl:w-auto px-4 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shrink-0">
                            <CalendarIcon size={14} className="text-emerald-500" />
                            <input type="date" className="bg-transparent text-[10px] font-black uppercase outline-none" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                            <span className="text-slate-300 mx-1">/</span>
                            <input type="date" className="bg-transparent text-[10px] font-black uppercase outline-none" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                        </div>

                        <Button
                            onClick={exportToExcel}
                            className="h-14 rounded-full bg-slate-900 text-white px-8 font-black text-[10px] uppercase tracking-widest gap-2 shrink-0 hover:bg-emerald-600 transition-all active:scale-95"
                        >
                            <FileSpreadsheet size={16} /> Export
                        </Button>

                        {(startDate || endDate || searchQuery) && (
                            <Button variant="ghost" onClick={() => { setStartDate(""); setEndDate(""); setSearchQuery(""); }} className="h-14 w-14 rounded-full text-rose-500 bg-rose-50 shrink-0">
                                <FilterX size={20} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CONTENT TABS --- */}
            <Tabs defaultValue="pending" className="space-y-10">

                <div className="flex justify-center w-full px-2">
                    <TabsList className="bg-slate-200/50 p-1.5 rounded-full w-full max-w-sm flex items-center border border-slate-200/50 h-auto">

                        <TabsTrigger
                            value="pending"
                            className={cn(
                                "flex-1 rounded-full font-black uppercase text-[9px] md:text-[10px] py-3 px-2 transition-all",
                                "data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-emerald-600",
                                "flex items-center justify-center gap-1.5 min-w-0"
                            )}
                        >
                            <span className="truncate">Queue</span>
                            <span className="shrink-0 px-2 py-0.5 bg-slate-100 rounded-md text-[9px] text-slate-500 group-data-[state=active]:bg-emerald-50">
                                {pendingPayouts.length}
                            </span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="history"
                            className={cn(
                                "flex-1 rounded-full font-black uppercase text-[9px] md:text-[10px] py-3 px-2 transition-all",
                                "data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-emerald-600",
                                "flex items-center justify-center gap-1.5 min-w-0"
                            )}
                        >
                            <span className="truncate">Archive</span>
                            <span className="shrink-0 px-2 py-0.5 bg-slate-100 rounded-md text-[9px] text-slate-500">
                                {historyTransactions.length}
                            </span>
                        </TabsTrigger>

                    </TabsList>
                </div>

                <TabsContent value="pending" className="grid grid-cols-1 lg:grid-cols-2 gap-6 outline-none">
                    <AnimatePresence>
                        {pendingPayouts.length === 0 ? <div className="lg:col-span-2"><EmptyState message="The queue is clear for now" /></div> :
                            pendingPayouts.map(p => <PayoutCard key={p.id} payout={p} isPending />)}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="history" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 outline-none">
                    {historyTransactions.length === 0 ? <EmptyState message="No records found in archive" /> :
                        historyTransactions.map(p => <PayoutCard key={p.id} payout={p} isPending={false} />)}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function PayoutCard({ payout, isPending }: { payout: any; isPending: boolean }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 p-6 md:p-8 relative overflow-hidden"
        >
            <div className="flex flex-col gap-8">
                {/* User Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-3xl bg-slate-100 overflow-hidden ring-4 ring-slate-50">
                            <Image alt="U" src={payout.user.photoUrl || "/placeholder.png"} fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">{payout.user?.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{payout.user.username} • {format(new Date(payout.createdAt), "MMM dd, yyyy")}</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                {/* Amount Box */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Payout</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{payout.amount.toLocaleString()}</p>
                    </div>
                    {!isPending && (
                        <div className={cn(
                            "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                            payout.status === "COMPLETED" ? "bg-emerald-500 text-white border-emerald-400" : "bg-rose-500 text-white border-rose-400"
                        )}>
                            {payout.status}
                        </div>
                    )}
                </div>

                {/* Bank Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group/bank">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl transition-all group-hover/bank:scale-150" />
                        <div className="flex items-center gap-2 mb-4 opacity-50">
                            <Landmark size={12} className="text-emerald-400" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Primary Bank</span>
                        </div>
                        <div className="space-y-4">
                            <BankItem label="Account" value={payout.user.accountNo} />
                            <BankItem label="IFSC Code" value={payout.user.ifsc} />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col justify-center">
                        <BankItem label="UPI Identity" value={payout.user.upiId} dark />
                    </div>
                </div>

                {isPending && <div className="w-full"><PayoutActions transactionId={payout.id} /></div>}
            </div>
        </motion.div>
    );
}

function BankItem({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: any) => {
        e.stopPropagation();
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(`${label} copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-1 group/item cursor-pointer" onClick={handleCopy}>
            <p className={cn("text-[8px] font-bold uppercase tracking-widest", dark ? "text-slate-400" : "text-slate-500")}>{label}</p>
            <div className="flex items-center justify-between gap-3">
                <p className={cn("text-xs font-black tracking-widest font-mono truncate", dark ? "text-slate-900" : "text-emerald-50")}>
                    {value || "UNDEFINED"}
                </p>
                <div className={cn("shrink-0 p-1.5 rounded-lg transition-all", dark ? "bg-slate-100 text-slate-400 group-hover/item:text-emerald-600" : "bg-white/5 text-slate-500 group-hover/item:text-emerald-400")}>
                    <AnimatePresence mode="wait">
                        {copied ? <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={10} /></motion.div> : <Copy size={10} />}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-white rounded-[3.5rem] py-32 text-center border border-slate-200 shadow-sm">
            <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">{message}</p>
        </div>
    );
}