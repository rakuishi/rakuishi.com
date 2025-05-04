---
category: tech
date: "2025-05-04T14:02:51+09:00"
page: false
slug: astro-v570-upgrade
title: "静的サイトジェネレータ Astro で運用しているブログの環境整備（Astro v5.7, Content Layer API, Temporal）"
---

静的サイトジェネレータ [Astro](https://astro.build/) で運用しているブログの環境整備を行いました。

Astro v5.7 で利用できる機能や、日時ライブラリ Temporal の採用など、最新の環境になるように色々と手を加えました。この記事では変更点を共有していきます。

## Content Layer API

`import.meta.glob` によるブログ記事一覧の読み込み処理を [Content Layer API](https://docs.astro.build/en/guides/content-collections/) に変更しました。

従来は以下のようにブログ記事を読み込んでいました：

```ts
const posts = Object.values(
    import.meta.glob('@/posts/*.md', { eager: true })
);
```

Content Layer API 移行するためには、次の変更が必要になります。

1. src/content/posts/*.md にブログ記事のマークダウンファイルを移動する（posts は任意）
2. src/content/config.ts を設置する
3. `getCollection` を使用して記事一覧を読み込む

config.ts は次のように記述します：

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.enum(["blog", "tech"]).default("blog"),
    date: z.coerce.date(),
    page: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

[Zod](https://zod.dev/) により、スキーマの定義を行います。これはブログ記事のマークダウンファイルの先頭に埋め込まれるメタデータと一致する必要があります。記事一覧を取得する際、スキーマエラーが出る場合はメタデータがズレていることがあります。

次に `getCollection` を行って記事一覧を取得する関数例です：

```ts
// posts.ts
import { type CollectionEntry, getCollection } from "astro:content";

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  return (await getCollection("posts"))
    .sort((a, b) => {
      return b.data.date.getTime() - a.data.date.getTime();
    });
}
```

後は、次のように既存の `import.meta.glob` を置き換えます。

```ts
import { getPosts } from "@/posts"

const posts = await getPosts();
```

## date-fns → Temporal 

JavaScript の `Date` の問題点（フォーマットやタイムゾーンの扱いが難しいなど）を解決するために、date-fns の日時ライブラリを利用していましたが、将来的にブラウザに標準実装される見込みのある [Temporal](https://tc39.es/proposal-temporal/docs/index.html) を導入してみました。

Polyfill の [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill) を利用しています。

とはいえ日時ライブラリではお馴染みのフォーマット処理は得意ではなく、例えば記事のファイル名を作成する処理は以下のように記述しました：

```ts
// date-fns
import { format } from "date-fns";

const date = new Date();
const formattedDate = format(date, "yyyy-MM-dd");
```

```ts
// Temporal
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.zonedDateTimeISO("Asia/Tokyo");
const year = now.year.toString().padStart(4, "0");
const month = now.month.toString().padStart(2, "0");
const day = now.day.toString().padStart(2, "0");
const formattedDate = "${year}-${month}-${day}";
```

参考：[Temporal で JavaScript の次世代の日時処理に触れてみる](https://qiita.com/sangotaro/items/8ee4b0f40cbcf3f12784)

## SVG Components

HTML に `<svg>` を直接書いていたのですが、[Astro v5.7](https://astro.build/blog/astro-570/) で正式に利用できるようになった SVG Componemts に置き換えました。

```ts
import DarkIcon from "@/assets/theme-dark-icon.svg";
---
<DarkIcon
  id="theme_dark_icon"
  aria-label="Darkmode"
  width="20px"
  height="20px"
/>
```

ちなみに、`<img>` タグからファイルを参照するのではなく、直接書いている理由は HTTP リクエスト数を減らすための工夫です。

## Path aliases

インポートの相対パスによる記述が面倒になってきたため、src ファイル起点にパスを記述できる [Path aliases](https://docs.astro.build/en/guides/imports/#aliases) を今更ながら導入しました。

```ts
import Header from "../components/Header.astro";
// ↓ @ は src を指すようになる
import Header from "@/components/Header.astro";
```

```json
// tsconfig.json
{
  /* 省略 */
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Biome

まだこのブログには導入していなかった Linter, Formatter として [Biome](https://biomejs.dev/) を導入しました。Biome はまだ [Astro には部分対応](https://biomejs.dev/ja/internals/language-support/) になりますが、*.astro ファイルの TypeScript 部分は効きます。

```sh
% npm install --save-dev --save-exact @biomejs/biome
% npx @biomejs/biome init
```

生成される設定ファイル biome.json に `"globals": ["Astro"]` を記述します。

```json
// biome.json
{
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    },
    "globals": ["Astro"]
  }
}
```

```json
// package.json
"scripts": {
    "check": "npx @biomejs/biome check --write ./src"
},
```

導入後、`% npm run check` を行えば src 以下のファイルに対してフォーマット処理が走ります。事前のコミットをお忘れなく。

また、VS Code 上で動かすには、別途 Biome 拡張機能のインストールが必要になります。
