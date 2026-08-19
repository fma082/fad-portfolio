import { imageSize } from "@/lib/image-size";

export type VideoFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
};

/* Same shell as ImageFrame, because it is the same thing to the reader: a
   frame that takes the shape of its source and carries a caption bar.

   Why video and not a GIF: the recording it replaces was a 2.6 MB GIF of the
   same ten seconds. As H.264 it is 1.0 MB, decoded on the GPU, and it needs
   none of the `unoptimized` handling a GIF does — next/image never sees it.

   `width`/`height` come from the track header at build time, so the element
   reserves its own height and nothing below it jumps when the file loads.
   Muted + playsinline are what make autoplay legal on iOS and in Chrome; both
   are structural here rather than preferences, so neither is a prop. */
export function VideoFrame({ src, alt, caption, tag }: VideoFrameProps) {
  const { width, height } = imageSize(src);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Silent screen recording: no audio track to caption. What a reader who
          cannot see it needs is the description, which is on `aria-label` and
          repeated in the caption bar below. */}
      <video
        src={src}
        width={width}
        height={height}
        autoPlay
        loop
        muted
        playsInline
        aria-label={alt}
        className="block w-full h-auto"
      />

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
