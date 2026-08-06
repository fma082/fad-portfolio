import type {
  TokenChainBlock,
  CodePeekBlock,
  DivergenceTableBlock,
  LinkOutBlock,
  CtaBlock,
} from "@/types/case-study";
import { SECONDARY_BUTTON } from "../CaseLinks";

/* Blocks for a case study about a system rather than a surface: an alias chain
   resolved hop by hop, a source excerpt with the decision it encodes, and a
   two-column divergence table. Like the spec blocks, they are mono, small and
   dense, and they stack rather than scroll sideways. */

/* ─── Token chain ────────────────────────────────────────────────────────── */

/* One chain, four boxes, read left to right. Names are the readable form, not
   the Figma path they were flattened from — the path is what the pipeline
   consumes, and printing it here would make the reader do the flattening.
   Below `md` the row becomes a column and the arrow turns to point down. */
export function TokenChain({ block }: { block: TokenChainBlock }) {
  const last = block.steps.length - 1;

  return (
    <div>
      {block.title && (
        <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-5">
          {block.title}
        </h3>
      )}

      <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0">
        {block.steps.map((step, i) => (
          <div key={step.layer} className="contents">
            <div className="flex-1 min-w-0 border border-border rounded-lg bg-card px-4 py-4">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint">
                {step.layer}
              </p>
              <p
                className={`font-mono text-[13px] mt-2 break-words leading-snug ${
                  i === last ? "text-(--accent)" : "text-fg"
                }`}
              >
                {step.name}
              </p>
              {step.detail && (
                <p className="font-mono text-[11px] text-fg-muted mt-1 break-words leading-snug">
                  {step.detail}
                </p>
              )}
              {i === last && (
                <span
                  aria-hidden
                  className="block h-6 w-full mt-3 rounded ring-1 ring-inset ring-border-strong"
                  style={{ background: step.name }}
                />
              )}
            </div>
            {i < last && <ChainArrow />}
          </div>
        ))}
      </div>

      {block.caption && (
        <p className="font-sans text-sm text-fg-muted leading-relaxed mt-5 max-w-3xl">
          {block.caption}
        </p>
      )}
    </div>
  );
}

/* Rotated to point down once the boxes stack. */
function ChainArrow() {
  return (
    <div className="flex items-center justify-center shrink-0 md:px-2 py-1 md:py-0">
      <svg
        aria-hidden
        viewBox="0 0 24 12"
        className="w-5 h-3 text-fg-faint rotate-90 md:rotate-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 6h21" />
        <path d="M17 1.5 22.5 6 17 10.5" />
      </svg>
    </div>
  );
}

/* ─── Code peek ──────────────────────────────────────────────────────────── */

/* No syntax highlighting on purpose: it would need a parser dependency, and the
   excerpts are read for the shape of the decision, not for the syntax. The code
   is the one place on the site allowed to scroll sideways — wrapping it would
   destroy the indentation that carries the meaning. */
export function CodePeek({ block }: { block: CodePeekBlock }) {
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="px-5 lg:px-6 py-3 border-b border-border flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-mono text-[11px] text-fg-muted break-all">
          {block.file}
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint tabular-nums">
          {block.lines}
        </p>
      </div>

      <div className="px-5 lg:px-6 pt-5">
        <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-(--accent)">
          {block.title}
        </h3>
      </div>

      <div className="px-5 lg:px-6 py-5 overflow-x-auto">
        <pre className="font-mono text-[11px] leading-relaxed text-fg-muted">
          <code>{block.code}</code>
        </pre>
      </div>

      {block.decision && (
        <p className="px-5 lg:px-6 py-4 border-t border-border font-sans text-sm text-fg-muted leading-relaxed">
          {block.decision}
        </p>
      )}
    </div>
  );
}

/* ─── Divergence table ───────────────────────────────────────────────────── */

/* Both sides side by side, neither presented as the correction of the other.
   The pill carries the judgement; the file location carries the evidence. No
   prose per row — the section's own paragraph does that work. */
