"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  verified?: boolean; // New prop for success state
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, verified, className, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full group">
        <div className="flex justify-between items-center px-1">
          <Label 
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.15em] transition-colors",
              error ? "text-red-500" : verified ? "text-emerald-600" : "text-slate-500 group-focus-within:text-emerald-600"
            )}
          >
            {label}
          </Label>
          {verified && !error && (
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">
              Verified
            </span>
          )}
        </div>
        
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "h-14 rounded-2xl border-slate-200 bg-white transition-all duration-200",
              "focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500",
              error && "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500",
              verified && !error && "border-emerald-500 bg-emerald-50/10",
              className
            )}
            {...props}
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Show Success Checkmark if verified and no error */}
            <AnimatePresence>
              {verified && !error && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                </motion.div>
              )}
            </AnimatePresence>
            {icon}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[10px] text-red-500 font-black uppercase flex items-center gap-1.5 mt-1.5 px-1 tracking-tight">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

FormInput.displayName = "FormInput"