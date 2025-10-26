'use client'
import * as React from "react";
import {
  CoinsIcon,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  PiggyBank,
  Send,
  TreePalm,
  User2Icon,
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
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  user: {
    name: "Amaze Ayurveda Pvt. Ltd.",
    email: "m@example.com",
    avatar: "/aalogoc.png",
  },
  navMain: [
    {
      title: "Profile",
      url: "#",
      icon: User2Icon,
      isActive: true,
      items: [
        {
          title: "Welcome Letter",
          url: "/dashboard/welcome-letter",
        },
        {
          title: "ID Card",
          url: "/dashboard/id-card",
        },
        {
          title: "View Profile",
          url: "/dashboard/profile",
        },
        {
          title: "KYC Verification",
          url: "/dashboard/kycVerification",
        },
      ],
    },
    {
      title: "Generology",
      url: "#",
      icon: TreePalm,
      items: [
        {
          title: "View",
          url: "/dashboard/generology",
        },
      ],
    },
    {
      title: "E-Wallet",
      url: "#",
      icon: PiggyBank,
      items: [
        {
          title: "Account Statement",
          url: "#",
        },
      ],
    },
    {
      title: "Income Report",
      url: "#",
      icon: CoinsIcon,
      items: [],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Marketing Plan",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className=" text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg">
                  <Image
                    src={"/aalogoc.png"}
                    width={40}
                    height={50}
                    alt="logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Amaze Ayurveda</span>
                  <span className="truncate text-xs">Pvt. Ltd.</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
