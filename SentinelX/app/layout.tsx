import "./globals.css";
import type { Metadata } from "next";
import * as React from "react";
import { Providers } from "@/components/providers/providers";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth/next";

export const metadata: Metadata = {
  title: "SentinelX – Cyber Security Operations",
  description:
    "Defensive, educational Security Operations Center dashboard. Visualizes assets, vulnerabilities, threat intelligence, attack paths, incidents, and security posture.",
  applicationName: "SentinelX",
  authors: [{ name: "SentinelX Maintainers" }],
  keywords: ["soc", "blue team", "cybersecurity", "dashboard", "defensive"],
  themeColor: "#05070d",
  robots: { index: false, follow: false } // portfolio demo
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

