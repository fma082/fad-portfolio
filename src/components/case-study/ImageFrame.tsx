import Image from "next/image";
import { hexToRgb } from "@/lib/utils";

export type ImageFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
  accent?: string;
  sizes?: string;
};

export function ImageFrame({
  src,
  alt,
  caption,
  tag,
  accent = "#8B7BF4",
  sizes = "(max-width: 768px) 100vw, 1200px",
}: ImageFrameProps) {
  const rgb = hexToRgb(accent);

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
            <span
              className="font-mono text-[10px] px-2.5 py-0.5 border shrink-0"
              style={{
                borderColor: `rgba(${rgb}, 0.4)`,
                color: `rgba(${rgb}, 0.9)`,
              }}
            >
              {tag}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
