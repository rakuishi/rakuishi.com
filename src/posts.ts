import { type CollectionEntry, getCollection } from "astro:content";

// Build a summary by stripping imports, MDX comments, HTML/JSX tags, and markdown syntax from the body
export function extractSummary(body = ""): string {
  return body
    .replace(/^import .*$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim()
    .slice(0, 200);
}

export async function getPosts(
  isPage = false,
): Promise<CollectionEntry<"posts">[]> {
  return (await getCollection("posts"))
    .filter((post) => {
      return post.data.page === isPage;
    })
    .sort((a, b) => {
      return b.data.date.getTime() - a.data.date.getTime();
    });
}
