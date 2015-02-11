+++
categories = ["Hugo"]
date = "2015-01-20T22:08:00+09:00"
draft = false
slug = "wordpress-to-hugo"
title = "WordPress から Hugo に乗り換えました"
excerpt = "A Fast and Flexible Static Site Generator"
image = "/images/2015/01/hugo.png"
+++

2011年8月25日から数えて3年と半年、このブログは WordPress で運営してきたのですが、この記事から [Hugo](http://gohugo.io/) という静的サイトジェネレータで運用します。

当初は WordPress も PHP も分からない微生物専攻の大学生だったのが、最近では WordPress テーマ／プラグイン作成をする仕事をしていて、時間の流れは不思議だと感じるこの頃。そして、WordPress のことが大まかに掴めたからこそ、他のブログツールを勉強したいなと思いました。

調べてみたらフロントエンドエンジニア界隈で、Go 言語で作られた Hugo という静的サイトジェネレータがなんか流行りっぽいので、それに移行しました。

- [OctopressからHugoへ移行した | SOTA](http://deeeet.com/writing/2014/12/25/hugo/)
- [Jekyllが許されるのは小学生までだよね - MOL](http://t32k.me/mol/log/hugo/)

## WordPress からの移行方法

まだ、公式に WordPress から Hugo に移行する方法がないのですが、以下の手順でだいたい出来ました。

### Hugo 導入

`go get` して Hugo を導入して、新規サイトを作成。

	$ export GOPATH=$HOME/go
	$ go get -v github.com/spf13/hugo
	$ hugo new site rakuishi.com

参考：[Hugo Quickstart Guide](http://gohugo.io/overview/quickstart/)

### 記事

- WordPress の記事情報 xml を取得する（管理画面 → Export → All content → Download Export file）
- WordPress の記事を Hugo 仕様に変換する。→ [wp-xml-hugo-import.rb](https://gist.github.com/rakuishi/3163f6e8c5a496329bc7)
- 作成した markdown（記事記述部分は、html のままだが）を content/ 以下の任意の場所に置く。このブログの場合は、content/archives/*.md

### 画像

- WordPress /wp-contents/uploads フォルダを FTP とかからローカルに落としておく
- uploads 内サムネイル用画像は、もう使わないから削除する。`find uploads -name "*-150x150.*" | xargs rm`
- uploads を images に名前を変えて static/images に配置

### テーマファイル

layouts にオリジナルテーマを書くか、テーマをクローンしてくる。テーマは、あまり揃っていないので、自作するのが吉。

	$ git clone --recursive https://github.com/spf13/hugoThemes themes

### .htaccess にリダイレクトを追加する

WordPress は /feed に、Hugo は /index.xml にフィードを吐き出しているからリダイレクト処理を static/.htaccess に書く。

	RedirectMatch 301 /feed /index.xml

### ローカル環境

ローカル環境を起動できます。`--buildDrafts` は、ドラフト記事も生成。`--watch` は、記事を保存した時に、ブラウザが自動リロードされる。http://localhost:1313/ からローカル環境が見えます。
約 420 記事あるこのブログの生成時間は、400ms ぐらいでした。

	$ hugo server --buildDrafts --watch
	$ hugo server --theme=redlounge --buildDrafts --watch

### サーバーとデータをシンクする

`rsync` コマンドで同期させている。以下のようなシェルスクリプトを書いた。

	#!/bin/sh
	hugo
	rsync -auv --delete ~/Dropbox/Private/rakuishi.com/public/ rakuishi@rakuishi.sakura.ne.jp:/home/rakuishi/www/

## 雑感

静的サイトジェネレータだから、WordPress のようにブラウザで記事を書くのではなくて、ローカルに記事を書く。記事はマークダウン形式で書けて、それを html ファイル形式で出力する。それをサーバーにシンクして完了、という流れになります。

まだ、関連記事やページネーションを導入するのが難しい成長途中のジェネレータですが、細かいところを拘らなければ特に問題ない。そういう細かいところは、これから実装されるみたい。→ [Hugo Roadmap](http://gohugo.io/meta/roadmap/)

それより WordPress のセキュリティとか、データベースとか、バックアップとか、PHP の記述をミスって画面が白くなる、というストレスから開放されるのが良いと思いました。静的サイトジェネレータだから、当然ですが、記事の読み込みが早くなった。

それと、ブログを GitHub で管理できるようになりました。

* [rakuishi/rakuishi.com](https://github.com/rakuishi/rakuishi.com)
