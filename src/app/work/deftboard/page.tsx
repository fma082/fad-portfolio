import type { Metadata } from "next";
import Link from "next/link";
import { CaseHero } from "@/components/case-study/CaseHero";
import { ImageFrame } from "@/components/case-study/ImageFrame";
import { ImageGrid } from "@/components/case-study/ImageGrid";
import { SectionDivider } from "@/components/case-study/SectionDivider";
import { ScrollReveal } from "@/components/case-study/ScrollReveal";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const IMG = (name: string) =>
  `/images/projects/deftboard/${encodeURIComponent(name)}`;

export const metadata: Metadata = {
  title: "DeftBoard Design System — Facundo Almirón",
  description:
    "A complete Figma Design System built from first principles using Atomic Design methodology.",
};

/* ─── Section wrapper ────────────────────────────────────────────────────── */

function CaseSection({
  num,
  label,
  children,
}: {
  num: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <SectionDivider num={num} label={label} />
        {children}
      </div>
    </section>
  );
}

/* ─── Atomic Design icons ────────────────────────────────────────────────── */

function AtomIcon() {
  return <div className="w-7 h-7 rounded-full border-2 border-(--accent)/60" />;
}

function MoleculeIcon() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-(--accent)/50" />
      <span className="w-5 h-px bg-(--accent)/30" />
      <span className="w-4 h-4 rounded-full bg-(--accent)/35" />
      <span className="w-5 h-px bg-(--accent)/30" />
      <span className="w-3 h-3 rounded-full bg-(--accent)/20" />
    </div>
  );
}

