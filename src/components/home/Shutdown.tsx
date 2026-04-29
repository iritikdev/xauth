"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Mail, Phone, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShutdownPage() {
  const ownerEmail = "ritik@amazeayurveda.in";
  const ownerPhone = "+91 92042 60719";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100/50 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-100/50 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-xl w-full"
      >
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 text-center">
          
          {/* Icon Section */}
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 relative">
              <AlertTriangle size={40} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-rose-500/10 rounded-[2rem]"
              />
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-none mb-4">
            Portal <span className="text-rose-500">Offline.</span>
          </h1>
          
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">
            Access has been temporarily restricted <br /> by the administrator.
          </p>

          <div className="h-px w-full bg-slate-100 mb-8" />

          {/* Action Buttons */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">
              Contact Owner for Support
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                asChild
                variant="outline" 
                className="h-14 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group"
              >
                <a href={`mailto:${ownerEmail}`}>
                  <Mail size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                  Email Admin
                </a>
              </Button>

              <Button 
                asChild
                className="h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all group"
              >
                <a href={`tel:${ownerPhone}`}>
                  <Phone size={16} className="mr-2 group-hover:shake transition-transform" />
                  Call Support
                </a>
              </Button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
              <Globe size={12} className="text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Amaze Ayurveda Pvt. Ltd.
              </span>
            </div>
            <p className="text-[9px] font-medium text-slate-300 italic">
              Expected uptime: Pending administrator clearance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}