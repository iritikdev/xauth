"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Wallet, Loader2, ArrowUpRight, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPassiveWalletData, WalletMetrics } from "@/lib/actions/passive-investment"

interface WalletGridProps {
    userId: string
    onWithdrawClick?: () => void
    onInvestClick?: () => void
}

export default function PassiveWalletGrid({ userId, onWithdrawClick, onInvestClick }: WalletGridProps) {
    const [metrics, setMetrics] = useState<WalletMetrics | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

    useEffect(() => {
        async function fetchWalletData() {
            try {
                setIsLoading(true)
                const data = await getPassiveWalletData(userId)
                setMetrics(data)
            } catch (err) {
                console.error("Failed loading layout metrics tracking array.", err)
            } finally {
                setIsLoading(false)
            }
        }

        if (userId) {
            fetchWalletData()
        }
    }, [userId])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-48 w-full animate-pulse rounded-[32px] bg-zinc-900" />
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 w-full animate-pulse rounded-[24px] bg-zinc-200" />
                    ))}
                </div>
            </div>
        )
    }

    const totalInvested = metrics?.totalInvested ?? 0
    const totalWithdrawn = metrics?.totalWithdrawn ?? 0
    const totalIncome = metrics?.totalIncome ?? 0
    // const availableBalance = metrics?.availableBalance ?? 0
const availableBalance =
  (metrics?.totalInvested ?? 0) +
  (metrics?.totalIncome ?? 0) -
  (metrics?.totalWithdrawn ?? 0);
    return (
        <div className="space-y-6 text-zinc-900">
            
            {/* Main Wallet Card (Available Balance) */}
            <Card className="overflow-hidden rounded-[32px] border-0 bg-zinc-950 text-white shadow-xl relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_45%)] pointer-events-none" />
                <CardContent className="relative z-10 p-6 md:p-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                                <Wallet className="h-4 w-4" />
                                Amaze Passive Wallet
                            </div>
                            <h1 className="text-4xl font-black tracking-tight md:text-5xl font-mono">
                                ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <p className="text-xs text-zinc-400 font-medium">
                                Available balance clear for immediate withdrawal
                            </p>
                        </div>

                        {/* Quick CTA Actions */}
                        <div className="flex flex-wrap gap-2.5">
                            <Button
                                onClick={onWithdrawClick}
                                className="h-10 rounded-xl bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-all"
                            >
                                <ArrowUpRight className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" />
                                Withdraw
                            </Button>

                            <Button
                                onClick={onInvestClick}
                                className="h-10 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 transition-all"
                            >
                                <TrendingUp className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" />
                                Invest Money
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sub-Metrics Breakdown Grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                
                {/* Metric 1: Total Investment */}
                <Card className="rounded-[24px] border border-zinc-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <TrendingUp className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                                Total Investment
                            </p>
                            <h2 className="mt-0.5 text-2xl font-black font-mono truncate">
                                ₹{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                            </h2>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric 2: Total Debits (Withdrawn) */}
                <Card className="rounded-[24px] border border-zinc-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                            <TrendingDown className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                                Total Debits
                            </p>
                            <h2 className="mt-0.5 text-2xl font-black font-mono truncate">
                                ₹{totalWithdrawn.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                            </h2>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric 3: Total Earning (Income) */}
                <Card className="rounded-[24px] border border-zinc-200/80 bg-white shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                                Total Earning
                            </p>
                            <h2 className="mt-0.5 text-2xl font-black font-mono truncate">
                                ₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                            </h2>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}