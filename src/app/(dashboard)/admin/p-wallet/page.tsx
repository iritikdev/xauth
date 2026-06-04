"use client"

import { useEffect, useState } from "react"
import { getAdminInvestmentList, AdminInvestmentData, activateInvestmentAndSetLockIn, rejectInvestment } from "@/lib/actions/admin"
import { Check, X, ExternalLink, Calendar, Loader2, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminInvestmentList() {
  const [list, setList] = useState<AdminInvestmentData[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await getAdminInvestmentList()
    setList(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
  setProcessingId(id)

  try {
    if (action === "APPROVE") {
      const response = await activateInvestmentAndSetLockIn(id)

      if (response.success) {
        toast.success("Investment Approved", {
          description: "Wallet balanced and 30-day lock-in clock started.",
        })
      } else {
        toast.error("Approval Failed", { description: "response.error" })
      }
    } else {
      // 💡 रिजेक्शन एक्शन को यहाँ इंटीग्रेट कर दिया गया है
      const response = await rejectInvestment(id, "Receipt screenshot is invalid or incomplete.")

      if (response.success) {
        toast.error("Investment Rejected", {
          description: "The request has been marked as REJECTED successfully.",
        })
      } else {
        toast.error("Rejection Failed", { description: response.error })
      }
    }

    // डेटाबेस अपडेट होने के बाद UI टेबल/कार्ड्स को रीफ्रेश करें
    await loadData()
  } catch (error) {
    console.error("Action loop broken:", error)
    toast.error("Execution Error")
  } finally {
    setProcessingId(null)
  }
}

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4  text-zinc-900 ">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-zinc-950 p-2 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Investment Approvals</h1>
            <p className="text-xs font-medium text-zinc-400">Verify screenshots and manage lock-in states</p>
          </div>
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="rounded-xl text-xs font-bold">
          Refresh
        </Button>
      </div>

      {/* 📱 Mobile Layout (Cards View) - Desktop पर छिप जाएगा */}
      <div className="grid gap-3 md:hidden">
        {list.length === 0 ? (
          <p className="text-center text-sm text-zinc-400 py-8">No investments requests found.</p>
        ) : (
          list.map((item) => (
            <Card key={item.id} className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              <CardContent className="p-0 space-y-3">
                {/* User & Status */}
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.userName}</h4>
                    <p className="text-xs text-zinc-400 truncate">{item.userEmail}</p>
                  </div>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    item.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" :
                    item.status === "REJECTED" ? "bg-rose-50 text-rose-700 border border-rose-200/50" :
                    "bg-amber-50 text-amber-700 border border-amber-200/50"
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Amount & TxnId */}
                <div className="flex justify-between items-baseline border-t border-zinc-50 pt-2">
                  <span className="text-xs text-zinc-400 font-medium">Amount:</span>
                  <span className="font-mono font-black text-base text-zinc-900">₹{item.amount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">Txn ID:</span>
                  <span className="font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">{item.transactionId}</span>
                </div>

                {/* Dates & Lock-in parameters */}
                <div className="bg-zinc-50 rounded-xl p-2.5 text-[11px] space-y-1 font-medium text-zinc-500">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{item.createdAt}</span>
                  </div>
                  {item.status === "COMPLETED" && item.maturesAt && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">🔒 Lock-in Until:</span>
                      <span>{item.maturesAt}</span>
                    </div>
                  )}
                </div>

                {/* Actions & Receipt Link */}
                <div className="flex gap-2 pt-1">
                  {item.receiptUrl ? (
                    <a 
                      href={item.receiptUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-1 flex-1 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 shadow-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Receipt
                    </a>
                  ) : (
                    <div className="h-9 flex-1 bg-zinc-100 rounded-xl flex items-center justify-center text-xs text-zinc-400">No Image</div>
                  )}

                   {item.status === "PENDING" && (
                                        <div className="inline-flex gap-2">
                                            <Button
                                                disabled={processingId !== null}
                                                onClick={() => handleAction(item.id, "REJECT")}
                                                size="sm"
                                                variant="outline"
                                                className="h-8 rounded-lg border-zinc-200 text-zinc-600 px-2.5 disabled:opacity-50"
                                            >
                                                Reject
                                            </Button>

                                            <Button
                                                disabled={processingId !== null}
                                                onClick={() => handleAction(item.id, "APPROVE")}
                                                size="sm"
                                                className="h-8 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 px-2.5 disabled:opacity-50 min-w-[76px]"
                                            >
                                                {processingId === item.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
                                                ) : (
                                                    "Approve"
                                                )}
                                            </Button>
                                        </div>
                                    )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 🖥️ Desktop & Tablet Layout (Table View) - Mobile पर छिप जाएगा */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Txn ID</th>
              <th className="p-4">Receipt</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/30 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-zinc-900">{item.userName}</div>
                  <div className="text-xs text-zinc-400 font-medium">{item.userEmail}</div>
                </td>
                <td className="p-4 font-mono font-bold text-zinc-900">
                  ₹{item.amount.toLocaleString("en-IN")}
                </td>
                <td className="p-4 font-mono text-xs text-zinc-600">
                  <span className="bg-zinc-100 px-2 py-0.5 rounded">{item.transactionId}</span>
                </td>
                <td className="p-4">
                  {item.receiptUrl ? (
                    <a href={item.receiptUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1 font-medium text-xs">
                      View File <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-zinc-300 text-xs">No receipt</span>
                  )}
                </td>
                <td className="p-4 text-xs font-medium text-zinc-500 space-y-0.5">
                  <div>{item.createdAt}</div>
                  {item.maturesAt && (
                    <div className="text-amber-600 font-bold flex items-center gap-0.5">
                      🔒 Lock: {item.maturesAt}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    item.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" :
                    item.status === "REJECTED" ? "bg-rose-50 text-rose-700 border border-rose-200/50" :
                    "bg-amber-50 text-amber-700 border border-amber-200/50"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {item.status === "PENDING" ? (
                    <div className="inline-flex gap-2">
                      <Button onClick={() => handleAction(item.id, "REJECT")} size="sm" variant="outline" className="h-8 rounded-lg border-zinc-200 text-zinc-600 px-2.5">
                        Reject
                      </Button>
                      <Button onClick={() => handleAction(item.id, "APPROVE")} size="sm" className="h-8 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 px-2.5">
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-zinc-400">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}