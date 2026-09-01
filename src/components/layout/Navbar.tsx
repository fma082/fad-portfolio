import Link from "next/link";

const LINKS = ["Work", "About", "Contact"] as const;

/* Fixed top bar. The section links are same-page anchors, so this only works
   on routes that render those sections — today, the home page. */
export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-canvas/90 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
        <Link href="/" className="font-mono text-sm font-medium text-fg">
          <span className="text-fg-faint">by</span>fma
        </Link>

        <nav className="flex items-center gap-8" aria-label="Main">
          {LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="font-mono text-xs tracking-widest text-fg-muted uppercase hover:text-fg transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
