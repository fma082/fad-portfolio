import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

export type CaseFooterProps = {
  href: string;
  title: string;
  cta: string;
};

export function CaseFooter({ href, title, cta }: CaseFooterProps) {
  return (
    <ScrollReveal>
      <section className="border-t border-border bg-raised">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-20 lg:py-28 text-center">
          <p className="font-mono text-[10px] tracking-[0.2em] text-fg-faint uppercase mb-5">
            Next case study
          </p>
          <h2 className="font-serif text-3xl lg:text-[2.5rem] text-fg mb-8 leading-tight">
            {title}
          </h2>
          <Link
            href={href}
            className="inline-flex items-center px-6 py-3 border border-border hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs tracking-widest uppercase transition-colors duration-200"
          >
            {cta}
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
}
