import type {
  MetricsBlock,
  CardGridBlock,
  ChipsBlock,
} from "@/types/case-study";
import { atomicIcons } from "../icons/atomic";

/* Accent-framed callout. One item fills the box; several share it as a row. */
export function Metrics({ block }: { block: MetricsBlock }) {
  return (
    <div className="rounded-xl border border-(--accent)/25 bg-(--accent)/5 p-10 lg:p-16 text-center">
      <div className="grid gap-10 sm:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
        {block.items.map(({ value, label, note }) => (
          <div key={label}>
            <p
              className="font-mono font-medium leading-none mb-3 text-(--accent)"
              style={{
                fontSize:
                  block.items.length === 1
                    ? "clamp(4rem, 10vw, 7rem)"
                    : "clamp(2.5rem, 5vw, 3.5rem)",
              }}
            >
              {value}
            </p>
            <p className="font-mono text-sm text-fg-muted">{label}</p>
            {note && (
              <p className="font-mono text-xs text-fg-faint mt-2">{note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGrid({ block }: { block: CardGridBlock }) {
  const icons = block.icons === "atomic" ? atomicIcons : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border">
      {block.items.map(({ num, title, body }, i) => {
        const Icon = icons[i];
        return (
          <div key={title} className="p-8 lg:p-10 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-fg-faint tabular-nums">
                {num}
              </span>
              {Icon && (
                <div className="h-6 flex items-center">
                  <Icon />
                </div>
              )}
            </div>
            <h3 className="font-serif text-lg text-fg">{title}</h3>
            <p className="font-sans text-sm text-fg-muted leading-relaxed">
              {body}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function Chips({ block }: { block: ChipsBlock }) {
  return (
    <div className="max-w-3xl flex flex-wrap gap-2">
      {block.items.map(({ label, value }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 border border-border bg-card"
        >
          <span className="text-fg">{label}</span>
          <span className="text-fg-faint">{value}</span>
        </span>
      ))}
    </div>
  );
}
