"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronRight,
  User,
  ShieldCheck,
  Zap,
  Search,
  Users,
  Award,
  TrendingUp,
  ArrowUpRight,
  Phone,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// --- TYPES ---
interface Member {
  id: string
  name: string
  rank: string
  status: "Active" | "Inactive"
  totalTeam: number
  weeklyBV: number
  targetBV: number
  mobile?: string
  children?: Member[]
}

// --- MOCK DATA ---
const TREE_DATA: Member = {
  id: "AA001",
  name: "Ritik Kumar",
  rank: "Gold Partner",
  status: "Active",
  totalTeam: 154,
  weeklyBV: 8500,
  targetBV: 10000,
  mobile: "919999999999",
  children: [
    {
      id: "AA042",
      name: "Diksha Kumari",
      rank: "Star Partner",
      status: "Active",
      totalTeam: 45,
      weeklyBV: 4200,
      targetBV: 5000,
      mobile: "918888888888",
      children: [
        { id: "AA102", name: "Rahul Singh", rank: "Associate", status: "Active", totalTeam: 5, weeklyBV: 400, targetBV: 1000 },
        { id: "AA105", name: "Anjali Gupta", rank: "Associate", status: "Inactive", totalTeam: 0, weeklyBV: 0, targetBV: 1000 },
      ]
    },
    {
      id: "AA055",
      name: "Sandeep Verma",
      rank: "Associate",
      status: "Active",
      totalTeam: 12,
      weeklyBV: 1200,
      targetBV: 2500,
      children: [
        { id: "AA110", name: "Vikram Raj", rank: "Associate", status: "Active", totalTeam: 2, weeklyBV: 150, targetBV: 1000 }
      ]
    }
  ]
}

// --- SUB-COMPONENT: STATS MODAL ---
function DownlineStatsModal({ 
  isOpen, 
  onClose, 
  member 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  member: Member | null 
}) {
  if (!member) return null
  const progress = Math.min((member.weeklyBV / member.targetBV) * 100, 100)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] p-0 border-none bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-[#0f172a] p-8 text-white relative overflow-hidden">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-3">Downline Insights</Badge>
          <DialogTitle className="text-3xl font-black">{member.name}</DialogTitle>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">ID: {member.id}</p>
          <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank Status</p>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" /> {member.rank}
              </h4>
            </div>
            <p className="text-xs font-bold text-emerald-600">{Math.round(progress)}% to Next Rank</p>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <TrendingUp className="w-4 h-4 text-emerald-600 mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Weekly BV</p>
              <p className="text-xl font-black text-slate-900">{member.weeklyBV}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Users className="w-4 h-4 text-blue-600 mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Team</p>
              <p className="text-xl font-black text-slate-900">{member.totalTeam}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <a 
              href={`https://wa.me/${member.mobile}`} 
              target="_blank" 
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black transition-all"
            >
              <Phone className="w-4 h-4" /> Contact via WhatsApp
            </a>
            <button 
              onClick={onClose}
              className="w-full h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- SUB-COMPONENT: TREE NODE ---
const TreeNode = ({ 
  node, 
  onSelect 
}: { 
  node: Member; 
  onSelect: (m: Member) => void 
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="flex flex-col ml-6 md:ml-12 border-l-2 border-slate-100 pl-6 md:pl-10 relative py-2">
      <div className="absolute top-10 left-0 w-6 md:w-10 h-0.5 bg-slate-100" />
      
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => onSelect(node)}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl min-w-[240px] md:min-w-[300px] cursor-pointer shadow-sm border transition-all",
            node.status === "Active" ? "bg-white border-slate-200 hover:border-emerald-500" : "bg-slate-50 opacity-60 grayscale"
          )}
        >
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
            node.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-200 text-slate-400"
          )}>
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-sm">{node.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[8px] h-4 font-bold uppercase">{node.rank}</Badge>
              <span className="text-[10px] text-slate-400 font-mono">{node.id}</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300" />
        </motion.div>

        {hasChildren && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node.children?.map((child) => (
              <TreeNode key={child.id} node={child} onSelect={onSelect} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- MAIN PAGE COMPONENT ---
export default function GenealogyPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [search, setSearch] = useState("")

  return (
    <div className="w-full mx-auto space-y-8">
      <Card className=" border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="p-8 md:p-12 bg-slate-900 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <NetworkIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tight italic">Genealogy Tree</CardTitle>
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Swadeshi Growth Network</p>
              </div>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find by Associate ID..." 
                className="pl-12 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:bg-white focus:text-slate-900 transition-all"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-12 bg-slate-50/50">
          <div className="overflow-x-auto pb-12">
             {/* Legend */}
             <div className="flex gap-6 mb-10 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Member</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inactive</span>
                </div>
             </div>

             {/* Root Tree */}
             <div className="inline-block min-w-full">
                <TreeNode node={TREE_DATA} onSelect={setSelectedMember} />
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
  )
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}