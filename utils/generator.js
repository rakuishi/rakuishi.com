import fs from "fs";
import path from "path";
import { parseISO, format } from "date-fns";
import { escape } from "utils/escape";

const rfc1123 = "eee, dd MMM yyyy HH:mm:ss xx";
const iso8601 = "yyyy-MM-dd'T'HH:mm:ssxxx";
const pages = Object.freeze(["", "about/", "quicka2/", "archives/"]);

export function generateFeed(posts) {
  const items = posts
    .slice(0, 10)
    .map((post) => {
      return `
    <item>
      <title>${escape(post.title)}</title>
      <link>https://rakuishi.com/archives/${escape(post.slug)}/</link>
      <guid>https://rakuishi.com/archives/${escape(post.slug)}/</guid>
      <pubDate>${escape(format(parseISO(post.date), rfc1123))}</pubDate>
      <description>${escape(post.summary)}</description>
    </item>`;
    })
    .join("");

  const sitemap = `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>rakuishi.com</title>
    <link>https://rakuishi.com/</link>
    <description>Blog posts by rakuishi since Aug 25, 2011</description>
    <language>ja</language>
    <atom:link href="https://rakuishi.com/feed/index.xml" rel="self" />
    <lastBuildDate>${escape(format(new Date(), rfc1123))}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  fs.writeFileSync(
    path.join(process.cwd(), "public", "feed", "index.xml"),
    sitemap
  );
}

export function generateSitemap(posts) {
  const urls = [];

  pages.forEach((page) => {
    urls.push(_createSitemapUrls(page, new Date(), "monthly", "1.0"));
  });

  posts.forEach((post) => {
    urls.push(
      _createSitemapUrls(
        `archives/${escape(post.slug)}/`,
        parseISO(post.date),
        "monthly",
        "0.9"
      )
    );
  });

  const data = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("")}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), data);
}

function _createSitemapUrls(loc, lastmod, changefreq, priority) {
  return `
  <url>
    <loc>https://rakuishi.com/${escape(loc)}</loc>
    <lastmod>${escape(format(lastmod, iso8601))}</lastmod>
    <changefreq>${escape(changefreq)}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}
