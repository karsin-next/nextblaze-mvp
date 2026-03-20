import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { FeedbackBubble } from "@/components/FeedbackBubble";

// We keep Outfit font to maintain the premium SaaS feel while conforming to the navy/gold colors
const outfit = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "FundabilityOS | AI-Powered Investor Readiness",
  description: "Scale your deep tech across Asia. FundabilityOS provides an AI FundabilityOS to assess and optimize your capital readiness, backed by RM 60.8M value created.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.className} bg-[#f2f6fa] text-[#022f42] antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-1 w-full flex flex-col">
             {children}
          </main>
          <Footer />
          <FeedbackBubble />
        </AuthProvider>
      </body>
    </html>
  );
}

