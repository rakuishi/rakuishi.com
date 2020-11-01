import Head from "components/head";
import { getArchives } from "api/posts.js";
import PostListLayout from "components/post-list-layout";

export default function Home({ archives }) {
  return (
    <>
      <Head />
      <PostListLayout title="Recent Posts" posts={archives} />
    </>
  );
}

export async function getStaticProps() {
  const archives = getArchives().slice(0, 5);
  return {
    props: {
      archives,
    },
  };
}
