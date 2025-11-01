import { AppSidebar } from '@/components/app-sidebar'
import AppBreadcrumb from '@/components/breadcrumb';
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";
type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="[--header-height:--spacing(14)]">
      <SidebarProvider className="flex flex-col min-h-screen bg-background">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-y-auto mx-6 my-8">
            <AppBreadcrumb />
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default Layout