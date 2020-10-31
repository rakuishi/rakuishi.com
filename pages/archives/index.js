import Head from "next/head";
import { getArchives } from "api/posts.js";
import PostListLayout from "components/post-list-layout";

export default function Home({ archives }) {
  return (
    <>
      <Head>
        <title>Archives | rakuishi.com</title>
      </Head>

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
