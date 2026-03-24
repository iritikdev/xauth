"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hash,
  Target,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Member } from "@/types";
import { getLevelCounts } from "@/lib/genealogy-utils";
import { getGenealogyTree } from "@/app/actions/genealogy";

const MAX_LEVEL = 16;
const SEARCH_MIN_LENGTH = 2;

type SelectedMember = Member & { level: number };
type FlatMember = Member & { level: number; childrenCount: number };

function flattenTree(node?: Member | null, level = 0): FlatMember[] {
  if (!node) return [];
  return [
    {
      ...node,
      level,
      childrenCount: node.children?.length ?? 0,
    },
    ...(node.children?.flatMap((child) => flattenTree(child, level + 1)) ?? []),
  ];
}

function findPathToId(
  node: Member,
  targetId: string,
  path: string[] = []
): string[] | null {
  if (node.id.toUpperCase() === targetId.toUpperCase()) {
    return [...path, node.id.toUpperCase()];
  }

  for (const child of node.children ?? []) {
    const found = findPathToId(child, targetId, [...path, node.id.toUpperCase()]);
    if (found) return found;
  }

  return null;
}

function getInsights(treeData?: Member | null, levelStats: Record<number, number> = {}) {
  const flat = flattenTree(treeData);
  const total = flat.length;
  const active = flat.filter((m) => m.status === "Active").length;
  const pending = total - active;
  const totalBV = flat.reduce((sum, m) => sum + (m.weeklyBV ?? 0), 0);
  const maxDepth = flat.reduce((max, m) => Math.max(max, m.level), 0);
  const avgTeam = total
    ? Math.round(flat.reduce((sum, m) => sum + (m.totalTeam ?? 0), 0) / total)
    : 0;

  let strongestLevel = 0;
  let strongestLevelCount = 0;

  Object.entries(levelStats).forEach(([level, count]) => {
    const numericCount = Number(count) || 0;
    if (numericCount > strongestLevelCount) {
      strongestLevel = Number(level);
      strongestLevelCount = numericCount;
    }
  });

  return {
    total,
    active,
    pending,
    totalBV,
    maxDepth,
    avgTeam,
    strongestLevel,
    strongestLevelCount,
    activeRate: total ? Math.round((active / total) * 100) : 0,
  };
}

