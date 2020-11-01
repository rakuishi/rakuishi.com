import Head from "components/head";
import { getArchives } from "api/posts.js";
import PostListLayout from "components/post-list-layout";

export default function Home({ archives }) {
  return (
    <>
      <Head props={{ title: "Archives" }} />
      <PostListLayout title="Archives" posts={archives} />
    </>
  );
}

export async function getStaticProps() {
  const archives = getArchives();
  return {
    props: {
      archives,
    },
  };
}
