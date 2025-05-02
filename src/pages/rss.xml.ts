import { SITE_DESCRIPTION, SITE_TITLE } from "@/const";
import { getPosts } from "@/posts";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site?.toString() ?? "",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.body.slice(0, 200),
      link: `/posts/${post.slug}`,
    })),
  });
}
