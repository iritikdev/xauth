import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/app/providers/query-provider";
import AppLoader from "@/components/Loader";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const metadata: Metadata = {
  title: "Amaze Ayurveda Pvt. Ltd.",
  description: "Embrace Wellness Naturally",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <QueryProvider>
          <SessionProvider>
            <AppLoader>
              <Toaster position="bottom-right" />
              {children}
            </AppLoader>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export { metadata };
export default Layout;
