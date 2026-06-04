"use client"

import { useState } from "react"
import { AlertTriangle, ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DisclaimerModalProps {
  isOpen?: boolean
  onAccept?: () => void
}

export default function InvestmentDisclaimerModal({ isOpen = true, onAccept }: DisclaimerModalProps) {
  const [open, setOpen] = useState(isOpen)
  const [hasAgreed, setHasAgreed] = useState(false)

  const handleConfirm = () => {
    if (!hasAgreed) return
    setOpen(false)
    if (onAccept) onAccept()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] mx-auto rounded-[28px] p-5 sm:p-6 gap-0 border border-zinc-200/80 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden selection:bg-emerald-500/10">
        
        {/* Decorative Top Accent Gradients */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-emerald-500 to-lime-400 pointer-events-none" />
        
        {/* Header Section */}
        <DialogHeader className="text-center sm:text-center space-y-2 mb-4">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-black tracking-tight text-zinc-900">
            Investment Disclaimer
            <span className="block text-xs font-bold text-zinc-400 mt-0.5 font-sans tracking-normal">निवेश अस्वीकरण</span>
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-zinc-500">
            Please read and acknowledge the policy conditions below.
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic Dual-Language Language Tabs Component */}
        <Tabs defaultValue="en" className="w-full">
          <div className="flex justify-center mb-4">
            <TabsList className="grid grid-cols-2 w-48 h-8 rounded-lg bg-zinc-100 p-0.5 text-zinc-600">
              <TabsTrigger value="en" className="text-xs font-bold rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
                English
              </TabsTrigger>
              <TabsTrigger value="hi" className="text-xs font-bold rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
                हिंदी
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Core Disclaimer Copy Containers */}
          <div className="max-h-[220px] overflow-y-auto pr-1 border border-zinc-100 bg-zinc-50/50 rounded-xl p-3.5 text-xs text-zinc-500 font-medium leading-relaxed shadow-inner">
            
            <TabsContent value="en" className="mt-0 focus-visible:outline-none space-y-2">
              <p>
                Your invested principal amount is intended to remain secure; however, the profit amount depends on the company's business performance and profitability.
              </p>
              <p className="bg-white border border-zinc-200/60 rounded-lg p-2 text-[11px] font-semibold text-zinc-700">
                ⚠️ The expected return <strong className="text-emerald-600 font-mono font-bold">upto 10% per month</strong> is indicative only.
              </p>
              <p>
                Investments are subject to business and market risks. The company shall not be liable for any losses on profits arising from unforeseen market, operational, or regulatory circumstances.
              </p>
            </TabsContent>

            <TabsContent value="hi" className="mt-0 focus-visible:outline-none space-y-2 font-sans tracking-normal">
              <p>
                 आपकी निवेश की गई मूल राशि (Principal Amount) सुरक्षित रखने का पूरा प्रयास किया जाता है, किन्तु लाभ की राशि कंपनी के व्यावसायिक प्रदर्शन एवं लाभ पर निर्भर करेगी।
              </p>
              <p className="bg-white border border-zinc-200/60 rounded-lg p-2 text-[11px] font-semibold text-zinc-700">
                ⚠️ प्रतिमाह <strong className="text-emerald-600 font-mono font-bold">10% तक लाभ</strong> संभावित है।
              </p>
              <p>
                निवेश व्यावसायिक एवं बाज़ार जोखिमों के अधीन है। अप्रत्याशित व्यावसायिक, बाज़ार अथवा नियामकीय परिस्थितियों से होने वाली किसी भी लाभ पर हानि के लिए कंपनी उत्तरदायी नहीं होगी।
              </p>
            </TabsContent>
          </div>
        </Tabs>

        {/* User Explicit Consent Checkbox Toggle */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-3 shadow-sm select-none">
          <Checkbox 
            id="agreement-checkbox" 
            checked={hasAgreed} 
            onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
            className="mt-0.5 border-zinc-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-md h-4 w-4"
          />
          <Label htmlFor="agreement-checkbox" className="text-[11px] font-semibold leading-normal text-zinc-600 cursor-pointer">
            I confirm that I have read and accepted all business conditions and risk factors.
            <span className="block text-[10px] font-medium text-zinc-400 mt-0.5">मैं पुष्टि करता हूँ कि मैंने सभी व्यावसायिक शर्तों और जोखिमों को पढ़ और समझ लिया है।</span>
          </Label>
        </div>

        {/* Primary Action Footer Buttons */}
        <DialogFooter className="mt-5 pt-0 w-full sm:flex-col gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!hasAgreed}
            className="h-11 w-full rounded-xl bg-zinc-950 font-bold text-xs uppercase tracking-wider text-white hover:bg-zinc-800 disabled:opacity-40 transition-all shadow-md shadow-zinc-950/5"
          >
            <ShieldCheck className="mr-1.5 h-4 w-4 stroke-[2.5]" />
            Acknowledge & Proceed
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}