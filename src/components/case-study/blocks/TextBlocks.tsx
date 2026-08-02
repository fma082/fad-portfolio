import type {
  SectionBlock,
  ProseBlock,
  DecisionBlock,
  TradeoffBlock,
  QuoteBlock,
} from "@/types/case-study";

/* Section intro — the heading and lead copy under a section divider. */
export function SectionIntro({ block }: { block: SectionBlock }) {
  if (!block.title && !block.body) return null;

  return (
    <div className="max-w-3xl">
      {block.title && (
        <h2 className="font-serif text-3xl lg:text-4xl text-fg mb-8 leading-tight">
          {block.title}
        </h2>
      )}
      {block.body && <Paragraphs body={block.body} />}
    </div>
  );
}

export function Prose({ block }: { block: ProseBlock }) {
  return (
    <div className="max-w-3xl">
      <Paragraphs body={block.body} />
    </div>
  );
}

export function DecisionBox({ block }: { block: DecisionBlock }) {
  return (
    <div className="max-w-3xl border-l-2 border-(--accent) bg-(--accent)/5 pl-6 pr-5 py-5">
      <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-(--accent) mb-3">
        {block.title}
      </h3>
      <p className="font-sans text-base text-fg-muted leading-relaxed">
        {block.body}
      </p>
    </div>
  );
}

export function TradeoffBox({ block }: { block: TradeoffBlock }) {
  return (
    <div className="max-w-3xl border border-amber/25 bg-amber/5 rounded-lg px-6 py-5">
      <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber mb-3">
        {block.title}
      </h3>
      <p className="font-sans text-base text-fg-muted leading-relaxed">
        {block.body}
      </p>
    </div>
  );
}

export function Quote({ block }: { block: QuoteBlock }) {
  return (
    <figure className="max-w-3xl">
      <blockquote className="font-serif text-2xl lg:text-3xl text-fg leading-snug">
        {block.text}
      </blockquote>
      {block.source && (
        <figcaption className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mt-5">
          {block.source}
        </figcaption>
      )}
    </figure>
  );
}

function Paragraphs({ body }: { body: string[] }) {
  return (
    <div className="flex flex-col gap-5">
      {body.map((paragraph, i) => (
        <p
          key={i}
          className="font-sans text-base text-fg-muted leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
