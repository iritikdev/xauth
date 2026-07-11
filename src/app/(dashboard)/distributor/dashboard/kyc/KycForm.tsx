"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";
import {
  Check,
  ChevronLeft,
  Upload,
  Smartphone,
  CreditCard,
  Landmark,
  User,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitKycAction } from "@/lib/actions/kyc";
import { kycSchema } from "@/lib/validations/kyc";
import { baseDashboardUrl } from "@/lib/constants";

// Steps definition with keys matching our database/state
const STEPS = [
  { id: 1, label: "Aadhaar Front", icon: Smartphone, key: "aadharFrontUrl" },
  { id: 2, label: "Aadhaar Back", icon: Smartphone, key: "aadharBackUrl" },
  { id: 3, label: "Pan Card", icon: CreditCard, key: "panUrl" },
  { id: 4, label: "Bank Passbook", icon: Landmark, key: "passbookUrl" },
  { id: 5, label: "Profile Pic", icon: User, key: "photoUrl" },
];

interface KycFormData {
  [key: string]: any;
  aadharFrontUrl: string;
  aadharBackUrl: string;
  panUrl: string;
  panNumber: string;
  aadharNo: string;
  passbookUrl: string;
  photoUrl: string;
}

export default function KycForm({ initialKyc }: { initialKyc: any }) {
  const router = useRouter();

  // Logic: Check if form should be disabled
  const isPending = initialKyc?.status === "PENDING";
  const isVerified = initialKyc?.status === "VERIFIED";
  const isRejected = initialKyc?.status === "REJECTED";
  const isLocked = isPending || isVerified;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KycFormData>({
    aadharFrontUrl: initialKyc?.aadharFrontUrl || "",
    aadharBackUrl: initialKyc?.aadharBackUrl || "",
    panUrl: initialKyc?.panUrl || "",
    panNumber: initialKyc?.panNumber || "",
    aadharNo: initialKyc?.aadharNo || "",
    passbookUrl: initialKyc?.passbookUrl || "",
    photoUrl: initialKyc?.photoUrl || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    try {
      // Step wise validation
      if (currentStep === 1) {
        kycSchema
          .pick({ aadharFrontUrl: true, aadharNo: true })
          .parse(formData);
      }

      if (currentStep === 2) {
        kycSchema.pick({ aadharBackUrl: true }).parse(formData);
      }

      if (currentStep === 3) {
        kycSchema.pick({ panUrl: true, panNumber: true }).parse(formData);
      }

      if (currentStep === 4) {
        kycSchema.pick({ passbookUrl: true }).parse(formData);
      }

      if (currentStep === 5) {
        kycSchema.pick({ photoUrl: true }).parse(formData);
      }

      setErrors({});
      return true;
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {};

      err.errors?.forEach((e: any) => {
        fieldErrors[e.path[0]] = e.message;
      });

      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0]);
      return false;
    }
  };

  const currentStepData = STEPS[currentStep - 1];

  // --- RENDERING LOCKED STATE (If Pending or Verified) ---
  if (isLocked) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
          <div
            className={cn(
              "h-24 w-24 rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner",
              isVerified
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600",
            )}
          >
            {isVerified ? (
              <ShieldCheck size={48} className="drop-shadow-sm" />
            ) : (
              <Clock size={48} className="animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">
            {isVerified ? "KYC Verified" : "Under Review"}
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            {isVerified
              ? "Badhaai ho! Aapka KYC verify ho chuka hai. Aap ab saari services access kar sakte hain."
              : "Aapke documents successfully upload ho chuke hain. Hamari team filhaal inhe review kar rahi hai."}
          </p>
          <Button
            onClick={() => router.push(`${baseDashboardUrl}`)}
            className="mt-10 w-full h-16 rounded-2xl bg-black hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  // --- NORMAL FORM LOGIC ---

  // const handleNext = () => {
  //   if (!formData[currentStepData.key]) {
  //     return toast.error(`Please upload ${currentStepData.label} first`);
  //   }

  //   if (currentStep === 1 && (!formData.aadharNo || formData.aadharNo.length < 12)) {
  //     return toast.error("Please enter a valid 12-digit Aadhaar number");
  //   }
  //   if (currentStep === 3 && (!formData.panNumber || formData.panNumber.length < 10)) {
  //     return toast.error("Please enter a valid 10-digit PAN number");
  //   }

  //   if (currentStep < STEPS.length) {
  //     setCurrentStep((prev) => prev + 1);
  //   } else {
  //     handleSubmit();
  //   }
  // };

  const handleNext = () => {
    const isValid = validateStep();

    if (!isValid) return;

    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleUploadSuccess = (result: any) => {
    const url = result?.info?.secure_url;
    setFormData((prev) => ({ ...prev, [currentStepData.key]: url }));
    toast.success(`${currentStepData.label} Uploaded Successfully!`);
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await submitKycAction(formData);
  //     if (res.success) {
  //       toast.success("KYC updated and submitted!");
  //       router.push("/dashboard/kyc/success");
  //     } else {
  //       toast.error(res.error || "Submission failed");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    const result = kycSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.error(firstError || "Validation failed");
      return;
    }

    setLoading(true);

    try {
      const res = await submitKycAction(formData);

      if (res.success) {
        toast.success("KYC submitted successfully!");
        router.push(`${baseDashboardUrl}/kyc`);
      } else {
        toast.error(res.error || "Submission failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1 || loading}
          className="rounded-full"
        >
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </Button>
        <h1 className="flex-1 text-center font-black text-xl uppercase tracking-widest text-slate-900">
          KYC Update
        </h1>
      </div>

      {/* Stepper Progress Bar */}
      <div className="w-full max-w-xl flex justify-between items-center mb-12 relative px-4">
        <div className="absolute h-[2px] bg-slate-200 w-[90%] left-[5%] top-5 -z-10" />
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-4 border-slate-50 z-10",
                currentStep === step.id
                  ? "bg-black text-white scale-110 shadow-lg"
                  : currentStep > step.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-400",
              )}
            >
              {currentStep > step.id ? <Check size={18} /> : step.id}
            </div>
            <span
              className={cn(
                "text-[8px] font-black uppercase tracking-tighter text-center max-w-[50px]",
                currentStep === step.id ? "text-black" : "text-slate-400",
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rejection Alert Banner */}
      {isRejected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mb-6 p-4 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-3 text-red-600"
        >
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-[11px] font-bold uppercase tracking-tight">
            KYC Rejected: Please re-upload clear and valid documents.
          </p>
        </motion.div>
      )}

      {/* Main Form Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            {currentStepData.label}
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-8">
            Upload clear photo of your {currentStepData.label} to proceed with
            verification.
          </p>

          <div className="space-y-6">
            {/* Conditional Input for PAN Number */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <label className="text-[10px] mb-2 font-black uppercase tracking-widest text-slate-400 ml-1">
                  Aadhaar Number
                </label>
                <Input
                  placeholder="7896 4563 4563"
                  maxLength={12}
                  value={formData.aadharNo}
                  onChange={(e) =>
                    setFormData({ ...formData, aadharNo: e.target.value })
                  }
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500/20 font-bold uppercase tracking-widest"
                />
                {errors.aadharNo && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.aadharNo}
                  </p>
                )}
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  PAN Card Number
                </label>
                <Input
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      panNumber: e.target.value.toUpperCase(),
                    })
                  }
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500/20 font-bold uppercase tracking-widest"
                />
                {errors.panNumber && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.panNumber}
                  </p>
                )}
              </div>
            )}

            {/* Cloudinary Upload Area */}
            <CldUploadWidget
              uploadPreset="amaze_kyc_preset"
              onSuccess={handleUploadSuccess}
              options={{
                maxFiles: 1,
                clientAllowedFormats: ["jpg", "png", "jpeg"],
              }}
            >
              {({ open }) => (
                <div
                  onClick={() => !loading && open()}
                  className={cn(
                    "border-2 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden",
                    formData[currentStepData.key]
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-200",
                  )}
                >
                  {formData[currentStepData.key] ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={formData[currentStepData.key]}
                        alt="preview"
                        className="h-32 w-auto rounded-2xl object-cover mb-4 shadow-xl border-4 border-white"
                      />
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Check size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Change Photo
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 mb-4 text-center uppercase tracking-widest">
                        Upload {currentStepData.label} Photo
                      </p>
                      <Button
                        variant="outline"
                        className="rounded-full font-bold px-8 border-slate-200 pointer-events-none text-xs"
                      >
                        Browse Files +
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CldUploadWidget>

            {/* Primary Action Button */}
            <Button
              onClick={handleNext}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : currentStep === STEPS.length ? (
                "Finish & Submit KYC"
              ) : (
                "Submit & Next Step"
              )}
            </Button>
          </div>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Secure
            Encryption by Amaze Ayurveda
          </p>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