function OrganismIcon() {
  return (
    <div className="flex flex-col gap-1 w-9">
      <span className="h-1.5 w-full rounded-sm bg-(--accent)/50" />
      <div className="flex gap-1">
        <span className="h-5 w-3 rounded-sm bg-(--accent)/25" />
        <span className="h-5 flex-1 rounded-sm bg-(--accent)/15" />
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const atomicLevels = [
  {
    num: "01",
    level: "Atoms",
    Icon: AtomIcon,
    desc: "Colors, typography, spacing, border radii, and icon library. The raw vocabulary every other decision inherits from.",
  },
  {
    num: "02",
    level: "Molecules",
    Icon: MoleculeIcon,
    desc: "Buttons, form inputs, badges, and tooltips — each with full variant and state coverage. The smallest reusable units with designed behavior.",
  },
  {
    num: "03",
    level: "Organisms",
    Icon: OrganismIcon,
    desc: "Navigation bars, data tables, and form sections. Complex components built from molecules with documented layout and interaction patterns.",
  },
];

const componentStats = [
  { name: "Buttons", count: "8 sizes × 5 states" },
  { name: "Text Inputs", count: "5 variants × 3 states" },
  { name: "Badges", count: "12+ variants" },
  { name: "Navigation", count: "3 components" },
  { name: "Tables", count: "5 configurations" },
  { name: "Graphics", count: "4 chart types" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function DeftboardPage() {
  return (
    /* data-accent feeds --accent to every descendant through the cascade */
    <main data-accent="blue">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <CaseHero
        tags={["Design System", "UI Kit", "Figma", "Atomic Design"]}
        title={
          <>
            DeftBoard: a complete{" "}
            <em className="italic text-(--accent)">Design System</em>{" "}
            built from first principles
          </>
        }
        subtitle="A comprehensive Figma Design System following Atomic Design methodology — from color primitives and typography scales to fully-documented components with all states, and production-ready screen templates."
        meta={{
          role: "Design System Designer",
          type: "Personal project",
          year: "2022",
          tools: "Figma",
        }}
        stats={[
          { value: "2,443+", label: "Behance likes" },
          { value: "10+",    label: "Component families" },
          { value: "100+",   label: "Variants documented" },
          { value: "4",      label: "Screen templates" },
        ]}
      />

      {/* ── 01 The Brief ─────────────────────────────────────────────────── */}
      <CaseSection num="01" label="The brief">
        <ScrollReveal>
          <div className="py-14 lg:py-20 max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
              Learning by building — a Design System from scratch
            </h2>
            <div className="flex flex-col gap-5">
              <p className="font-sans text-base text-fg-muted leading-relaxed">
                DeftBoard started as a personal initiative to understand design
                systems from the inside. Not by inheriting an existing one, but
                by building from the ground up — starting from color primitives
                and type decisions, ending with production-ready templates. The
                goal: develop both a working artifact and a reusable way of
                thinking about systems.
              </p>
              <p className="font-sans text-base text-fg-muted leading-relaxed">
                The structure follows Brad Frost&apos;s Atomic Design
                methodology, which provides a clear mental model for organizing
                design decisions. Atoms are the smallest indivisible elements —
                a color, a type style, a spacing value. Molecules combine atoms
                into functional units. Organisms assemble molecules into complex
                UI sections. This hierarchy makes the system legible, extensible,
                and traceable from token to template.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Atomic level cards */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border mb-16 lg:mb-20">
            {atomicLevels.map(({ num, level, Icon, desc }) => (
              <div key={level} className="p-8 lg:p-10 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono text-[10px] text-fg-faint tabular-nums"
                  >
                    {num}
                  </span>
                  <div className="h-6 flex items-center">
                    <Icon />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-fg">{level}</h3>
                <p className="font-sans text-sm text-fg-muted leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </CaseSection>

      {/* ── 02 Foundations ───────────────────────────────────────────────── */}
      <CaseSection num="02" label="Foundations">
        <ScrollReveal>
          <div className="py-14 lg:py-16 max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
              Every system starts with decisions about color, type, and space
            </h2>
            <p className="font-sans text-base text-fg-muted leading-relaxed">
              Before documenting a single component, the foundation requires
              explicit decisions. A color system needs primitive values that
              semantic tokens can reference. A type scale needs a ratio and base
              size that all text styles derive from. Getting these foundation
              layers right — and naming them consistently — is what makes the
              rest of the system coherent rather than coincidentally consistent.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-4 pb-16 lg:pb-20">
          <ScrollReveal delay={0.05}>
            <ImageFrame
              src={IMG("02 - Colors Styles.png")}
              alt="Color system — primitive and semantic tokens"
              caption="Color system"
              tag="Atom"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ImageFrame
              src={IMG("03 - Typography Desktop.png")}
              alt="Typography scale for desktop"
              caption="Typography scale"
              tag="Atom"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <ImageGrid
              left={{
                src: IMG("04 - Spacing & screen grid.png"),
                alt: "Spacing system and screen grid",
                caption: "Spacing & grid",
                tag: "Atom",
              }}
              right={{
                src: IMG("05 - Icons.png"),
                alt: "Icon library",
                caption: "Icon library",
                tag: "Atom",
              }}
            />
          </ScrollReveal>
        </div>
      </CaseSection>

      {/* ── 03 Components ────────────────────────────────────────────────── */}
      <CaseSection num="03" label="Components">
        <ScrollReveal>
          <div className="py-14 lg:py-16 max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
              Every state. Every variant. Documented.
            </h2>
            <p className="font-sans text-base text-fg-muted leading-relaxed mb-10">
              Component documentation means more than showing the default state.
              It means capturing error states, empty states, disabled states, and
              loading states — thinking about what happens at the extremes of
              content length and what the screen reader encounters. Each component
              family was built with that completeness as the bar.
            </p>

            {/* Component stat chips */}
            <div className="flex flex-wrap gap-2">
              {componentStats.map(({ name, count }) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 border border-border bg-card"
                >
                  <span className="text-fg">{name}</span>
                  <span className="text-fg-faint">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-4 pb-16 lg:pb-20">
          <ScrollReveal delay={0.05}>
            <ImageFrame
              src={IMG("06 - Buttons.png")}
              alt="Button component — all sizes and states"
              caption="Button variants"
              tag="Molecule"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ImageFrame
              src={IMG("07 - Text Input.png")}
              alt="Text input component — variants and states"
              caption="Text inputs"
              tag="Molecule"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <ImageGrid
              left={{
                src: IMG("08 - Badges.png"),
                alt: "Badge components",
                caption: "Badges",
                tag: "Molecule",
              }}
              right={{
                src: IMG("09 - Navigation.png"),
                alt: "Navigation components",
                caption: "Navigation",
                tag: "Organism",
              }}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <ImageGrid
              left={{
                src: IMG("10 - Tables.png"),
                alt: "Table component variants",
                caption: "Tables",
                tag: "Organism",
              }}
              right={{
                src: IMG("12 - Graphics.png"),
                alt: "Chart and graphic components",
                caption: "Graphics",
                tag: "Organism",
              }}
            />
          </ScrollReveal>
        </div>
      </CaseSection>

      {/* ── 04 Figma Craft ───────────────────────────────────────────────── */}
      <CaseSection num="04" label="Figma craft">
        <ScrollReveal>
          <div className="py-14 lg:py-16 max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
              Built for real use — variants, properties, and scalable structures
            </h2>
            <p className="font-sans text-base text-fg-muted leading-relaxed">
              Figma&apos;s component architecture can mirror good code practices:
              controlled props, hidden complexity, composable structures. Each
              component was built with variant groups that expose only the
              controls a designer needs — keeping the frame count manageable
              while preserving full design flexibility underneath.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-4 pb-16 lg:pb-20">
          <ScrollReveal delay={0.05}>
            <ImageFrame
              src={IMG("13 - Variants_02.png")}
              alt="Figma component variants structure"
              caption="Component variant architecture"
              tag="System"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ImageFrame
              src={IMG("14 Variantes_02.png")}
              alt="Figma component properties panel"
              caption="Property architecture"
              tag="System"
            />
          </ScrollReveal>
        </div>
      </CaseSection>

      {/* ── 05 System in Use ─────────────────────────────────────────────── */}
      <CaseSection num="05" label="The system in use">
        <ScrollReveal>
          <div className="py-14 lg:py-16 max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
              From atoms to screens
            </h2>
            <p className="font-sans text-base text-fg-muted leading-relaxed">
              The final test of any design system is whether it accelerates real
              design work. These screen templates use the full component library —
              from atomic text styles to organism-level navigation and data
              tables — demonstrating that a well-built system enables design at
              a different pace than composing from scratch every time.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="pb-16 lg:pb-20">
            <ImageFrame
              src={IMG("15 - Screen.png")}
              alt="Screen templates built with the design system"
              caption="Screen templates"
              tag="Templates"
            />
          </div>
        </ScrollReveal>
      </CaseSection>

      {/* ── 06 Impact ────────────────────────────────────────────────────── */}
      <CaseSection num="06" label="Impact">
        <ScrollReveal>
          <div className="py-14 lg:py-16 max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
              Community validation
            </h2>
          </div>
        </ScrollReveal>

        {/* Behance callout */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-(--accent)/25 bg-(--accent)/5 p-10 lg:p-16 text-center mb-12">
            <p
              className="font-mono font-medium leading-none mb-3 text-(--accent)"
              style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}
            >
              2,443+
            </p>
            <p className="font-mono text-sm text-fg-muted">
              Behance likes · Community appreciation
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-3xl flex flex-col gap-5 pb-16 lg:pb-20">
            <p className="font-sans text-base text-fg-muted leading-relaxed">
              Publishing DeftBoard on Behance was an experiment in making the
              work visible. The response revealed that systematic documentation
              resonates with designers who have experienced poorly-organized
              systems — or who are trying to build their first one. Over time,
              the project became a reference point for Atomic Design
              implementation in Figma.
            </p>
            <p className="font-sans text-base text-fg-muted leading-relaxed">
              These lessons carried directly into bLoyal. When I joined that
              project, I arrived with a clear methodology for token architecture,
              established documentation standards, and a tested approach to
              Design QA. The difference between inheriting a chaotic component
              library and knowing how to build one deliberately — that was built
              through DeftBoard.
            </p>
          </div>
        </ScrollReveal>
      </CaseSection>

      {/* ── Case CTA ─────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="border-t border-border bg-raised">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-20 lg:py-28 text-center">
            <p className="font-mono text-[10px] tracking-[0.2em] text-fg-faint uppercase mb-5">
              Next case study
            </p>
            <h2 className="font-serif text-3xl lg:text-[2.5rem] text-fg mb-8 leading-tight">
              Want to see how I work in production?
            </h2>
            <Link
              href="/work/bloyal"
              className="inline-flex items-center px-6 py-3 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            >
              View bLoyal case →
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
