---
categories:
  - JavaScript
date: "2020-11-07T09:49:48+09:00"
page: false
slug: static-site-generator-hugo-to-nextjs
title: "静的サイトジェネレーターを Hugo から Next.js に乗り換えた"
---

職場のプロジェクトに Next.js を導入する事例が増え、流石に勉強するかと Next.js のチュートリアルを触りました。以前、チュートリアルを遠目に眺めた感じでは Next.js は Server Side Rendering フレームワークという印象でしたが、v9.3.0 以降 Static Site Generation（以降、SSG）機能に注力しているように見えます。

特に、チュートリアルが Markdown 管理されているブログを作る内容となっており、「お前のブログを作り直せ」というメッセージをひしひしと感じ、今回 Hugo から Next.js に乗り換えました。

この記事では Hugo から Next.js に乗り換えた際、実装で躓いた部分などを書いていきます。また、ブログのソースコードは [rakuishi/rakuishi.com](https://github.com/rakuishi/rakuishi.com) に置いています。

## 静的 HTML 出力する

まずは [Next.js のチュートリアル](https://nextjs.org/learn/basics/create-nextjs-app) を参考にプロジェクトを作った後、これを静的 HTML 出力するには、まず `package.json` の `scripts` に以下の記述を追加します：

```js
{
  "scripts": {
    "export": "npm run build && npm run export"
  }
}
```

そして `npm run export` を叩けば `out` フォルダに HTML ファイルが出力されます。後は、`out` フォルダに移動し `php -S localhost:8000` でローカルサーバーを立ち上げれば動作確認まで行えます。

自分の場合、ホスティングに Firebase を利用しているため、`firebase.json` の `public` を `out` に変更し：

```js
{
  "hosting": {
    "public": "out"
  }
}
```

`firebase deploy` を叩けばデプロイされました。

## Trailing Slash（フォルダ + index.html）を出力する

デフォルト設定では `pages/about.js` は `/about` と見做され `/about/` と書いても `/about` にリダイレクトされます。また 静的 HTML 出力の際、`/about.html` に置かれます。

Hugo では `/about/index.html` として出力し `/about/` を指していたため、この動作に揃えることにし、Next.js に Trailing Slash の設定を追加します。

`next.config.js` ファイルを作成し、`trailingSlash` を追加します：

```js
module.exports = {
  trailingSlash: true,
};
```

設定後、`/about/` にアクセスできるようになり、静的 HTML 出力の際、`/about/index.html` に置かれます。

## サイトマップとフィード対応

Next.js 公式のサンプル集には sitemap.xml は next-sitemap プラグインを利用した方法、`next.config.js` に記述し `isServer` 時にスクリプトを走らせる方法があります。

- [next-sitemap example](https://github.com/vercel/next.js/tree/canary/examples/with-next-sitemap)
- [With Sitemap example](https://github.com/vercel/next.js/tree/canary/examples/with-sitemap)

サイトマップもフィードも同じように扱おうとすると、後者が都合良いと思ったのですが、本体のブログ記事一覧を出力する処理は `import` を利用し、新しく追加する sitemap.xml 出力用のスクリプトは `require` を利用しています。

すると似たようなコードを同プロジェクト上で 2 回書く必要があり、エレガントさ不足を感じました。このあたりは自分の JavaScript の知識不足もあると思います。

最終的には、野性味あふれるエレガントな方法を採用しました。全ブログ記事を出力する `/pages/archives/index.js` の `getStaticProps` 時に、サイトマップとフィードを出力するようにしています。

```js
import { generateFeed, generateSitemap } from "utils/generator";

/* 省略 */

export async function getStaticProps() {
  const archives = getArchives();

  generateFeed(archives);
  generateSitemap(archives);

  return {
    props: {
      archives,
    },
  };
}
```

## `getStaticProps` は `Date` オブジェクトを扱えない

YAML front matter を `*.md` に記述してブログ記事を管理しているのですが、この YAML 部分を処理する `gray-matter` を経由した `getStaticProps` が次のエラーを吐くことがありました。

```
Error: Error serializing `.post.date` returned from `getStaticProps` in "/archives/[slug]".
Reason: `object` ("[object Date]") cannot be serialized as JSON. Please only return JSON serializable data types.
```

これは `*.md` の先頭部分の日付がダブルクオーテーションなしだと `gray-matter` は `Date` オブジェクトと見做すのが間接的な原因でした。

```yaml
---
date: 2020-11-07T09:49:48+09:00
---

```

特に `Date` オブジェクトに拘っていないため、ダブルクオーテーションで囲ってあげました。日付の処理は UI 表示時に `date-fns` の `parseISO` を利用して行っています。

```yaml
---
date: "2020-11-07T09:49:48+09:00"
---

```

## カスタムフォントの定義場所

Next.js のチュートリアルにあるようにグローバルな CSS は、`/pages/_app.js` の `import "styles/global.css"` として読み込む方法があります。

これを利用して `/styles/global.css` にカスタムフォントの `@font-face` を定義していたのですが、この実装方法だと静的 HTML 出力した際、初回表示時はカスタムフォントがあたるのに、画面遷移後にカスタムフォントがあたらない現象が発生しました。

少し調べたものの原因が分からないため、最終的には `/pages/_app.js` 内にカスタムフォントの定義を埋め込みました。これだと綺麗に動作しました。

```jsx
import "styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        @font-face {
          font-family: "NotoSans";
          font-style: normal;
          font-weight: 400;
          font-display: optional;
          src: local("NotoSansCJKjp-Regular.otf"), local(
              "NotoSansJP-Regular.otf"
            ), url("/assets/fonts/NotoSans-Regular.woff2") format("woff2");
        }
        @font-face {
          font-family: "NotoSans";
          font-style: normal;
          font-weight: 700;
          font-display: optional;
          src: local("NotoSansCJKjp-Bold.otf"), local("NotoSansJP-Bold.otf"),
            url("/assets/fonts/NotoSans-Bold.woff2") format("woff2");
        }
      `}</style>
    </>
  );
}
```

## ダークモードを実装する方法

Hugo を利用していた時は、LocalStorage + 属性セレクタによるダークモードを実装していました。LocalStorage にダークモードの設定情報を保存し、それを `<head>` 内の `<script>` で処理することにより、最初の画面レンダリングから違和感なくダークモードが反映された状態になります。

Next.js に則った実装をするならば、`pages/_app.js` 時にダークモード判定させることになるのでしょうが、評価タイミングが遅く、一瞬白い画面が表示された後にダークモードが反映されます。恐らく Next.js の動作に必要な JavaScript ファイル群は静的 HTML が画面描画された後に、評価されるからだと思います。

仕方なく従来の挙動に倣い `pages/_document.js` の `<Head>` 内に、以下のようにダークモードの設定情報を読み込む JavaScript を埋め込みました。

```jsx
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
```

ダークモードを切り替えるコードは LocalStorage を利用するため `React.useCallback` 内に書きます：

```js
<button
  onClick={React.useCallback(() => {
    const isDarkmode = localStorage.getItem("prefers-color-scheme") === "dark";
    const scheme = isDarkmode ? "light" : "dark";
    localStorage.setItem("prefers-color-scheme", scheme);
    document.documentElement.setAttribute("data-prefers-color-scheme", scheme);
  })}
/>
```

## Markdown のスタイルの反映方法

Markdown を `remark` を使って HTML に変換した後、それにスタイルを反映するには、CSS Modules という機能を利用します。まず、`dangerouslySetInnerHTML` プロパティを利用して HTML を出力し、`className={styles.markdown}` という命名規則でそれらにスタイルを反映します。

```jsx
import styles from "styles/markdown.module.css";

export default function PostLayout({ post }) {
  return (
    <>
      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </>
  );
}
```

`styles/markdown.module.css` には次のようにスタイルが書かれています。

```css
.markdown h2 {
  position: relative;
  width: fit-content;
  margin: 72px 0 24px;
  padding-bottom: 12px;
  font-size: 24px;
  color: var(--primary-text-color);
}
```

## Hugo Shortcode の移行

このブログでは画像を `loading="lazy"` 付きで表示したり、Amazon のアフィリエイトリンクを付与する処理を Hugo Shortcode を利用して展開していました。

この Shortcode は便利なので使い続けることにし、Markdown を `remark` を使って HTML に変換する前に置換する処理をだらだらと書きました：

```js
content = content.replace(
  /{{<img alt="(.*?)" src="(.+?)" width="(\d*?)" height="(\d*?)">}}/g,
  '<p><img alt="$1" src="$2" width="$3" height="$4" loading="lazy"></p>'
);
```
