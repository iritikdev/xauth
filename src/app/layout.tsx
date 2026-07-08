import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/components/providers/query-provider";
import AppLoader from "@/components/ui/Loader";
import SessionWatcher from "@/components/SessionWatcher";
import ShutdownPage from "@/components/home/Shutdown";
import Script from "next/script";

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
    default: "Amaze Ayurveda | Premium Ayurvedic Products & Natural Wellness",
    template: "%s | Amaze Ayurveda",
  },

  description:
    "Discover premium Ayurvedic medicines, herbal juices, health supplements, personal care, and wellness products from Amaze Ayurveda. Experience authentic Ayurveda for a healthier lifestyle.",

  keywords: [
    "Amaze Ayurveda",
    "Ayurvedic Products",
    "Ayurvedic Medicine",
    "Herbal Products",
    "Natural Wellness",
    "Health Supplements",
    "Herbal Juice",
    "Organic Healthcare",
    "Ayurveda India",
    "Made in India",
  ],

  authors: [
    {
      name: "Amaze Ayurveda Pvt. Ltd.",
      url: "https://amazeayurveda.in",
    },
  ],

  creator: "Amaze Ayurveda Pvt. Ltd.",
  publisher: "Amaze Ayurveda Pvt. Ltd.",

  category: "Health & Wellness",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://amazeayurveda.in",
    siteName: "Amaze Ayurveda",

    title: "Amaze Ayurveda | Premium Ayurvedic Products",

    description:
      "Experience authentic Ayurvedic wellness with premium herbal products, health supplements, herbal juices, and personal care solutions.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amaze Ayurveda - Premium Ayurvedic Wellness",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Amaze Ayurveda | Premium Ayurvedic Wellness",

    description:
      "Discover authentic Ayurvedic products for natural health and wellness.",

    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Amaze Ayurveda Pvt. Ltd.",
    "url": "https://amazeayurveda.in",
    "logo": "https://amazeayurveda.in/amaze-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9204260719", // Update with actual number
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/amazeayurveda",
      "https://instagram.com/amazeayurveda"
    ]
  };
 
   if (process.env.NEXT_PUBLIC_SITE_STATUS === "SHUTDOWN") {
  return (
    <html lang="en" className={`${inter.variable} `}>
       <body className="font-sans antialiased bg-[#fcfdfc]">
        <ShutdownPage />
       </body>
    </html>
  );
}

  return (
    <html lang="en" className={`${inter.variable} `}>
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
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}