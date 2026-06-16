"use client";
import * as React from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center">
      <div className="glass p-8 text-center">
        <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-400">The defensive SOC caught an unexpected error.</p>
        <code className="mt-3 block text-xs text-danger">{error.message}</code>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-md border border-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/5"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
