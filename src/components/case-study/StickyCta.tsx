"use client";

import { useEffect, useState } from "react";

export type StickyCtaProps = {
  label: string;
  cta: string;
  href: string;
};

/* Fixed to the bottom for the whole scroll. It appears once the hero is behind
   the reader — before that the hero's own Live demo button is on screen and a
   second copy of it would be noise. Dismissible, because a bar that cannot be
   closed is the thing people remember about a page. */
export function StickyCta({ label, cta, href }: StickyCtaProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      }`}
    >
      <div className="border-t border-border bg-raised/95 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-fg-muted truncate">
            {label}
          </p>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-widest uppercase text-(--accent) hover:text-fg px-3 py-1.5 transition-colors duration-200"
            >
              {cta}
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="text-fg-faint hover:text-fg p-1.5 transition-colors duration-200"
            >
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
