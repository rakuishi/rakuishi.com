import Link from "next/link";
import { categories } from "constants/categories";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_inner">
        <section className="footer_section">
          <form action="//google.com/search" method="get">
            <input
              type="text"
              name="q"
              placeholder="サイト内検索"
              autoComplete="off"
              className="footer_searchbar"
              aria-label="Search"
            />
            <input
              type="hidden"
              name="sitesearch"
              value="http://rakuishi.com"
            />
          </form>

          <p className="footer_categories">
            {categories.map(({ name, slug }) => (
              <Link href={`/categories/${slug}/`} key={slug}>
                <a className="footer_category">{name}</a>
              </Link>
            ))}
          </p>
        </section>

        <section className="footer_section">
          <h2 className="footer_title">Hey, I'm rakuishi</h2>
          <p className="footer_about">
            はじめまして。
            <Link href="/about/">
              <a>rakuishi</a>
            </Link>{" "}
            といいます。大学在籍中（微生物学を専攻）の 2012 年 1
            月に趣味で初めた iOS
            アプリ開発が高じて、アプリ開発とフロントエンド・デベロッパを仕事にしています。個人開発した{" "}
            <Link href="/quicka2/">
              <a>Quicka</a>
            </Link>{" "}
            が有料アプリ 5
            位でした（過去の栄光）。このサイトは私個人によるブログです。会社とは関係ありません。2011
            年 8 月から記事を書いています。過去の記事は
            <a href="/archives">こちら</a>から見れます。
          </p>

          <p className="footer_analytics">
            このウェブサイトでは訪問者の行動を把握するために{" "}
            <a
              href="https://www.google.com/analytics/terms/jp.html"
              rel="noopener"
              target="_blank"
            >
              Google アナリティクス
            </a>
            を設置しています。その際、お使いのブラウザに{" "}
            <a
              href="https://policies.google.com/technologies/cookies"
              rel="noopener"
              target="_blank"
            >
              Cookie
            </a>{" "}
            を設定したり、既存の Cookie を読み取ったりする場合があります。
          </p>

          <p className="footer_copyright">© 2011-2021 rakuishi</p>
        </section>
      </div>
      <style jsx>
        {`
          .footer {
            padding: 48px 0;
            background: var(--secondary-background-color);
          }
          .footer_inner {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 24px;
          }
          .footer_section {
            margin-bottom: 24px;
          }
          .footer_section:last-child {
            margin-bottom: 0;
          }
          .footer_searchbar {
            display: inline-block;
            width: 100%;
            height: 44px;
            margin-bottom: 12px;
            padding: 12px;
            font-size: 16px;
            line-height: normal;
            outline: none;
            appearance: none;
            color: var(--primary-text-color);
            background-color: var(--primary-background-color);
            border: 2px solid var(--border-color);
            border-radius: 5px;
          }
          .footer_searchbar::placeholder {
            color: var(--secondary-text-color);
            opacity: 1;
          }
          .footer_searchbar:focus {
            border-color: var(--link-color);
          }
          .footer_category {
            display: inline-block;
            padding: 2px 10px;
            margin: 0 4px 4px 0;
            font-size: 14px;
            font-family: var(--mono-font-family);
            color: var(--secondary-text-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            background-color: var(--primary-background-color);
          }
          .footer_category:hover {
            border-color: var(--link-color);
          }
          .footer_title {
            font-size: 18px;
            margin-bottom: 8px;
          }
          .footer_about {
            margin-bottom: 12px;
            font-size: 14px;
            color: var(--secondary-text-color);
          }
          .footer_about a:hover {
            text-decoration: underline;
          }
          .footer_analytics {
            margin-bottom: 12px;
            font-size: 14px;
            color: var(--secondary-text-color);
          }
          .footer_analytics a:hover {
            text-decoration: underline;
          }
          .footer_copyright {
            font-size: 14px;
            color: var(--secondary-text-color);
          }
        `}
      </style>
    </footer>
  );
}
