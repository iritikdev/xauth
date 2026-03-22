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

/* ─── icon renderer ───────────────────────────────────────────── */
const IconRenderer = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const Icon = useMemo(
    () => (LucideIcons as Record<string, any>)[name],
    [name]
  );
  return Icon ? (
    <Icon className={className} strokeWidth={2} />
  ) : (
    <Minus className={className} strokeWidth={2} />
  );
};

/* ─── component ───────────────────────────────────────────────── */
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
    <SidebarGroup
      className="px-3 mt-2"
    >
      {/* Section label */}
      <SidebarGroupLabel
        className={cn(
          "px-2 mb-3 text-[9px] font-black tracking-[0.25em] uppercase select-none transition-all duration-200",
          "text-zinc-400",
          isCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
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
                    "relative h-11 rounded-2xl transition-all duration-200 border px-3 group/btn",
                    isActive
                      ? [
                          // active: dark pill with amber left accent
                          "bg-zinc-950 dark:bg-zinc-50",
                          "text-white dark:text-zinc-950",
                          "border-zinc-900 dark:border-zinc-200",
                          "shadow-sm shadow-zinc-900/20",
                        ]
                      : [
                          "text-zinc-500 dark:text-zinc-400",
                          "hover:text-zinc-900 dark:hover:text-white",
                          "hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                          "border-transparent",
                        ]
                  )}
                >
                  <Link
                    href={item.url === "#" ? "" : item.url}
                    className="flex items-center gap-3 w-full"
                  >
                    {/* Active amber dot indicator */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full text-emerald-600"
                        aria-hidden="true"
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-5 h-5 shrink-0 transition-all duration-200",
                        isActive
                          ? "text-emerald-600 scale-110"
                          : "text-zinc-400 group-hover/btn:text-zinc-700 dark:group-hover/btn:text-zinc-200"
                      )}
                    >
                      {typeof item.icon === "string" ? (
                        <IconRenderer
                          name={item.icon}
                          className="h-[17px] w-[17px]"
                        />
                      ) : (
                        item.icon && (
                          <item.icon className="h-[17px] w-[17px]" />
                        )
                      )}
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "text-[13px] tracking-tight transition-all duration-150 truncate",
                          isActive ? "font-black" : "font-medium"
                        )}
                      >
                        {item.title}
                      </span>
                    )}

                    {/* Active amber pill on right */}
                    {isActive && !isCollapsed && (
                      <span className="ml-auto flex h-1.5 w-1.5 rounded-full text-emerald-600 shrink-0" />
                    )}
                  </Link>
                </SidebarMenuButton>

                {/* Collapse trigger */}
                {hasChildren && !isCollapsed && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className={cn(
                          "right-2 top-[11px] h-6 w-6 rounded-xl transition-all duration-200",
                          "flex items-center justify-center",
                          isActive
                            ? "text-zinc-400 dark:text-zinc-600 hover:bg-white/10"
                            : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                          "group-data-[state=open]/collapsible:rotate-90"
                        )}
                      >
                        <ChevronRight size={13} strokeWidth={2.5} />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <SidebarMenuSub
                        className={cn(
                          "ml-[26px] pl-3 mt-1 pb-1 space-y-0.5",
                          "border-l border-zinc-200 dark:border-zinc-800"
                        )}
                      >
                        {(item.items ?? []).map((sub: any) => {
                          const isSubActive = pathname === sub.url;

                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "rounded-xl px-3 h-9 text-[12px] transition-all duration-150 group/sub",
                                  isSubActive
                                    ? [
                                        "font-black text-emerald-600 dark:text-amber-400",
                                        "bg-emerald-50 dark:bg-amber-400/10",
                                      ]
                                    : [
                                        "font-medium text-zinc-400 dark:text-zinc-500",
                                        "hover:text-zinc-800 dark:hover:text-zinc-200",
                                        "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                                      ]
                                )}
                              >
                                <Link
                                  href={sub.url}
                                  className="flex items-center gap-2"
                                >
                                  {/* sub-item dot */}
                                  <span
                                    className={cn(
                                      "w-1 h-1 rounded-full shrink-0 transition-all duration-150",
                                      isSubActive
                                        ? "text-emerald-600 scale-125"
                                        : "bg-zinc-300 dark:bg-zinc-600 group-hover/sub:bg-zinc-500"
                                    )}
                                  />
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