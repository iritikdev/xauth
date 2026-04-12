import { AppSidebar } from "@/components/layout/app-sidebar";
import AppBreadcrumb from "@/components/ui/app-breadcrumb";
import { NewsTicker } from "@/components/new-ticker";
import { UserDashboardHeader } from "@/components/user-dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { DASHBOARD_SIDEBAR } from "@/lib/constants";
export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";
type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="[--header-height:--spacing(14)]">
      <SidebarProvider className="flex flex-col min-h-screen bg-background">
        <UserDashboardHeader />
        {/* <NewsTicker /> */}
        <div className="flex flex-row">
          <AppSidebar navigation={DASHBOARD_SIDEBAR} />
          {/* <BackButton /> */}
          <SidebarInset className="flex-1 overflow-y-auto py-4 px-4 md:px-12 md-py-10" >
            {/* <AppBreadcrumb /> */}
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
