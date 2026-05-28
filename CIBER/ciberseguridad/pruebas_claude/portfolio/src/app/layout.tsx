import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = GeistSans({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Lucas Méndez — Telecommunications & Systems",
  description: "Junior telecommunications student building practical experience. Networking, fiber optics, cybersecurity labs, systems infrastructure.",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body className="bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
