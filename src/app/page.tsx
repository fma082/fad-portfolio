/* ─── Nav ────────────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-base/90 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
        <a href="/" className="font-mono text-sm font-medium text-fg">
          fad<span className="text-violet">.design</span>
        </a>

        <nav className="flex items-center gap-8" aria-label="Main">
          {(["Work", "About", "Contact"] as const).map((label) => (
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

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-14"
    >
      <div className="max-w-screen-xl mx-auto w-full py-24 lg:py-32">
        {/* Label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-6 h-px bg-violet shrink-0" aria-hidden />
          <span className="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
            Senior Product Designer
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.05] tracking-tight text-fg max-w-4xl mb-8">
          I design the systems and interfaces that make{" "}
          <em className="text-violet italic">AI products</em> usable
        </h1>

        {/* Sub */}
        <p className="font-sans text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl mb-12">
          Design Systems, AI&thinsp;/&thinsp;SaaS interfaces, and
          design-to-code workflows — for products where complexity needs to feel
          simple.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center px-5 py-2.5 bg-violet hover:bg-violet-dim text-white font-mono text-xs tracking-widest uppercase transition-colors duration-200"
          >
            Get in touch
          </a>
          <a
            href="#work"
            className="inline-flex items-center px-5 py-2.5 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
          >
            View work
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
