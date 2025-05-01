import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/const";

function pubDate(dateStr) {
  const date = new Date(dateStr);
  date.setUTCHours(0);
  return date;
}

export function GET() {
  const posts = Object.values(
    import.meta.glob("@/archives/*.md", { eager: true })
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: posts.reverse().map((item) => ({
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      link: `/archives/${item.frontmatter.slug}`,
      pubDate: pubDate(item.frontmatter.date.toString()),
    })),
  });
}
