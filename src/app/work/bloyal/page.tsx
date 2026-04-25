import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "bLoyal Design System — Facundo Almirón",
};

export default function BloyalPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-14">
      <div className="text-center">
        <p className="font-mono text-[10px] tracking-[0.2em] text-fg-faint uppercase mb-4">
          Case study
        </p>
        <h1 className="font-serif text-4xl text-fg mb-3">bLoyal Design System</h1>
        <p className="font-mono text-xs text-fg-muted mb-8">Coming soon.</p>
        <Link
          href="/#work"
          className="font-mono text-xs text-violet hover:text-violet-dim transition-colors"
        >
          ← Back to work
        </Link>
      </div>
    </main>
  );
}
