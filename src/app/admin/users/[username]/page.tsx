import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  User, Mail, Phone, MapPin, ShieldCheck,
  Network, Wallet, Landmark, UserPlus, Heart,
  Users, Fingerprint, CreditCard, Building2,
  CalendarDays, Hash, Activity, Briefcase,
  ArrowUpRight, Info,
  
  Pencil
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { ChangeSponsorModal } from "@/components/admin/ChangeSponsorModal";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: { username: username },
    include: {
      _count: { select: { downlines: true, orders: true } },
      sponsor: { select: { name: true, username: true } },
      kycDocument: { select: { status: true, aadharNo: true, panNumber: true } },
      Wallet: true
    }
  });

  if (!user) notFound();

  return (
    <div className="space-y-8 pb-20">

      {/* ─── TOP ACTION BAR ─── */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* User Hero Branding */}
        <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="relative h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-md bg-slate-50 group">
            {user.photoUrl ? (
              <Image src={user.photoUrl} alt={user.name || ""} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <User size={48} />
              </div>
            )}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                {user.name}
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-3 py-1 text-[9px] uppercase tracking-widest">
                Partner Active
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-100">
                <Fingerprint size={12} /> @{user.username}
              </span>
              <span className="flex items-center gap-1.5 py-0.5">
                <CalendarDays size={12} /> Joined {format(user.createdAt, "MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Business Quick Stats */}
        <div className="lg:w-80 grid grid-cols-2 gap-4">
          <div className="bg-emerald-600 rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-lg shadow-emerald-900/10">
            <Activity size={20} className="opacity-40" />
            <div>
              <p className="text-2xl font-black italic tracking-tighter">{user.personalBv || 0}</p>
              <p className="text-[9px] font-bold uppercase opacity-60 tracking-widest">Personal BV</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-lg">
            <Users size={20} className="opacity-40" />
            <div>
              <p className="text-2xl font-black italic tracking-tighter">{user._count.downlines}</p>
              <p className="text-[9px] font-bold uppercase opacity-60 tracking-widest">Network</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ─── LEFT COLUMN: CORE ADMIN CONTROLS ─── */}
        <div className="lg:col-span-4 space-y-8">

          {/* Hierarchy Management (CRITICAL) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Network size={16} className="text-emerald-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Hierarchy Management
              </h2>
            </div>
            <ChangeSponsorModal user={user} />
          </section>

          {/* Financial Summary */}
          <Card className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-6 shadow-2xl relative overflow-hidden border-none">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <Wallet size={14} /> Wallet Balance
                </h3>
                <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center">
                  <ArrowUpRight size={14} className="text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-black italic tracking-tighter">₹{user.Wallet?.balance.toLocaleString() || "0.00"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Payout Balance</p>
                </div>
              </div>
            </div>
            {/* Abstract Decor */}
            <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl" />
          </Card>
        </div>

        {/* ─── RIGHT COLUMN: DATA BENTO GRID ─── */}
        <div className="lg:col-span-8 space-y-8">

          {/* Bento Grid: Personal & Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-all">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Personal Heritage
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Father's Name</span>
                  <span className="font-black text-slate-900 italic uppercase tracking-tight">{user.fatherName || "Not Provided"}</span>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mother's Name</span>
                  <span className="font-black text-slate-900 italic uppercase tracking-tight">{user.motherName || "Not Provided"}</span>
                </div>
              </div>
            </Card>

            {/* Verification Status */}
            <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-6 bg-slate-50/30">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Legal Verification
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl ring-1 ring-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar</span>
                  <span className="font-mono text-xs font-black tracking-widest">{user.kycDocument?.aadharNo || "XXXX-XXXX-XXXX"}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl ring-1 ring-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">PAN</span>
                  <span className="font-mono text-xs font-black tracking-widest uppercase">{user.kycDocument?.panNumber || "XXXXX000X"}</span>
                </div>
                {user.kycDocument?.status === "VERIFIED" && (
                  <Badge className="w-full justify-center py-2 bg-emerald-50 text-emerald-700 border-emerald-100 font-black uppercase text-[9px] tracking-widest">
                    KYC Verified
                  </Badge>
                )}
                {user.kycDocument?.status === "PENDING" && (
                  <Badge className="w-full justify-center py-2 bg-amber-50 text-amber-700 border-amber-100 font-black uppercase text-[9px] tracking-widest">
                    KYC Pending
                  </Badge>
                )}
                {user.kycDocument?.status === "REJECTED" && (
                  <Badge className="w-full justify-center py-2 bg-red-50 text-red-700 border-red-100 font-black uppercase text-[9px] tracking-widest">
                    KYC Rejected
                  </Badge>
                )}
                {user.kycDocument?.status === "NOT_SUBMITTED" && (
                  <Badge className="w-full justify-center py-2 bg-gray-50 text-gray-700 border-gray-100 font-black uppercase text-[9px] tracking-widest">
                    KYC Not Submitted
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Banking & Settlements (Wide Card) */}
          <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Landmark size={14} className="text-amber-500" /> Banking Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Number</span>
                <span className="font-black text-lg italic text-slate-900 tracking-tighter">{user.accountNo}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">IFSC</span>
                <span className="font-black text-lg italic text-slate-900 uppercase tracking-tighter">{user.ifsc}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Branch Name</span>
                <span className="font-black text-lg italic text-slate-900 capitalize tracking-tighter">{user.branch}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Digital VPA (UPI)</span>
                <span className="font-black text-lg italic text-emerald-600 tracking-tighter lowercase">{user.upiId || "not_found@upi"}</span>
              </div>
            </div>
            {/* Background Bank Icon */}
            <Building2 className="absolute -right-6 -bottom-6 opacity-[0.03] text-slate-900" size={180} />
          </Card>

          {/* Legacy Beneficiary (Wide Card) */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-emerald-50/30 border-l-8 border-l-emerald-600 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nominee & Legacy Beneficiary</h3>
              <Heart className="text-emerald-600 fill-emerald-600/20" size={20} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Full Name</p>
                <p className="text-sm font-black italic text-slate-900 uppercase tracking-tight">{user.nomineeName || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Relation</p>
                <p className="text-sm font-black italic text-slate-900 uppercase tracking-tight">{user.nomineeRelation || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Mobile</p>
                <p className="text-sm font-black italic text-slate-900 uppercase tracking-tight">{user.nomineeMobile || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Aadhaar</p>
                <p className="text-sm font-black italic text-slate-900 uppercase tracking-tight">{user.nomineeAadhaar || "—"}</p>
              </div>
            </div>
          </Card>
        </div>

        <Link href={`/admin/users/${user.username}/edit`}>
        <Button
          variant="outline"
          className="rounded-xl border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-[10px] uppercase tracking-widest h-10 gap-2"
        >
          <Pencil size={14} />
          Edit Information
        </Button>
      </Link>
      </div>

    
    </div>
  );
}