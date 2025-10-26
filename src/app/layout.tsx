import type { Metadata } from "next";
import {  Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>
          <Toaster position="top-right" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
};

export { metadata };
export default Layout;
