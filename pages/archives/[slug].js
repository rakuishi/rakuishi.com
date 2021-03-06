import { getArchives, getPostSlugs, getPost } from "api/posts";
import Head from "components/head";
import PostLayout from "components/post-layout";

export default function Post({ post }) {
  return (
    <>
      <Head props={post} />
      <PostLayout post={post} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = getPostSlugs(getArchives());
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return {
    props: {
      post,
    },
  };
}
