import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "NextBlaze | Fundability OS",
  description: "The AI-powered system to become investor-ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans min-h-screen text-slate-50 antialiased selection:bg-blaze-500/30 selection:text-blaze-100`}>
        {children}
      </body>
    </html>
  );
}
