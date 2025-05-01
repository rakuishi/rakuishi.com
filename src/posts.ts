import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  return (await getCollection('posts'))
    .sort((a, b) => {
      return b.data.date.getTime() - a.data.date.getTime();
    });
}
