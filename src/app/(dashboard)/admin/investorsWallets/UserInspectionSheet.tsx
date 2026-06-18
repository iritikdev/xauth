"use client"

import { useState, useEffect } from "react"
import { getUserWalletDetailReport, UserWalletDetailReport } from "@/lib/actions/adminPassiveWallet"
import { ArrowLeft, Loader2, Calendar, TrendingUp, ArrowDownLeft, ArrowUpRight, DollarSign, Wallet, ShieldAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserInspectionSheetProps {
  walletId: string
  onBack: () => void
}

export default function UserInspectionSheet({ walletId, onBack }: UserInspectionSheetProps) {
  const [report, setReport] = useState<UserWalletDetailReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReport() {
      setLoading(true)
      const data = await getUserWalletDetailReport(walletId)
      setReport(data)
      setLoading(false)
    }
    if (walletId) loadReport()
  }, [walletId])

  // लॉक-इन डेज रीमेनिंग हेल्पर
  const getDaysRemaining = (maturesAtStr: string | null) => {
    if (!maturesAtStr) return null
    const diffTime = new Date(maturesAtStr).getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-6 text-center text-sm font-medium text-zinc-400">
        User analytical ledger could not be loaded.
      </div>
    )
  }

  return (
    <div className="space-y-6 text-zinc-900 selection:bg-emerald-500/10 font-sans max-w-6xl mx-auto">
      
      {/* Top Header Controls */}
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-9 w-9 p-0 rounded-xl border border-zinc-200 bg-white">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-black tracking-tight">{report.userName}</h1>
          <p className="text-xs font-medium text-zinc-400">{report.userEmail} · User Panel Account Summary</p>
        </div>
      </div>

      {/* Main Financial Wallet Balance Display Card */}
      <Card className="overflow-hidden rounded-[32px] border-0 bg-zinc-950 text-white shadow-xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_45%)] pointer-events-none" />
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-6 sm:items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Available Balance</span>
            <h2 className="text-4xl font-black font-mono">₹{report.availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-l border-zinc-800 pl-0 sm:pl-6 pt-4 sm:pt-0">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase block">Total Invested</span>
              <span className="font-mono text-sm font-bold">₹{report.totalInvested.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase block">Total Profit</span>
              <span className="font-mono text-sm font-bold text-emerald-400">₹{report.totalIncome.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase block">Withdrawn</span>
              <span className="font-mono text-sm font-bold text-rose-400">₹{report.totalWithdrawn.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relations Tabs Sections */}
      <Tabs defaultValue="investments" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:max-w-md h-10 rounded-xl bg-zinc-100 p-1 font-semibold text-zinc-500">
          <TabsTrigger value="investments" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
            Investments ({report.investments.length})
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
            Withdrawals ({report.withdrawals.length})
          </TabsTrigger>
          <TabsTrigger value="income" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
            Daily Yields ({report.incomes.length})
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: INVESTMENTS HISTORY ─── */}
        <TabsContent value="investments" className="mt-4 focus-visible:outline-none">
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {report.investments.length === 0 ? (
                <p className="p-6 text-center text-xs text-zinc-400 font-medium">No recorded investments found.</p>
              ) : (
                report.investments.map((inv) => {
                  const daysLeft = getDaysRemaining(inv.maturesAt)
                  return (
                    <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 text-xs">
                      <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-zinc-900">Capital Investment Subscribed</div>
                          <div className="text-zinc-400 font-mono">Ref: {inv.transactionId || "N/A"}</div>
                          <div className="text-zinc-400 pt-0.5">Created: {inv.createdAt}</div>
                        </div>
                      </div>
                      
                      <div className="sm:text-right space-y-1.5 pl-12 sm:pl-0">
                        <div className="font-mono font-black text-sm text-zinc-900">₹{inv.amount.toLocaleString("en-IN")}</div>
                        <div className="flex items-center sm:justify-end gap-2">
                          {daysLeft !== null && daysLeft > 0 ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200/40 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              🔒 Lock-in: {daysLeft} days left
                            </span>
                          ) : inv.status === "ACTIVE" || inv.status === "COMPLETED" ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              🔓 Matured
                            </span>
                          ) : null}
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            inv.status === "ACTIVE" || inv.status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" :
                            inv.status === "REJECTED" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                          }`}>{inv.status}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB 2: WITHDRAWALS HISTORY ─── */}
        <TabsContent value="withdrawals" className="mt-4 focus-visible:outline-none">
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {report.withdrawals.length === 0 ? (
                <p className="p-6 text-center text-xs text-zinc-400 font-medium">No withdrawal requests found.</p>
              ) : (
                report.withdrawals.map((w) => (
                  <div key={w.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 text-xs">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-zinc-900">Payout/Withdrawal Debit Request</div>
                        <div className="text-zinc-400">Initiated: {w.createdAt}</div>
                        {w.processedAt && <div className="text-zinc-400 text-[10px]">Processed: {w.processedAt}</div>}
                      </div>
                    </div>
                    <div className="sm:text-right space-y-1 pl-12 sm:pl-0">
                      <div className="font-mono font-black text-sm text-rose-600">-₹{w.amount.toLocaleString("en-IN")}</div>
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        w.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                        w.status === "REJECTED" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                      }`}>{w.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB 3: DAILY PASSIVE INCOMES ─── */}
        <TabsContent value="income" className="mt-4 focus-visible:outline-none">
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {report.incomes.length === 0 ? (
                <p className="p-6 text-center text-xs text-zinc-400 font-medium">No passive yields distributed yet.</p>
              ) : (
                report.incomes.map((inc) => (
                  <div key={inc.id} className="flex items-center justify-between p-4 text-xs">
                    <div className="flex gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-bold text-zinc-900 truncate">{inc.description || "Daily ROI Generated"}</div>
                        <div className="text-zinc-400 text-[10px] truncate font-mono">Linked Txn Ref: {inc.investmentTxnId}</div>
                        <div className="text-zinc-400 text-[10px]">{inc.creditedAt}</div>
                      </div>
                    </div>
                    <div className="font-mono font-black text-sm text-emerald-600 shrink-0 pl-2">
                      +₹{inc.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}