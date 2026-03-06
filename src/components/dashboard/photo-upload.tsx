"use client"

import React, { useRef, useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Camera, Loader2, User, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PhotoUploadProps {
  currentPhoto?: string;
  username: string;
}

export function PhotoUpload({ currentPhoto, username }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  
  // Local state for instant visual feedback
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  // Cleanup local URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    }
  }, [localPreview])

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("username", username)

      const res = await fetch("/api/user/upload-photo", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Upload failed")
      }
      return res.json()
    },
    onSuccess: () => {
      // Sync global cache
      queryClient.invalidateQueries({ queryKey: ["user", username] })
      toast.success("Profile photo updated successfully!")
      setLocalPreview(null); // Clear local preview once server syncs
    },
    onError: (error: any) => {
      setLocalPreview(null); // Revert to old photo on error
      toast.error(error.message || "Failed to upload photo")
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image too large. Please upload a file under 2MB.")
    }

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image file.")
    }

    // Generate instant preview
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)
    
    uploadMutation.mutate(file)
  }

  // Determine which source to show: Local Preview > Server Photo > Placeholder
  const displayImage = localPreview || currentPhoto

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        
        {/* Profile Image Circle */}
        <div className={cn(
          "h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 relative transition-all duration-500",
          uploadMutation.isPending ? "scale-95 opacity-80" : "group-hover:scale-105"
        )}>
          {displayImage ? (
            <Image 
              src={displayImage} 
              alt="Profile" 
              fill 
              className="object-cover"
              priority
              unoptimized={!!localPreview} // Needed to show blob URLs
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-300">
              <User size={64} />
            </div>
          )}

          {/* Uploading Spinner Overlay */}
          <AnimatePresence>
            {uploadMutation.isPending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2"
              >
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-center">
                  Syncing Cloud...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Upload Trigger Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className={cn(
            "absolute -bottom-2 -right-2 p-4 rounded-2xl shadow-xl border-4 border-white transition-all",
            "bg-[#0f172a] text-white hover:bg-emerald-600 hover:scale-110 active:scale-95",
            uploadMutation.isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera size={20} />
          )}
        </button>

        {/* Verification Badge */}
        {currentPhoto && !uploadMutation.isPending && (
           <div className="absolute -top-2 -left-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg">
              <CheckCircle2 size={16} />
           </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp" 
      />

      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Official Partner Avatar
        </p>
        <p className="text-[9px] text-slate-400 font-medium italic mt-0.5">
          JPG, PNG or WebP • Max 2MB
        </p>
      </div>
    </div>
  )
}