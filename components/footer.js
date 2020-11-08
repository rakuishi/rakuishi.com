import Link from "next/link";
import { categories } from "constants/categories";
import { switchDarkmode } from "utils/darkmode";

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
            アプリ開発が高じて、アプリ開発とフロントエンド・デベロッパを仕事にしています。個人開発した
            Quicka が有料アプリ 5
            位でした（過去の栄光）。このサイトは私個人によるブログです。会社とは関係ありません。2011
            年 8 月から記事を書いています。
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

          <p className="footer_copyright">© 2011-2020 rakuishi</p>
        </section>

        <section className="footer_section">
          <button
            className="footer_darkmode"
            onClick={React.useCallback(() => {
              switchDarkmode();
            })}
          >
            <svg
              enable-background="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m0 0h24v24h-24z" fill="none" />
              <path d="m12.34 2.02c-5.75-.2-10.34 4.4-10.34 9.98 0 5.52 4.48 10 10 10 3.71 0 6.93-2.02 8.66-5.02-7.51-.25-12.09-8.43-8.32-14.96z" />
            </svg>
          </button>
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
            padding: 0 16px;
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
            border-radius: 8px;
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
            border-radius: 8px;
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
            margin-bottom: 24px;
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
          .footer_darkmode {
            cursor: pointer;
            outline: none;
            transition-duration: 0.4s;
          }
          .footer_darkmode:hover {
            transform: rotate(-45deg);
          }
        `}
      </style>
    </footer>
  );
}
