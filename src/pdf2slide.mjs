import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

// Usage: node src/pdf2slide.mjs slides/YYYYMMDD_event-name.pdf [--slug ...] [--title "..."] [--date 2024-04-24]
// Converts a PDF into WebP images (long edge 1920px) at src/assets/slides/{slug}/001.webp...
// and generates a post skeleton at src/content/posts/YYYY-MM-DD-{slug}.mdx

const LONG_EDGE = 1920;
const WEBP_QUALITY = 75;

const args = process.argv.slice(2);
const pdfPath = args.find((arg) => !arg.startsWith("--"));
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 ? args[index + 1] : undefined;
};

if (!pdfPath || !fs.existsSync(pdfPath)) {
  console.error("Usage: node src/pdf2slide.mjs [pdf] --slug --title --date");
  process.exit(1);
}

// The filename minus its YYYYMMDD prefix becomes the slug; the date comes from the prefix
const basename = path.basename(pdfPath, ".pdf");
const dateInFilename = basename.match(/^(\d{4})(\d{2})(\d{2})/);
const slug = option("slug") ?? basename.replace(/^\d{8}[-_\s]*/, "");
const date =
  option("date") ??
  (dateInFilename
    ? `${dateInFilename[1]}-${dateInFilename[2]}-${dateInFilename[3]}`
    : undefined);
if (!slug || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error(
    "Pass --date (YYYY-MM-DD) when the filename does not start with YYYYMMDD",
  );
  process.exit(1);
}

// Fall back to the PDF metadata title when --title is not given.
// Post titles should not contain dates, so strip a leading one.
const pdfinfo = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
const title =
  option("title") ??
  (pdfinfo.match(/^Title:\s*(.+)$/m)?.[1]?.trim() ?? basename).replace(
    /^\d{4}[-/]?\d{2}[-/]?\d{2}[-_\s]*/,
    "",
  );

// 1. Rasterize the PDF into PNGs with pdftoppm (-scale-to targets the long edge)
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdf2slide-"));
execFileSync("pdftoppm", [
  "-png",
  "-scale-to",
  String(LONG_EDGE),
  pdfPath,
  path.join(tmpDir, "page"),
]);

// 2. Convert to WebP with sharp, named as zero-padded sequential numbers
const outDir = path.join(process.cwd(), "src/assets/slides", slug);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const pages = fs
  .readdirSync(tmpDir)
  .filter((file) => file.endsWith(".png"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let totalBytes = 0;
for (const [index, page] of pages.entries()) {
  const outPath = path.join(
    outDir,
    `${String(index + 1).padStart(3, "0")}.webp`,
  );
  await sharp(path.join(tmpDir, page))
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);
  totalBytes += fs.statSync(outPath).size;
}
fs.rmSync(tmpDir, { recursive: true, force: true });

// 3. Extract per-page text as a numbered-list draft
const transcript = pages
  .map((_, index) => {
    const page = String(index + 1);
    const text = execFileSync(
      "pdftotext",
      ["-f", page, "-l", page, pdfPath, "-"],
      {
        encoding: "utf8",
      },
    )
      // Join wrapped lines without a space when both sides are non-ASCII (Japanese)
      .replace(/(\P{ASCII}) *\n(?=\P{ASCII})/gu, "$1")
      .replace(/\s+/g, " ")
      .replace(/[<{]/g, "\\$&") // Escape MDX special characters
      .trim();
    return `${page}. ${text}`;
  })
  .join("\n");

// 4. Generate the post skeleton (never overwrite an existing post)
const postPath = path.join(
  process.cwd(),
  "src/content/posts",
  `${date}-${slug}.mdx`,
);
if (fs.existsSync(postPath)) {
  console.log(`skip: ${path.relative(process.cwd(), postPath)} already exists`);
} else {
  const mdx = `---
category: slide
date: "${date}T10:00:00+09:00"
page: false
slug: "${slug}"
title: "${title.replace(/"/g, '\\"')}"
---

import SlideViewer from "@/components/SlideViewer.astro";

<SlideViewer slug="${slug}" />

${transcript}
`;
  fs.writeFileSync(postPath, mdx);
  console.log(`created: ${path.relative(process.cwd(), postPath)}`);
}

const totalKB = Math.round(totalBytes / 1024);
console.log(
  `created: src/assets/slides/${slug}/ (${pages.length} pages, ${totalKB}KB total, ${Math.round(totalKB / pages.length)}KB/page)`,
);
