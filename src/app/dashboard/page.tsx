"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Wallet,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  UserCheck,
  ExternalLink,
} from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Utils
import { formatDateTime, cn } from "@/lib/utils";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { InsightItem } from "@/components/dashboard/InsightItem";



// --- Main Page ---

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Business Logic: Training Time (Memoized for performance)
  const trainingStatus = useMemo(() => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const hours = now.getHours();
    return {
      isSunday,
      isLive: isSunday && hours >= 19 && hours <= 21,
      meetingLink: "https://meet.google.com/your-meeting-id",
    };
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?.username) return;
      try {
        const res = await fetch(`/api/user/${session.user.username}`);
        if (res.ok) setUserData(await res.json());
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [session?.user?.username]);

  // Loading State
  if (status === "loading" || loading || !userData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Spinner className="h-10 w-10 text-emerald-600" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest uppercase text-xs">
          Syncing Swadeshi Portal...
        </p>
      </div>
    );
  }

  // Dashboard Metrics Array
  const stats = [
    {
      label: "Total Team",
      value: userData.totalTeam || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Team",
      value: userData.activeTeam || "0",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Payout",
      value: `₹${userData.totalPayout || "0"}`,
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Rank",
      value: userData.rank || "Associate",
      icon: Trophy,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  console.log("User Datt", userData);

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* 1. Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 mb-8 text-white shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-emerald-500/30">
                  <AvatarImage src={userData.photoUrl} />
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
                  Welcome, {userData.name.split(" ")[0]}!
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    ID: {userData.username}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-slate-400 border-slate-700"
                  >
                    Joined {formatDateTime(userData.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center min-w-[200px]">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                Upcoming Rank
              </p>
              <h3 className="text-2xl font-black text-emerald-400 uppercase italic">
                Star Partner
              </h3>
              <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[40%] transition-all duration-1000" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        </motion.section>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* 3. Detailed Insights & Training */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden p-8">
              <div className="flex justify-between items-center mb-6">
                <CardTitle className="text-xl font-black text-slate-900">
                  Distributor Insights
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600"
                >
                  Real-time Data
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {[
                  {
                    label: "Sponsor Details",
                    value: userData.sponsor
                      ? `${userData.sponsor.name} (${userData.sponsor.username})`
                      : "Direct",
                    icon: Zap,
                  },
                  {
                    label: "PAN Card",
                    value: userData.panNumber || "Not Provided",
                    icon: ShieldCheck,
                  },
                  { label: "Weekly Payout", value: "₹0.00", icon: Wallet },
                  {
                    label: "Monthly Self BV",
                    value: userData.totalBv || "0",
                    icon: Zap,
                  },
                ].map((item) => (
                  <InsightItem key={item.label} item={item} />
                ))}
              </div>
            </Card>

            {/* Live Training Banner */}
            <Card className="rounded-[2.5rem] border-none bg-slate-900 p-8 md:p-10 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-4 max-w-xl text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    {trainingStatus.isLive && (
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative h-3 w-3 rounded-full bg-emerald-500"></span>
                      </span>
                    )}
                    <span
                      className={cn(
                        "font-black text-[10px] uppercase tracking-[0.3em]",
                        trainingStatus.isLive
                          ? "text-emerald-400"
                          : "text-slate-500",
                      )}
                    >
                      {trainingStatus.isLive
                        ? "Session is Live"
                        : "Weekly Training"}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black">
                    Master the Marketing Strategy
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    Join our expert-led webinar to learn the official Swadeshi
                    business plan.
                  </p>
                </div>

                <Button
                  onClick={() =>
                    trainingStatus.isLive
                      ? window.open(trainingStatus.meetingLink)
                      : toast.info("Reminder set for Sunday!")
                  }
                  className={cn(
                    "h-14 px-10 rounded-2xl font-black text-sm uppercase transition-all active:scale-95",
                    trainingStatus.isLive
                      ? "bg-emerald-500 hover:bg-emerald-400"
                      : "bg-white text-slate-900",
                  )}
                >
                  {trainingStatus.isLive ? "Join Meeting Now" : "Set Reminder"}
                </Button>
              </div>
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 ${trainingStatus.isLive ? "bg-emerald-500/20" : "bg-blue-500/10"}`}
              />
            </Card>
          </div>

          {/* 4. Business Growth Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
              <h3 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">
                Growth Tracker
              </h3>
              <div className="space-y-6">
                {[
                  {
                    label: "Weekly Group BV",
                    value: "0",
                    color: "bg-emerald-500",
                    progress: 5,
                  },
                  {
                    label: "Rank Progress",
                    value: userData.rank || "Associate",
                    color: "bg-purple-500",
                    progress: 20,
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full transition-all duration-1000`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white text-center relative overflow-hidden group">
              <Trophy className="h-10 w-10 mx-auto mb-4 text-emerald-300" />
              <h3 className="text-xl font-black mb-2 uppercase text-sm">
                Business Tools
              </h3>
              <p className="text-emerald-100/80 text-xs mb-6">
                Calculate your potential earnings with our official tool.
              </p>
              <Link href="/dashboard/businessPlanCalculator" className="block">
                <Button className="w-full bg-white text-emerald-700 font-bold hover:bg-emerald-50 rounded-xl">
                  Plan Calculator
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
