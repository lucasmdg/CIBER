import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucas Méndez Díez | Estudiante de Ciberseguridad",
  description:
    "Estudiante de Telecomunicaciones e Informática orientado a la ciberseguridad. Python, Java, JavaScript. Aprendizaje continuo.",
  openGraph: {
    title: "Lucas Méndez Díez | Estudiante de Ciberseguridad",
    description:
      "Estudiante de Telecomunicaciones e Informática orientado a la ciberseguridad.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <LoadingScreen />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
