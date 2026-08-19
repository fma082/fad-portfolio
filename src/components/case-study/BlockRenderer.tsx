import type { Block } from "@/types/case-study";
import { ImageFrame } from "./ImageFrame";
import { VideoFrame } from "./VideoFrame";
import { ImageGrid } from "./ImageGrid";
import {
  SectionIntro,
  Subhead,
  Prose,
  DecisionBox,
  TradeoffBox,
  Quote,
} from "./blocks/TextBlocks";
import { Metrics, CardGrid, Chips } from "./blocks/DataBlocks";
import {
  TokenTable,
  ComponentInventory,
  VariantMatrix,
  SpecList,
} from "./blocks/SpecBlocks";
import {
  TokenChain,
  CodePeek,
  DivergenceTable,
  LinkOut,
  Cta,
} from "./blocks/SystemBlocks";
import { BugFlow, TierGrid, EvidenceTable } from "./blocks/GovernanceBlocks";
import { NodeDemo } from "./blocks/NodeDemo";
import { FigmaEmbed } from "./blocks/FigmaEmbed";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "section":
      return <SectionIntro block={block} />;
    case "subhead":
      return <Subhead block={block} />;
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
    case "video":
      return (
        <VideoFrame
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
    case "bugFlow":
      return <BugFlow block={block} />;
    case "tierGrid":
      return <TierGrid block={block} />;
    case "evidenceTable":
      return <EvidenceTable block={block} />;
    case "tokenTable":
      return <TokenTable block={block} />;
    case "componentInventory":
      return <ComponentInventory block={block} />;
    case "variantMatrix":
      return <VariantMatrix block={block} />;
    case "specList":
      return <SpecList block={block} />;
    case "tokenChain":
      return <TokenChain block={block} />;
    case "nodeDemo":
      return <NodeDemo block={block} />;
    case "codePeek":
      return <CodePeek block={block} />;
    case "divergenceTable":
      return <DivergenceTable block={block} />;
    case "linkOut":
      return <LinkOut block={block} />;
    case "cta":
      return <Cta block={block} />;
    case "figmaEmbed":
      return <FigmaEmbed block={block} />;
    default: {
      /* Adding a member to the Block union without a case above is a
         compile error here, not a silently blank section. */
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
