const fs = require("node:fs");
const path = require("node:path");
const { Temporal } = require("@js-temporal/polyfill");
const { exec } = require("node:child_process");

const slug = process.argv[2];
if (!slug) {
  console.log("Usage: npm run new [slug]");
  process.exit(1);
}

const now = Temporal.Now.zonedDateTimeISO("Asia/Tokyo");
const date = now
  .toInstant()
  .toString({ timeZone: "Asia/Tokyo", smallestUnit: "second" });
const yaml = `---
category: blog
date: "${date}"
page: false
slug: ${slug}
title: ""
---
`;

const year = now.year.toString().padStart(4, "0");
const month = now.month.toString().padStart(2, "0");
const day = now.day.toString().padStart(2, "0");
const filename = `${year}-${month}-${day}-${slug}.md`;
const dest = path.join(process.cwd(), "src/content/posts", filename);
fs.writeFileSync(dest, yaml);
exec(`open ${dest}`);
