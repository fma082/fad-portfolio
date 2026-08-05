import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy, caseStudySlugs } from "@/content/case-studies";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseLinks } from "@/components/case-study/CaseLinks";
import { CaseBody } from "@/components/case-study/CaseBody";
import { ImageFrame } from "@/components/case-study/ImageFrame";
import { StickyCta } from "@/components/case-study/StickyCta";
import { CaseFooter } from "@/components/case-study/CaseFooter";

type Params = { params: Promise<{ slug: string }> };

const plain = (title: string) => title.replace(/\*/g, "");

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.seo?.title ?? plain(study.meta.title),
    description: study.seo?.description ?? study.meta.subtitle,
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { meta, tags, links, stats, cover, stickyCta, blocks, nextCase } =
    study;

  return (
    /* data-accent feeds --accent to every descendant through the cascade */
    <main data-accent={meta.accent}>
      <CaseHero
        tags={tags}
        title={meta.title}
        subtitle={meta.subtitle}
        meta={{
          role: meta.role,
          type: meta.type,
          year: meta.year,
          tools: meta.tools,
        }}
        stats={stats}
      >
        <CaseLinks links={links} />
      </CaseHero>

      {cover && (
        /* Same vertical step a CaseBody section uses, top and bottom, so the
           cover reads as its own band rather than as something stuck to the
           hero's bottom border. */
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-14 lg:pt-16 pb-16 lg:pb-20">
          <ImageFrame {...cover} sizes="(max-width: 768px) 100vw, 1280px" />
        </div>
      )}

      <CaseBody blocks={blocks} />

      {nextCase && <CaseFooter {...nextCase} />}

      {stickyCta && <StickyCta {...stickyCta} />}
    </main>
  );
}
