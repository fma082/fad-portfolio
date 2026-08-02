import type { Block } from "@/types/case-study";
import { ImageFrame } from "./ImageFrame";
import { ImageGrid } from "./ImageGrid";
import {
  SectionIntro,
  Prose,
  DecisionBox,
  TradeoffBox,
  Quote,
} from "./blocks/TextBlocks";
import { Metrics, CardGrid, Chips } from "./blocks/DataBlocks";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "section":
      return <SectionIntro block={block} />;
    case "prose":
      return <Prose block={block} />;
    case "decision":
      return <DecisionBox block={block} />;
    case "tradeoff":
      return <TradeoffBox block={block} />;
    case "image":
      return (
        <ImageFrame
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          tag={block.tag}
        />
      );
    case "imageGrid":
      return <ImageGrid left={block.images[0]} right={block.images[1]} />;
    case "metrics":
      return <Metrics block={block} />;
    case "quote":
      return <Quote block={block} />;
    case "cardGrid":
      return <CardGrid block={block} />;
    case "chips":
      return <Chips block={block} />;
    default: {
      /* Adding a member to the Block union without a case above is a
         compile error here, not a silently blank section. */
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
