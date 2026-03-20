'use client'

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { Leaf } from "lucide-react";

import { NavMain }      from "@/components/nav-main";
import { NavProjects }  from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser }      from "@/components/nav-user";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

/* ── Botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
  </svg>
);

/* ── Icon renderer ── */
export const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : null;
};

/* ── Types ── */
interface NavigationData {
  navMain: any[];
  navSecondary: any[];
  marketing: any[];
}
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navigation: NavigationData;
}

export function AppSidebar({ navigation, ...props }: AppSidebarProps) {
  const { data: session } = useSession();
  const { state }         = useSidebar();
  const isCollapsed       = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        " bg-[#1c3320] shadow-[4px_0_32px_rgba(28,50,32,0.15)]",
        "transition-all duration-300"
      )}
      
      {...props}
    >

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
     

      {/* ══════════════════════════════════
          CONTENT
      ══════════════════════════════════ */}
      <SidebarContent className="relative px-2 py-3 overflow-hidden">

        {/* Decorative leaves inside content area */}
        <div className="pointer-events-none absolute bottom-32 right-0 w-20 text-emerald-400 opacity-10">
          <LeafDecor />
        </div>
        <div className="pointer-events-none absolute top-1/3 -left-3 w-14 text-[#c8860a] opacity-8 rotate-[20deg]">
          <LeafDecor />
        </div>

        {/* Collapsed micro-indicator */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="h-px w-5 bg-[#e8a020]/30" />
            <Leaf className="w-3 h-3 text-[#e8a020]/30 fill-[#e8a020]/20" />
            <div className="h-px w-5 bg-[#e8a020]/30" />
          </div>
        )}

        {/* Main nav */}
        <NavMain items={navigation.navMain} />

        {/* Resources section */}
        <div className={cn(
          "mt-6 mb-1.5 px-3 transition-all duration-300",
          isCollapsed ? "opacity-0 h-0 overflow-hidden mt-0 mb-0" : "opacity-100"
        )}>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
              Resources
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>
        </div>

        <NavProjects projects={navigation.marketing} />
        <NavSecondary items={navigation.navSecondary} className="mt-auto pb-2" />
      </SidebarContent>

     
    </Sidebar>
  );
}