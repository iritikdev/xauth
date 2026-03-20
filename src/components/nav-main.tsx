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

const IconRenderer = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const Icon = useMemo(
    () => (LucideIcons as Record<string, any>)[name],
    [name],
  );
  return Icon ? (
    <Icon className={className} strokeWidth={2.25} /> // Thicker stroke for bold look
  ) : (
    <Minus className={className} strokeWidth={2.25} />
  );
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon | string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup className="px-3 selection:bg-emerald-500/30">
      <SidebarGroupLabel
        className={cn(
          "px-2 mb-2 text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase transition-all select-none",
          isCollapsed ? "opacity-0" : "opacity-100",
        )}
      >
        Platform
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/" && pathname.startsWith(item.url));
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
                    "relative h-10 px-3 rounded-lg transition-all duration-200 border",
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent",
                  )}
                >
                  <Link
                    href={item.url === "#" ? "" : item.url}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-transform",
                        isActive
                          ? "scale-110"
                          : "opacity-70 group-hover:opacity-100",
                      )}
                    >
                      {typeof item.icon === "string" ? (
                        <IconRenderer
                          name={item.icon}
                          className="h-[18px] w-[18px]"
                        />
                      ) : (
                        item.icon && <item.icon className="h-[18px] w-[18px]" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <span className="text-[14px] font-medium tracking-tight">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>

                {hasChildren && !isCollapsed && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className={cn(
                          "right-1 top-2 h-6 w-6 rounded-md transition-all",
                          isActive
                            ? "text-white dark:text-slate-950"
                            : "text-slate-400",
                          "group-data-[state=open]/collapsible:rotate-90",
                        )}
                      >
                        <ChevronRight size={14} strokeWidth={2.5} />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <SidebarMenuSub className="ml-5 border-l-2 border-slate-200 dark:border-slate-800 pl-4 mt-1 space-y-1">
                        {/* Use ?. and ?? [] to safely handle potential undefined values */}
                        {(item.items ?? []).map((sub: any) => {
                          const isSubActive = pathname === sub.url;

                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "rounded-md px-3 text-[13px] transition-all",
                                  isSubActive
                                    ? "text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium",
                                )}
                              >
                                <Link href={sub.url}>{sub.title}</Link>
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
