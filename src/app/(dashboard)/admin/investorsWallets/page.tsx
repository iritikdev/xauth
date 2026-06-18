"use client"

import { useEffect, useState } from "react"
import { getAdminWalletList, AdminWalletListData } from "@/lib/actions/adminPassiveWallet"
import { Wallet, Search, Loader2, RefreshCw, Eye, ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function AdminWalletLedgerPage() {
    const [wallets, setWallets] = useState<AdminWalletListData[]>()
    const [filteredWallets, setFilteredWallets] = useState<AdminWalletListData[]>()
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const loadWalletLedger = async () => {
        setLoading(true)
        try {
            const data = await getAdminWalletList()
            setWallets(data)
            setFilteredWallets(data)
        } catch (err) {
            toast.error("Failed to sync structural wallet parameters.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadWalletLedger()
    }, [])

    // लाइव सर्च फ़िल्टर हैंडलर
    useEffect(() => {
        if (!wallets) return
        const query = searchQuery.toLowerCase().trim()
        if (!query) {
            setFilteredWallets(wallets)
        } else {
            const filtered = wallets.filter(
                (w) =>
                    w.userName.toLowerCase().includes(query) ||
                    w.userEmail.toLowerCase().includes(query)
            )
            setFilteredWallets(filtered)
        }
    }, [searchQuery, wallets])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    return (
        <div className="space-y-5 text-zinc-900 max-w-7xl mx-auto p-4 sm:p-6 select-none font-sans">

            {/* Top Action Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-zinc-950 p-2.5 text-white shadow-md">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                            Passive Investment Wallets
                        </h1>
                        <p className="text-xs font-medium text-zinc-400">
                            Track investment capital, returns, and available wallet balances
                        </p>
                    </div>
                </div>

                <Button
                    onClick={loadWalletLedger}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold self-start sm:self-center h-10 border-zinc-200"
                >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh Data
                </Button>
            </div>

            {/* Dynamic Filter Search Layout Control */}
            <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                    type="text"
                    placeholder="Search by user name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 rounded-xl border-zinc-200 focus-visible:ring-emerald-500 text-sm placeholder:text-zinc-400"
                />
            </div>

            {/* 📱 Mobile Layout: Multi-card Dynamic List (Hidden on desktop) */}
            <div className="grid gap-3.5 md:hidden">
                {filteredWallets?.length === 0 ? (
                    <p className="text-center text-sm text-zinc-400 py-8 font-medium">No system wallets match criteria.</p>
                ) : (
                    filteredWallets?.map((wallet) => (
                        <Card key={wallet.id} className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm relative overflow-hidden">
                            <CardContent className="p-0 space-y-4">

                                {/* Profile Meta Info Header */}
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm text-zinc-900 truncate">{wallet.userName}</h4>
                                        <p className="text-xs text-zinc-400 truncate font-medium">{wallet.userEmail}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Available</span>
                                        <span className="text-base font-black font-mono text-emerald-600">₹{wallet.availableBalance.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                {/* Grid Financial Parameters Breakdown */}
                                <div className="grid grid-cols-3 gap-2 border-t border-b border-zinc-50 py-3 text-center bg-zinc-50/50 rounded-xl px-1">
                                    <div>
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide block">Invested</span>
                                        <span className="font-mono text-xs font-bold text-zinc-800">₹{wallet.totalInvested.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide block">Earned</span>
                                        <span className="font-mono text-xs font-bold text-blue-600">₹{wallet.totalIncome.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide block">Withdrawn</span>
                                        <span className="font-mono text-xs font-bold text-rose-600">₹{wallet.totalWithdrawn.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                {/* Footer Details Sync Row */}
                                <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
                                    <span>Synced: {wallet.updatedAt}</span>
                                    <Button variant="ghost" size="sm" className="h-7 rounded-lg text-xs font-bold text-zinc-600 px-2 hover:bg-zinc-100">
                                        <Eye className="mr-1 h-3.5 w-3.5" /> Inspect
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* 🖥️ Desktop & Tablet Layout: Compressed Grid Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        <tr>
                            <th className="p-4">Account Holder</th>
                            <th className="p-4">Available Balance</th>
                            <th className="p-4">Total Invested</th>
                            <th className="p-4">Total Earning</th>
                            <th className="p-4">Total Withdrawn</th>
                            <th className="p-4">Last Sync</th>
                            <th className="p-4 text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                        {filteredWallets?.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-zinc-400 font-medium">No matching wallet registry records found.</td>
                            </tr>
                        ) : (
                            filteredWallets?.map((wallet) => (
                                <tr key={wallet.id} className="hover:bg-zinc-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-zinc-900">{wallet.userName}</div>
                                        <div className="text-xs text-zinc-400 font-medium">{wallet.userEmail}</div>
                                    </td>
                                    <td className="p-4 font-mono font-black text-emerald-600 text-base">
                                        ₹{wallet.availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 font-mono font-bold text-zinc-900">
                                        ₹{wallet.totalInvested.toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-4 font-mono font-bold text-blue-600">
                                        ₹{wallet.totalIncome.toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-4 font-mono font-bold text-rose-600">
                                        ₹{wallet.totalWithdrawn.toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-4 text-xs font-medium text-zinc-400">
                                        {wallet.updatedAt}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold px-2.5">
                                            <Eye className="h-3.5 w-3.5 text-zinc-400 mr-1" /> View User
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}