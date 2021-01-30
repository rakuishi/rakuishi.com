import Link from "next/link";
import Header from "components/header";
import Footer from "components/footer";
import Date from "components/date";

export default function PostListLayout({ title, posts }) {
  return (
    <>
      <Header />
      <section className="layout">
        <h1 className="layout_title">{title}</h1>
        <ul className="layout_list">
          {posts.map(({ title, date, slug, summary }) => (
            <li key={slug} className="layout_list_item">
              <Link href={`/archives/${slug}/`}>
                <a className="layout_list_item_inner">
                  <div className="layout_list_item_meta">
                    <Date dateString={date} />
                  </div>
                  <h2 className="layout_list_item_title">{title}</h2>
                  <div className="layout_list_item_summary">{summary}</div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Footer />

      <style jsx>
        {`
          .layout {
            max-width: var(--max-width);
            margin: 0 auto 48px;
          }
          .layout_title {
            color: var(--secondary-text-color);
            font-size: 20px;
            margin: 16px 0 16px 16px;
          }
          .layout_list {
            list-style: none;
          }
          .layout_list_item_inner {
            display: block;
            padding: 16px;
            border-radius: 8px;
          }
          .layout_list_item_inner:hover {
            background: var(--secondary-background-color);
          }
          .layout_list_item_meta {
            margin-bottom: 4px;
            color: var(--secondary-text-color);
            font-size: 15px;
            font-family: var(--mono-font-family);
          }
          .layout_list_item_title {
            margin-bottom: 4px;
            color: var(--primary-text-color);
            font-size: 20px;
          }
          .layout_list_item_summary {
            color: var(--secondary-text-color);
            font-size: 15px;
          }
        `}
      </style>
    </>
  );
}
