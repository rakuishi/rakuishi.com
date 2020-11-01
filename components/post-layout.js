import Header from "components/header";
import Footer from "components/footer";
import Date from "components/date";
import styles from "styles/markdown.module.css";

export default function PostLayout({ post }) {
  return (
    <>
      <Header />
      <main className="layout">
        <div className="layout_meta">
          <Date dateString={post.date} />
        </div>
        <h1 className="layout_title">{post.title}</h1>
        <div
          className={styles.markdown}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
      <Footer />

      <style jsx>{`
        .layout {
          max-width: var(--max-width);
          margin: 0 auto 48px;
          padding: 0 16px;
        }
        .layout_meta {
          margin-bottom: 4px;
          color: var(--secondary-text-color);
          font-size: 15px;
          font-family: var(--mono-font-family);
        }
        .layout_title {
          font-size: 28px;
          margin-bottom: 48px;
        }
      `}</style>
    </>
  );
}
