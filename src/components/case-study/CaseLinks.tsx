import type { CaseLinks as CaseLinksType } from "@/types/case-study";

const LABELS: Record<keyof CaseLinksType, string> = {
  figma: "Figma file",
  github: "Repository",
  tokens: "Token repo",
  live: "Live demo",
  storybook: "Storybook",
  behance: "Behance",
};

/* First present key wins the solid treatment; the rest are outlined. */
const ORDER = ["live", "figma", "storybook", "tokens", "github", "behance"] as const;

const base =
  "inline-flex items-center px-5 py-2.5 font-mono text-xs tracking-widest uppercase transition-colors duration-200";

/* Measured against every accent token, not just violet, because this component
   is shared by all case studies:
     accent as a border on canvas  →  4.76:1 (blue) … 13.38:1 (teal), all ≥ 3:1
     canvas as text on the fill    →  4.76:1 (blue) … 13.38:1 (teal), all ≥ 4.5:1
     white as text on the fill     →  1.48:1 … 4.16:1, fails on all six
   So the solid button carries dark text. White would be the instinct and would
   fail every accent in the set. */
const PRIMARY = `${base} bg-(--accent) text-canvas hover:opacity-90`;
const SECONDARY = `${base} border border-(--accent) text-(--accent) hover:bg-(--accent)/10`;

/* Renders nothing when a case study has no links, so a case with an empty
   `links` object is visually unchanged. */
export function CaseLinks({ links }: { links: CaseLinksType }) {
  const present = ORDER.filter((key) => links[key]);
  if (present.length === 0) return null;

  return (
    /* The meta row above already carries the top spacing. */
    <div className="flex flex-wrap gap-3 pb-8">
      {present.map((key, i) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className={i === 0 ? PRIMARY : SECONDARY}
        >
          {LABELS[key]}
        </a>
      ))}
    </div>
  );
}
