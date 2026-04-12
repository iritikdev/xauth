import { Metadata } from "next";

import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
  title: "Order Summary | Amaze Ayurveda",
  description: "Review your order details and business volume rewards before confirming.",
};

export default function CheckoutLayout({
  children,
  
}: {
  children: React.ReactNode;
  
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <AppHeader />
      
     

      {/* ── Main Checkout Content ── */}
      <main>
        {children}
      </main>
    </div>
  );
}