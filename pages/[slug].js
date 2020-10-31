import { getPages, getPostSlugs, getPost } from "../api/posts.js";
import Layout from "components/post-layout";

export default function Post({ post }) {
  return <Layout post={post} />;
}

export async function getStaticPaths() {
  const paths = getPostSlugs(getPages());
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
