"use client";

import React, { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, UserCheck, Shield, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserTable({ initialUsers }: { initialUsers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Instant Client-Side Filter
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchStr) ||
        user.email?.toLowerCase().includes(searchStr) ||
        user.mobile?.toLowerCase().includes(searchStr)
      );
    });
  }, [searchTerm, initialUsers]);

  return (
    <div className="space-y-6">
      {/* Instant Client-Side Search Input */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Instant search by name, email, or mobile..." 
          className="h-16 pl-14 rounded-2xl bg-white border-none shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500/20 text-lg font-medium"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 h-16">Partner Details</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sponsor</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rank/Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network Size</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 uppercase italic tracking-tight">{user.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.mobile || user.email}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-xs font-bold text-slate-600">{user.sponsor?.name || "Direct"}</span>
                </TableCell>

                <TableCell>
                  <Badge className={`border-none font-black text-[9px] uppercase px-3 py-1 ${
                    user.role === "ADMIN" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {user.role}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-900 font-black italic">
                     <Award size={14} className="text-orange-400" />
                     <span>{user._count?.downlines || 0} Members</span>
                  </div>
                </TableCell>

                <TableCell className="text-right pr-8">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-emerald-600">
                    <MoreVertical size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
            No matching partners found on this page.
          </div>
        )}
      </div>
    </div>
  );
}