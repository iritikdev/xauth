"use client";

import { CheckCircle2, Loader2, UploadCloud, ImageIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";

interface ReceiptUploadZoneProps {
  receiptUrl: string;
  setReceiptUrl: (url: string) => void;
  isUploading: boolean;
  setIsUploading: (loading: boolean) => void;
}

export default function ReceiptUploadZone({
  receiptUrl,
  setReceiptUrl,
  isUploading,
  setIsUploading,
}: ReceiptUploadZoneProps) {
  return (
    <div className="w-full">
      <CldUploadWidget
        uploadPreset=
          "amaze_pw_receipts"
        
        options={{
          multiple: false,
          maxFiles: 1,
          sources: ["local", "camera"],
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 5000000,
        }}
        onOpen={() => {
          setIsUploading(true);
        }}
        onSuccess={(result: any) => {
          try {
            const secureUrl = result?.info?.secure_url;

            if (!secureUrl) {
              throw new Error("Upload URL not found");
            }

            setReceiptUrl(secureUrl);
            toast.success("Receipt uploaded successfully");
          } catch (error) {
            console.error(error);
            toast.error("Failed to process uploaded image");
          } finally {
            setIsUploading(false);
          }
        }}
        onError={(error) => {
          console.error("Cloudinary Error:", error);

          setIsUploading(false);

          toast.error("Upload failed");
        }}
        onClose={() => {
          setIsUploading(false);
        }}
      >
        {({ open }) => (
          <div className="space-y-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!isUploading) {
                  open?.();
                }
              }}
              className="
                cursor-pointer
                overflow-hidden
                rounded-[24px]
                border-2 border-dashed
                border-zinc-200
                bg-zinc-50
                transition-all
                duration-300
                hover:border-emerald-400
                hover:bg-emerald-50/30
              "
            >
              {receiptUrl ? (
                <div className="relative">
                  <img
                    src={receiptUrl}
                    alt="Receipt Preview"
                    className="
                      h-56
                      w-full
                      object-cover
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-white">
                          Receipt Uploaded
                        </p>

                        <p className="text-[11px] text-zinc-200">
                          Tap to change image
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    {isUploading ? (
                      <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                    ) : (
                      <UploadCloud className="h-7 w-7 text-emerald-600" />
                    )}
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-zinc-900">
                    {isUploading
                      ? "Opening Upload Widget..."
                      : "Upload Payment Receipt"}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    JPG, PNG, WEBP • Max 5MB
                  </p>
                </div>
              )}
            </div>

            {receiptUrl && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <ImageIcon className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                      Upload Complete
                    </p>

                    <p className="mt-1 text-xs text-emerald-900/80">
                      Receipt is attached and ready for verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}