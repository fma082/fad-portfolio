import Link from "next/link";

/* ─── Utility ────────────────────────────────────────────────────────────── */

function hexToRgb(hex: string): string {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(", ");
}

/* ─── SectionHeader (reused across all sections) ─────────────────────────── */

function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-5 h-16">
      <span className="font-mono text-xs text-fg-faint tabular-nums select-none">
        {num}
      </span>
      <span className="flex-1 h-px bg-border" aria-hidden />
      <span className="font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">
        {label}
      </span>
    </div>
  );
}

/* ─── Icons (geometric divs) ─────────────────────────────────────────────── */

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

function DesignToCodeIcon() {
  return (
    <div className="relative w-10 h-8">
      <span className="absolute top-0 left-0 w-6 h-6 border border-fg-muted/40" />
      <span className="absolute bottom-0 right-0 w-6 h-6 border border-violet/60" />
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

type Pillar = { title: string; Icon: () => React.JSX.Element; body: string };

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

type Project = {
  slug: string;
  title: string;
  tags: string[];
  type: string;
  desc: string;
  accent: string;
};

const projects: Project[] = [
  {
    slug: "next-agent",
    title: "Next Agent",
    tags: ["AI SaaS", "Design System", "Next.js", "Product Design"],
    type: "AI Agent Orchestration Platform · Personal product · Design + Dev",
    desc: "A platform where teams deploy, monitor, and orchestrate multiple AI agents from a single dashboard.",
    accent: "#8B7BF4",
  },
  {
    slug: "ai-interface-patterns",
    title: "AI Interface Patterns",
    tags: ["AI UX", "Research", "Pattern Library"],
    type: "Research catalog · 50+ patterns · 10 categories",
    desc: "A comprehensive catalog of interface patterns for AI products — from initial CTAs to orchestration dashboards.",
    accent: "#5EEAD4",
  },
  {
    slug: "deftboard-design-system",
    title: "Deftboard Design System",
    tags: ["Design System", "UI Kit", "Figma"],
    type: "Personal project · Atomic Design · 2022",
    desc: "A complete Figma Design System built from first principles — 2,443+ likes on Behance.",
    accent: "#3C76F1",
  },
  {
    slug: "bloyal-design-system",
    title: "bLoyal Design System",
    tags: ["Design System", "B2B SaaS", "Design QA"],
    type: "Client work · AI Loyalty Platform · In production",
    desc: "Token architecture, component audits, and Design QA for an AI-powered CRM platform.",
    accent: "#34D399",
  },
];

type ToolGroup = { label: string; tools: string[] };

const toolGroups: ToolGroup[] = [
  {
    label: "Design",
    tools: ["Figma", "Figma Variables", "Tokens Studio", "FigJam"],
  },
  {
    label: "Process",
    tools: ["Design QA", "Jira", "Confluence", "Agile/Scrum"],
  },
  {
    label: "Code",
    tools: ["Next.js", "Tailwind CSS", "shadcn/ui", "TypeScript"],
  },
  {
    label: "AI",
    tools: ["Claude", "Figma MCP", "Claude Code", "Cursor"],
  },
];

/* ─── ProjectCard ────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const { slug, title, tags, type, desc, accent } = project;
  const rgb = hexToRgb(accent);

  return (
    <Link
      href={`/work/${slug}`}
      className="group flex flex-col border border-border bg-card hover:border-border-strong hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Preview — gradient placeholder, swap for Image later */}
      <div
        style={{
          aspectRatio: featured ? "21 / 9" : "16 / 9",
          background: `linear-gradient(135deg, rgba(${rgb}, 0.14) 0%, rgba(${rgb}, 0.04) 65%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 lg:p-8 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 border"
              style={{
                borderColor: `rgba(${rgb}, 0.35)`,
                color: `rgba(${rgb}, 0.9)`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3
          className={`font-serif text-fg leading-snug ${
            featured ? "text-2xl lg:text-[1.75rem]" : "text-xl"
          }`}
        >
          {title}
        </h3>

        <p className="font-mono text-[11px] text-fg-faint leading-relaxed">
          {type}
        </p>

        <p className="font-sans text-sm text-fg-muted leading-relaxed line-clamp-2 flex-1">
          {desc}
        </p>

        <span className="font-mono text-xs text-violet group-hover:text-violet-dim transition-colors duration-200 mt-auto">
          View case study →
        </span>
      </div>
    </Link>
  );
}

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
        <div className="flex items-center gap-3 mb-10">
          <span className="w-6 h-px bg-violet shrink-0" aria-hidden />
          <span className="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
            Senior Product Designer
          </span>
        </div>

        <h1 className="font-serif text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.05] tracking-tight text-fg max-w-4xl mb-8">
          I design the systems and interfaces that make{" "}
          <em className="text-violet italic">AI products</em> usable
        </h1>

        <p className="font-sans text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl mb-12">
          Design Systems, AI&thinsp;/&thinsp;SaaS interfaces, and
          design-to-code workflows — for products where complexity needs to feel
          simple.
        </p>

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
        <SectionHeader num="01" label="What I do" />

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
          {pillars.map(({ title, Icon, body }) => (
            <article
              key={title}
              className="group p-8 lg:p-12 hover:bg-raised transition-colors duration-300"
            >
              <div className="mb-8 h-8 flex items-center">
                <Icon />
              </div>
              <h3 className="font-serif text-xl text-fg mb-4 leading-snug">
                {title}
              </h3>
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

/* ─── Proof of Work ──────────────────────────────────────────────────────── */

function ProofOfWork() {
  const [featured, ...rest] = projects;

  return (
    <section id="work" className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <SectionHeader num="02" label="Proof of work" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16 lg:pb-24">
          <div className="md:col-span-2">
            <ProjectCard project={featured} featured />
          </div>
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <SectionHeader num="03" label="About" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-16 lg:py-20 border-t border-border">

          {/* Left — bio text */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] text-fg leading-tight">
              10+ years turning complex products into usable systems.
            </h2>

            <div className="flex flex-col gap-5">
              <p className="font-sans text-base text-fg-muted leading-relaxed">
                I started in web design and gradually moved deeper into product —
                from pixels to systems, from screens to architectures. Today I
                specialize in B2B SaaS products where the challenge is making
                genuinely complex tools feel manageable.
              </p>
              <p className="font-sans text-base text-fg-muted leading-relaxed">
                My approach is pragmatic. I care about consistency, edge cases,
                accessibility, and whether what I design can actually be built
                without friction. I document, I QA, I think in tokens and states
                — not just happy paths.
              </p>
              <p className="font-sans text-base text-fg-muted leading-relaxed">
                Currently exploring the intersection of design and AI: how we
                build interfaces for products that think, respond, and sometimes
                fail — and how Design Systems need to evolve to support those
                patterns.
              </p>
            </div>

            <p className="font-mono text-xs text-fg-faint tracking-wider">
              Based in Argentina · Working with international teams
            </p>
          </div>

          {/* Right — tools box */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 flex flex-col gap-6">

              {/* Box header */}
              <div className="pb-4 border-b border-border">
                <span className="font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
                  Tools &amp; Stack
                </span>
              </div>

              {/* Tool groups */}
              {toolGroups.map(({ label, tools }) => (
                <div key={label} className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] tracking-widest text-fg-faint uppercase">
                    {label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="font-mono text-[11px] px-2.5 py-1 bg-raised border border-border rounded text-fg-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────── */

function Contact() {
  return (
    <section id="contact" className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <SectionHeader num="04" label="Contact" />

        <div className="border-t border-border py-20 lg:py-28 flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-fg leading-tight">
            Let&apos;s build something{" "}
            <em className="text-violet italic">useful</em>.
          </h2>

          <p className="font-sans text-base text-fg-muted leading-relaxed max-w-lg">
            Available for freelance contracts, consulting, and product design
            roles — especially if you&apos;re building something with AI.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:hello@fad.design"
              className="inline-flex items-center px-5 py-2.5 bg-violet hover:bg-violet-dim text-white font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            >
              Email me
            </a>
            <a
              href="#"
              className="inline-flex items-center px-5 py-2.5 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="inline-flex items-center px-5 py-2.5 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            >
              Upwork
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */

function Footer() {
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

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatIDo />
        <ProofOfWork />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
