import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
    title: "Shop Sanctuary | Amaze Ayurveda",
    description: "Explore our premium range of Swadeshi formulations. Every purchase empowers your health and expands your business volume.",
    openGraph: {
        title: "Botanical Sanctuary Shop - Amaze Ayurveda",
        images: ["/og-shop.jpg"],
    },
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#fcfdfc]">
            <AppHeader />




            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    );
}