"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FigmaEmbedBlock } from "@/types/case-study";

/* Figma's embed iframe is heavy — it loads the real editor. It is mounted only
   once the block reaches the viewport, so a case study that is never scrolled
   to the bottom never pays for it. The placeholder reserves the same height,
   so nothing shifts when the swap happens. */

/* www.figma.com/design/… → embed.figma.com/design/…?embed-host=share */
function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hostname = "embed.figma.com";
    parsed.searchParams.set("embed-host", "share");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function FigmaEmbed({ block }: { block: FigmaEmbedBlock }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const height = block.height ?? 640;
  const embedUrl = useMemo(() => toEmbedUrl(block.url), [block.url]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Without IntersectionObserver the iframe simply mounts on the next frame.
       Deferred rather than immediate so the first paint stays consistent with
       what the server rendered. */
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint">
          Figma — Live file
        </span>
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-(--accent) hover:text-fg transition-colors duration-200 shrink-0"
        >
          Open in Figma
        </a>
      </div>

      <div ref={ref} style={{ height }} className="w-full bg-raised">
        {visible ? (
          <iframe
            src={embedUrl}
            title={block.caption ?? "Figma file"}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint">
              Loading embed…
            </span>
          </div>
        )}
      </div>

      {block.caption && (
        <figcaption className="px-5 py-3 border-t border-border font-mono text-xs text-fg-muted">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
