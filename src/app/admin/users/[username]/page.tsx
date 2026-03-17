import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Network, Wallet, Landmark, UserPlus, Heart, 
  Users, Fingerprint, CreditCard, Building2,
  CalendarDays, Hash
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const {username} = await params  
  
  const user = await prisma.user.findFirst({
    where: { username: username },
    include: {
      _count: { select: { downlines: true, orders: true } },
      sponsor: { select: { name: true, username: true } },
      Wallet: true
    }
  });

  if (!user) notFound();

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-[#fafafa]">
      
      {/* --- HERO SECTION --- */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-inner bg-slate-100">
          {user.photoUrl ? (
            <Image src={user.photoUrl} alt={user.name || ""} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <User size={64} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900">
              {user.name}
            </h1>
            <Badge className="bg-emerald-500 text-white border-none font-black px-4 py-1 text-[10px] uppercase">Active Partner</Badge>
          </div>
          <div className="flex flex-wrap gap-4 items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            <span className="flex items-center gap-1.5 text-emerald-600"><UserPlus size={14}/> @{user.username}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={14}/> Registered: {format(user.createdAt, "dd MMM yyyy")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT SIDE: THE VITAL STATS --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Family & Heritage */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Heart size={14} className="text-red-400"/> Family Details
            </h3>
            <div className="space-y-4">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Father's Name</span>
                  <span className="font-black text-slate-900 italic uppercase">{user.fatherName || "—"}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Mother's Name</span>
                  <span className="font-black text-slate-900 italic uppercase">{user.motherName || "—"}</span>
               </div>
            </div>
          </Card>

          {/* Wallet Summary */}
          <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-6 shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <Wallet size={14}/> Financial Balance
                </h3>
                <div className="mt-4">
                  <p className="text-4xl font-black italic tracking-tighter">₹{user.Wallet?.balance.toLocaleString() || "0.00"}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Available Payout</p>
                </div>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10">
                <Wallet size={120} />
             </div>
          </Card>

          {/* MLM Hierarchy */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Network size={14}/> Network Position
            </h3>
            <div className="space-y-4 text-sm">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sponsor ID</span>
                  <Badge variant="outline" className="font-black uppercase italic">{user.sponsorId || "Direct"}</Badge>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Downline Size</span>
                  <span className="font-black text-emerald-600">{user._count.downlines} Partners</span>
               </div>
            </div>
          </Card>
        </div>

        {/* --- RIGHT SIDE: COMPREHENSIVE DATA --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identity & Legal */}
            <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500"/> Verification Docs
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Aadhaar Number</span>
                  {/* <span className="text-sm font-black italic tracking-widest">{user.aadharNo}</span> */}
                </div>
                <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">PAN Card Number</span>
                  {/* <span className="text-sm font-black italic tracking-widest uppercase">{user.panNumber}</span> */}
                </div>
              </div>
            </Card>

            {/* Address Info */}
            <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin size={14}/> Registered Address
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-900 leading-relaxed uppercase italic">
                  {user.address} {user.district}, {user.state} {user.pincode}
                </p>
                
              </div>
            </Card>
          </div>

          {/* Banking Infrastructure */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Landmark size={14}/> Settlements & Banking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
               <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Account Number</span>
                  <span className="font-black text-sm italic text-slate-900">{user.accountNo}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</span>
                  <span className="font-black text-sm italic text-slate-900 uppercase">{user.ifsc}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bank Branch</span>
                  <span className="font-black text-sm italic text-slate-900 capitalize">{user.branch}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">UPI Address</span>
                  <span className="font-black italic text-sm text-emerald-600">{user.upiId || "NOT_FOUND"}</span>
               </div>
            </div>
          </Card>

          {/* Nominee Details */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 space-y-6 bg-white border-l-8 border-l-blue-500">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nominee & Legacy Beneficiary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Full Name</p>
                  <p className="text-sm font-black italic text-slate-900 uppercase">{user.nomineeName || "—"}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Relation</p>
                  <p className="text-sm font-black italic text-slate-900 uppercase">{user.nomineeRelation || "—"}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Mobile</p>
                  <p className="text-sm font-black italic text-slate-900 uppercase">{user.nomineeMobile || "—"}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Aadhaar</p>
                  <p className="text-sm font-black italic text-slate-900 uppercase">{user.nomineeAadhaar || "—"}</p>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}