const TreeNode = React.memo(function TreeNode({
  node,
  onSelect,
  currentLevel = 1,
  searchTerm,
  searchPath,
  isRoot = false,
}: {
  node: Member;
  onSelect: (member: SelectedMember) => void;
  currentLevel?: number;
  searchTerm: string;
  searchPath: string[];
  isRoot?: boolean;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isMaxLevel = currentLevel >= MAX_LEVEL;
  const isMatch =
    !!searchTerm && node.id.toUpperCase() === searchTerm.trim().toUpperCase();
  const isInSearchPath = searchPath.includes(node.id.toUpperCase());

  const [isOpen, setIsOpen] = useState(isRoot || currentLevel < 3);

  useEffect(() => {
    if (isInSearchPath) setIsOpen(true);
  }, [isInSearchPath]);

  return (
    <div
      id={`node-${node.id.toUpperCase()}`}
      className={cn(
        "relative py-2",
        !isRoot && "ml-4 border-l-2 border-slate-200/70 pl-4 sm:ml-8 sm:pl-6"
      )}
      role="treeitem"
      aria-level={currentLevel}
      aria-expanded={hasChildren ? isOpen : undefined}
    >
      {!isRoot && (
        <div className="absolute left-0 top-10 h-0.5 w-4 bg-slate-200/70 sm:w-6" />
      )}

      <div className="flex items-start gap-2 sm:gap-3">
        {hasChildren && !isMaxLevel ? (
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "mt-4 h-8 w-8 shrink-0 rounded-xl border-slate-200 bg-white p-0",
              !isOpen && "-rotate-90"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            aria-label={isOpen ? "Collapse children" : "Expand children"}
          >
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </Button>
        ) : (
          <div className="mt-4 hidden h-8 w-8 shrink-0 sm:block" />
        )}

        <motion.div
          animate={
            isMatch
              ? {
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 4px 8px rgba(15,23,42,0.06)",
                    "0 12px 24px rgba(16,185,129,0.18)",
                    "0 4px 8px rgba(15,23,42,0.06)",
                  ],
                }
              : {}
          }
          transition={
            isMatch
              ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
              : {}
          }
          className={cn(
            "group w-full rounded-2xl border bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
            isMatch && "border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/70",
            node.status === "Active"
              ? "border-slate-200"
              : "border-amber-200 bg-amber-50/40",
            isMaxLevel && "border-slate-900/20"
          )}
          onClick={() => onSelect({ ...node, level: currentLevel - 1 })}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                node.status === "Active"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-600"
              )}
            >
              <User className="h-5 w-5" />
              <span className="absolute -bottom-1 -right-1 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm">
                L{currentLevel - 1}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                    {node.name}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="h-5 border-slate-200 px-2 text-[10px] font-semibold text-slate-600"
                    >
                      {node.rank || "Associate"}
                    </Badge>
                    <span className="font-mono text-[11px] text-slate-500">
                      {node.id}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        node.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    {node.status === "Active" ? "Verified" : "Pending"}
                  </div>

                  {isMaxLevel ? (
                    <Badge className="bg-slate-900 text-[10px] text-white">MAX</Badge>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-500" />
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <MiniMetric label="Team" value={(node.totalTeam ?? 0).toLocaleString()} />
                <MiniMetric label="BV" value={(node.weeklyBV ?? 0).toLocaleString()} />
                <MiniMetric label="Direct" value={(node.children?.length ?? 0).toString()} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && hasChildren && !isMaxLevel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {node.children?.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                onSelect={onSelect}
                currentLevel={currentLevel + 1}
                searchTerm={searchTerm}
                searchPath={searchPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function GenealogyPage() {
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [treeKey, setTreeKey] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { data: session } = useSession();
  const username = session?.user?.username;

  const { data: treeData, isLoading } = useQuery({
    queryKey: ["genealogy", username],
    queryFn: () => getGenealogyTree(username!, MAX_LEVEL),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  const levelStats = useMemo(() => getLevelCounts(treeData), [treeData]);
  const flatMembers = useMemo(() => flattenTree(treeData), [treeData]);
  const insights = useMemo(() => getInsights(treeData, levelStats), [treeData, levelStats]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toUpperCase());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  const suggestions = useMemo(() => {
    const term = search.trim().toUpperCase();
    if (term.length < SEARCH_MIN_LENGTH) return [];

    return flatMembers
      .filter(
        (member) =>
          member.id.toUpperCase().includes(term) ||
          member.name.toUpperCase().includes(term)
      )
      .slice(0, 6);
  }, [search, flatMembers]);

  useEffect(() => {
    const term = debouncedSearch.trim().toUpperCase();

    if (!treeData || term.length < SEARCH_MIN_LENGTH) {
      setSearchPath([]);
      return;
    }

    const exact = flatMembers.find((member) => member.id.toUpperCase() === term);
    if (!exact) {
      setSearchPath([]);
      return;
    }

    const path = findPathToId(treeData, exact.id);
    if (!path) return;

    setSearchPath(path);

    const timer = window.setTimeout(() => {
      document.getElementById(`node-${term}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [debouncedSearch, treeData, flatMembers]);

  const handleSearchSelect = useCallback((id: string) => {
    setSearch(id.toUpperCase());
    setDebouncedSearch(id.toUpperCase());
    setIsSearchFocused(false);
  }, []);

  const handleResetView = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setSearchPath([]);
    setZoom(1);
    setTreeKey((prev) => prev + 1);
    toast.info("Tree view reset");
  }, []);

  const exportTeamPDF = useCallback(() => {
    if (!treeData) return;

    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Amaze Ayurveda", 14, 16);
    doc.setFontSize(10);
    doc.text(`Genealogy Report - ${treeData.id}`, 14, 24);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    const rows: string[][] = [];

    const pushRows = (node: Member, level: number) => {
      rows.push([
        `L${level}`,
        node.id,
        node.name,
        node.status,
        (node.totalTeam ?? 0).toLocaleString(),
        (node.weeklyBV ?? 0).toLocaleString(),
      ]);

      node.children?.forEach((child) => pushRows(child, level + 1));
    };

    pushRows(treeData, 0);

    autoTable(doc, {
      startY: 42,
      head: [["Level", "Associate ID", "Name", "Status", "Team Size", "Weekly BV"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    doc.save(
      `Amaze_Network_${treeData.id}_${new Date().toISOString().split("T")[0]}.pdf`
    );
    toast.success("PDF exported");
  }, [treeData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <Network className="absolute left-3 top-3 h-6 w-6 animate-pulse text-emerald-600" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">Building your network view...</p>
          <p className="mt-1 text-sm text-slate-500">
            Organizing the tree, levels, and insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                  <Network className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Genealogy Tree
                  </h1>
                  <p className="text-xs text-slate-500">
                    16-level network view with mobile-first insights
                  </p>
                </div>
              </div>

              <Badge className="bg-slate-900 text-white">
                {insights.total.toLocaleString()} Associates
              </Badge>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value.toUpperCase())}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 100)}
                  placeholder="Search by Associate ID or name..."
                  className="h-11 rounded-xl border-slate-200 pl-10 pr-10 uppercase"
                />
                {search && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1.5 h-8 w-8 rounded-lg p-0"
                    onClick={() => {
                      setSearch("");
                      setDebouncedSearch("");
                      setSearchPath([]);
                    }}
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </Button>
                )}

                {isSearchFocused && search.length >= SEARCH_MIN_LENGTH && (
                  <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    {suggestions.length > 0 ? (
                      <div className="space-y-1">
                        {suggestions.map((member) => (
                          <button
                            key={member.id}
                            onMouseDown={() => handleSearchSelect(member.id)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {member.name}
                              </p>
                              <p className="text-xs font-mono text-slate-500">
                                {member.id}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="ml-2 text-[10px] text-slate-600"
                            >
                              L{member.level}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-3 text-sm text-slate-500">
                        No matching associate found.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetView}
                  className="h-11 rounded-xl border-slate-200"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                  className="h-11 rounded-xl border-slate-200"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom((z) => Math.max(z - 0.2, 0.55))}
                  className="h-11 rounded-xl border-slate-200"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(1)}
                  className="h-11 rounded-xl border-slate-200"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={exportTeamPDF}
                  className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 sm:px-4"
                >
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>

            {searchPath.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 overflow-x-auto rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2"
              >
                <span className="whitespace-nowrap text-xs font-semibold text-emerald-700">
                  Path
                </span>
                {searchPath.map((id, idx) => (
                  <React.Fragment key={`${id}-${idx}`}>
                    <Badge variant="secondary" className="font-mono text-[11px]">
                      {id}
                    </Badge>
                    {idx < searchPath.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-emerald-500" />
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <InsightCard
            title="Total Associates"
            value={insights.total.toLocaleString()}
            hint="Visible in the 16-level tree"
            icon={<Users className="h-4 w-4 text-emerald-600" />}
          />
          <InsightCard
            title="Active Rate"
            value={`${insights.activeRate}%`}
            hint={`${insights.active} active / ${insights.pending} pending`}
            icon={<Target className="h-4 w-4 text-blue-600" />}
          />
          <InsightCard
            title="Weekly BV"
            value={insights.totalBV.toLocaleString()}
            hint="Combined network activity"
            icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
          />
          <InsightCard
            title="Strongest Level"
            value={`L${insights.strongestLevel}`}
            hint={`${insights.strongestLevelCount} associates`}
            icon={<Zap className="h-4 w-4 text-amber-600" />}
          />
          <InsightCard
            title="Network Depth"
            value={`${insights.maxDepth}/${MAX_LEVEL - 1}`}
            hint={`Average team size ${insights.avgTeam}`}
            icon={<Network className="h-4 w-4 text-slate-700" />}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                      How to read the tree
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Tap a member card to view details. Use zoom controls for dense networks.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Legend color="bg-emerald-500" label="Verified associate" />
                    <Legend color="bg-amber-500" label="Pending KYC" />
                    <Legend color="bg-slate-900" label="Max depth reached" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white/80 pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      Network Tree
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-500">
                      Scalable hierarchy view with exact-ID jump support
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Zoom <span className="font-bold text-slate-900">{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="h-[72vh] min-h-[540px] p-4 sm:p-6">
                <motion.div
                  key={treeKey}
                  style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
                >
                  {treeData ? (
                    <TreeNode
                      node={treeData}
                      onSelect={setSelectedMember}
                      currentLevel={1}
                      searchTerm={debouncedSearch}
                      searchPath={searchPath}
                      isRoot
                    />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                      No genealogy data available.
                    </div>
                  )}
                </motion.div>
              </ScrollArea>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900">
                  Network Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-slate-300">
                    Quick summary
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    Your network is strongest at{" "}
                    <span className="font-bold text-emerald-400">
                      Level {insights.strongestLevel}
                    </span>{" "}
                    with{" "}
                    <span className="font-bold text-white">
                      {insights.strongestLevelCount.toLocaleString()}
                    </span>{" "}
                    associates. Overall active ratio is{" "}
                    <span className="font-bold text-emerald-400">
                      {insights.activeRate}%
                    </span>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SmallInsight label="Verified" value={insights.active.toLocaleString()} />
                  <SmallInsight label="Pending" value={insights.pending.toLocaleString()} />
                  <SmallInsight label="Avg Team" value={insights.avgTeam.toLocaleString()} />
                  <SmallInsight label="Max Depth" value={`L${insights.maxDepth}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900">
                  Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: MAX_LEVEL }).map((_, i) => {
                  const count = levelStats[i] || 0;
                  const width = insights.total ? (count / insights.total) * 100 : 0;

                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">L{i}</span>
                        <span className="font-bold text-slate-900">
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.5, delay: i * 0.02 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <MemberModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}

function InsightCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SmallInsight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xs font-bold text-slate-900 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-3 w-3 rounded-full shadow-sm", color)} />
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
  );
}

function MemberModal({
  isOpen,
  onClose,
  member,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: SelectedMember | null;
}) {
  if (!member) return null;

  const weeklyBV = member.weeklyBV ?? 0;
  const targetBV = member.targetBV || 10000;
  const progress = Math.min((weeklyBV / targetBV) * 100, 100);

  console.log("Member", member)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-lg overflow-y-auto rounded-3xl border-slate-200 bg-white/95 p-0 shadow-2xl">
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white sm:p-8">
          <div className="relative z-10">
            <div className="mb-4 flex items-start justify-between gap-3">
              <Badge
                className={cn(
                  "px-3 py-1 text-xs font-bold",
                  member.status === "Active"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                )}
              >
                {member.status === "Active" ? "Verified Partner" : "KYC Pending"}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                Level {member.level}
              </Badge>
            </div>

            <DialogTitle className="text-2xl font-bold">{member.name}</DialogTitle>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{member.id}</span>
            </div>
          </div>

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
        </div>

        <div className="space-y-6 p-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Weekly Target Progress
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
              label="Weekly BV"
              value={weeklyBV}
            />
            <StatCard
              icon={<Users className="h-4 w-4 text-blue-600" />}
              label="Team Size"
              value={member.totalTeam}
            />
            <StatCard
              icon={<Award className="h-4 w-4 text-purple-600" />}
              label="Rank"
              value={member.rank || "Associate"}
              isText
            />
            <StatCard
              icon={<Target className="h-4 w-4 text-amber-600" />}
              label="Direct Referrals"
              value={member.children?.length ?? 0}
            />
            <StatCard
              icon={<Calendar className="h-4 w-4 text-slate-600" />}
              label="Join Date"
              value="-"
              isText
            />
            <StatCard
              icon={<Zap className="h-4 w-4 text-emerald-600" />}
              label="Target BV"
              value={targetBV}
            />
          </div>

          <div className="flex gap-3 border-t border-slate-100 pt-2">
            {member.mobile && (
              <a
                href={`https://wa.me/${member.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello ${member.name},\n\nYour Amaze Ayurveda network update:\n📈 Weekly BV: ${weeklyBV}\n👥 Team Size: ${member.totalTeam ?? 0}\n🎯 Keep growing!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </a>
            )}

            <Button onClick={onClose} variant="outline" className="h-12 flex-1 rounded-xl">
              Close
            </Button>
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
  isText = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  isText?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        {isText ? (
          <p className="truncate text-sm font-bold text-slate-900">{value}</p>
        ) : (
          <p className="text-lg font-bold text-slate-900">
            {(value ?? 0).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}