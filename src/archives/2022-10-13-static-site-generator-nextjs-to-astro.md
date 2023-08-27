---
categories:
  - JavaScript
date: "2022-10-13T20:52:16+09:00"
page: false
slug: static-site-generator-nextjs-to-astro
title: "静的サイトジェネレーターを Next.js から Astro に乗り換えた 🧑‍🚀"
---

2011 年当初 WordPress で書き始めたこのブログは、途中からは Hugo による静的サイトに置き換わり、その次は Next.js, そしてこの記事からは [Astro](https://astro.build/) を採用しています。

新しいものを勉強することが移行の一番のモチベーションでしたが、結果として Next.js に感じていた不満を解消することが出来ました。

Next.js の不満点としては、静的サイト出力はあくまで機能の一部であり（個人的感想です）、ブログ用途にしては機能過多感がありました。また、サイトマップやフィードの静的出力に難があり、未だに適切な書き方が分からず敗北感が拭えませんでした。追い打ちとなったのは、先日 8 万字弱の記事を公開したかったのですが、これが差分更新のパフォーマンス劣化を及ぼすとして公開できず… 😢

そんな折、静的サイト出力（SSG）とサーバーサイドレンダリング（SSR）をサポートしている Astro を知り、この数日ブログを書き直してみました。

Astro は Next.js のように Web アプリケーションを作るのではなくドキュメントベースのウェブサイトを作るのに適しています。Astro によるブログの静的サイト出力の基本的な実装方法は、Vue.js や Next.js に慣れた人ならば[このブログの GitHub レポジトリ](https://github.com/rakuishi/rakuishi.com)や[公式サイトのテーマ集](https://astro.build/themes/)を見ればカバーできるほど、特に変わったルールはありません。

ということで、この記事では Next.js と Astro の比較と、現状の課題を紹介します。

## Next.js vs Astro

Next.js は静的サイト出力できますが、中身は JavaScript の塊です。サイトが見れるようになるまでは、細切れの JavaScript を読み込んだり、その JavaScript を評価する必要があります。一方、Astro は JavaScript を極限まで省くことを設計思想としています。

例えば、Astro はビルド時に利用されていない JavaScript が lightweight HTML に置き換わる機能があります（あまり理解できていないですが）。また、`<script>` タグもデフォルトで消されるため `<script is:inline>` のように書く必要があります。

この JavaScript によるパフォーマンスを比較するために Developer Tools の値を見てみます。実際に、このブログを Next.js で書いていた時は次のような数値でした。\*.js を中心に 24 requests が発生し、DOMContentLoaded が呼ばれるまでに 450 ms 掛かっていました。

<img alt="Performance Next.js" src="/images/2022/10/performance-nextjs.png" width="839" height="751">

比較して Astro は 6 request の DOMContentLoaded は 33 ms でした。10 倍以上もページ読み込みのパフォーマンスが良いことが分かります。

<img alt="Performance Astro" src="/images/2022/10/performance-astro.png" width="839" height="751">

もちろん Next.js では（ユーザーの知らない間に）次のページを JSON として取得し、次のページの描画速度に貢献する差分更新があるため、ページ遷移のパフォーマンスは期待できる面があります。一方 Astro はページごとに HTML を取得し直すため、確かにページ遷移の体験の良さは少し Next.js に軍配が上がります。

が、少なくとも初回ページ表示の速度は Astro が圧倒的ですし、Next.js のページ遷移の体験の良さも普通の人間はまったく気付かないレベルだと思います。

## ローカルサーバー立ち上げ時間の課題

Astro には、ブログを実装するには十分な機能が揃っており、Next.js で実装していたのと同じ機能を提供することが出来ましたが、課題がひとつ残っています。

このブログでは 500 記事以上あるのですが、`npm run dev` コマンドを打ってローカルサーバーを立ち上げる時、ブラウザで確認できるまでに 5, 6 秒ほど時間がかかります。ちなみに、立ち上がった後は変更がリアルタイム反映されるのですが、これのストレスはまったくありません。

手元の挙動を確かめてみるに、すべての記事が `Astro.glob` により読み込まれた後 remark 処理（コードハイライト、自作ショートコード変換、自作説明文追加）が評価されており、記事数分遅くなるような処理になっています。

`Astro.glob` が最新の記事しか読み込まないように出来ないか、など調べて見たのですが、解決の糸口が見つけられず現状ではお手上げ状態です。