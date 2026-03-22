"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile, state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup
      className="px-3 group-data-[collapsible=icon]:hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Section label */}
      <SidebarGroupLabel
        className={cn(
          "px-2 mb-3 text-[9px] font-black tracking-[0.25em] uppercase select-none transition-all duration-200 text-zinc-400",
          isCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
        )}
      >
        Download Zone
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {projects.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={cn(
                  "relative h-11 rounded-2xl transition-all duration-200 border px-3 group/btn",
                  isActive
                    ? [
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
                <a href={item.url} className="flex items-center gap-3 w-full">
                  {/* amber left bar when active */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber-400"
                      aria-hidden="true"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-5 h-5 shrink-0 transition-all duration-200",
                      isActive
                        ? "text-amber-400 scale-110"
                        : "text-zinc-400 group-hover/btn:text-zinc-700 dark:group-hover/btn:text-zinc-200"
                    )}
                  >
                    <item.icon className="h-[17px] w-[17px]" strokeWidth={2} />
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "text-[13px] tracking-tight truncate transition-all duration-150 flex-1",
                        isActive ? "font-black" : "font-medium"
                      )}
                    >
                      {item.name}
                    </span>
                  )}

                  {/* active amber dot */}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}