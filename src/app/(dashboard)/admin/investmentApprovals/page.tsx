"use client"

import { useEffect, useState } from "react"
import { getAdminInvestmentList, AdminInvestmentData, activateInvestmentAndSetLockIn, rejectInvestment, updateMaturityDate } from "@/lib/actions/admin"
import { Check, X, ExternalLink, Calendar as CalendarIcon, Loader2, ShieldCheck, Edit2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export default function AdminInvestmentList() {
  const [list, setList] = useState<AdminInvestmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Modals Controller States
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"APPROVE" | "EDIT">("APPROVE")
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null)
  const [customMaturityDate, setCustomMaturityDate] = useState<Date | undefined>(new Date())

  const loadData = async () => {
    setLoading(true)
    const data = await getAdminInvestmentList()
    setList(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // अप्रूवल या डेट एडिट फ्लो को ओपन करने का कंबाइंड हैंडलर
  const openDateModalFlow = (id: string, mode: "APPROVE" | "EDIT", currentMaturesAt?: string | null) => {
    setSelectedInvestmentId(id)
    setModalMode(mode)
    
    if (mode === "EDIT" && currentMaturesAt) {
      setCustomMaturityDate(new Date(currentMaturesAt))
    } else {
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 30)
      setCustomMaturityDate(defaultDate)
    }
    setIsDateModalOpen(true)
  }

  // फाइनल सबमिशन (Approve या Edit दोनों के लिए समान डायलॉग यूज़ होगा)
  const handleMaturitySubmitConfirm = async () => {
    if (!selectedInvestmentId || !customMaturityDate) return

    const id = selectedInvestmentId
    setIsDateModalOpen(false)
    setProcessingId(id)

    try {
      if (modalMode === "APPROVE") {
        const response = await activateInvestmentAndSetLockIn(id, customMaturityDate)
        if (response.success) {
          toast.success("Investment Approved successfully")
        } else {
          toast.error("Approval Failed", { description: "response.error" })
        }
      } else {
        // 💡 यहाँ अप्रूव्ड निवेश की डेट चेंज करने वाला एक्शन कॉल हो रहा है
        const response = await updateMaturityDate(id, customMaturityDate)
        if (response.success) {
          toast.success("Maturity Date Updated", {
            description: `Lock-in period extended to ${format(customMaturityDate, "dd MMM yyyy")}`,
          })
        } else {
          toast.error("Update Failed", { description: response.error })
        }
      }

      await loadData()
    } catch (error) {
      console.error("Execution error:", error)
      toast.error("Execution Error")
    } finally {
      setProcessingId(null)
      setSelectedInvestmentId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      const response = await rejectInvestment(id, "Receipt screenshot is invalid.")
      if (response.success) toast.error("Investment Rejected")
      await loadData()
    } catch (error) {
      toast.error("Execution Error")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
    )
  }

  return (
    <div className="space-y-4 text-zinc-900 max-w-7xl mx-auto p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-zinc-950 p-2 text-white"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Investment Approvals</h1>
            <p className="text-xs font-medium text-zinc-400">Verify assets and update locked dates actively</p>
          </div>
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="rounded-xl text-xs font-bold">Refresh</Button>
      </div>

      {/* 📱 Mobile Layout */}
      <div className="grid gap-3 md:hidden">
        {list.map((item) => (
          <Card key={item.id} className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm truncate">{item.userName}</h4>
                  <p className="text-xs text-zinc-400 truncate">{item.userEmail}</p>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  item.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border"
                }`}>{item.status}</span>
              </div>

              <div className="flex justify-between border-t border-zinc-50 pt-2 text-xs">
                <span className="text-zinc-400">Amount:</span>
                <span className="font-mono font-black">₹{item.amount.toLocaleString("en-IN")}</span>
              </div>

              {item.maturesAt && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 text-[11px] flex justify-between items-center text-emerald-800 font-semibold">
                  <span>🔒 Lock-in Until: {item.maturesAt}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-700" onClick={() => openDateModalFlow(item.id, "EDIT", item.maturesAt)}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                {item.receiptUrl && <a href={item.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-1 flex-1 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm"><ExternalLink className="h-3.5 w-3.5" /> Receipt</a>}
                {item.status === "PENDING" && (
                  <>
                    <Button disabled={processingId !== null} onClick={() => handleReject(item.id)} size="sm" variant="outline" className="h-8 rounded-lg text-rose-600 border-zinc-200">Reject</Button>
                    <Button disabled={processingId !== null} onClick={() => openDateModalFlow(item.id, "APPROVE")} size="sm" className="h-8 rounded-lg bg-zinc-900 text-white font-medium">Approve</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🖥️ Desktop Table Layout */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Txn ID</th>
              <th className="p-4">Maturity Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/30 transition-colors">
                <td className="p-4">
                  <div className="font-semibold">{item.userName}</div>
                  <div className="text-xs text-zinc-400">{item.userEmail}</div>
                </td>
                <td className="p-4 font-mono font-bold">₹{item.amount.toLocaleString("en-IN")}</td>
                <td className="p-4 font-mono text-xs"><span className="bg-zinc-100 px-2 py-0.5 rounded">{item.transactionId}</span></td>
                <td className="p-4">
                  {item.receiptUrl ? (
                    <a href={item.receiptUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1 font-medium text-xs">
                      View File <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-zinc-300 text-xs">No receipt</span>
                  )}
                </td>
                <td className="p-4 text-xs font-medium text-zinc-500">
                  {item.maturesAt ? (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600 font-bold">🔒 {item.maturesAt}</span>
                      {/* 💡 एडमिन अप्रूव्ड डाटा की डेट यहाँ से बदल सकता है */}
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => openDateModalFlow(item.id, "EDIT", item.maturesAt)}>
                        <Edit2 className="h-3 w-3 text-zinc-500" />
                      </Button>
                    </div>
                  ) : <span className="text-zinc-300">Not Active</span>}
                </td>
                <td className="p-4">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    item.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border"
                  }`}>{item.status}</span>
                </td>
                <td className="p-4 text-right">
                  {item.status === "PENDING" ? (
                    <div className="inline-flex gap-2">
                      <Button disabled={processingId !== null} onClick={() => handleReject(item.id)} size="sm" variant="outline" className="h-8 rounded-lg text-rose-600 border-zinc-200">Reject</Button>
                      <Button disabled={processingId !== null} onClick={() => openDateModalFlow(item.id, "APPROVE")} size="sm" className="h-8 rounded-lg bg-zinc-900 text-white font-medium">Approve</Button>
                    </div>
                  ) : <span className="text-xs font-medium text-zinc-400">Processed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📅 Shared Date Selection Modal (Approve / Edit) */}
      <Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {modalMode === "APPROVE" ? "Set Initial Maturity" : "Modify Maturity Date"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {modalMode === "APPROVE" ? "Approve investment and set its release threshold clock." : "Alter the active lock-in constraints for this asset balance securely."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 flex flex-col items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-11 rounded-xl border-zinc-200">
                  <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                  {customMaturityDate ? format(customMaturityDate, "PPP") : <span>Select threshold date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="center">
                <Calendar
                  mode="single"
                  selected={customMaturityDate}
                  onSelect={setCustomMaturityDate}
                  disabled={(date) => date < new Date()}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDateModalOpen(false)} className="rounded-xl text-xs font-semibold">Cancel</Button>
            <Button onClick={handleMaturitySubmitConfirm} className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-bold text-xs px-5">
              {modalMode === "APPROVE" ? "Confirm & Approve" : "Update Release Date"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}