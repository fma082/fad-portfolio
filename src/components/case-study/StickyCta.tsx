"use client";

import { useEffect, useState } from "react";

export type StickyCtaProps = {
  label: string;
  cta: string;
  href: string;
};

/* Fixed to the bottom once the hero is behind the reader. It is not
   dismissible: this is the page's primary call to action, and a CTA the reader
   can delete is a CTA that stops converting the moment it becomes mildly
   inconvenient.

   It appears after the hero rather than from the first pixel because the hero
   already carries a Live demo button — two copies of the same link on one
   screen read as noise, not as emphasis.

   The 56px of body padding that keeps it off the footer is set in globals.css,
   keyed off `body:has(...)`, so a page without the bar pays nothing. */
export function StickyCta({ label, cta, href }: StickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-sticky-cta
      className={`fixed inset-x-0 bottom-0 z-40 h-14 border-t border-border-strong bg-raised/92 backdrop-blur-md transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-screen-xl mx-auto h-full px-6 lg:px-12 flex items-center justify-center sm:justify-between gap-4">
        {/* Hidden below sm so the button can centre on its own. */}
        <p className="hidden sm:block font-mono text-xs tracking-wider text-fg-muted truncate">
          {label}
        </p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center rounded-md bg-(--accent) text-canvas font-mono text-xs tracking-[0.08em] px-4.5 py-2.5 hover:opacity-90 transition-opacity duration-200"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
