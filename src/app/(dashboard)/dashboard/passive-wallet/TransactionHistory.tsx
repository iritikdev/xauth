"use client"

import { useState, useEffect } from "react"
import { Clock3, ChevronDown, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getInvestmentTransactions, TransactionUI } from "@/lib/actions/passive-investment"

interface TransactionHistoryProps {
    userId: string
}

export default function TransactionHistory({ userId }: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<TransactionUI[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchHistory = async () => {
        setIsLoading(true)
        try {
            const data = await getInvestmentTransactions(userId)
            setTransactions(data)
        } catch (err) {
            console.error("Failed to sync activity records.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchHistory()
        }
    }, [userId])

    console.log("Transaction history data:", transactions)

    return (
        <Card className="rounded-[28px] border border-zinc-200/80 bg-white shadow-sm overflow-hidden text-zinc-900">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-zinc-100 p-4 sm:p-5 bg-zinc-50/50">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
                        <Clock3 className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold">
                        Transaction History
                    </h3>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isLoading}
                    onClick={fetchHistory}
                    className="rounded-xl border-zinc-200 shadow-none text-xs font-semibold"
                >
                    {isLoading ? "Syncing..." : "All Activity"}
                    {!isLoading && <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-zinc-500" />}
                </Button>
            </div>

            {/* List entries */}
            <div className="divide-y divide-zinc-100">
                {isLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center text-sm text-zinc-400 font-medium gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                        <span>Loading records...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-400 font-medium">
                        No recent investment transactions found.
                    </div>
                ) : (
                    transactions.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 hover:bg-zinc-50/40 transition-colors"
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
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
                                    <p className="text-xs text-zinc-500 font-mono tracking-tight">
                                        Ref: {item.from}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <span className="text-[11px] font-medium text-zinc-400">
                                            {item.date}
                                        </span>
                                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                            item.status === "VERIFIED" 
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                                                : item.status === "REJECTED"
                                                ? "bg-rose-50 text-rose-700 border border-rose-200/50"
                                                : "bg-amber-50 text-amber-700 border border-amber-200/50"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile responsive text styling alignments */}
                            <div className={`text-lg sm:text-xl font-bold sm:text-right font-mono self-start sm:self-center pl-13 sm:pl-0 ${
                                item.type === "credit" ? "text-emerald-600" : "text-rose-600"
                            }`}>
                                {item.type === "credit" ? "+" : "-"}{item.amount}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}