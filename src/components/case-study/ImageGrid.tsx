import { ImageFrame, type ImageFrameProps } from "./ImageFrame";

type ImageGridProps = {
  left: ImageFrameProps;
  right: ImageFrameProps;
};

const GRID_SIZES = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px";

export function ImageGrid({ left, right }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ImageFrame {...left} sizes={GRID_SIZES} />
      <ImageFrame {...right} sizes={GRID_SIZES} />
    </div>
  );
}
