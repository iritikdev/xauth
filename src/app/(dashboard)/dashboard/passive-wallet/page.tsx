"use client"

import { useState } from "react"
import {
    ArrowDownLeft,
    ArrowUpRight,
    Download,
    Wallet,
    TrendingUp,
    TrendingDown,
    Clock3,
    ChevronDown,
    ArrowRight, QrCode, UploadCloud,
    CheckCircle2, AlertCircle, Copy, Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"

type FlowStep = "AMOUNT_INPUT" | "QR_PAYMENT" | "RECEIPT_UPLOAD" | "SUCCESS";

export default function PassiveWalletPage() {

    // 

    const [step, setStep] = useState<FlowStep>("AMOUNT_INPUT");
    const [amount, setAmount] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string>("");

    // Placeholder UPI String for QR Generator or Gateway (Amaze Business UPI)
    const upiId = "amazeayurveda@naviaxis";
    const upiLink = `upi://pay?pa=${upiId}&pn=Amaze%20Ayurveda&am=${amount}&cu=INR`;
    // Using dynamic QR API for immediate scanning matching user input amount
    const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(upiId);
        toast.success("UPI ID copied to clipboard");
    };

    // Mock Cloudinary Upload Action
    const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Simulate Cloudinary upload logic here
        setTimeout(() => {
            setReceiptUrl("https://cloudinary.com/mock-receipt-url.jpg");
            setIsUploading(false);
            toast.success("Receipt uploaded successfully!");
        }, 2000);
    };

    const handleSubmitInvestment = async () => {
        if (!receiptUrl) {
            toast.error("Please upload the payment receipt first.");
            return;
        }

        try {
            // Server Action to create investment ledger entry in DB
            // await createPassiveInvestmentRequest({ amount: parseFloat(amount), receipt: receiptUrl });

            setStep("SUCCESS");
            toast.success("Investment request submitted for verification!");
        } catch (err) {
            toast.error("Database submission failed.");
        }
    };
    // 
    const [walletBalance, setWalletBalance] = useState(722.5)
    const [totalDebits, setTotalDebits] = useState(301)
    const [totalCredits, setTotalCredits] = useState(935)
    const [totalInvested, setTotalInvested] = useState(2500)

    const [withdrawOpen, setWithdrawOpen] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")

    const [investOpen, setInvestOpen] = useState(false)
    const [investAmount, setInvestAmount] = useState("")

    const [isDownloading, setIsDownloading] = useState(false)

    const [transactions, setTransactions] = useState([
        {
            id: 1,
            title: "L4 Income",
            from: "AMZ251100120",
            amount: "₹18",
            status: "Completed",
            date: "19 Apr 2026 · 03:04 PM",
            type: "credit",
        },
    ])

    // =========================
    // Withdraw Function
    // =========================
    const handleWithdraw = () => {
        const amount = Number(withdrawAmount)

        if (!amount || amount <= 0) {
            toast.error("Invalid Amount", {
                description: "Enter a valid withdrawal amount.",
            })
            return
        }

        if (amount > walletBalance) {
            toast.error("Insufficient Balance", {
                description: "You do not have enough balance in your wallet.",
            })
            return
        }

        // State Mutations
        setWalletBalance((prev) => prev - amount)
        setTotalDebits((prev) => prev + amount)

        const newTransaction = {
            id: Date.now(),
            title: "Withdrawal Requested",
            from: "Bank Account Transfer",
            amount: `₹${amount}`,
            status: "Processing",
            date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
            type: "debit",
        }

        setTransactions((prev) => [newTransaction, ...prev])
        setWithdrawOpen(false)
        setWithdrawAmount("")

        toast.success("Withdrawal Requested", {
            description: `₹${amount} withdrawal request submitted successfully.`,
        })
    }

    // =========================
    // Invest Function
    // =========================
    const handleInvest = () => {
        const amount = Number(investAmount)

        if (!amount || amount <= 0) {
            toast.error("Invalid Amount", {
                description: "Enter a valid investment amount.",
            })
            return
        }

        // State Mutations
        setTotalInvested((prev) => prev + amount)
        setTotalCredits((prev) => prev + amount)

        const newTransaction = {
            id: Date.now(),
            title: "Investment Added",
            from: "Amaze Passive Plan",
            amount: `₹${amount}`,
            status: "Completed",
            date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
            type: "credit",
        }

        setTransactions((prev) => [newTransaction, ...prev])
        setInvestOpen(false)
        setInvestAmount("")

        toast.success("Investment Successful", {
            description: `₹${amount} invested successfully.`,
        })
    }

    // =========================
    // Mock Download Function
    // =========================
    const handleDownloadStatement = () => {
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
            toast.success("Statement Downloaded", {
                description: "Your wallet statement file has been saved.",
            })
        }, 1500)
    }

    return (
        <div className="min-h-screen text-zinc-900 selection:bg-emerald-500/30">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Wallet Card */}
                <Card className="overflow-hidden rounded-[32px] border-0 bg-zinc-950 text-white shadow-xl relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_45%)] pointer-events-none" />
                    <CardContent className="relative z-10 p-6 md:p-10">
                        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                                    <Wallet className="h-4 w-4" />
                                    Amaze Passive Wallet
                                </div>
                                <h1 className="text-5xl font-black tracking-tight md:text-6xl font-mono">
                                    ₹{walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h1>
                                <p className="text-sm text-zinc-400 font-medium">
                                    Available balance clean for immediate withdrawal
                                </p>
                            </div>

                            {/* Actions Group */}
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => setWithdrawOpen(true)}
                                    className="h-12 rounded-2xl bg-zinc-100 text-zinc-950 font-semibold hover:bg-zinc-200 transition-all shadow-sm"
                                >
                                    <ArrowUpRight className="mr-2 h-4 w-4 stroke-[2.5]" />
                                    Withdraw
                                </Button>

                                <Button
                                    onClick={() => setInvestOpen(true)}
                                    className="h-12 rounded-2xl bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-400/20 transition-all"
                                >
                                    <TrendingUp className="mr-2 h-4 w-4 stroke-[2.5]" />
                                    Invest Money
                                </Button>

                                <Button
                                    variant="ghost"
                                    disabled={isDownloading}
                                    onClick={handleDownloadStatement}
                                    className="h-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                                >
                                    {isDownloading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-4 w-4" />
                                    )}
                                    Statement
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Grid Metrics Breakdown */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="rounded-[24px] border border-zinc-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                                    Total Investment
                                </p>
                                <h2 className="mt-0.5 text-2xl font-black text-zinc-900 font-mono truncate">
                                    ₹{totalCredits.toLocaleString("en-IN")}
                                </h2>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[24px] border border-zinc-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                                    Total Debits
                                </p>
                                <h2 className="mt-0.5 text-2xl font-black text-zinc-900 font-mono truncate">
                                    ₹{totalDebits.toLocaleString("en-IN")}
                                </h2>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[24px] border border-zinc-200/80 bg-white shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                                    Total Earning
                                </p>
                                <h2 className="mt-0.5 text-2xl font-black text-zinc-900 font-mono truncate">
                                    ₹{totalInvested.toLocaleString("en-IN")}
                                </h2>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History Section */}
                <Card className="rounded-[28px] border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
                                <Clock3 className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-zinc-900">
                                Transaction History
                            </h3>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 shadow-none text-xs font-semibold">
                            All Activity
                            <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-zinc-500" />
                        </Button>
                    </div>

                    <div className="divide-y divide-zinc-100">
                        {transactions.length === 0 ? (
                            <div className="p-8 text-center text-sm text-zinc-400 font-medium">
                                No recent activity found.
                            </div>
                        ) : (
                            transactions.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 hover:bg-zinc-50/40 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                            }`}>
                                            {item.type === "credit" ? (
                                                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                                            ) : (
                                                <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
                                            )}
                                        </div>

                                        <div className="space-y-0.5">
                                            <h4 className="font-semibold text-sm text-zinc-900">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                Ref: {item.from}
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className="text-[11px] font-medium text-zinc-400">
                                                    {item.date}
                                                </span>
                                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${item.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50"
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`text-xl font-bold sm:text-right font-mono self-start sm:self-center ${item.type === "credit" ? "text-emerald-600" : "text-rose-600"
                                        }`}>
                                        {item.type === "credit" ? "+" : "-"}{item.amount}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Withdraw Dialog */}
                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                    <DialogContent className="sm:max-w-md rounded-[24px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                                Withdraw Money
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="withdraw-amount" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Withdrawal Amount (₹)
                                </Label>
                                <Input
                                    id="withdraw-amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="h-12 rounded-xl border-zinc-200 focus-visible:ring-emerald-500 font-mono text-lg"
                                />
                            </div>
                            <div className="rounded-xl bg-zinc-100 p-3.5 text-xs font-semibold text-zinc-600 flex justify-between items-center">
                                <span>Available Balance:</span>
                                <span className="font-mono text-zinc-900">₹{walletBalance.toFixed(2)}</span>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="ghost"
                                onClick={() => setWithdrawOpen(false)}
                                className="rounded-xl font-semibold text-zinc-500 hover:text-zinc-900"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleWithdraw}
                                className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold"
                            >
                                Confirm Withdrawal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Invest Dialog */}
                <Dialog open={investOpen} onOpenChange={setInvestOpen}>
                    <DialogContent className="sm:max-w-md rounded-[24px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                                Invest Funds
                            </DialogTitle>
                        </DialogHeader>
                        <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-500"
                            style={{
                                width: `${(stepsMap[step] / 4) * 100}%`
                            }} />
                        <AnimatePresence mode="wait">



                            {/* STEP 2: AMOUNT INPUT */}
                            {step === "AMOUNT_INPUT" && (
                                <motion.div
                                    key="amount"
                                    {...fadeConfig}
                                    className="space-y-4"
                                >
                                    {/* Header */}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                            Passive Investment
                                        </p>

                                        <h3 className="mt-1 text-xl font-black text-zinc-900">
                                            Enter Amount
                                        </h3>
                                    </div>

                                    {/* Amount Card */}
                                    <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black text-emerald-600">₹</span>

                                            <Input
                                                type="number"
                                                placeholder="5000"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="
            border-0 bg-transparent
            p-0 shadow-none
            text-3xl font-black
            focus-visible:ring-0
          "
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Amounts */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {[5000, 10000, 50000, 100000].map((value) => (
                                            <Button
                                                key={value}
                                                variant="outline"
                                                onClick={() => setAmount(String(value))}
                                                className="
            h-10 rounded-xl
            text-xs font-bold
            border-zinc-200
          "
                                            >
                                                ₹{value / 1000}K
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Small Info */}
                                    <div className="rounded-2xl bg-emerald-50 px-3 py-2">
                                        <p className="text-[11px] text-emerald-700">
                                            Daily ROI starts after verification.
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <Button
                                        disabled={!amount || Number(amount) <= 0}
                                        onClick={() => setStep("QR_PAYMENT")}
                                        className="
        h-12 w-full rounded-2xl
        bg-emerald-500
        text-xs font-black
        uppercase tracking-[0.2em]
      "
                                    >
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}
                            {/* STEP 3: QR PAYMENT SCAN */}
                            {step === "QR_PAYMENT" && (
                                <motion.div
                                    key="step-payment"
                                    {...fadeConfig}
                                    className="
            relative overflow-hidden
            rounded-[28px]
            border border-zinc-100
            bg-white
            p-4
            shadow-sm
        "
                                >
                                    {/* Soft Glow */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_40%)]" />

                                    <div className="relative z-10 space-y-4">
                                        {/* Top Row */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                                    Secure Payment
                                                </p>

                                                <h3 className="mt-1 text-xl font-black tracking-tight text-zinc-900">
                                                    Scan & Pay
                                                </h3>
                                            </div>

                                            {/* Amount */}
                                            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                                                    Amount
                                                </p>

                                                <p className="font-mono text-lg font-black text-emerald-700">
                                                    ₹{amount}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Compact QR */}
                                        <div className="relative mx-auto w-fit">
                                            <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/10 blur-2xl" />

                                            <div className="relative rounded-[2rem] border border-zinc-100 bg-white p-3 shadow-lg">
                                                <img
                                                    src={qrCodeSrc}
                                                    alt="Payment QR"
                                                    className="h-44 w-44 rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2">
                                            {/* Open UPI */}
                                            <Link
                                                href={upiLink}
                                                target="_blank"
                                                className="block"
                                            >
                                                <Button
                                                    className="
                            h-12 w-full rounded-2xl
                            bg-emerald-500
                            text-xs font-black uppercase
                            tracking-[0.2em]
                            text-white
                            shadow-md shadow-emerald-500/20
                            hover:bg-emerald-400
                        "
                                                >
                                                    💳 Open UPI App
                                                </Button>
                                            </Link>

                                            {/* UPI ID */}
                                            <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-3 py-3">
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                                                        UPI ID
                                                    </p>

                                                    <p className="truncate font-mono text-xs font-bold text-zinc-900">
                                                        {upiId}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleCopyUPI}
                                                    className="
                            h-9 w-9 rounded-xl
                            bg-white
                            text-zinc-600
                            hover:bg-emerald-50
                            hover:text-emerald-600
                        "
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Small Info */}
                                        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                                                <p className="text-[11px] leading-relaxed text-amber-900">
                                                    Pay using any UPI app and upload receipt after payment.
                                                </p>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <Button
                                            onClick={() => setStep("RECEIPT_UPLOAD")}
                                            className="
                    h-12 w-full rounded-2xl
                    bg-zinc-900
                    text-xs font-black uppercase
                    tracking-[0.2em]
                    text-white
                    hover:bg-zinc-800
                "
                                        >
                                            Payment Completed
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}



                            {/* STEP 4: RECEIPT UPLOAD */}
                            {step === "RECEIPT_UPLOAD" && (
                                <motion.div
                                    key="step-upload"
                                    {...fadeConfig}
                                    className="
            relative overflow-hidden
            rounded-[28px]
            border border-zinc-100
            bg-white
            p-4
            shadow-sm
        "
                                >
                                    {/* Background Glow */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_45%)]" />

                                    <div className="relative z-10 space-y-4">
                                        {/* Header */}
                                        <div>
                                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
                                                <UploadCloud className="h-3.5 w-3.5 text-emerald-600" />

                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                                    Verification Upload
                                                </span>
                                            </div>

                                            <h3 className="mt-3 text-2xl font-black tracking-tight text-zinc-900">
                                                Upload Receipt
                                            </h3>

                                            <p className="mt-1 text-sm font-medium text-zinc-500">
                                                Upload your payment screenshot for verification.
                                            </p>
                                        </div>

                                        {/* Upload Area */}
                                        <div className="space-y-3">
                                            <label
                                                className="
                        relative block overflow-hidden
                        rounded-[24px]
                        border-2 border-dashed border-zinc-200
                        bg-zinc-50/70
                        transition-all duration-300
                        hover:border-emerald-300
                        hover:bg-emerald-50/30
                        cursor-pointer
                    "
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleReceiptUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    disabled={isUploading}
                                                />

                                                {/* Uploaded Preview */}
                                                {receiptUrl ? (
                                                    <div className="relative">
                                                        <img
                                                            src={receiptUrl}
                                                            alt="Receipt Preview"
                                                            className="
                                    h-56 w-full object-cover
                                "
                                                        />

                                                        {/* Overlay */}
                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white">
                                                                        Receipt Uploaded
                                                                    </p>

                                                                    <p className="text-[11px] text-zinc-200">
                                                                        Ready for verification
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                                                            {isUploading ? (
                                                                <Loader2 className="h-6 w-6 animate-spin" />
                                                            ) : (
                                                                <UploadCloud className="h-6 w-6" />
                                                            )}
                                                        </div>

                                                        <div className="mt-4 space-y-1">
                                                            <p className="text-sm font-bold text-zinc-800">
                                                                {isUploading
                                                                    ? "Uploading Receipt..."
                                                                    : "Tap to upload receipt"}
                                                            </p>

                                                            <p className="text-xs text-zinc-500">
                                                                PNG, JPG up to 5MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </label>

                                            {/* Status Card */}
                                            {receiptUrl && (
                                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </div>

                                                        <div>
                                                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                                                                Upload Complete
                                                            </p>

                                                            <p className="mt-1 text-xs leading-relaxed text-emerald-900/80">
                                                                Your payment receipt has been securely
                                                                attached and is ready for verification.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <Button
                                            disabled={!receiptUrl || isUploading}
                                            onClick={handleSubmitInvestment}
                                            className="
                    h-12 w-full rounded-2xl
                    bg-zinc-900
                    text-xs font-black uppercase
                    tracking-[0.2em]
                    text-white
                    shadow-lg shadow-zinc-900/10
                    transition-all duration-300
                    hover:bg-zinc-800
                    disabled:pointer-events-none
                    disabled:opacity-40
                "
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Investment
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 6: SUCCESS */}
                            {step === "SUCCESS" && (
                                <motion.div
                                    key="step-success"
                                    {...fadeConfig}
                                    className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 p-6 text-center shadow-xl shadow-emerald-100/40"
                                >
                                    {/* Background Glow */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_45%)]" />

                                    <div className="relative z-10 space-y-6">
                                        {/* Animated Badge */}
                                        <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-3 shadow-sm">
                                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                                <span className="absolute h-full w-full animate-ping rounded-full bg-amber-300 opacity-30" />

                                                <Loader2 className="relative z-10 h-5 w-5 animate-spin text-amber-600" />
                                            </div>

                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600">
                                                    Verification Pending
                                                </p>

                                                <p className="mt-1 text-xs font-semibold text-zinc-500">
                                                    Investment under admin review
                                                </p>
                                            </div>
                                        </div>

                                        {/* Success Icon */}
                                        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                                            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />

                                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-lg">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black tracking-tight text-zinc-900">
                                                    Investment Submitted
                                                </h3>

                                                <p className="text-sm font-medium leading-relaxed text-zinc-500 max-w-sm mx-auto">
                                                    Your passive investment request has been securely added
                                                    to the verification queue and will be activated shortly.
                                                </p>
                                            </div>

                                            {/* Investment Summary */}
                                            <div className="mx-auto max-w-xs rounded-2xl border border-zinc-100 bg-white/80 backdrop-blur p-4 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                        Invested Amount
                                                    </span>

                                                    <span className="font-mono text-lg font-black text-emerald-600">
                                                        ₹{amount}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                        Status
                                                    </span>

                                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 border border-amber-200">
                                                        Pending
                                                    </span>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </DialogContent>

                </Dialog>

            </div>
        </div>
    )
}

const fadeConfig = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: 0.25 }
};

const stepsMap = {
    "AMOUNT_INPUT": 1,
    "QR_PAYMENT": 2,
    "RECEIPT_UPLOAD": 3,
    "SUCCESS": 4
};