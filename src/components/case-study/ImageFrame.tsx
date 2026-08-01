import Image from "next/image";

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
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Image container — object-contain shows full screenshot without crop */}
      <div className="relative w-full bg-card" style={{ aspectRatio: "16 / 9" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes={sizes}
        />
      </div>

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
