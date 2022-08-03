import Link from "next/link";
import Header from "components/header";
import Footer from "components/footer";
import Date from "components/date";
import styles from "styles/markdown.module.css";
import { getCategorySlug } from "constants/categories";

export default function PostLayout({ post }) {
  return (
    <>
      <Header />
      <article
        className="layout"
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <div className="layout_meta">
          <Date dateString={post.date} />
          {post.categories && post.categories.length > 0 && (
            <>
              {"・"}
              <Link
                href={`/categories/${getCategorySlug(post.categories[0])}/`}
              >
                <a className="layout_meta_category">{post.categories[0]}</a>
              </Link>
            </>
          )}
        </div>
        <h1 className="layout_title" itemProp="name">
          {post.title}
        </h1>
        <div
          className={styles.markdown}
          itemProp="text"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
      <Footer />

      <style jsx>{`
        .layout {
          max-width: var(--max-width);
          margin: 0 auto 48px;
          padding: 0 24px;
        }
        .layout_meta {
          margin-bottom: 4px;
          color: var(--secondary-text-color);
        }
        .layout_meta_category {
          color: var(--secondary-text-color);
        }
        .layout_meta_category:hover {
          text-decoration: underline;
        }
        .layout_title {
          font-size: 28px;
          margin-bottom: 48px;
        }
      `}</style>
    </>
  );
}
