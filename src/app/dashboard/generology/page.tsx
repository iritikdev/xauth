"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Download,
  Minimize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getGenealogyTree } from "@/app/actions/genealogy";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Member } from "@/types";
import { getLevelCounts } from "@/lib/genealogy-utils";

export default function GenealogyPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [treeKey, setTreeKey] = useState(0); 
  const { data: session } = useSession();
  const username = session?.user?.username;

  const { data: treeData, isLoading } = useQuery({
    queryKey: ["genealogy", username],
    queryFn: () => getGenealogyTree(username!, 16),
    enabled: !!username,
  });

  const levelStats = useMemo(() => getLevelCounts(treeData), [treeData]);

  // --- RECURSIVE SEARCH PATH FINDER ---
  const findPath = (
    node: Member,
    targetId: string,
    path: string[] = [],
  ): string[] | null => {
    if (node.id.toUpperCase() === targetId.toUpperCase()) {
      return [...path, node.id.toUpperCase()];
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findPath(child, targetId, [
          ...path,
          node.id.toUpperCase(),
        ]);
        if (found) return found;
      }
    }
    return null;
  };

  // --- JUMP TO SEARCH & AUTO-EXPAND ---
  useEffect(() => {
    if (search.length >= 3 && treeData) {
      const path = findPath(treeData, search);
      if (path) {
        setSearchPath(path);
        setTimeout(() => {
          const element = document.getElementById(`node-${search.toUpperCase()}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    } else {
      setSearchPath([]);
    }
  }, [search, treeData]);

  const handleCollapseAll = () => {
    setSearch("");
    setSearchPath([]);
    setTreeKey((prev) => prev + 1);
    toast.info("Tree View Reset", { icon: <Minimize2 className="w-4 h-4" /> });
  };

  const exportTeamPDF = () => {
    if (!treeData) return;
    const doc = new jsPDF();
    const tableRows: any[] = [];
    const flattenMember = (node: Member, level: number) => {
      tableRows.push([
        `L${level - 1}`,
        node.id,
        node.name,
        node.status,
        (node.totalTeam ?? 0).toLocaleString(),
        (node.weeklyBV ?? 0).toLocaleString(),
      ]);
      node.children?.forEach((child) => flattenMember(child, level + 1));
    };
    flattenMember(treeData, 1);
    
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text("Amaze Ayurveda Pvt. Ltd.", 14, 20);
    autoTable(doc, {
      startY: 40,
      head: [["Level", "Associate ID", "Name", "Status", "Team Size", "Weekly BV"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42] },
    });
    doc.save(`Amaze_Network_${treeData.id}.pdf`);
  };

  if (isLoading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
          Mapping Your Swadeshi Network...
        </p>
      </div>
    );

  return (
    <div className="w-full mx-auto space-y-8 p-0 md:p-0">
      <Card className="border-none shadow-2xl bg-white overflow-hidden ">
        <CardHeader className="p-2 md:p-10 bg-[#0f172a] text-white relative space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tight italic">Genealogy Tree</CardTitle>
                <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">16-Level Growth Network</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-80 text-slate-900">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find Associate ID..."
                  className="pl-12 h-14 rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:bg-white focus:text-slate-900 transition-all border-2 uppercase"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCollapseAll} variant="outline" className="h-14 px-4 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white hover:text-slate-900">
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button onClick={exportTeamPDF} className="flex-1 h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px]">
                  <Download className="w-4 h-4" /> Export Report
                </Button>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-xl bg-white overflow-hidden relative z-10">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-white"><Users className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase italic">Network Density</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Active nodes per generation</p>
                </div>
              </div>
              <Badge className="bg-emerald-500 text-white font-black text-[10px] px-6 py-2 rounded-full shadow-lg shadow-emerald-500/20">
                Total: {Object.values(levelStats).reduce((a, b) => a + b, 0).toLocaleString()} Associates
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-3xl bg-white border border-slate-100 min-w-[90px] shadow-sm hover:border-emerald-500 transition-all group">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-emerald-600">Level {i}</span>
                    <span className="text-xl font-black text-[#0f172a]">{levelStats[i] || 0}</span>
                    <div className="w-8 h-1 bg-slate-100 rounded-full group-hover:bg-emerald-500 transition-all" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        </CardHeader>

        <CardContent className="p-6 md:p-12 bg-slate-50/30">
          <div className="flex flex-wrap gap-6 mb-12 px-4 justify-center md:justify-start">
            <Legend color="bg-emerald-500" label="Verified Associate" />
            <Legend color="bg-slate-300" label="Pending KYC" />
            <Legend color="bg-slate-900" label="Level Cap (16)" />
          </div>

          <div className="overflow-x-auto pb-20 custom-scrollbar">
            <div className="inline-block min-w-full" key={treeKey}>
              {treeData && (
                <TreeNode
                  node={treeData}
                  onSelect={setSelectedMember}
                  currentLevel={1}
                  searchTerm={search}
                  searchPath={searchPath}
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

const TreeNode = ({
  node,
  onSelect,
  currentLevel = 1,
  searchTerm,
  searchPath = [],
}: any) => {
  const [isOpen, setIsOpen] = useState(currentLevel < 3);

  // Auto-expand logic for search
  useEffect(() => {
    if (searchPath.includes(node.id.toUpperCase())) {
      setIsOpen(true);
    }
  }, [searchPath, node.id]);

  const isMatch = searchTerm && node.id.toUpperCase() === searchTerm.toUpperCase();
  const hasChildren = node.children && node.children.length > 0;
  const isMaxLevel = currentLevel >= 16;

  return (
    <div
      className="flex flex-col ml-8 md:ml-16 border-l-2 border-slate-200/60 pl-8 md:pl-12 relative py-3"
      id={`node-${node.id.toUpperCase()}`}
    >
      <div className="absolute top-12 left-0 w-8 md:w-12 h-0.5 bg-slate-200/60" />
      <div className="flex items-center gap-4">
        <motion.div
          animate={isMatch ? { scale: [1, 1.05, 1], borderColor: ["#e2e8f0", "#10b981", "#e2e8f0"] } : {}}
          transition={isMatch ? { repeat: Infinity, duration: 1.5 } : {}}
          onClick={() => onSelect({ ...node, level: currentLevel - 1 })}
          className={cn(
            "flex items-center gap-4 p-5 rounded-[2rem] min-w-[280px] md:min-w-[320px] cursor-pointer shadow-sm border-2 transition-all relative",
            node.status === "Active" ? "bg-white border-transparent hover:border-emerald-500 shadow-sm" : "bg-slate-100/50 opacity-70 grayscale",
            isMatch && "border-emerald-500 bg-emerald-50/50 shadow-emerald-200 shadow-lg",
            isMaxLevel && "border-slate-900/20",
          )}
        >
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative", node.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-200 text-slate-400")}>
            <User className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md leading-none shadow-sm">L{currentLevel - 1}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-black text-slate-900 text-sm tracking-tight italic">{node.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[8px] h-4 font-black px-2 border-slate-200 uppercase tracking-tighter">{node.rank}</Badge>
              <span className="text-[10px] text-slate-400 font-bold">{node.id}</span>
            </div>
          </div>
          {isMaxLevel ? <Badge className="bg-slate-900 text-[8px] uppercase tracking-tighter h-5 text-white">End</Badge> : <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />}
        </motion.div>
        {hasChildren && !isMaxLevel && (
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-all shadow-sm">
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {isOpen && hasChildren && !isMaxLevel && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="origin-top">
            {node.children?.map((child: any) => (
              <TreeNode key={child.id} node={child} onSelect={onSelect} currentLevel={currentLevel + 1} searchTerm={searchTerm} searchPath={searchPath} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ... Include DownlineStatsModal and StatCard from previous turns

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
                "mb-4 px-3 py-1 rounded-full text-[10px] font-black uppercase border-none",
                member.status === "Active"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-orange-500/20 text-orange-400",
              )}
            >
              {member.status === "Active" ? "Verified Partner" : "KYC Pending"}
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 rounded-full text-[10px] font-black">
              Level: {member.level}
            </Badge>
          </div>
          <DialogTitle className="text-4xl font-black tracking-tight italic">
            {member.name}
          </DialogTitle>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Associate ID: {member.id}
          </p>
          <Zap className="absolute -bottom-6 -right-6 w-40 h-40 text-white/5 rotate-12" />
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Designation
                </p>
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                  <Award className="w-6 h-6 text-orange-500" />{" "}
                  {member.rank || "Associate"}
                </h4>
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                {Math.round(progress)}% of Weekly Target
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
                `Hello ${member.name}, I am your sponsor from Amaze Ayurveda. Your current network status: ID ${member.id}, Team Size ${member.totalTeam}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-sm transition-all shadow-xl shadow-emerald-100"
            >
              <Phone className="w-4 h-4" /> Message on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full h-16 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              Return to Tree
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
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-900">
        {/* The Fix: Ensure value exists before calling toLocaleString */}
        {(value ?? 0).toLocaleString()}
      </p>
    </div>
  );
}
