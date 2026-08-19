import type { CaseStudy } from "@/types/case-study";
import { countersign } from "./countersign";
import { designSystem } from "./design-system";
import { fluuen } from "./fluuen";

/* Adding a project means adding a content file and one line here. */
const studies: CaseStudy[] = [fluuen, countersign, designSystem];

export const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  studies.map((study) => [study.meta.slug, study]),
);

export const caseStudySlugs = studies.map((study) => study.meta.slug);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}
