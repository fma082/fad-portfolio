import type { CaseLinks as CaseLinksType } from "@/types/case-study";

const LABELS: Record<keyof CaseLinksType, string> = {
  figma: "Figma file",
  github: "Repository",
  tokens: "Token repo",
  live: "Live demo",
  storybook: "Storybook",
  behance: "Behance",
};

const ORDER = ["live", "figma", "tokens", "storybook", "github", "behance"] as const;

/* Renders nothing when a case study has no links, so a case with an empty
   `links` object is visually unchanged. */
export function CaseLinks({ links }: { links: CaseLinksType }) {
  const present = ORDER.filter((key) => links[key]);
  if (present.length === 0) return null;

  return (
    /* The meta row above already carries the top spacing. */
    <div className="flex flex-wrap gap-3 pb-8">
      {present.map((key) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-2.5 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
        >
          {LABELS[key]}
        </a>
      ))}
    </div>
  );
}
