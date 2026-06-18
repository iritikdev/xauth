"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, ArrowRight, QrCode, UploadCloud, 
  CheckCircle2, AlertCircle, Copy, Loader2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FlowStep = "ACTIVATE_REQUEST" | "AMOUNT_INPUT" | "QR_PAYMENT" | "CONFIRMATION" | "RECEIPT_UPLOAD" | "SUCCESS";

export default function InvestmentFlow() {
  const [step, setStep] = useState<FlowStep>("ACTIVATE_REQUEST");
  const [amount, setAmount] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>("");

  // Placeholder UPI String for QR Generator or Gateway (Amaze Business UPI)
  const upiId = "amazeayurveda@ybl"; 
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

  return (
    <div className="min-h-[85vh] bg-[#fcfdfc] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-100/40 p-8 relative overflow-hidden">
        
        {/* Progress Bar Header */}
        <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-500" 
             style={{ width: `${(Object.keys(stepsMap).indexOf(step) + 1) * 16.6}%` }} />

        <AnimatePresence mode="wait">
          
          {/* STEP 1: REQUEST ACTIVATION */}
          {step === "ACTIVATE_REQUEST" && (
            <motion.div key="step1" {...fadeConfig} className="text-center space-y-6">
              <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Wallet size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-[1000] tracking-tighter uppercase italic text-slate-900">Passive Wallet</h2>
                <p className="text-slate-400 text-xs font-semibold mt-1">Activate passive pool to start compounding earnings.</p>
              </div>
              <Button 
                onClick={() => setStep("AMOUNT_INPUT")}
                className="w-full h-14 rounded-2xl bg-[#1c3320] text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-950 transition-all gap-2"
              >
                Request Passive Allocation <ArrowRight size={14} />
              </Button>
            </motion.div>
          )}

          {/* STEP 2: AMOUNT INPUT */}
          {step === "AMOUNT_INPUT" && (
            <motion.div key="step2" {...fadeConfig} className="space-y-6">
              <div>
                <h3 className="text-xl font-[1000] tracking-tighter uppercase italic text-slate-900">Investment Amount</h3>
                <p className="text-slate-400 text-xs font-semibold">Enter funds you want to lock in passive pool.</p>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 italic text-lg">₹</span>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 pl-10 pr-4 rounded-xl border-slate-100 bg-slate-50 text-base font-bold focus:ring-emerald-500/10"
                />
              </div>
              <Button 
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => setStep("QR_PAYMENT")}
                className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all"
              >
                Generate Payment Intent
              </Button>
            </motion.div>
          )}

          {/* STEP 3: QR PAYMENT SCAN */}
          {step === "QR_PAYMENT" && (
            <motion.div key="step3" {...fadeConfig} className="text-center space-y-6">
              <div className="text-left">
                <h3 className="text-lg font-[1000] tracking-tighter uppercase italic text-slate-900">Scan & Pay</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-emerald-600">Amount: ₹{amount}</p>
              </div>
              
              {/* Dynamic QR Code */}
              <div className="mx-auto border border-slate-100 p-4 rounded-3xl bg-white w-fit shadow-md relative group">
                <img src={qrCodeSrc} alt="Payment QR" className="w-48 h-48 rounded-xl" />
              </div>

              {/* UPI ID Clipboard Copy block */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Official Merchant UPI</span>
                  <span className="text-xs font-black text-slate-700">{upiId}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopyUPI} className="h-8 w-8 p-0">
                  <Copy size={14} className="text-slate-400" />
                </Button>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 text-left border border-amber-100/50 flex items-start gap-3">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] text-amber-900 font-bold leading-normal">
                  Important: Scan via any UPI app (PhonePe, GPay, Paytm). Do not close this window while processing.
                </p>
              </div>

              <Button 
                onClick={() => setStep("CONFIRMATION")}
                className="w-full h-14 rounded-2xl bg-[#1c3320] text-white font-black uppercase tracking-widest text-xs"
              >
                I Have Made The Payment
              </Button>
            </motion.div>
          )}

          {/* STEP 4: DID YOU PAY CONFIRMATION */}
          {step === "CONFIRMATION" && (
            <motion.div key="step4" {...fadeConfig} className="text-center space-y-6 py-4">
              <div className="mx-auto h-14 w-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-[1000] tracking-tighter uppercase italic text-slate-900">Confirm Payment?</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">Kya aapne sach me digital payment execute kar diya hai?</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("QR_PAYMENT")}
                  className="flex-1 h-14 rounded-2xl border-slate-100 text-xs font-black uppercase tracking-widest text-slate-500"
                >
                  No, Go Back
                </Button>
                <Button 
                  onClick={() => setStep("RECEIPT_UPLOAD")}
                  className="flex-1 h-14 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                >
                  Yes, I Paid
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: RECEIPT UPLOAD (CLOUDINARY) */}
          {step === "RECEIPT_UPLOAD" && (
            <motion.div key="step5" {...fadeConfig} className="space-y-6">
              <div>
                <h3 className="text-xl font-[1000] tracking-tighter uppercase italic text-slate-900">Upload Receipt</h3>
                <p className="text-slate-400 text-xs font-semibold">Provide transaction reference screenshot for instant audit.</p>
              </div>

              <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  disabled={isUploading}
                />
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                    {isUploading ? <Loader2 size={20} className="animate-spin text-emerald-500" /> : <UploadCloud size={20} />}
                  </div>
                  <div className="text-xs font-bold text-slate-600">
                    {receiptUrl ? <span className="text-emerald-600">✓ Receipt Checked Ready</span> : "Click to select or drag image"}
                  </div>
                  <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <Button 
                disabled={!receiptUrl || isUploading}
                onClick={handleSubmitInvestment}
                className="w-full h-14 rounded-2xl bg-[#1c3320] text-white font-black uppercase tracking-widest text-xs disabled:opacity-40"
              >
                Submit Investment Ledger
              </Button>
            </motion.div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === "SUCCESS" && (
            <motion.div key="step6" {...fadeConfig} className="text-center space-y-6 py-6">
              <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-[1000] tracking-tighter uppercase italic text-slate-900">Under Audit</h3>
                <p className="text-slate-400 text-xs font-medium px-4 mt-2 leading-relaxed">
                  Aapki receipt blockchain validation & admin dashboard verification ke liye queue me daal di gayi hai. Active status within 2 hours populate ho jayega.
                </p>
              </div>
              <Button 
                onClick={() => { setStep("ACTIVATE_REQUEST"); setAmount(""); setReceiptUrl(""); }}
                className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest"
              >
                Back To Passive Hub
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

const fadeConfig = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.25 }
};

const stepsMap = {
  "ACTIVATE_REQUEST": 1,
  "AMOUNT_INPUT": 2,
  "QR_PAYMENT": 3,
  "CONFIRMATION": 4,
  "RECEIPT_UPLOAD": 5,
  "SUCCESS": 6
};