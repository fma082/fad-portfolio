import Image from "next/image";
import { imageSize } from "@/lib/image-size";

export type ImageFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
  sizes?: string;
};

export function ImageFrame({
  src,
  alt,
  caption,
  tag,
  sizes = "(max-width: 768px) 100vw, 1200px",
}: ImageFrameProps) {
  /* The frame takes the shape of the image instead of forcing one. A fixed
     ratio letterboxed anything that was not 16:9 — dashboard captures are
     nearly square, and documentation sheets are far taller than they are wide. */
  const { width, height } = imageSize(src);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="block w-full h-auto"
      />

      {/* Caption bar */}
      {(caption || tag) && (
        <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-border">
          <span className="font-mono text-xs text-fg-muted">
            {caption ?? ""}
          </span>
          {tag && (
            <span className="font-mono text-[10px] px-2.5 py-0.5 border border-(--accent)/40 text-(--accent)/90 shrink-0">
              {tag}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
