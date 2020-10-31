import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_inner">
        <h2 className="footer_title">About this site</h2>
        <p className="footer_about">
          はじめまして。rakuishi といいます。大学在籍中（微生物学を専攻）の 2012
          年 1 月に趣味で初めた iOS
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
          .footer_title {
            font-size: 18px;
            margin-bottom: 8px;
          }
          .footer_about {
            margin-bottom: 24px;
            color: var(--secondary-text-color);
          }
          .footer_analytics {
            margin-bottom: 24px;
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
