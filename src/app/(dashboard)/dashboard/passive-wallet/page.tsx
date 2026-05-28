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
    Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export default function PassiveWalletPage() {
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
                                    Total Credits
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
                                    Total Invested
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
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                            item.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
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
                                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                                    item.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50"
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`text-xl font-bold sm:text-right font-mono self-start sm:self-center ${
                                        item.type === "credit" ? "text-emerald-600" : "text-rose-600"
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
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="invest-amount" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Investment Amount (₹)
                                </Label>
                                <Input
                                    id="invest-amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(e.target.value)}
                                    className="h-12 rounded-xl border-zinc-200 focus-visible:ring-emerald-500 font-mono text-lg"
                                />
                            </div>
                            <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3.5 text-xs font-medium text-emerald-800 leading-relaxed">
                                Funds loaded will be routed straight into your active <strong>Amaze Passive Plan</strong> pipeline to accrue yields.
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="ghost"
                                onClick={() => setInvestOpen(false)}
                                className="rounded-xl font-semibold text-zinc-500 hover:text-zinc-900"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleInvest}
                                className="rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400"
                            >
                                Confirm Investment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}