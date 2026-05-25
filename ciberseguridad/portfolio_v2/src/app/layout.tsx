import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Lucas Méndez Díez | Telecomunicaciones y Ciberseguridad",
  description:
    "FP Superior STI · Ciberseguridad, Redes e Infraestructura Crítica. Python, C, JavaScript, fibra óptica, sistemas de telecomunicaciones.",
  openGraph: {
    title: "Lucas Méndez Díez | Telecom & Cybersecurity",
    description:
      "FP Superior en STI especializado en ciberseguridad, redes y telecomunicaciones.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-bg text-text antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
