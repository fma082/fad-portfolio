/* Per-project accent. The value is a token name, never a hex.
   Set it via `data-accent` on a case study's root node; `globals.css` maps it
   to `--accent`, which descendants consume as `text-(--accent)`,
   `border-(--accent)/40`, and so on.

   `bone` is the odd one out on purpose: a warm off-white rather than a hue.
   Countersign's product surface is monochrome warm-neutral and reserves colour
   for meaning — amber reversible, red destructive, green safe. An accent hue
   there would compete with the only three colours that carry information. */
export type AccentToken =
  | "violet"
  | "teal"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "bone";
