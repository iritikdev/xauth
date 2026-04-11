import { AppSidebar } from "@/components/app-sidebar";
import AppBreadcrumb from "@/components/breadcrumb";
import { UserDashboardHeader } from "@/components/user-dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ADMIN_SIDEBAR } from "@/lib/constants";
import React, { ReactNode } from "react";

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
        <div className="flex flex-row">
          <AppSidebar  navigation={ADMIN_SIDEBAR}/>
          {/* <BackButton /> */}
          <SidebarInset className="bg-[#FAFAFA] flex-1 overflow-y-auto  px-4 py-4 sm:px-12 sm:py-10">
            {/* <AppBreadcrumb /> */}
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
