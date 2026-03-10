'use client'

import * as React from "react";
import {
  CoinsIcon,
  LayoutDashboard,
  LifeBuoy,
  PiggyBank,
  Send,
  Network,
  UserCircle2,
  FileText,
  BadgeCheck,
  CreditCard,
  BarChart3,
  Contact2,
  ArrowRightLeft,
  ChevronRight
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react"; // Import all icons as an object

// 1. Define the TypeScript interface for the navigation prop
interface NavigationData {
  navMain: any[];
  navSecondary: any[];
  marketing: any[];
}

// 2. Update component to accept 'navigation' as a prop
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navigation: NavigationData;
}

// Helper component to render icon by name string
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export function AppSidebar({ navigation, ...props }: AppSidebarProps) {
  const { data: session } = useSession()
  const { state } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/60 bg-white shadow-xl"
      {...props}
    >
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square h-10 w-10 items-center justify-center rounded-xl  shadow-lg  transition-transform hover:scale-105">
                  <Image
                    src="/amaze-logo.png"
                    width={32}
                    height={32}
                    alt="Amaze Logo"
                  />
                </div>
                <div className={cn(
                  "grid flex-1 text-left text-sm leading-tight transition-all duration-300",
                  state === "collapsed" ? "opacity-0 invisible" : "opacity-100 visible"
                )}>
                  <span className="truncate font-black text-slate-900 uppercase tracking-tighter">Amaze Ayurveda</span>
                  <span className="truncate text-[10px] font-bold text-[#059669] uppercase tracking-widest">Pvt. Ltd.</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Progress Badge for Collapsed State */}
        {state === "collapsed" && (
           <div className="flex flex-col items-center py-4 gap-4">
              <div className="h-1.5 w-8 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-500" />
              </div>
           </div>
        )}

        <NavMain items={navigation.navMain} />
        
        <div className="mt-8 px-4 mb-2">
           <h3 className={cn(
             "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-opacity",
             state === "collapsed" ? "opacity-0" : "opacity-100"
           )}>Resources</h3>
        </div>
        <NavProjects projects={navigation.marketing} />
        
        <NavSecondary items={navigation.navSecondary} className="mt-auto pb-4" />
      </SidebarContent>

      {/* <SidebarFooter className="border-t border-slate-100 p-2 bg-slate-50/50">
        {session?.user && (
          <NavUser user={{
            name: session.user.name ?? "Member",
            email: session.user.email ?? "",
            image: session.user.image ?? "/aalogoc.png",
            username: session.user.username
          }} />
        )}
      </SidebarFooter> */}
    </Sidebar>
  );
}