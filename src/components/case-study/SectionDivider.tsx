export function SectionDivider({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-5 h-16">
      <span className="font-mono text-xs text-fg-faint tabular-nums select-none">
        {num}
      </span>
      <span className="flex-1 h-px bg-border" aria-hidden />
      <span className="font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">
        {label}
      </span>
    </div>
  );
}
