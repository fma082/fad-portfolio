import type {
  BugFlowBlock,
  TierGridBlock,
  EvidenceTableBlock,
  TierTone,
} from "@/types/case-study";

/* Blocks for a case study about what an agent is allowed to do: the defect
   that opened it, the three tiers that answer it, and the failures that
   pressure-tested them.

   These are the only blocks on the site where colour carries meaning rather
   than identity. Countersign's accent is a warm off-white, precisely so that
   green, amber and red can mean safe, reversible and destructive here without
   competing with a brand hue. */

/* ─── Inline emphasis ────────────────────────────────────────────────────── */

/* Prose does not parse markdown and this does not either. `fragment` is matched
   as a verbatim substring and split on once; anything else renders as plain
   text. It exists because in these three blocks the emphasised clause IS the
   content — the red half of the punchline, the tier's rule, the shape of a fix
   — and a paragraph that leans on position instead would lose the argument. */
function Emphasise({
  text,
  fragment,
  className,
}: {
  text: string;
  fragment?: string;
  className: string;
}) {
  const at = fragment ? text.indexOf(fragment) : -1;
  if (at === -1 || !fragment) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <strong className={`font-medium ${className}`}>{fragment}</strong>
      {text.slice(at + fragment.length)}
    </>
  );
}

/* ─── Bug flow ───────────────────────────────────────────────────────────── */

const STEP_BOX =
  "flex-1 min-w-0 rounded-[10px] bg-card px-4 py-4 text-center";
const STEP_LABEL =
  "font-mono text-[10px] tracking-[0.1em] uppercase text-fg-faint";

/* Two boxes and an arrow. The distance between them is one hop by name, and
   the layout says so: no intermediate step, no branch, no legend. Below `md`
   the row stacks and the arrow turns to point down — the same treatment
   TokenChain gives its own chain. */
export function BugFlow({ block }: { block: BugFlowBlock }) {
  const { asked, reached, punchline } = block;

  return (
    <div className="rounded-2xl border border-border bg-raised p-6 lg:p-9">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 mb-6">
        <div className={`${STEP_BOX} border border-border-strong`}>
          <p className={STEP_LABEL}>{asked.label}</p>
          <p className="font-mono text-sm text-fg mt-2 break-words">
            {asked.value}
          </p>
        </div>

        <span
          aria-hidden
          className="self-center text-fg-faint text-lg md:px-4 rotate-90 md:rotate-0"
        >
          →
        </span>

        <div className={`${STEP_BOX} border border-red`}>
          <p className={STEP_LABEL}>{reached.label}</p>
          <p className="font-mono text-sm text-red mt-2 break-words">
            {reached.value}
          </p>
        </div>
      </div>

      <p className="border-t border-border pt-5 font-sans text-base text-fg leading-relaxed">
        <Emphasise
          text={punchline.body}
          fragment={punchline.emphasis}
          className="text-red"
        />
      </p>
    </div>
  );
}

/* ─── Tier grid ──────────────────────────────────────────────────────────── */

/* The block never learns a colour: it is handed a meaning and looks the token
   up here. A tier arriving with a hex would be the regression this map exists
   to prevent. */
const TONE: Record<TierTone, string> = {
  safe: "text-green",
  reversible: "text-amber",
  destructive: "text-red",
};

/* Three columns divided by rules rather than boxed as cards: the tiers are one
   scale read left to right, and three separate cards would read as three
   unrelated options. The first and last cells drop their outer padding so the
   row starts and ends on the same vertical as every frame on the page. */
export function TierGrid({ block }: { block: TierGridBlock }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
      {block.tiers.map((tier, i) => (
        <div
          key={tier.label}
          className={`py-5 md:py-6 border-b border-border md:border-b-0 md:border-r md:last:border-r-0 md:px-6 md:first:pl-0 md:last:pr-0 ${
            i === block.tiers.length - 1 ? "border-b-0" : ""
          }`}
        >
          <span
            className={`block font-mono text-[10px] tracking-[0.1em] uppercase mb-3 ${TONE[tier.tone]}`}
          >
            {tier.label}
          </span>
          <p className="font-sans text-sm text-fg-muted leading-relaxed">
            <Emphasise
              text={tier.body}
              fragment={tier.emphasis}
              className="text-fg"
            />
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─── Evidence table ─────────────────────────────────────────────────────── */

/* Two columns, and there is no third on purpose. The case study's claim is
   that a fix is a change to the tool surface, so the column a reader expects
   between them — the root cause, the prompt that was tightened — is exactly
   the one that does not exist. */
export function EvidenceTable({ block }: { block: EvidenceTableBlock }) {
  const headings = block.headings ?? {
    failure: "The failure",
    fix: "The fix",
  };

  return (
    <div className="border-t border-border">
      {block.rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-border"
        >
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-red mb-2">
              {headings.failure}
            </p>
            <p className="font-sans text-[15px] text-fg-muted leading-relaxed">
              <Emphasise
                text={row.failure}
                fragment={row.failureEmphasis}
                className="text-fg"
              />
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-fg mb-2">
              {headings.fix}
            </p>
            <p className="font-sans text-[15px] text-fg-muted leading-relaxed">
              <Emphasise
                text={row.fix}
                fragment={row.fixEmphasis}
                className="text-fg"
              />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
