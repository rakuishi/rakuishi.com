const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const { exec } = require("child_process");

const slug = process.argv[2];
if (!slug) {
  console.log("Usage: npm run new [slug]");
  process.exit(1);
}

const date = new Date();
const yaml = `---
categories:
  - Blog
date: "${format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx")}"
page: false
slug: ${slug}
title: ""
---
`;
const filename = `${format(date, "yyyy-MM-dd")}-${slug}.md`;
const dest = path.join(process.cwd(), "src/archives", filename);
fs.writeFileSync(dest, yaml);
exec(`open ${dest}`);
