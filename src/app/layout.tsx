import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GamificationProvider } from '@/contexts/GamificationContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quitt Dashboard",
  description: "Moderne Rauchstopp-App mit Apple-inspiriertem Design",
  keywords: ["Rauchen aufhören", "Gesundheit", "Motivation", "Rauchstopp"],
  authors: [{ name: "Quitt Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 font-sans`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <GamificationProvider>
            {children}
          </GamificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
