import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/app/providers/query-provider";
import AppLoader from "@/components/Loader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
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
        className={`${inter.className} ${poppins.variable} antialiased`}
      >
        <QueryProvider>
        <SessionProvider>
          <AppLoader>
            <Toaster position="top-right" />
            
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