export function DivergenceTable({ block }: { block: DivergenceTableBlock }) {
  return (
    <div>
      {block.summary && (
        <p className="font-mono text-[11px] text-fg-muted mb-5">
          {block.summary}
        </p>
      )}

      {/* One grid for the table, `subgrid` rows inside it. Each row used to
          declare its own tracks, so the `auto` pill column was measured per
          row — three different pill widths meant the two value columns started
          at a different x in every row. Sharing one track list is what makes
          the columns line up; the rows stay separate elements because each one
          carries its own top border. */}
      <div className="border-y border-border lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-x-6">
        {block.rows.map((row, i) => (
          <div
            key={`${row.item}-${i}`}
            className={`grid grid-cols-1 lg:grid-cols-subgrid lg:col-span-4 gap-x-6 gap-y-3 py-5 items-start ${
              i === 0 ? "" : "border-t border-border"
            }`}
          >
            <p className="font-mono text-xs text-fg break-words lg:pt-px">
              {row.item}
            </p>
            <Side value={row.code} at={row.codeAt} swatch={row.codeSwatch} />
            <Side value={row.figma} at={row.figmaAt} swatch={row.figmaSwatch} />
            {/* Left-aligned, not right: the shared track is exactly as wide as
                the widest pill, so starting them together puts all three on one
                vertical and still ends the table on the table's right edge. */}
            <span className="font-mono text-[10px] tracking-[0.05em] uppercase px-2 py-1 rounded bg-(--accent)/10 text-(--accent) justify-self-start whitespace-nowrap">
              {row.pill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The swatch gutter is reserved on every row, occupied or not, and the file
   location sits in the same column as the value above it. With the swatch
   inline, a row without one started its value 22px to the left of the rows
   with one, and the location started 22px to the left of its own value — three
   different left edges in a table whose whole job is comparing two columns. */
function Side({
  value,
  at,
  swatch,
}: {
  value: string;
  at?: string;
  swatch?: string;
}) {
  return (
    <div className="min-w-0 grid grid-cols-[0.875rem_minmax(0,1fr)] gap-x-2">
      {swatch ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 mt-px rounded-sm ring-1 ring-inset ring-border-strong"
          style={{ background: swatch }}
        />
      ) : (
        <span aria-hidden />
      )}
      <p className="font-mono text-[11px] text-fg-muted break-words leading-snug">
        {value}
      </p>
      {at && (
        <p className="col-start-2 font-mono text-[10px] text-fg-faint break-all leading-snug mt-1">
          {at}
        </p>
      )}
    </div>
  );
}

/* ─── Link out ───────────────────────────────────────────────────────────── */

/* An artefact linked where it is being discussed, rather than in the hero. It
   takes the same neutral treatment as the hero's secondary buttons — it is not
   a demo CTA, and the accent is reserved for those. */
export function LinkOut({ block }: { block: LinkOutBlock }) {
  return (
    <div className="max-w-3xl">
      {block.body && (
        <p className="font-sans text-base text-fg-muted leading-relaxed mb-5">
          {block.body}
        </p>
      )}
      <a
        href={block.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${SECONDARY_BUTTON}`}
      >
        {block.label}
        <span aria-hidden>↗</span>
      </a>
    </div>
  );
}

/* ─── Inline CTA ─────────────────────────────────────────────────────────── */

/* A tinted panel, not a sentence: it interrupts the reading column on purpose,
   placed right after the evidence that earns it. The button carries dark text
   on the accent fill — white fails 4.5:1 on every accent in the set, these
   being light hues on a near-black canvas.

   Full width, not `max-w-3xl`: it follows a full-width capture, and a panel
   stopping short of the image above it read as a mistake rather than as a
   narrower measure. Prose keeps its reading width; this is not prose. */
export function Cta({ block }: { block: CtaBlock }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-(--accent)/20 bg-(--accent)/[0.06] px-6 py-5">
      {block.body && (
        <p className="font-sans text-[15px] text-fg leading-relaxed text-center sm:text-left">
          {block.body}
        </p>
      )}
      <a
        href={block.href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center justify-center rounded-md bg-(--accent) text-canvas font-mono text-xs tracking-[0.08em] px-5 py-2.5 hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
      >
        {block.label}
      </a>
    </div>
  );
}
