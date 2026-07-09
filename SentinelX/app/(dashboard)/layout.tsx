import * as React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { Shell } from "@/components/layout/shell";
import { KeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;
  if (!session) redirect("/login");
  const s = session as any;
  return (
    <Shell user={{ name: s.user?.name ?? undefined, role: s.user?.role }}>
      <KeyboardShortcuts />
      {children}
    </Shell>
  );
}

