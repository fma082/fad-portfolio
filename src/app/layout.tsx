import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const NAME = "Facundo Almirón";
const TITLE = `${NAME} — Senior Product Designer`;
const DESCRIPTION =
  `${NAME} — Senior Product Designer. Design Systems, AI/SaaS interfaces, ` +
  "and design-to-code workflows — and the proof that what I design gets built.";

export const metadata: Metadata = {
  metadataBase: new URL("https://byfma.com"),
  /* Case study pages set only their own title; the template appends the name
     so a shared link always carries it. */
  title: { default: TITLE, template: `%s — ${NAME}` },
  description: DESCRIPTION,
  authors: [{ name: NAME }],
  creator: NAME,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://byfma.com",
    siteName: "byfma",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
