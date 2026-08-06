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

/* Shared by every button on a case study page, so a new one cannot drift into
   its own size. Exported for the section action, which is a button elsewhere in
   the tree but has to match these exactly. */
export const BUTTON_BASE =
  "inline-flex items-center px-5 py-2.5 font-mono text-xs tracking-widest uppercase transition-colors duration-200";
const base = BUTTON_BASE;

/* Measured against every accent token, not just violet, because this component
   is shared by all case studies:
     accent as a border on canvas  →  4.76:1 (blue) … 13.38:1 (teal), all ≥ 3:1
     canvas as text on the fill    →  4.76:1 (blue) … 13.38:1 (teal), all ≥ 4.5:1
     white as text on the fill     →  1.48:1 … 4.16:1, fails on all six
   So the solid button carries dark text. White would be the instinct and would
   fail every accent in the set. */
const PRIMARY = `${base} bg-(--accent) text-canvas hover:opacity-90`;

/* Secondary buttons are neutral, everywhere on the site. The accent is reserved
   for the case study title and the demo CTAs; three accent-bordered buttons in
   one row spent it on the two links that matter least and left the primary with
   nothing to stand out against. The label carries the affordance — it is
   text-fg at full strength — so the border can stay quiet. */
export const SECONDARY_BUTTON =
  "border border-border-strong text-fg hover:bg-card-hover hover:border-fg-faint";
const SECONDARY = `${base} ${SECONDARY_BUTTON}`;

/* The one exception to the rule above: a button that IS a demo CTA keeps the
   accent. Outline rather than filled, so it stays below the hero's solid Live
   demo in the page's order of asks. The border runs at full accent strength —
   4.76:1 against canvas on the weakest accent in the set, over a 3:1 minimum.
   Do not dim it to /40: that drops it under the minimum. */
export const ACCENT_OUTLINE_BUTTON =
  "border border-(--accent) text-(--accent) hover:bg-(--accent)/10";

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
