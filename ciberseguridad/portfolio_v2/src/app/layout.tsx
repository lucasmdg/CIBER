import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUCAS_SYS — Telecommunications & Systems",
  description:
    "Active systems portfolio. FP Superior STI. Cybersecurity, networking, fiber optics, infrastructure. Still learning.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "LUCAS_SYS — Telecommunications & Systems",
    description:
      "Live operations terminal. Cybersecurity labs, networking infrastructure, and telecom systems.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="bg-bg text-text antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
