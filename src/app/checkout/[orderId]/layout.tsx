import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Order Summary | Amaze Ayurveda",
  description: "Review your order details and business volume rewards before confirming.",
};

export default function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orderId: string };
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
     

      {/* ── Main Checkout Content ── */}
      <main className="py-10">
        {children}
      </main>
    </div>
  );
}