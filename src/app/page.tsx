/* ─── Icons (geometric, no SVG, no emoji) ────────────────────────────────── */

/* Token scale matrix — represents Primitives → Semantics → Components */
function DesignSystemsIcon() {
  return (
    <div className="flex gap-1.5">
      {[
        ["bg-violet/60", "bg-violet/30"],
        ["bg-violet/40", "bg-violet/20"],
        ["bg-violet/20", "bg-violet/10"],
      ].map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1.5">
          {col.map((cls, ri) => (
            <span key={ri} className={`block w-2.5 h-2.5 ${cls}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* Streaming text lines — violet line = active cursor / response */
function AIInterfaceIcon() {
  const lines: { w: string; cls: string }[] = [
    { w: "w-10", cls: "bg-fg-muted/50" },
    { w: "w-7",  cls: "bg-fg-muted/30" },
    { w: "w-10", cls: "bg-fg-muted/50" },
    { w: "w-5",  cls: "bg-violet/70"   },
  ];
  return (
    <div className="flex flex-col gap-2">
      {lines.map(({ w, cls }, i) => (
        <span key={i} className={`block h-px ${w} ${cls}`} />
      ))}
    </div>
  );
}

/* Two frames offset — Figma layer → code component */
function DesignToCodeIcon() {
  return (
    <div className="relative w-10 h-8">
      <span className="absolute top-0 left-0 w-6 h-6 border border-fg-muted/40" />
      <span className="absolute bottom-0 right-0 w-6 h-6 border border-violet/60" />
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

type Pillar = {
  title: string;
  Icon: () => React.JSX.Element;
  body: string;
};

const pillars: Pillar[] = [
  {
    title: "Design Systems",
    Icon: DesignSystemsIcon,
    body: "Token architectures (Primitives → Semantics → Components) that scale across features and teams. Every component documented, every state accounted for, every token traceable from Figma to code.",
  },
  {
    title: "AI Interface Design",
    Icon: AIInterfaceIcon,
    body: "The patterns that make AI interactions intuitive — loading states, streaming responses, agent orchestration dashboards. I catalog, study, and implement what works across the industry.",
  },
  {
    title: "Design-to-Code",
    Icon: DesignToCodeIcon,
    body: "Bridging Figma and production. I work with developers' tools — tokens, variables, component APIs — speak their language, and ensure what ships matches what was designed.",
  },
];

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

/* ─── What I Do ──────────────────────────────────────────────────────────── */
function WhatIDo() {
  return (
    <section id="what-i-do" className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-center gap-5 h-16">
          <span className="font-mono text-xs text-fg-faint tabular-nums select-none">
            01
          </span>
          <span className="flex-1 h-px bg-border" aria-hidden />
          <span className="font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">
            What I do
          </span>
        </div>

        {/* Grid — 1-col on mobile, 3-col with vertical dividers on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
          {pillars.map(({ title, Icon, body }) => (
            <article
              key={title}
              className="group p-8 lg:p-12 hover:bg-raised transition-colors duration-300"
            >
              {/* Icon */}
              <div className="mb-8 h-8 flex items-center">
                <Icon />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-fg mb-4 leading-snug">
                {title}
              </h3>

              {/* Body */}
              <p className="font-sans text-sm text-fg-muted leading-relaxed">
                {body}
              </p>
            </article>
          ))}
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
        <WhatIDo />
      </main>
    </>
  );
}
