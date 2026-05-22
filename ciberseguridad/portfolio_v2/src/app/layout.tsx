import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucas Méndez Díez | Telecom & Cybersecurity Engineer",
  description:
    "FP Superior en STI · Ciberseguridad · Infraestructura de Redes y Telecomunicaciones. Python, Java, C/C++, fibra óptica, sistemas críticos.",
  openGraph: {
    title: "Lucas Méndez Díez | Telecom & Cybersecurity",
    description:
      "FP Superior en STI especializado en ciberseguridad y telecomunicaciones.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg text-text antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
