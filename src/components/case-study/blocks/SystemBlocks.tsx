import type {
  TokenChainBlock,
  CodePeekBlock,
  DivergenceTableBlock,
  LinkOutBlock,
  CtaBlock,
} from "@/types/case-study";

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

/* Two values per row, side by side, neither presented as the correct one. The
   category and status carry the judgement instead. */
export function DivergenceTable({ block }: { block: DivergenceTableBlock }) {
  return (
    <div>
      {block.summary && (
        <p className="font-mono text-[11px] text-fg-muted mb-5">
          {block.summary}
        </p>
      )}

      <div className="border-y border-border">
        {block.rows.map((row, i) => (
          <div
            key={`${row.item}-${i}`}
            className={`py-5 ${i === 0 ? "" : "border-t border-border"}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-4">
              <p className="font-mono text-xs text-fg break-words lg:pt-px">
                {row.item}
              </p>
              <Side label="In code" value={row.code} at={row.codeAt} />
              <Side label="In Figma" value={row.figma} at={row.figmaAt} />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="font-mono text-[10px] px-2 py-0.5 border border-border text-fg-muted">
                {row.category}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 border border-(--accent)/40 text-(--accent)">
                {row.status}
              </span>
            </div>

            {row.note && (
              <p className="font-sans text-sm text-fg-muted leading-relaxed mt-3 max-w-3xl">
                {row.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Side({
  label,
  value,
  at,
}: {
  label: string;
  value: string;
  at?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-1.5">
        {label}
      </p>
      <p className="font-mono text-[11px] text-fg-muted break-words leading-snug">
        {value}
      </p>
      {at && (
        <p className="font-mono text-[10px] text-fg-faint break-all leading-snug mt-1">
          {at}
        </p>
      )}
    </div>
  );
}

/* ─── Link out ───────────────────────────────────────────────────────────── */

/* An artefact linked where it is being discussed, rather than in the hero. The
   border is the accent at full strength — measured at 4.76:1 against canvas on
   the weakest accent in the set, against a 3:1 minimum for non-text UI. */
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
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-(--accent) text-(--accent) hover:bg-(--accent)/10 font-mono text-xs tracking-widest uppercase transition-colors duration-200"
      >
        {block.label}
        <span aria-hidden>↗</span>
      </a>
    </div>
  );
}

/* ─── Inline CTA ─────────────────────────────────────────────────────────── */

/* Deliberately not a button. It sits inside the reading column right after the
   evidence that earns it, so it reads as the next sentence rather than as an
   advertisement interrupting one. */
export function Cta({ block }: { block: CtaBlock }) {
  return (
    <p className="max-w-3xl font-sans text-base text-fg-muted leading-relaxed">
      {block.body}{" "}
      <a
        href={block.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm tracking-wide text-(--accent) underline decoration-(--accent)/30 underline-offset-4 hover:decoration-(--accent) transition-colors duration-200 whitespace-nowrap"
      >
        {block.label}
      </a>
    </p>
  );
}
