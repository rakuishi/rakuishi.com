---
categories:
- 開発
date: 2016-04-18T21:21:09+09:00
draft: falce
slug: aniradime
title: "ネット配信されているアニラジの更新情報をまとめたサイトを作った"
---

仕事で RESTful API サーバーを Ruby on Rails で開発した。その時の勉強のために借りた VPS（仮想専用サーバー）を再利用して、普段聴いているアニラジの更新情報をまとめたサイトを作った。

大学生の頃に「とある科学の超電磁砲」のネットラジオを聴いて以来、普通のひとがテレビを見るように、だいたいネットラジオを聴いている。また、面白い番組が増えていて、チェックするのが大変だった。そのような経緯があり、久しぶりに自分が欲しいものを作った次第である。勉強すると、自分の思うようになる瞬間が増えるのが喜ばしい。

{{<img alt="" src="/images/2016/04/aniradime.png" width="728" height="546">}}

* [aniradime](http://radio.rakuishi.com/)
* [rakuishi/aniradime: Gather anime radio waves.](https://github.com/rakuishi/aniradime)

## Library

この機会に勉強して採用したライブラリなどを紹介してみる。

### [Nokogiri](http://www.nokogiri.org/)

RSS が提供されていないサイトの情報を感謝の気持ちを持って抜き出すために（ちゃんと配信元を書いている）、スクレイピングでよく使われる Nokogiri を採用した。以下のように、スクレイピングのコードが簡単に書ける。

```rb
doc = Nokogiri::HTML(open(url))
doc.xpath('//ul[@class="radioList"]//li[@class="radio"]').each do |node|
  puts node.xpath('div[@class="name"]').inner_text
end
```

### [Slim - A Fast, Lightweight Template Engine for Ruby](http://slim-lang.com/)

Ruby on Rails に標準で導入されている ERB で満足していたのですが、試しに Slim を採用してみた。括弧を省略するのと、インデントを適切に揃えれば、問題なく動作するのが学習コストが少なくてよかった。また、自動で HTML 圧縮されるから、[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?hl=ja) の点数が上がる。

### [Lazy Load Plugin for jQuery](http://www.appelsiini.net/projects/lazyload)

画像のリクエスト数を抑えるために採用してみた。`background-image` にも対応していた。

### [Support for theme-color in Chrome 39 for Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)

```html
<meta content="#00cdac" name="theme-color" />
```

メタタグに上記のコードを置くと Android の Chrome アプリのヘッダーカラーを指定できる。Recent Apps の色も変わる。

### [rakuishi/jquery-infinite-scroll](https://github.com/rakuishi/jquery-infinite-scroll)

2 週間ぐらい前に書いたコードを再利用して、Ajax による読み込み処理を書いた。Rails4 から導入されている Turbolink でも出来るのかもしれないけれど、学習コストが高そうで諦めた。

## Special Thanks

日常の空隙を埋めてくれるネットラジオ配信会社さんに多謝です。これからもお世話になります。
