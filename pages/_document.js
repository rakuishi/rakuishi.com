import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta
            key="google-site-verification"
            name="google-site-verification"
            content="hLAob0ZIhg0c3AeIGNo4AMQPkxMjM1UM3mBPYNvwceE"
          />
          <link
            rel="preconnect"
            href="https://www.google-analytics.com"
            crossOrigin="anonymous"
          />
          <script async src="/assets/javascripts/ga.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
(function () {
  let scheme = "light";
  
  if (localStorage.getItem("prefers-color-scheme")) {
    scheme = localStorage.getItem("prefers-color-scheme");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    scheme = "dark";
  }
  
  document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
}());`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
