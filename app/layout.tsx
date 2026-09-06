import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://rongostay.co.ke"),
  title: {
    default: "RongoStay | Find Student Housing Easily",
    template: "%s | RongoStay",
  },
  description: "Search, discover, and secure affordable student rentals and housing options around campus.",
  verification: {
    google: "w7PzgVHUesNwMVx4mxMmPv4n9LLejT4eGMNgJrKrJIc",
  },
  openGraph: {
    title: "RongoStay | Find Student Housing Easily",
    description: "Search, discover, and secure affordable student rentals and housing options around campus.",
    url: "https://rongostay.co.ke",
    siteName: "RongoStay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RongoStay Student Housing Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RongoStay | Find Student Housing Easily",
    description: "Search, discover, and secure affordable student rentals around campus.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        
        {/* GLOBAL NAVBAR */}
        <Navbar />

        {/* MAIN PAGE CONTENT STREAM */}
        <div className="flex-1">
          {children}
        </div>
        
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}