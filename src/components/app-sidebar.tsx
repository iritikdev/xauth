'use client'

import * as React from "react";
import * as LucideIcons from "lucide-react";


import { NavMain } from "@/components/nav-main";

import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";


import { cn } from "@/lib/utils";



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
  ;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        " bg-[#1c3320] shadow-[4px_0_32px_rgba(28,50,32,0.15)]",
        "transition-all duration-300"
      )}

      {...props}
    >


      <SidebarContent className="relative px-2 py-3 overflow-hidden">





        <NavMain items={navigation.navMain} />

      </SidebarContent>


    </Sidebar>
  );
}