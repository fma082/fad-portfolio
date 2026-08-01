import Link from "next/link";

function CaseNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-canvas/90 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
        <Link href="/" className="font-mono text-sm font-medium text-fg">
          fad<span className="text-violet">.design</span>
        </Link>
        <Link
          href="/#work"
          className="font-mono text-xs text-fg-muted hover:text-fg uppercase tracking-widest transition-colors duration-200"
        >
          ← Work
        </Link>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
        <span className="font-mono text-xs text-fg-faint">
          © 2026 Facundo Almirón
        </span>
        <span className="font-mono text-xs text-fg-faint">
          Built with <span className="text-violet">Next.js</span> +{" "}
          <span className="text-violet">Tailwind</span> · Deployed on{" "}
          <span className="text-violet">Vercel</span>
        </span>
      </div>
    </footer>
  );
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CaseNav />
      {children}
      <SiteFooter />
    </>
  );
}
