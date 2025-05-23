---
category: blog
date: "2015-04-01T01:33:36+09:00"
slug: junk-code-in-march-2015
title: "Junk code in March 2015"
---

今年は、GitHub の Contributions Calendar に、緑色のタイルをたくさん並べるのが目標です。3 月は、今まで触れたことのない分野を勉強できたから、この記事ではメモがてら作ったものを紹介していきます。

<img alt="contributions" src="/images/2015/04/contributions.jpg" width="728" height="283">

## [memol](https://github.com/rakuishi/memol)

Polymer という Google が作っている Web Components のフレームワークで付箋メモアプリを作った。

<img alt="memol" src="https://raw.githubusercontent.com/rakuishi/static/master/images/memol.png">

## [Memol-iOS](https://github.com/rakuishi/Memol-iOS)

久しぶりに、iOS アプリ開発をしようと思い、どうせならと Swift を触ることにした。練習としてマークダウンが書けるエディタアプリを作ることにした。とりあえず動くものは作れた。Objective-C で書くのと比べて、簡潔に書ける印象だった。ただ、Swift の言語仕様については、全然理解していないから、仕事で使うならがっつり勉強する必要があると思った。

まだ実装していない機能：

- 全画面に貼り付けている UITextView が 1 行の時でもスクロールバウンス可能にする。できれば、UITextView のサブクラスで作ってみたいが、難しいのだろうか？
- キーボード上部に、記号が簡単に入力できる補助キーボードを実装する

## [undercoat](https://github.com/rakuishi/undercoat)

仕事でサイトを作る時に、だいたい似たようなグリッドとか、汎用コンポーネントを使いまわしているから、Boilerplate 的なものを作ってみた。機能としては、以下のような感じです：

- HTML5-Reset
- gulp.js による SCSS コンパイル環境
- BrowserSync によるローカルサーバー起動
- SMACSS 的な記述手法
- Twitter と Facebook の Open Graph Protocol 記述済

今までは、サイトを作るたびに、過去に自分が書いたコードからコピペしていたのだけれど、一点にまとまったから、とても（コピペが）楽である。

## [jquery-responsive-image](https://github.com/rakuishi/jquery-responsive-image)

画面幅に応じて画像を出し分けるのを簡単にする jQuery プラグインを書いた。似たようなプラグインがどこかに転がっていると思うけれど、探せる範囲では使い勝手の良いものがなかった。カスタムデータ属性 `data-*` に、端末ごとに異なる画像パスを指定して使える。

    <img src="images/mobile.png"
         data-mobile="images/mobile.png"
         data-phablet="images/phablet.png"
         data-tablet="images/tablet.png"
         data-desktop="images/desktop.png"/>

    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="../jquery.responsive-image.js"></script>
    <script type="text/javascript">
      $("body").responsiveImage({
        mobile : 400,
        phablet: 550,
        tablet : 750,
        desktop: 1000,
      });
    </script>
