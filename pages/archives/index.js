import { getArchives } from "api/posts.js";
import Head from "components/head";
import PostListLayout from "components/post-list-layout";
import { generateFeed, generateSitemap } from "utils/generator";

export default function Archives({ archives }) {
  return (
    <>
      <Head props={{ title: "Archives" }} />
      <PostListLayout title="Archives" posts={archives} />
    </>
  );
}

export async function getStaticProps() {
  const archives = getArchives();

  // TODO: Rewrite following code after an official SSG support of generating feed and sitemap.
  generateFeed(archives);
  generateSitemap(archives);

  return {
    props: {
      archives,
    },
  };
}
