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
    ArrowRight,
    QrCode,
    UploadCloud,
    CheckCircle2,
    AlertCircle,
    Copy,
    Loader2,
    Receipt
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

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
import { CldUploadWidget } from "next-cloudinary" // ✅ Imported Cloudinary direct inside
import { createPassiveInvestmentRequest } from "@/lib/actions/passive-investment"
import CloudinaryUpload from "./CloudinaryUpload"
import TransactionHistory from "./TransactionHistory"
import { useSession } from "next-auth/react"
import PassiveWalletStats from "./PassiveWalletStats"

type FlowStep = "AMOUNT_INPUT" | "QR_PAYMENT" | "RECEIPT_UPLOAD" | "SUCCESS";

export default function PassiveWalletPage() {
    const [step, setStep] = useState<FlowStep>("AMOUNT_INPUT");
    const [amount, setAmount] = useState<string>("");
    const [transactionId, setTransactionId] = useState<string | null | undefined>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const { data: session, status } = useSession()

    if (status === "loading") return <p>Loading...</p>
    if (!session?.user?.id) {
        return <div className="p-4 text-sm text-zinc-500">Please sign in to view activity.</div>
    }

    // Placeholder UPI String for QR Generator or Gateway (Amaze Business UPI)
    const upiId = "amazeayurveda@naviaxis";
    const upiLink = `upi://pay?pa=${upiId}&pn=Amaze%20Ayurveda&am=${amount}&cu=INR`;
    const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(upiId);
        toast.success("UPI ID copied to clipboard");
    };

    const handleSubmitInvestment = async () => {
        if (!receiptUrl) {
            toast.error("Please upload the payment receipt first.");
            return;
        }

        setIsUploading(true);

        try {
            const response = await createPassiveInvestmentRequest({
                amount: parseFloat(amount),
                receiptUrl: receiptUrl
            });

            if (response.success) {
                setStep("SUCCESS");
                setTransactionId(response.data?.transactionId);
                toast.success(`Request logged! TxID: ${response.data?.transactionId}`);
            } else {
                toast.error(response.error || "Submission failed");
            }
        } catch (error) {
            toast.error("An unexpected database connection error occurred.");
        } finally {
            setIsUploading(false);
        }
    };

    // Cloudinary Helper Handlers
    const handleOnSuccess = (result: any) => {
        setIsUploading(false);
        if (result?.info?.secure_url) {
            setReceiptUrl(result.info.secure_url);
            toast.success("Receipt uploaded successfully!");
        } else {
            toast.error("Failed to parse upload metadata.");
        }
    };

    const handleOnError = (error: any) => {
        setIsUploading(false);
        console.error("Cloudinary Widget Error:", error);
        toast.error("Upload process failed.");
    };

    const [walletBalance, setWalletBalance] = useState(722.5)
    const [totalDebits, setTotalDebits] = useState(301)
    const [totalCredits, setTotalCredits] = useState(935)
    const [totalInvested, setTotalInvested] = useState(2500)

    const [withdrawOpen, setWithdrawOpen] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [investOpen, setInvestOpen] = useState(false)
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

    const handleWithdraw = () => {
        const amt = Number(withdrawAmount)
        if (!amt || amt <= 0) {
            toast.error("Invalid Amount");
            return;
        }
        if (amt > walletBalance) {
            toast.error("Insufficient Balance");
            return;
        }

        setWalletBalance((prev) => prev - amt)
        setTotalDebits((prev) => prev + amt)

        const newTransaction = {
            id: Date.now(),
            title: "Withdrawal Requested",
            from: "Bank Account Transfer",
            amount: `₹${amt}`,
            status: "Processing",
            date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
            type: "debit",
        }

        setTransactions((prev) => [newTransaction, ...prev])
        setWithdrawOpen(false)
        setWithdrawAmount("")
        toast.success("Withdrawal Requested");
    }

    const handleDownloadStatement = () => {
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
            toast.success("Statement Downloaded")
        }, 1500)
    }

    return (
        <div className="min-h-screen text-zinc-900 selection:bg-emerald-500/30">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Wallet Card */}


                <PassiveWalletStats
                    userId={session?.user!.id}
                    onInvestClick={() => setInvestOpen(true)}
                    onWithdrawClick={() => setWithdrawOpen(true)}
                />
                <TransactionHistory userId={session?.user!.id} />

                {/* Withdraw Dialog */}
                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                    <DialogContent className="sm:max-w-md rounded-[24px] overflow-visible">
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
                <Dialog
                    open={investOpen}
                    onOpenChange={setInvestOpen}
                    modal={false}
                >
                    <DialogContent forceMount
                        onInteractOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        className="sm:max-w-md rounded-[24px] overflow-visible">
                        <DialogHeader className="space-y-4">
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight text-zinc-900">
                                    Invest Funds
                                </DialogTitle>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Complete the investment process
                                </p>
                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                    <span>Step {stepsMap[step]} of 4</span>
                                    <span>{Math.round((stepsMap[step] / 4) * 100)}%</span>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                                        style={{
                                            width: `${(stepsMap[step] / 4) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </DialogHeader>
                        <div className = "no-scrollbar max-h-[70vh] overflow-y-auto">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: AMOUNT INPUT */}
                            {step === "AMOUNT_INPUT" && (
                                <motion.div key="amount" {...fadeConfig} className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                            Passive Investment
                                        </p>
                                        <h3 className="mt-1 text-xl font-black text-zinc-900">
                                            Enter Amount
                                        </h3>
                                    </div>

                                    <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black text-emerald-600">₹</span>
                                            <Input
                                                type="number"
                                                placeholder="5000"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="border-0 bg-transparent p-0 shadow-none text-3xl font-black focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        {[5000, 10000, 50000, 100000].map((value) => (
                                            <Button
                                                key={value}
                                                variant="outline"
                                                onClick={() => setAmount(String(value))}
                                                className="h-10 rounded-xl text-xs font-bold border-zinc-200"
                                            >
                                                ₹{value / 1000}K
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="rounded-2xl bg-emerald-50 px-3 py-2">
                                        <p className="text-[11px] text-emerald-700">
                                            Daily ROI starts after verification.
                                        </p>
                                    </div>

                                    <Button
                                        disabled={!amount || Number(amount) <= 0}
                                        onClick={() => setStep("QR_PAYMENT")}
                                        className="h-12 w-full rounded-2xl bg-emerald-500 text-xs font-black uppercase tracking-[0.2em]"
                                    >
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* STEP 2: QR PAYMENT SCAN */}
                            {step === "QR_PAYMENT" && (
                                <motion.div key="step-payment" {...fadeConfig} className="relative overflow-hidden rounded-[28px] bg-white space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                                Secure Payment
                                            </p>
                                            <h3 className="mt-1 text-xl font-black tracking-tight text-zinc-900">
                                                Scan & Pay
                                            </h3>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                                                Amount
                                            </p>
                                            <p className="font-mono text-lg font-black text-emerald-700">
                                                ₹{amount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative mx-auto w-fit">
                                        <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/10 blur-2xl" />
                                        <div className="relative rounded-[2rem] border border-zinc-100 bg-white p-3 shadow-lg">
                                            <img src={qrCodeSrc} alt="Payment QR" className="h-44 w-44 rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Link href={upiLink} target="_blank" className="block">
                                            <Button className="h-12 w-full rounded-2xl bg-emerald-500 text-xs font-black uppercase tracking-[0.2em] text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-400">
                                                💳 Open UPI App
                                            </Button>
                                        </Link>

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
                                                className="h-9 w-9 rounded-xl bg-white text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                            <p className="text-[11px] leading-relaxed text-amber-900">
                                                Pay using any UPI app and upload receipt after payment.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setStep("RECEIPT_UPLOAD")}
                                        className="h-12 w-full rounded-2xl bg-zinc-900 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800"
                                    >
                                        Payment Completed
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* STEP 3: RECEIPT UPLOAD (INTEGRATED CLOUDINARY WIDGET) */}
                            {step === "RECEIPT_UPLOAD" && (
                                <motion.div
                                    key="step-upload"
                                    {...fadeConfig}
                                    className="space-y-4 text-zinc-900"
                                >
                                    {/* Compact Header */}
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <Receipt className="h-5 w-5" />
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                                            Verification
                                        </p>
                                        <h3 className="mt-1 text-xl font-black tracking-tight">
                                            Upload Receipt
                                        </h3>
                                        <p className="mt-1 text-xs font-medium text-zinc-500 max-w-xs mx-auto leading-normal">
                                            Upload the payment screenshot to verify your investment.
                                        </p>
                                    </div>

                                    {/* Streamlined Upload Area */}
                                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-3">
                                        {!receiptUrl ? (
                                            <div className="space-y-2 text-center">
                                                <CloudinaryUpload
                                                    buttonText="Upload Screenshot"
                                                    onUpload={(url) => setReceiptUrl(url)}
                                                />
                                                <p className="text-[10px] text-zinc-400 font-medium">
                                                    JPG, PNG formats supported
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="relative overflow-hidden rounded-xl border border-zinc-100 bg-white">
                                                    <img
                                                        src={receiptUrl}
                                                        alt="Receipt"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                    <div className="absolute right-2 top-2 rounded-full bg-emerald-500 p-1.5 text-white shadow-md">
                                                        <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full h-9 rounded-xl border-zinc-200 text-xs font-semibold"
                                                    onClick={() => setReceiptUrl(null)}
                                                >
                                                    Replace Receipt
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Compact Info Banner */}
                                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-2.5">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                                            <p className="text-[11px] font-medium leading-normal text-amber-900">
                                                Verification usually takes a 1-2 business days.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Optimized Submit Button */}
                                    <Button
                                        disabled={!receiptUrl || isUploading}
                                        onClick={handleSubmitInvestment}
                                        className="h-11 w-full rounded-xl bg-zinc-950 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-40 transition-all"
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                <span>Submitting...</span>
                                            </div>
                                        ) : (
                                            "Submit Investment"
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                            {/* STEP 4: SUCCESS */}
                            {step === "SUCCESS" && (
                                <motion.div
                                    key="step-success"
                                    {...fadeConfig}
                                    className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30 p-4 sm:p-6 text-center shadow-xl shadow-emerald-100/40"
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />

                                    <div className="relative z-10 space-y-4">
                                        {/* Minimal Verification Pill */}
                                        <div className="mx-auto flex w-fit items-center gap-2.5 rounded-xl border border-amber-200/70 bg-white p-2 pr-3 shadow-sm">
                                            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50">
                                                <span className="absolute h-full w-full animate-ping rounded-full bg-amber-200 opacity-40" />
                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" />
                                            </div>
                                            <div className="text-left leading-tight">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-amber-600">Verification Pending</p>
                                                <p className="text-[11px] font-medium text-zinc-500">Under admin review</p>
                                            </div>
                                        </div>

                                        {/* Success Icon */}
                                        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                                            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-md text-emerald-500">
                                                <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
                                            </div>
                                        </div>

                                        {/* Typography */}
                                        <div className="space-y-1">
                                            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">Investment Submitted</h3>
                                            <p className="text-xs font-medium text-zinc-500 max-w-xs mx-auto leading-normal">
                                                Your request is in the queue and will be active shortly.
                                            </p>
                                        </div>

                                        {/* Compact Details Card with Transaction ID */}
                                        <div className="mx-auto max-w-xs rounded-xl border border-zinc-100 bg-white/90 p-3 text-xs shadow-sm space-y-2 font-medium">
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Txn ID</span>
                                                <span className="font-mono text-zinc-700 tracking-tight selection:bg-emerald-200">
                                                    {transactionId || "NA"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
                                                <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Amount</span>
                                                <span className="font-mono text-base font-bold text-emerald-600">₹{amount}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
                                                <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Status</span>
                                                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/50">Pending</span>
                                            </div>
                                        </div>

                                        {/* Primary Action */}
                                        <Button
                                            onClick={() => {
                                                setInvestOpen(false);
                                                window.location.reload();
                                            }}
                                            className="h-10 w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                        >
                                            Close Panel
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                        </div>
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