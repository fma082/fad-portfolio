type Stat = { value: string; label: string };

type Meta = {
  role: string;
  type: string;
  year: string;
  tools: string;
};

export type CaseHeroProps = {
  tags: string[];
  /* Fragments wrapped in *asterisks* render in the accent colour. */
  title: string;
  subtitle: string;
  meta: Meta;
  stats: Stat[];
  /* Slot under the meta row, used for the external links. */
  children?: React.ReactNode;
};

/* Odd indices are the emphasised fragments once split on the markers. */
function renderTitle(title: string) {
  return title.split("*").map((fragment, i) =>
    i % 2 === 1 ? (
      <em key={i} className="italic text-(--accent)">
        {fragment}
      </em>
    ) : (
      fragment
    ),
  );
}

export function CaseHero({
  tags,
  title,
  subtitle,
  meta,
  stats,
  children,
}: CaseHeroProps) {
  return (
    <section className="border-b border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32">

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2.5 py-1 border border-border text-fg-faint"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(2rem,5.5vw,4.25rem)] leading-[1.05] tracking-tight text-fg max-w-4xl mb-6">
          {renderTitle(title)}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base lg:text-lg text-fg-muted leading-relaxed max-w-2xl mb-10">
          {subtitle}
        </p>

        {/* Meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 border-t border-border pt-6 pb-8">
          {(["role", "type", "year", "tools"] as const).map((key) => (
            <div key={key}>
              <p className="font-mono text-[10px] text-fg-faint uppercase tracking-widest mb-1.5">
                {key}
              </p>
              <p className="font-sans text-sm text-fg">{meta[key]}</p>
            </div>
          ))}
        </div>

        {children}

        {/* Stats bar — auto-fit so four or five stats both sit on one row.
            The figures are plain text-fg: size and the mono face already make
            them the loudest thing in the row, and the accent is spent on the
            title and the demo CTAs instead. */}
        <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] divide-x divide-border border-t border-border -mx-6 lg:-mx-12 px-6 lg:px-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-6 px-3 first:pl-0 last:pr-0">
              <p className="font-mono text-2xl lg:text-3xl font-medium leading-none mb-1.5 text-fg">
                {value}
              </p>
              <p className="font-mono text-[10px] text-fg-faint uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
