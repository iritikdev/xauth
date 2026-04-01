"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { changeUserSponsor, getUsernameInfo } from "@/lib/actions/admin";
import { Loader2, UserPlus, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ChangeSponsorModal({ user }: { user: any }) {
  const [newSponsor, setNewSponsor] = useState("");
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fetch logic with Debouncing
  useEffect(() => {
    const fetchSponsor = async () => {
      if (newSponsor.length >= 4) {
        setIsFetching(true);
        const data = await getUsernameInfo(newSponsor);
        setSponsorName(data?.name || null);
        setIsFetching(false);
      } else {
        setSponsorName(null);
      }
    };

    const timer = setTimeout(fetchSponsor, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [newSponsor]);

  const handleUpdate = async () => {
    if (!newSponsor || !sponsorName) return toast.error("Please enter a valid Sponsor ID");
    
    setLoading(true);
    const res = await changeUserSponsor(user.id, newSponsor);
    
    if (res.success) {
      toast.success(res.message);
      setNewSponsor("");
      setSponsorName(null);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-emerald-900/5 space-y-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

      <div className="relative">
        <div className="flex items-center gap-4 mb-1">
          <div className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <UserPlus className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tighter italic text-slate-900 text-xl">
              Hierarchy <span className="text-emerald-600">Shift</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Re-Sponsoring: {user.name} ({user.username})
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
            New Sponsor ID
          </label>
          <div className="relative group">
            <Input 
              placeholder="ENTER ASSOCIATE ID..."
              value={newSponsor}
              onChange={(e) => setNewSponsor(e.target.value.toUpperCase())}
              className={cn(
                "h-14 pl-5 pr-12 rounded-2xl border-slate-100 bg-slate-50/50 font-mono text-sm tracking-wider transition-all focus:bg-white focus:ring-emerald-500/10",
                sponsorName && "border-emerald-200 bg-emerald-50/20"
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isFetching ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              ) : sponsorName ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : newSponsor.length >= 4 ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : null}
            </div>
          </div>
        </div>

        {/* --- Auto-Fetched Sponsor Card --- */}
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          sponsorName ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-lg shadow-emerald-900/20">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 size={16} />
               </div>
               <div>
                 <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-200">Sponsor Confirmed</p>
                 <p className="text-sm font-black italic">{sponsorName}</p>
               </div>
            </div>
            <Badge variant="outline" className="border-white/20 text-white text-[9px] font-bold uppercase">
              Valid ID
            </Badge>
          </div>
        </div>

        <Button 
          onClick={handleUpdate}
          disabled={loading || !sponsorName}
          className={cn(
            "w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-[0.98]",
            sponsorName 
              ? "bg-[#1c3320] hover:bg-black text-white" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
          )}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Confirm Placement"
          )}
        </Button>

        <div className="flex gap-2 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-[9px] text-amber-700/70 font-medium leading-relaxed uppercase tracking-tighter">
            Warning: This action will move <span className="font-bold">{user.name}</span> and their entire downline to the new sponsor. This is irreversible.
          </p>
        </div>
      </div>
    </div>
  );
}