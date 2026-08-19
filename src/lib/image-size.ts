import { readFileSync } from "node:fs";
import path from "node:path";

/* Intrinsic image dimensions, read from `public/` at build time.
   `next/image` needs width and height whenever `src` is a runtime string
   instead of a static import. Reading the file header here means the ratio is
   never restated in the content files, so replacing an asset with one of a
   different shape needs no edit anywhere else.

   PNG, JPEG, GIF and MP4 — the four formats in this repo. Anything else, or an
   unreadable file, falls back to 16:9 rather than breaking the build.

   MP4 is here rather than in a file of its own because the caller's need is the
   same one: a frame that takes the shape of its source instead of forcing a
   ratio on it. `VideoFrame` reserves height from this exactly as `ImageFrame`
   does. */

type Size = { width: number; height: number };

const FALLBACK: Size = { width: 16, height: 9 };
const cache = new Map<string, Size>();

/* IHDR is always the first chunk: width and height sit at a fixed offset. */
function readPng(buffer: Buffer): Size | null {
  if (buffer.length < 24) return null;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/* Walk the segment chain until a Start Of Frame marker carries the size. */
function readJpeg(buffer: Buffer): Size | null {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    /* SOF0–SOF15 hold the frame header. C4, C8 and CC are Huffman and
       arithmetic coding tables that happen to share the range. */
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  return null;
}

/* The logical screen descriptor sits right after the 6-byte signature, and it
   is little-endian — the one header in this file that is. */
function readGif(buffer: Buffer): Size | null {
  if (buffer.length < 10) return null;
  const signature = buffer.subarray(0, 3).toString("latin1");
  if (signature !== "GIF") return null;
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}

/* ISO base media: the track header carries display width and height as 16.16
   fixed-point. A file has one `tkhd` per track, and an audio track reports
   0x0 — so every header is read and the largest box wins, rather than the
   first one found. `moov` is at the head in a web-ready file, but the scan does
   not depend on that. */
function readMp4(buffer: Buffer): Size | null {
  if (buffer.length < 16) return null;
  if (buffer.subarray(4, 8).toString("latin1") !== "ftyp") return null;

  let best: Size | null = null;
  let at = buffer.indexOf("tkhd", 0, "latin1");

  while (at !== -1) {
    /* version sits one byte past the 8-byte box header, and it decides the
       width of the four time fields before the 36-byte matrix. */
    const box = at - 4;
    const version = buffer[box + 8];
    const offset = box + (version === 1 ? 96 : 84);

    if (box >= 0 && offset + 8 <= buffer.length) {
      const width = buffer.readUInt32BE(offset) / 65536;
      const height = buffer.readUInt32BE(offset + 4) / 65536;
      if (width >= 1 && height >= 1 && (!best || width > best.width)) {
        best = { width: Math.round(width), height: Math.round(height) };
      }
    }
    at = buffer.indexOf("tkhd", at + 4, "latin1");
  }

  return best;
}

/* `src` is a public-relative URL, e.g. "/images/projects/x/Dashboard.png". */
export function imageSize(src: string): Size {
  const cached = cache.get(src);
  if (cached) return cached;

  let size = FALLBACK;
  try {
    const file = path.join(process.cwd(), "public", decodeURIComponent(src));
    const buffer = readFileSync(file);
    size =
      readPng(buffer) ??
      readJpeg(buffer) ??
      readGif(buffer) ??
      readMp4(buffer) ??
      FALLBACK;
  } catch {
    /* Missing or unreadable — the fallback keeps the page rendering. */
  }

  cache.set(src, size);
  return size;
}
