import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/app/providers/query-provider";
import AppLoader from "@/components/Loader";
import SessionWatcher from "@/components/SessionWatcher";

// Inter for body, Manrope for premium headlines
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const viewport: Viewport = {
  themeColor: "#1c3320",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://amazeayurveda.in"),
  title: {
    default: "Amaze Ayurveda | Authentic Swadeshi Wellness",
    template: "%s | Amaze Ayurveda"
  },
  description: "Amaze Ayurveda offers authentic Ayurvedic formulations. Join our Swadeshi movement for natural wellness and financial growth. Based in Bihar, serving Bharat.",
  keywords: ["Ayurveda", "Swadeshi Products", "Herbal Wellness", "Amaze Ayurveda", "Organic Health Bihar", "MLM Business India"],
  authors: [{ name: "Amaze Ayurveda Pvt. Ltd." }],
  creator: "Amaze Ayurveda Team",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://amazeayurveda.in",
    title: "Amaze Ayurveda | Rooted in Bharat",
    description: "Pure Ayurvedic products crafted for your wellness and prosperity.",
    siteName: "Amaze Ayurveda",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this in your public folder
        width: 1200,
        height: 630,
        alt: "Amaze Ayurveda Branding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaze Ayurveda",
    description: "Embrace Wellness Naturally with Swadeshi Power.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Structured Data for Google (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Amaze Ayurveda Pvt. Ltd.",
    "url": "https://amazeayurveda.in",
    "logo": "https://amazeayurveda.in/amaze-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX", // Update with actual number
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/amazeayurveda",
      "https://instagram.com/amazeayurveda"
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#fcfdfc]">
        <QueryProvider>
          <SessionProvider>
            <SessionWatcher />
            <AppLoader>
              <Toaster position="bottom-right" richColors />
              {children}
            </AppLoader>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}