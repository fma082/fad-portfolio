"use client";

import { useState } from "react";
import type { NodeDemoBlock } from "@/types/case-study";

/* The Agent Builder node under each of its three states, with the chain that
   produced the border underneath. Every colour — the border, and the eight
   structure values the node is drawn with — is read out of Figma into
   `_data/fluuen.ts`. Nothing here is authored.

   A static image could show the three borders. What it could not show is that
   two of them resolve through a component token and the third does not. */

export function NodeDemo({ block }: { block: NodeDemoBlock }) {
  const [activeId, setActiveId] = useState(block.states[0]?.id);
  const active = block.states.find((s) => s.id === activeId) ?? block.states[0];
  if (!active) return null;

  const s = block.structure;

  /* Null semantic is the finding, so the box is rendered and labelled rather
     than dropped — a missing box would read as a rendering bug. */
  const steps: { layer: string; name: string; muted?: boolean }[] = [
    { layer: "Component", name: active.semantic ? active.token : "—", muted: !active.semantic },
    { layer: "Semantic", name: active.semantic ?? active.token },
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

      {/* Radios rather than buttons: one choice out of a fixed set. */}
      <fieldset className="px-5 lg:px-8 py-5 border-b border-border">
        <legend className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint mb-4">
          Node states
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
                  name="fluuen-node-state"
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

      {/* The node. Drawn with the structure tokens; only the border changes. */}
      <div
        className="px-5 lg:px-8 py-12 flex justify-center"
        style={{ background: s.canvas }}
      >
        <div
          className="w-[19rem] max-w-full rounded-lg transition-colors duration-200"
          style={{
            background: s.bg,
            border: `1px solid ${active.hex}`,
            boxShadow:
              active.id === "selected"
                ? `0 0 0 3px ${active.hex}33`
                : undefined,
          }}
        >
          <div className="px-3 pt-2.5 flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: s.accent }}
            />
            <p
              className="font-mono text-[11px] flex-1 truncate"
              style={{ color: s.label }}
            >
              Send Slack message
            </p>
            <p className="font-mono text-[10px]" style={{ color: s.sublabel }}>
              a3
            </p>
          </div>

          <p
            className="px-3 pt-1 font-mono text-[10px]"
            style={{ color: s.sublabel }}
          >
            Action · Slack
          </p>

          <div className="mx-3 mt-2.5 h-px" style={{ background: s.divider }} />

          <div className="px-3 py-2 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px]" style={{ color: s.sublabel }}>
              channel
            </span>
            <span
              className="font-mono text-[10px] truncate"
              style={{ color: s.bodyText }}
            >
              #alerts
            </span>
          </div>

          <div className="px-3 pb-3">
            <span
              className="inline-block px-1.5 py-0.5 rounded font-mono text-[9px]"
              style={{
                color: s.bodyText,
                background: s.portBg,
                border: `1px solid ${s.portBorder}`,
              }}
            >
              ts
            </span>
          </div>
        </div>
      </div>

      {/* The chain that produced the border above. */}
      <div className="px-5 lg:px-8 py-6 border-t border-border">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.layer} className="contents">
              <div className="flex-1 min-w-0 border border-border rounded-lg bg-raised px-4 py-3">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-faint">
                  {step.layer}
                </p>
                <p
                  className={`font-mono text-[12px] mt-1.5 break-words leading-snug ${
                    step.muted
                      ? "text-fg-faint"
                      : i === steps.length - 1
                        ? "text-(--accent)"
                        : "text-fg"
                  }`}
                >
                  {step.name}
                </p>
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

        <p aria-live="polite" className="sr-only">
          {active.label}: {active.semantic ?? active.token} → {active.primitive}{" "}
          → {active.hex}
        </p>

        {/* Neutral grey, deliberately. This is an observation about the
            system's shape, not a warning about it — an amber field would
            editorialise a fact that reads better flat. */}
        {active.note && (
          <p className="font-sans text-sm text-fg-muted leading-relaxed mt-5 max-w-3xl">
            {active.note}
          </p>
        )}
      </div>

      {block.caption && (
        <p className="border-t border-border px-5 lg:px-8 py-4 font-sans text-sm text-fg-muted leading-relaxed">
          {block.caption}
        </p>
      )}
    </div>
  );
}
