"use client";

import { useState } from "react";
import type { StatusBadgeDemoBlock } from "@/types/case-study";

/* The one interactive block on the site. Everything it paints with — fill,
   border, label colour, and the chain printed underneath — comes from
   `_data/fluuen.ts`, read out of the token repo. No colour is authored here.

   It exists because a static swatch table cannot show the thing worth showing:
   that one component under five states is five resolutions of the same
   structure, and that three of those five bend it. */

type State = StatusBadgeDemoBlock["states"][number];

/* Hand-drawn, like every other icon in this repo — no icon library. */
function Icon({ name }: { name: State["icon"] }) {
  const common = {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-3.5 h-3.5 shrink-0",
    "aria-hidden": true,
  };

  switch (name) {
    case "check":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.25" />
          <path d="m5.5 8.25 1.75 1.75 3.25-3.5" />
        </svg>
      );
    case "loader":
      /* Three-quarter ring: the gap is what reads as motion when it spins. */
      return (
        <svg {...common} className={`${common.className} animate-spin`}>
          <path d="M14.25 8a6.25 6.25 0 1 0-2.4 4.93" />
        </svg>
      );
    case "pause":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.25" />
          <path d="M6.5 5.75v4.5M9.5 5.75v4.5" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.25" />
          <path d="m6 6 4 4M10 6l-4 4" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M9 1.75H4.25v12.5h7.5V4.5z" />
          <path d="M9 1.75V4.5h2.75" />
        </svg>
      );
  }
}

export function StatusBadgeDemo({ block }: { block: StatusBadgeDemoBlock }) {
  const [activeId, setActiveId] = useState(block.states[0]?.id);
  const active = block.states.find((s) => s.id === activeId) ?? block.states[0];
  if (!active) return null;

  const steps: { layer: string; name: string; detail?: string }[] = [
    { layer: "Component", name: "status badge", detail: `${active.id}-text` },
    { layer: "Semantic", name: active.semantic },
    { layer: "Primitive", name: active.primitive },
    { layer: "Value", name: active.hex },
  ];

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {(block.title || block.intro) && (
        <div className="px-5 lg:px-8 pt-6 pb-5 border-b border-border">
          {block.title && (
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-(--accent)">
              {block.title}
            </h3>
          )}
          {block.intro && (
            <p className="font-sans text-sm text-fg-muted leading-relaxed mt-3 max-w-3xl">
              {block.intro}
            </p>
          )}
        </div>
      )}

      {/* State picker. Radios rather than buttons: it is a single choice out of
          a fixed set, and that is what a screen reader should hear. */}
      <fieldset className="px-5 lg:px-8 py-5 border-b border-border">
        <legend className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-4">
          Agent states
        </legend>
        <div className="flex flex-wrap gap-2">
          {block.states.map((state) => {
            const selected = state.id === active.id;
            return (
              <label
                key={state.id}
                className={`inline-flex items-center gap-2 px-3.5 py-2 border rounded-md cursor-pointer font-mono text-[11px] transition-colors duration-150 ${
                  selected
                    ? "border-(--accent) text-fg"
                    : "border-border text-fg-muted hover:border-border-strong hover:text-fg"
                }`}
              >
                <input
                  type="radio"
                  name="fluuen-badge-state"
                  value={state.id}
                  checked={selected}
                  onChange={() => setActiveId(state.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: selected ? state.hex : "currentColor" }}
                />
                {state.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* The badge itself, painted with the resolved values. */}
      <div className="px-5 lg:px-8 py-10 flex justify-center">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-xs"
          style={{
            background: active.bg,
            borderColor: active.border,
            color: active.hex,
          }}
        >
          <Icon name={active.icon} />
          {active.label}
        </span>
      </div>

      {/* Its chain. Same four-box shape as the tokenChain block in 01. */}
      <div className="px-5 lg:px-8 pb-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.layer} className="contents">
              <div className="flex-1 min-w-0 border border-border rounded-lg bg-raised px-4 py-3">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint">
                  {step.layer}
                </p>
                <p
                  className={`font-mono text-[12px] mt-1.5 break-words leading-snug ${
                    i === steps.length - 1 ? "text-(--accent)" : "text-fg"
                  }`}
                >
                  {step.name}
                </p>
                {step.detail && (
                  <p className="font-mono text-[11px] text-fg-muted mt-0.5 break-words">
                    {step.detail}
                  </p>
                )}
                {i === steps.length - 1 && (
                  <span
                    aria-hidden
                    className="block h-5 w-full mt-2 rounded ring-1 ring-inset ring-border-strong"
                    style={{ background: step.name }}
                  />
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center justify-center shrink-0 md:px-2 py-0.5 md:py-0">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 12"
                    className="w-5 h-3 text-fg-faint rotate-90 md:rotate-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 6h21" />
                    <path d="M17 1.5 22.5 6 17 10.5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live region: the chain changes without the focused control changing
            its own label, so the update has to be announced. */}
        <p aria-live="polite" className="sr-only">
          {active.label}: {active.semantic} → {active.primitive} → {active.hex}
        </p>

        {active.note && (
          <p className="font-sans text-sm text-fg-muted leading-relaxed mt-5 max-w-3xl">
            {active.note}
          </p>
        )}
      </div>

      {block.vocabularies && (
        <div className="border-t border-border px-5 lg:px-8 py-6">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-4">
            One badge, {block.vocabularies.length} vocabularies
          </p>
          <div className="flex flex-col gap-3">
            {block.vocabularies.map((vocabulary) => (
              <div
                key={vocabulary.name}
                className="grid grid-cols-1 sm:grid-cols-[7rem_minmax(0,1fr)] gap-x-6 gap-y-1.5"
              >
                <p className="font-mono text-[11px] text-fg">
                  {vocabulary.name}
                </p>
                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {vocabulary.states.map((state) => (
                      <span
                        key={state}
                        className="font-mono text-[10px] px-2 py-0.5 border border-border text-fg-muted"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] text-fg-faint mt-1.5">
                    {vocabulary.surface}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {block.caption && (
        <p className="border-t border-border px-5 lg:px-8 py-4 font-sans text-sm text-fg-muted leading-relaxed">
          {block.caption}
        </p>
      )}
    </div>
  );
}
