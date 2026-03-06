"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatDateTime } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Users, 
  Wallet, 
  Zap, 
  Calendar, 
  ChevronRight, 
  ShieldCheck,
  ArrowUpRight,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SignOut } from "@/components/sign-out";

export default function Page() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/sign-in");
  }, [status, router]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.username) return;
      try {
        const res = await fetch(`/api/user/${session.user.username}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [session?.user?.username]);

  if (status === "loading" || loading || !userData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Spinner className="h-10 w-10 text-emerald-600" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing Swadeshi Portal...</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Team", value: userData.totalTeam || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Team", value: userData.activeTeam || "0", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Payout", value: `₹${userData.totalPayout || "0"}`, icon: Wallet, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Current Rank", value: userData.rank || "Associate", icon: Trophy, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12">
      

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 mb-8 text-white shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-emerald-500/30">
                  <AvatarImage src="/aalogoc.png" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xl">
                    {userData.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-4 border-slate-900">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                  Welcome back, {userData.name.split(' ')[0]}!
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                    ID: {userData.username}
                  </Badge>
                  <Badge variant="outline" className="text-slate-400 border-slate-700">
                    Joined {formatDateTime(userData.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center min-w-[200px]">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Upcoming Rank</p>
              <h3 className="text-2xl font-black text-emerald-400 uppercase italic">Star Partner</h3>
              <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[40%]" />
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Distribution Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black text-slate-900">Distributor Insights</CardTitle>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded-lg">Real-time Data</Badge>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    { label: "Sponsor Details", value: userData.sponsor ? `${userData.sponsor.name} (${userData.sponsor.username})` : "Direct", icon: Zap },
                    { label: "PAN Card", value: userData.panNumber || "Not Provided", icon: ShieldCheck },
                    { label: "Weekly Payout", value: "₹0.00", icon: Wallet },
                    { label: "Monthly Self BV", value: "0 BV", icon: Zap },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 py-4 border-b border-slate-50">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-bold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Downline List Redesign */}
            {/* <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-xl font-black text-slate-900">Recent Downlines</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 text-center">
                {userData.downlines?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.downlines.map((d: any) => (
                      <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold text-emerald-600 shadow-sm">
                            {d.name.substring(0, 1)}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-900">{d.name}</p>
                            <p className="text-xs text-slate-500">ID: {d.username}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <Users className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-medium tracking-tight uppercase text-xs">No Downlines found yet</p>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </motion.div>

          {/* Right Column: Business Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
              <h3 className="font-black text-slate-900 mb-6">Business Growth</h3>
              <div className="space-y-6">
                {[
                  { label: "Weekly Group BV", value: "0", target: "5000", color: "bg-emerald-500" },
                  { label: "Rank Progress", value: "Associate", next: "Star", progress: 20, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: item.progress ? `${item.progress}%` : '5%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white text-center relative overflow-hidden group">
              <div className="relative z-10">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-emerald-300" />
                <h3 className="text-xl font-black mb-2 tracking-tight">Swadeshi Rewards</h3>
                <p className="text-emerald-100/80 text-sm mb-6">Reach Star rank to unlock monthly loyalty bonuses!</p>
                <button className="w-full bg-white text-emerald-700 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-colors">
                  View Business Plan
                </button>
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}