"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  User,
  Zap,
  Search,
  Users,
  Award,
  TrendingUp,
  ArrowUpRight,
  Phone,
  Loader2,
  Network,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getGenealogyTree } from "@/app/actions/genealogy";
import { useSession } from "next-auth/react";

// --- TYPES ---
interface Member {
  id: string;
  name: string;
  rank: string;
  status: "Active" | "Inactive";
  totalTeam: number;
  weeklyBV: number;
  targetBV: number;
  level?: number;
  mobile?: string;
  children?: Member[];
}

// --- MAIN PAGE COMPONENT ---
export default function GenealogyPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");

  const { data: session } = useSession();
  const username = session?.user?.username;

  const { data: treeData, isLoading } = useQuery({
    queryKey: ["genealogy", username],
    queryFn: () => getGenealogyTree(username!, 15), // Capped at 15 levels
    enabled: !!username,
  });

  if (isLoading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Mapping Your 15-Level Network...
        </p>
      </div>
    );

  return (
    <div className="w-full mx-auto space-y-8 p-4 md:p-0">
      <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem]">
        <CardHeader className="p-8 md:p-12 bg-[#0f172a] text-white relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tight italic">
                  Genealogy Tree
                </CardTitle>
                <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
                  15-Level Growth Plan
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find Associate ID..."
                className="pl-12 h-14 rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:bg-white focus:text-slate-900 transition-all border-2"
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        </CardHeader>

        <CardContent className="p-6 md:p-12 bg-slate-50/30">
          <div className="flex gap-6 mb-12 px-4 justify-center md:justify-start">
            <Legend color="bg-emerald-500" label="Verified Associate" />
            <Legend color="bg-slate-300" label="Pending KYC" />
            <Legend color="bg-slate-900" label="Level Cap (15)" />
          </div>

          <div className="overflow-x-auto pb-20 custom-scrollbar">
            <div className="inline-block min-w-full">
              {treeData && (
                <TreeNode
                  node={treeData}
                  onSelect={setSelectedMember}
                  currentLevel={1}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DownlineStatsModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full shadow-sm", color)} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </span>
    </div>
  );
}

const TreeNode = ({
  node,
  onSelect,
  currentLevel = 1,
}: {
  node: Member;
  onSelect: (m: Member) => void;
  currentLevel?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isMaxLevel = currentLevel >= 15;

  return (
    <div className="flex flex-col ml-8 md:ml-16 border-l-2 border-slate-200/60 pl-8 md:pl-12 relative py-3">
      <div className="absolute top-12 left-0 w-8 md:w-12 h-0.5 bg-slate-200/60" />

      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ x: 5 }}
          onClick={() => onSelect({ ...node, level: currentLevel })}
          className={cn(
            "flex items-center gap-4 p-5 rounded-[2rem] min-w-[280px] md:min-w-[320px] cursor-pointer shadow-sm border-2 transition-all relative",
            node.status === "Active"
              ? "bg-white border-transparent hover:border-emerald-500 hover:shadow-xl"
              : "bg-slate-100/50 border-transparent opacity-70 grayscale",
            isMaxLevel && "border-slate-900/20",
          )}
        >
          <div
            className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative",
              node.status === "Active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-200 text-slate-400",
            )}
          >
            <User className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md leading-none">
              L{currentLevel}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-black text-slate-900 text-sm tracking-tight">
              {node.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="text-[8px] h-4 font-black px-2 border-slate-200 uppercase tracking-tighter"
              >
                {node.rank}
              </Badge>
              <span className="text-[10px] text-slate-400 font-bold">
                {node.id}
              </span>
            </div>
          </div>
          {isMaxLevel ? (
            <Badge className="bg-slate-900 text-[8px] uppercase tracking-tighter h-5">
              Max
            </Badge>
          ) : (
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
          )}
        </motion.div>

        {hasChildren && !isMaxLevel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
          >
            {isOpen ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && !isMaxLevel && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="origin-top"
          >
            {node.children?.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                onSelect={onSelect}
                currentLevel={currentLevel + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function DownlineStatsModal({
  isOpen,
  onClose,
  member,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}) {
  if (!member) return null;
  const progress = Math.min(
    (member.weeklyBV / (member.targetBV || 10000)) * 100,
    100,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 border-none bg-white rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="bg-[#0f172a] p-10 text-white relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <Badge
              className={cn(
                "mb-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none",
                member.status === "Active"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-orange-500/20 text-orange-400",
              )}
            >
              {member.status === "Active" ? "Verified Partner" : "KYC Pending"}
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 rounded-full text-[10px] font-black">
              Generation: L{member.level}
            </Badge>
          </div>
          <DialogTitle className="text-4xl font-black tracking-tight">
            {member.name}
          </DialogTitle>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            ID: {member.id}
          </p>
          <Zap className="absolute -bottom-6 -right-6 w-40 h-40 text-white/5 rotate-12" />
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Rank
                </p>
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                  <Award className="w-6 h-6 text-orange-500" />{" "}
                  {member.rank || "Associate"}
                </h4>
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                {Math.round(progress)}% of Goal
              </p>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<TrendingUp className="text-emerald-600 w-5 h-5" />}
              label="Weekly BV"
              value={member.weeklyBV}
            />
            <StatCard
              icon={<Users className="text-blue-600 w-5 h-5" />}
              label="Total Team"
              value={member.totalTeam}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <a
              href={`https://wa.me/${member.mobile?.replace(/\D/g, "")}?text=${encodeURIComponent(
                `Hello ${member.name},

Welcome to Amaze Ayurveda 🌿
Your Associate ID: ${member.id}

For any help feel free to contact us.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-sm transition-all shadow-xl shadow-emerald-100"
            >
              <Phone className="w-4 h-4" /> Message via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full h-16 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest border border-slate-100"
            >
              Close Branch
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="mb-3">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
