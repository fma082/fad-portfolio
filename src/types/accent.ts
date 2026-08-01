/* Per-project accent. The value is a token name, never a hex.
   Set it via `data-accent` on a case study's root node; `globals.css` maps it
   to `--accent`, which descendants consume as `text-(--accent)`,
   `border-(--accent)/40`, and so on. */
export type AccentToken =
  | "violet"
  | "teal"
  | "blue"
  | "green"
  | "amber"
  | "red";
