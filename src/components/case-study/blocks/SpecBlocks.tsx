import type {
  TokenTableBlock,
  ComponentInventoryBlock,
  VariantMatrixBlock,
  SpecListBlock,
} from "@/types/case-study";

/* Spec-sheet blocks. They render extracted design-system data directly, so a
   reader compares real numbers instead of squinting at a screenshot.
   All four are dense by design: mono, small, tabular. Every one collapses to a
   single stacked column below `sm`/`lg` rather than scrolling sideways. */

/* ─── Token table ────────────────────────────────────────────────────────── */

/* One row per ramp: the ramp name on the left, its stops wrapping on the right.
   Token names are printed verbatim and allowed to wrap — never truncated —
   because the point is to show exactly what ships in the published file. */
export function TokenTable({ block }: { block: TokenTableBlock }) {
  return (
    <div>
      {block.title && (
        <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-5">
          {block.title}
        </h3>
      )}

      <div className="border-y border-border">
        {block.groups.map((group) => (
          <div
            key={group.name}
            className="grid grid-cols-1 lg:grid-cols-[9rem_minmax(0,1fr)] gap-x-8 gap-y-4 border-t border-border first:border-t-0 py-6"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-(--accent) lg:pt-1">
              {group.name}
            </p>

            <div className="grid gap-x-6 gap-y-4 grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]">
              {group.tokens.map((token) => (
                <div key={token.name} className="flex items-start gap-3 min-w-0">
                  <span
                    aria-hidden
                    className="h-8 w-8 shrink-0 rounded ring-1 ring-inset ring-border-strong"
                    style={{ background: token.value }}
                  />
                  <div className="min-w-0 pt-0.5">
                    <p className="font-mono text-[10px] leading-snug text-fg break-words">
                      {token.name}
                    </p>
                    <p className="font-mono text-[10px] leading-snug text-fg-faint tabular-nums">
                      {token.value}
                    </p>
                    {token.note && (
                      <p className="font-mono text-[10px] leading-snug text-amber/80 mt-1">
                        {token.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Component inventory ────────────────────────────────────────────────── */

export function ComponentInventory({
  block,
}: {
  block: ComponentInventoryBlock;
}) {
  const showInstances = block.sets.some((set) => set.instances !== undefined);
  /* Header and rows share one track definition so the columns line up. */
  const columns = showInstances
    ? "lg:grid-cols-[minmax(0,1fr)_5rem_5rem]"
    : "lg:grid-cols-[minmax(0,1fr)_5rem]";

  return (
    <div>
      {block.summary && (
        <p className="font-mono text-[11px] text-fg-muted mb-5">
          {block.summary}
        </p>
      )}

      <div className="border-y border-border">
        {/* Column headers only make sense once the row is a grid. */}
        <div
          className={`hidden lg:grid ${columns} gap-x-8 py-3 border-b border-border`}
        >
          <Header>Component set</Header>
          <Header align="right">Variants</Header>
          {showInstances && <Header align="right">Instances</Header>}
        </div>

        {/* The header is the container's first child, so `first:` would never
            match row zero — the rule border is skipped by index instead. */}
        {block.sets.map((set, i) => (
          <div
            key={`${set.name}-${i}`}
            className={`grid grid-cols-1 ${columns} gap-x-8 gap-y-3 py-4 ${
              i === 0 ? "" : "border-t border-border"
            }`}
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-fg break-words">{set.name}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {set.properties.map((property) => (
                  <span
                    key={property.name}
                    title={property.options.join(" · ")}
                    className="inline-flex items-baseline gap-1 font-mono text-[10px] px-2 py-0.5 border border-border text-fg-muted"
                  >
                    {property.name}
                    <span className="text-fg-faint tabular-nums">
                      {property.options.length}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile keeps the numbers inline with their own labels. */}
            <div className="flex gap-6 lg:contents">
              <Figure label="variants" value={set.variants} accent />
              {showInstances && (
                <Figure label="instances" value={set.instances ?? 0} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <p
      className={`font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </p>
  );
}

function Figure({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <p className="font-mono text-xs tabular-nums lg:text-right">
      <span className={accent ? "text-(--accent)" : "text-fg-muted"}>
        {value}
      </span>
      <span className="text-fg-faint lg:hidden"> {label}</span>
    </p>
  );
}

/* ─── Variant matrix ─────────────────────────────────────────────────────── */

/* The headline is the contrast: what the full cartesian product would have
   been, against what was actually built. Axes and rationale come after it. */
export function VariantMatrix({ block }: { block: VariantMatrixBlock }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="px-6 lg:px-8 py-4 border-b border-border">
        <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint">
          {block.title}
        </h3>
      </div>

      <div className="px-6 lg:px-8 py-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 text-center">
        <Count value={block.theoretical} label="Full matrix" />
        <Arrow />
        <Count value={block.built} label="Variants built" accent />
      </div>

      <div className="border-t border-border px-6 lg:px-8 py-6">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-4">
          {block.axes.length} properties
        </p>
        <div className="flex flex-col gap-3">
          {block.axes.map((axis) => (
            <div
              key={axis.name}
              className="grid grid-cols-1 sm:grid-cols-[9rem_minmax(0,1fr)] gap-x-6 gap-y-1.5"
            >
              <p className="font-mono text-[11px] text-fg break-words">
                {axis.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {axis.options.map((option) => (
                  <span
                    key={option}
                    className="font-mono text-[10px] px-2 py-0.5 border border-border text-fg-muted"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-6 lg:px-8 py-5">
        <p className="font-sans text-sm text-fg-muted leading-relaxed">
          {block.note}
        </p>
      </div>
    </div>
  );
}

function Count({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-mono font-medium leading-none tabular-nums text-[clamp(2.75rem,8vw,4.5rem)] ${
          accent ? "text-(--accent)" : "text-fg-faint"
        }`}
      >
        {value}
      </p>
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mt-3">
        {label}
      </p>
    </div>
  );
}

/* Hand-drawn arrow — rotates to point down once the counts stack. */
function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 16"
      className="w-10 h-4 shrink-0 text-fg-faint rotate-90 sm:rotate-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 8h37" />
      <path d="M31 2.5 38 8l-7 5.5" />
    </svg>
  );
}

/* ─── Spec list ──────────────────────────────────────────────────────────── */

export function SpecList({ block }: { block: SpecListBlock }) {
  return (
    <div className="border-y border-border">
      {block.items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-1 border-t border-border first:border-t-0 py-3"
        >
          <p className="font-mono text-[11px] text-fg-muted break-words">
            {item.label}
          </p>
          <p className="font-mono text-[11px] text-fg tabular-nums sm:text-right">
            {item.value}
          </p>
          {item.note && (
            <p className="font-mono text-[10px] text-fg-faint sm:col-span-2">
              {item.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
