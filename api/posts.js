import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import { applyShortcodes } from "utils/shortcodes";
import { categories } from "constants/categories";

const dir = path.join(process.cwd(), "archives");

export function getArchives(categorySlug = null) {
  return _getPosts({ categorySlug }).filter(
    (post) => post.page === undefined || post.page === false
  );
}

export function getPages() {
  return _getPosts({}).filter((post) => post.page === true);
}

function _getPosts({ slug, categorySlug }) {
  return fs
    .readdirSync(dir)
    .filter((filename) => {
      return !slug || filename.endsWith(`${slug}.md`);
    })
    .map((filename) => {
      const contentPath = path.join(dir, filename);
      const content = matter(fs.readFileSync(contentPath, "utf8"));
      content.data.slug = content.data.slug.toString();
      content.data.filename = filename.toString();
      return content;
    })
    .filter((content) => {
      if (!categorySlug) {
        return true;
      }

      const name = getCategory(categorySlug).name;
      return (
        !!content.data.categories && content.data.categories.includes(name)
      );
    })
    .map((content) => {
      const summary = _extractSummary(content.content);
      return {
        ...content.data,
        summary,
      };
    })
    .sort((a, b) => (a.date > b.date ? "-1" : "1"));
}

function _extractSummary(content) {
  return content
    .split("\n")
    .find((p) => {
      return p.length > 0 && !p.startsWith("<") && !p.startsWith("{");
    })
    .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, "$1")
    .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2")
    .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2")
    .replace(/<a .+?>(.+?)<\/a>/g, "$1");
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

export function getCategorySlugs() {
  return categories.map((category) => {
    return {
      params: {
        slug: category.slug,
      },
    };
  });
}

export function getCategory(slug) {
  return categories.find((category) => category.slug == slug);
}

export async function getPost(slug) {
  const post = _getPosts({ slug }).find((post) => post.slug === slug);
  const contentPath = path.join(dir, post.filename);
  let content = matter(fs.readFileSync(contentPath, "utf8")).content;
  content = applyShortcodes(content);
  const processedContent = await remark()
    .use(html)
    .process(applyShortcodes(content));
  const contentHtml = processedContent.toString();

  return {
    contentHtml,
    ...post,
  };
}
