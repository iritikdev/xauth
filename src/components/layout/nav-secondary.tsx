"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup
      {...props}
      className={cn("px-3 mt-auto", props.className)}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* subtle top divider */}
      <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-2 mb-3" />

      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  tooltip={item.title}
                  className={cn(
                    "relative h-9 rounded-xl transition-all duration-150 border px-3 group/btn",
                    isActive
                      ? [
                          "bg-zinc-950 dark:bg-zinc-50",
                          "text-white dark:text-zinc-950",
                          "border-zinc-900 dark:border-zinc-200",
                        ]
                      : [
                          "text-zinc-400 dark:text-zinc-500",
                          "hover:text-zinc-700 dark:hover:text-zinc-200",
                          "hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                          "border-transparent",
                        ]
                  )}
                >
                  <a href={item.url} className="flex items-center gap-2.5 w-full">
                    {/* amber left bar when active */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-amber-400"
                        aria-hidden="true"
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-4 h-4 shrink-0 transition-all duration-150",
                        isActive
                          ? "text-amber-400"
                          : "text-zinc-400 group-hover/btn:text-zinc-600 dark:group-hover/btn:text-zinc-300"
                      )}
                    >
                      <item.icon className="h-[14px] w-[14px]" strokeWidth={2} />
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "text-[12px] tracking-tight truncate",
                          isActive ? "font-black" : "font-medium"
                        )}
                      >
                        {item.title}
                      </span>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}