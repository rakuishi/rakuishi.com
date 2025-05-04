import { SITE } from "@/const";
import { getPosts } from "@/posts";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site?.toString() ?? "",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: extractSummary(post.body),
      link: `/posts/${post.slug}`,
    })),
  });
}

function extractSummary(body: string): string {
  return body
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .slice(0, 200);
}
