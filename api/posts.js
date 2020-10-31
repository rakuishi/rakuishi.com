import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const dir = path.join(process.cwd(), "archives");

export function getArchives() {
  return _getPosts().filter(
    (post) => post.page === undefined || post.page === false
  );
}

export function getPages() {
  return _getPosts().filter((post) => post.page === true);
}

export function _getPosts() {
  const filenames = fs.readdirSync(dir);
  const archives = filenames
    .map((filename) => {
      const contentPath = path.join(dir, filename);
      const content = matter(fs.readFileSync(contentPath, "utf8"));
      const summary = _extractSummary(content.content);
      content.data.slug = content.data.slug.toString();
      content.data.filename = filename.toString();
      return {
        ...content.data,
        summary,
      };
    })
    .sort((a, b) => (a.date > b.date ? "-1" : "1"));
  return archives;
}

export function _extractSummary(content) {
  return content
    .split("\n")
    .find((p) => {
      return p.length > 0 && !p.startsWith("<") && !p.startsWith("{");
    })
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1");
}

export function getPostSlugs(posts) {
  return posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
}

export async function getPost(slug) {
  const post = _getPosts().find((post) => post.slug === slug);
  const contentPath = path.join(dir, post.filename);
  const content = matter(fs.readFileSync(contentPath, "utf8"));
  const processedContent = await remark().use(html).process(content.content);
  const contentHtml = processedContent.toString();

  return {
    contentHtml,
    ...post,
  };
}
