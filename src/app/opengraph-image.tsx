import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Facundo Almirón — Senior Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Equal on all four sides, and deliberately generous: some platforms crop the
   card to their own aspect ratio, and a margin that only looks safe at 1200x630
   is the first thing they eat. Nothing that has to be read lives outside it. */
const PAD = 80;

/* Wordmark to rule. Short enough to read as family rather than as a section
   break, and deliberately tighter than the 40px between the label and the name
   so the grouping runs one way: the mark joins the label, the label joins the
   name, and the three arrive as one object. */
const FAMILY_GAP = 28;

/* Satori resolves no CSS: it never sees globals.css, Tailwind classes or
   `var(--color-*)`. Every value below has to arrive as a literal — so rather
   than copying the hex codes here (and letting them drift the first time a
   token changes), the @theme block is parsed at build time. A missing token
   fails the build instead of silently rendering the wrong colour. */
async function themeTokens<T extends string>(...names: T[]) {
  const css = await readFile(
    join(process.cwd(), "src/app/globals.css"),
    "utf8",
  );

  return Object.fromEntries(
    names.map((name) => {
      const match = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
      if (!match) {
        throw new Error(
          `opengraph-image: --color-${name} is not defined in globals.css`,
        );
      }
      return [name, match[1].trim()];
    }),
  ) as Record<T, string>;
}

/* next/font hands Satori nothing usable: it caches woff2 under hashed
   filenames, and Satori reads only ttf/otf/woff. The same families are
   vendored as ttf so the card cannot drift from the site's type. */
async function font(file: string) {
  return readFile(join(process.cwd(), "src/assets/fonts", file));
}

export default async function Image() {
  const [color, serif, mono, monoMedium] = await Promise.all([
    themeTokens("canvas", "fg", "fg-muted", "fg-faint", "violet"),
    font("InstrumentSerif-Regular.ttf"),
    font("IBMPlexMono-Regular.ttf"),
    font("IBMPlexMono-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: PAD,
          backgroundColor: color.canvas,
          fontFamily: "IBM Plex Mono",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Same treatment as the navbar wordmark: mono, medium, `by` faint. */}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 500,
              marginBottom: FAMILY_GAP,
            }}
          >
            <span style={{ color: color["fg-faint"] }}>by</span>
            <span style={{ color: color.fg }}>fma</span>
          </div>

          {/* The hero's rule + label pair — the rule is what anchors the
              label there, and it does the same job here. Scaled from `h-px`
              it would land on 2px, but a feed renders this card at roughly
              half size and 2px would drop below a pixel: the one accent in
              the composition would vanish exactly where it has to read. */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span
              style={{ width: 56, height: 3, backgroundColor: color.violet }}
            />
            <span
              style={{
                fontSize: 22,
                letterSpacing: "0.2em",
                color: color["fg-muted"],
              }}
            >
              SENIOR PRODUCT DESIGNER
            </span>
          </div>

          <div
            style={{
              marginTop: 40,
              fontFamily: "Instrument Serif",
              fontSize: 124,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: color.fg,
            }}
          >
            Facundo Almirón
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "IBM Plex Mono", data: mono, style: "normal", weight: 400 },
        { name: "IBM Plex Mono", data: monoMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
