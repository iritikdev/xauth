"use client";

import React, { useMemo } from "react";
import { ChevronRight, type LucideIcon, Minus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = useMemo(() => (LucideIcons as Record<string, any>)[name], [name]);
  return Icon ? <Icon className={className} strokeWidth={1.5} /> : <Minus className={className} />;
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon | string;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup className="px-2 pt-16">
      

      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));
          const hasChildren = !!item.items?.length;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive ?? isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "relative h-10 rounded-lg transition-all duration-200 group/btn overflow-hidden",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 hover:translate-x-1"
                  )}
                >
                  <Link href={item.url === "#" ? "" : item.url} className="flex items-center gap-3 w-full">
                    {/* Visual Indicator for Active Item */}
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-emerald-600 rounded-r-full shadow-[2px_0_8px_rgba(5,150,105,0.4)]" />
                    )}

                    <div className={cn("flex items-center justify-center w-5 h-5 shrink-0 transition-transform duration-300", isActive && "scale-110")}>
                      {typeof item.icon === "string" ? (
                        <IconRenderer name={item.icon} className="h-5 w-5" />
                      ) : (
                        item.icon && <item.icon className="h-5 w-5" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <span className={cn("text-sm transition-colors duration-200", isActive ? "font-bold" : "font-medium")}>
                        {item.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>

                {hasChildren && !isCollapsed && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="right-2 h-7 w-7 text-zinc-400 hover:text-zinc-900 group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200">
                        <ChevronRight size={16} />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
                      <SidebarMenuSub className="relative ml-[22px] border-l border-zinc-200 dark:border-zinc-800 pl-2 mt-0.5 space-y-0.5">
                        {(item.items ?? []).map((sub) => {
                          const isSubActive = pathname === sub.url;
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "rounded-md px-3 h-8 text-[13px] transition-all relative group/sub",
                                  isSubActive
                                    ? "text-emerald-600 font-semibold bg-emerald-50/50 dark:bg-emerald-500/5"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-transparent"
                                )}
                              >
                                <Link href={sub.url} className="flex items-center gap-2.5">
                                  {/* Sub-item connecting dot */}
                                  <div className={cn(
                                    "w-1 h-1 rounded-full transition-all duration-300",
                                    isSubActive ? "bg-emerald-500 scale-125 shadow-[0_0_5px_rgba(16,185,129,0.8)]" : "bg-zinc-300 group-hover/sub:bg-zinc-400"
                                  )} />
                                  {sub.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}