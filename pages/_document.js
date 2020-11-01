import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta
            name="google-site-verification"
            content="hLAob0ZIhg0c3AeIGNo4AMQPkxMjM1UM3mBPYNvwceE"
          />
          <link
            rel="preload"
            href="/assets/fonts/NotoSans-Regular.woff2"
            as="font"
            type="font/woff2"
            crossorigin
          />
          <link
            rel="preload"
            href="/assets/fonts/NotoSans-Bold.woff2"
            as="font"
            type="font/woff2"
            crossorigin
          />
          <script async src="/assets/javascripts/ga.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
