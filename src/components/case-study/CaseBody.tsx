import type { Block, SectionBlock } from "@/types/case-study";
import { SectionDivider } from "./SectionDivider";
import { ScrollReveal } from "./ScrollReveal";
import { BlockRenderer } from "./BlockRenderer";

type Group = { section: SectionBlock; blocks: Block[] };

/* The block list is flat; a `section` block opens a group and everything after
   it belongs to that group until the next one. */
function groupBySection(blocks: Block[]): Group[] {
  const groups: Group[] = [];
  for (const block of blocks) {
    if (block.type === "section") {
      groups.push({ section: block, blocks: [block] });
    } else if (groups.length > 0) {
      groups[groups.length - 1].blocks.push(block);
    }
  }
  return groups;
}

const isMedia = (block: Block) =>
  block.type === "image" ||
  block.type === "video" ||
  block.type === "imageGrid";

/* Vertical rhythm: consecutive media sit tight, chips hug the paragraph above
   them, everything else gets a full section step. */
function spacing(current: Block, previous: Block | undefined): string {
  if (!previous) return "";
  if (isMedia(current) && isMedia(previous)) return "mt-4";
  /* A heading belongs to what follows it, not to what it sits under. */
  if (previous.type === "subhead") return "mt-6";
  if (current.type === "chips") return "mt-10";
  return "mt-14 lg:mt-16";
}

export function CaseBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {groupBySection(blocks).map(({ section, blocks: group }) => (
        <section key={section.num} className="border-t border-border">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionDivider num={section.num} label={section.label} />
            <div className="pt-14 lg:pt-16 pb-16 lg:pb-20">
              {group.map((block, i) => (
                <ScrollReveal
                  key={i}
                  delay={Math.min(i * 0.05, 0.2)}
                  className={spacing(block, group[i - 1])}
                >
                  <BlockRenderer block={block} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
