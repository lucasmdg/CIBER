import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center">
      <div className="glass p-8 text-center">
        <h1 className="text-2xl font-semibold text-white">404 — Lost in the SOC</h1>
        <p className="mt-2 text-sm text-slate-400">The page you requested is not available.</p>
        <Link href="/dashboard" className="mt-4 inline-block rounded-md border border-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/5">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
