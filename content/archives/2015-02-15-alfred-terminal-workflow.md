+++
categories = ["Mac"]
date = "2015-02-15T11:32:16+09:00"
draft = false
slug = "alfred-terminal-workflow"
title = "現在 Finder で表示しているフォルダ位置を Terminal で開く Alfred WorkFlow を作りました"

+++

ランチャーアプリ Alfred の Powerpack を買うと、ユーザーが組んだスクリプト（Workflow）を動かすことができる。以前から自分も作ってみようと思っていたが、どこから手を付ければよいかよく分からなった。

そんな折、Workflow をまとめた [GitHub リポジトリ](https://github.com/zenorocha/alfred-workflows) を発見した。これらの中身を覗きながら、自分でも作ってみた。

## Alfred Terminal WorkFlow

現在 Finder で表示しているフォルダ位置を Terminal で開く Workflow を作った。

* [rakuishi/alfred-terminal-workflow](https://github.com/rakuishi/alfred-terminal-workflow)

以下のスクリーンキャストを見ると動作がわかりやすいと思う。

![](https://raw.githubusercontent.com/rakuishi/static/master/images/alfred-terminal-workflow.gif)

Finder を開いていて、Alfred 上に `terminal` と入力することで Terminal を起動するようにしている。ダウンロードは[ここから](https://github.com/rakuishi/alfred-terminal-workflow/blob/master/Terminal.alfredworkflow?raw=true)、もしくは[リポジトリ](https://github.com/rakuishi/alfred-terminal-workflow)をクローンする。

ダウンロードした Terminal.alfredworkflow を起動すれば、インストールされる。

## Alfred Workflow でしていること

実際には、Alfred 内で以下の AppleScript を呼び出している。

	on alfred_script(q)
		tell application "Finder"
			set selections to selection
			if ((count of selections) > 0) then
				set myPath to (quoted form of POSIX path of (item 1 of selections as alias))
				tell application "Terminal"
					activate
					tell window 1
						do script "cd $(dirname " & myPath & "); clear"
					end tell
				end tell
			end if
		end tell
	end alfred_script

多くの Workflow は、決めたコマンドで起動し、シェルスクリプト／AppleScript／PHP／Ruby／Python／Perl などを走らせ、その結果に応じて、コピーしたり起動したりサイトを開いたりという処理を行っている。

PHP などの言語は、Workflow 用のライブラリを読みこめば OK のようだった。アイデアがあれば、次は AppleScript 以外で書いてみたい。

