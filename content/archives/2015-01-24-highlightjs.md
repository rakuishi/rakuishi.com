+++
categories = ["JavaScript"]
date = "2015-01-24T18:16:24+09:00"
draft = false
slug = "highlightjs"
title = "シンタックスハイライトに highlight.js を使うことにしました"
+++

ブラウザで実行されるクライアントサイドのシンタックスハイライト（ソースコードを意味ごとに色付けしてくれる）に、[google-code-prettify](https://code.google.com/p/google-code-prettify/) を使用していたのですが、[highlight.js](https://highlightjs.org/) に乗り換えました。

## 経緯

prettify は、ハイライトするコード部分を `<pre class="prettyprint"> ~ </pre>` で囲う必要がありました。

ですが、先日から記事をマークダウンで記述するようになり、コード部分が、`<code><pre> ~ </pre></code>` に変換されるため、クラスを指定する prettify が使えなくなりました。

## highlight.js 導入

ブログに JavaScript と、CSS を読み込ませるだけです。ハイライトする部分は、`<code><pre> ~ </pre></code>` 形式で囲まれている必要があります。

[Getting highlight.js](https://highlightjs.org/download/) からダウンロードすることもできますし、CDN で配信されているので、自分のブログにコードを貼り付けるだけで OK です。

スタイルシートをヘッダーに貼り付けます。デモページから好きなテーマを探せます。→ [highlight.js demo](https://highlightjs.org/static/demo/)

	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/default.min.css">

JavaScript をフッター部分に貼り付けます。これをヘッダー部分に貼った場合、ブロッキング JavaScript になるので、フッター部分である `</body>` の直前に記述するのが良いです。

	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>
	<script>hljs.initHighlightingOnLoad();</script>

以上の手順で、記事中のソースコード記述部分が、シンタックスハイライトされます。手軽にブログ記事を華やかにできるので、オススメです。
