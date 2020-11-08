import { getArchives } from "api/posts";
import { getCategory, getCategorySlugs } from "constants/categories";
import Head from "components/head";
import PostListLayout from "components/post-list-layout";

export default function Categories({ archives, category }) {
  return (
    <>
      <Head props={{ title: category.name }} />
      <PostListLayout title={category.name} posts={archives} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = getCategorySlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const archives = getArchives(params.slug);
  const category = getCategory(params.slug);
  return {
    props: {
      archives,
      category,
    },
  };
}
