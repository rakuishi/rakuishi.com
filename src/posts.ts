import { type CollectionEntry, getCollection } from "astro:content";

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
