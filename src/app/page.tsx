import Link from "next/link";
import Image from "next/image";
import type { AccentToken } from "@/types/accent";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

/* Where a card sends you. `case` is the generic case-study route; `external`
   opens a live artefact when the case study does not exist yet; `none` renders
   a card that is deliberately not clickable. Swapping a project between the
   three is a one-line change in the data below. */
type ProjectLink =
  | { kind: "case"; slug: string }
  | { kind: "external"; href: string; label: string }
  | { kind: "none"; label: string };

type Project = {
  title: string;
  tags: string[];
  type: string;
  desc: string;
  accent: AccentToken;
  link: ProjectLink;
  /* Preview image. Without one the card falls back to the accent gradient. */
  thumb?: string;
};

const projects: Project[] = [
  {
    title: "Fluuen",
    tags: ["Design System", "Design Tokens", "AI SaaS", "Next.js"],
    type: "Personal product · Design system + AI product · 2026",
    desc: "A three-layer token architecture synced from Figma to code by a custom pipeline — and the AI agent product built on top of it to test whether the system held.",
    accent: "violet",
    /* Pointed at the Storybook until the case study existed. The case study now
       links all four artefacts — Figma, token repo, demo, Storybook — and frames
       them, which the bare Storybook link could not do. */
    link: { kind: "case", slug: "fluuen" },
    /* Capital C is the filename on disk. macOS would resolve "cover.png" too;
       Vercel's Linux filesystem would not, and it 404s only in production. */
    thumb: "/images/projects/fluuen/Cover.png",
  },
  {
    title: "Countersign",
    tags: ["AI UX", "Agent Governance", "Research", "Next.js"],
    type: "Personal product · AI agent governance · 2026",
    desc: "An AI agent that runs reads on its own, pauses after reversible writes, and stops for a human before destructive ones. Friction before or friction after, never both.",
    /* Warm off-white, not a hue: Countersign's surface reserves green, amber
       and red for safe / reversible / destructive, and a brand colour beside
       them would read as a fourth meaning. */
    accent: "bone",
    /* Was deliberately unlinked while /scenario had no fictional-data notice
       and the home page had nowhere to put one. The case study is that place:
       every CTA on it opens the demo next to a line that says Northbase is
       invented. */
    link: { kind: "case", slug: "countersign" },
    /* Captured 2026-08-18 by `_inbox/demo-capture/cover.mjs` in the Countersign
       repo: the real app, production build, Groq, driven over CDP — the same
       pipeline as the stills inside the case study. 2880x2160, exactly 4:3, so
       `object-cover` has nothing to crop.
       The state is the approval gate open and pending, with the reversible
       write from the step before it still undoable above: two of the three
       tiers in one frame, and the only thing on screen an ordinary admin panel
       would never show. */
    thumb: "/images/projects/countersign/cover.png",
  },
  {
    title: "Dashboard Design System",
    tags: ["Design System", "UI Kit", "Figma"],
    type: "Personal project · Atomic Design · 2021",
    desc: "A Figma design system for dashboard products — 49 component sets, 817 variants, used 1,600 times on Figma Community.",
    accent: "blue",
    link: { kind: "case", slug: "design-system" },
    thumb: "/images/projects/design-system/cover.png",
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
  const { title, tags, type, desc, accent, thumb, link } = project;
  const clickable = link.kind !== "none";

  /* A card that goes nowhere must not offer the affordances of one that does:
     no lift, no border change, no pointer. */
  const shell = `group flex flex-col border border-border bg-card ${
    clickable
      ? "hover:border-border-strong hover:-translate-y-0.5 transition-all duration-300"
      : ""
  }`;

  const body = (
    <>
      {/* Preview — cover image when the project has one, accent gradient when
          it does not. `alt` is empty on purpose: the card title right below
          already names the link, so a description here would be read twice. */}
      {/* Both ratios exist so a cover exported from a design file fits without
          cropping — the card takes the shape of the artwork, not the reverse.
          4:3 for the grid cards (the Design System cover is padded to it in its
          own background colour); 16:9 for the featured one, which was 21/9
          until the Fluuen cover arrived: at 21:9 the frame left so much empty
          space at the sides in Figma that the composition fell apart, and
          cropping a 16:9 cover into it cut the wordmark off the top and sliced
          the credits row in half. `object-cover` now has nothing to cut on
          either. A new cover has to match its card's ratio exactly. */}
      <div
        className={`relative overflow-hidden border-b border-border ${
          featured ? "aspect-16/9" : "aspect-4/3"
        }`}
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 1200px"
                : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 620px"
            }
          />
        ) : (
          <div className="accent-wash absolute inset-0" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 lg:p-8 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 border border-(--accent)/35 text-(--accent)/90"
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

        <span
          className={`font-mono text-xs mt-auto ${
            clickable
              ? "text-violet group-hover:text-violet-dim transition-colors duration-200"
              : "text-fg-faint"
          }`}
        >
          {link.kind === "case" ? "View case study →" : link.label}
        </span>
      </div>
    </>
  );

  if (link.kind === "case") {
    return (
      <Link href={`/work/${link.slug}`} data-accent={accent} className={shell}>
        {body}
      </Link>
    );
  }

  if (link.kind === "external") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        data-accent={accent}
        className={shell}
      >
        {body}
      </a>
    );
  }

  return (
    <article data-accent={accent} className={shell}>
      {body}
    </article>
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
        <div className="flex items-start gap-3 mb-10">
          <span className="w-6 h-px bg-violet shrink-0 mt-[0.55rem]" aria-hidden />
          {/* Wraps between segments, never mid-name: each segment is nowrap and
             the separator rides along with the first one so it can't lead a
             line. aria-hidden on the dot keeps the read-out a clean phrase. */}
          <span className="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase flex flex-wrap gap-x-2">
            <span className="whitespace-nowrap">
              Facundo Almir&oacute;n <span aria-hidden>&middot;</span>
            </span>
            <span className="whitespace-nowrap">Senior Product Designer</span>
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
            <ProjectCard key={project.title} project={project} />
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

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@byfma.com"
              className="inline-flex items-center px-5 py-2.5 bg-violet hover:bg-violet-dim text-white font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            >
              Email me
            </a>
            <a
              href="https://www.linkedin.com/in/fma82/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            >
              LinkedIn
            </a>
          </div>
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
        <ProofOfWork />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
