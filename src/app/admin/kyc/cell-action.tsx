"use client";

import { Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateKycStatus } from "@/lib/actions/kyc";
// 1. KycStatus import karein
import { KycStatus } from "@prisma/client"; 

export const KycCellAction = ({ userId, docUrl }: { userId: string, docUrl?: string }) => {
  
  // 2. Parameter type ko KycStatus set karein
  const handleUpdate = async (status: KycStatus) => {
    const res = await updateKycStatus(userId, status);
    if (res.success) toast.success(`KYC ${status.toLowerCase()}!`);
    else toast.error("Something went wrong");
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={() => window.open(docUrl, "_blank")}>
        <Eye className="h-4 w-4 text-blue-600" />
      </Button>
      {/* 3. Enum values use karein */}
      <Button variant="ghost" size="icon" onClick={() => handleUpdate(KycStatus.VERIFIED)}>
        <Check className="h-4 w-4 text-emerald-600" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleUpdate(KycStatus.REJECTED)}>
        <X className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};