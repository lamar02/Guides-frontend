import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guides.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Guides.ai - Transform PDFs into Smart Installation Guides",
    template: "%s | Guides.ai",
  },
  description:
    "Transform your PDF manuals into personalized, step-by-step installation guides powered by AI. Get clear instructions tailored to your needs in seconds.",
  keywords: [
    "installation guide",
    "PDF to guide",
    "AI guide generator",
    "smart manual",
    "product setup",
    "user manual",
    "step by step guide",
    "guide d'installation",
    "manuel utilisateur",
  ],
  authors: [{ name: "Guides.ai" }],
  creator: "Guides.ai",
  publisher: "Guides.ai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "fr_FR",
    url: siteUrl,
    siteName: "Guides.ai",
    title: "Guides.ai - Transform PDFs into Smart Installation Guides",
    description:
      "Transform your PDF manuals into personalized, step-by-step installation guides powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Guides.ai - Smart Installation Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guides.ai - Transform PDFs into Smart Installation Guides",
    description:
      "Transform your PDF manuals into personalized, step-by-step installation guides powered by AI.",
    images: ["/og-image.png"],
    creator: "@guidesai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
