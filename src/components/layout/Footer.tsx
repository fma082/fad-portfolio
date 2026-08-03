export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
        <span className="font-mono text-xs text-fg-faint">
          © 2026 Facundo Almirón
        </span>
        <span className="font-mono text-xs text-fg-faint">
          Built with{" "}
          <span className="text-violet">Next.js</span>
          {" "}+{" "}
          <span className="text-violet">Tailwind</span>
          {" · "}Deployed on{" "}
          <span className="text-violet">Vercel</span>
        </span>
      </div>
    </footer>
  );
}
