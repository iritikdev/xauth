import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";


export const metadata: Metadata = {
  title: "Shop Ayurvedic Products",
  description:
    "Browse Amaze Ayurveda's premium collection of Ayurvedic medicines, herbal juices, health supplements, personal care, and wellness products. Made with trusted herbal ingredients for a healthier lifestyle.",

  keywords: [
    "Buy Ayurvedic Products",
    "Ayurvedic Medicine",
    "Herbal Juice",
    "Health Supplements",
    "Natural Wellness",
    "Organic Herbal Products",
    "Amaze Ayurveda",
    "Ayurveda Store",
    "Personal Care",
    "Made in India",
  ],

  alternates: {
    canonical: "/shop",
  },

  openGraph: {
    title: "Shop Premium Ayurvedic Products | Amaze Ayurveda",
    description:
      "Discover authentic Ayurvedic products crafted with premium herbal ingredients. Shop health supplements, herbal juices, wellness, and personal care products.",
    url: "https://amazeayurveda.in/shop",
    images: [
      {
        url: "/og-shop.jpg",
        width: 1200,
        height: 630,
        alt: "Amaze Ayurveda Shop",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Premium Ayurvedic Products | Amaze Ayurveda",
    description:
      "Explore premium Ayurvedic products for natural health and wellness.",
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