+++
categories = ["CSS"]
date = "2015-09-13T13:26:04+09:00"
draft = false
slug = "getting-started-with-css"
title = "CSS 初学者だった頃に知りたかったこと"

+++

この記事では、自分が CSS 初学者だった頃に知りたかったことをまとめています。


## Normalize.css

Chrome, Safari, Firefox, IE などといったブラウザには、各々、デフォルトスタイルが当てられています。これにより、同じ要素なのに、余白や文字の大きさが微妙に異なる、といったことが起こります。

そこで登場する [Normalize.css](https://necolas.github.io/normalize.css/) は、各ブラウザの違いを吸収し、各要素の有用なデフォルトのスタイルを維持したものです。Normalize.css を使えば、どのブラウザで見た時にも同じスタイルが当てられます。

Normalize.css は、HTML の head 内で以下のように宣言して使います：

    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/style.css">

スタイルシート内から `@import` を使用して複数の CSS を読み込ませる方法もありますが、パフォーマンス的に好ましくないので避けてください。


## display の挙動を理解する

display は、要素の振る舞いを決める大事なプロパティです。最初はあまり意識出来ないかもしれませんが、この使い分けをしっかり理解できるようになると、表現の幅が広がります。

### block

* width は 100% がデフォルト値
* 中央寄せにしたいときは、`margin: 0 auto;` のように記述する
* h1, h2, h3, p, div, header, main, footer などは標準で block 値である

### inline

* width はコンテンツに依存する
* width, height, margin を設定することが出来ない
* 中央寄せにしたい時は、親要素に `text-align: center` を宣言する
* span などは標準で inline 値である

### inline-block

* 基本的には、inline と同じだが、width, height, margin を設定することが出来る


## レスポンシブサイト作りに役立つ `box-sizing: border-box`

box-sizing プロパティは、幅と高さの計算方法を変える際に使用できます。初期値は、`content-box` で padding と border を幅と高さに含めない、`border-box` は含める指定になります。

試しに、box-sizing の指定の異なる、ふたつのクラスを用意してみました。

    .content-box {
      box-sizing: content-box; /* デフォルト値 */
      display: block;
      width: 300px;
      padding: 20px;
      border: 10px;
    }

    .border-box {
      box-sizing: border-box;
      display: block;
      width: 300px;
      padding: 20px;
      border: 10px;
    }

content-box は、全体の横幅が 360px（width + padding * 2 + border * 2）になります。一方、border-box は、全体の横幅が 300px で、その中に padding と border が詰まっています。ですので、実質的な横幅は、240px（width - padding * 2 - border * 2）となります。

ただの計算方法の違いで終わりと言われればそうなのですが、この計算方法の違いは、レスポンシブサイトを作る時にとても重宝します。

例えば、以下のように宣言した場合は、横幅 100% で、内部に余白（padding）に 20px の指定になります。どのデバイス横幅でも 20px 余白が表示されます。

    .container {
      box-sizing: border-box;
      display: block;
      width: 100%;
      padding: 0 20px;
    }

これが、`box-sizing: content-box` の時は、横幅が 100% + 20px * 2 となり、100% を超えてしまうことになります。100% を超えてしまうと、横幅がデバイスよりもはみでてしまって、サイト全体がたつきます。

## クラス名は、抽象的な名前を付ける

例えば、あるソーシャルゲームに登場するモンスター名を装飾するために、以下の様なクラスを宣言したとしましょう。

    .title-monster { /* 背景が赤くて、文字が白いスタイル */ }

しかし、このスタイルを別の場所で使いたくなった時に（例えば、そのソーシャルゲームに登場するアイテム名）、`title-monster` を指定するのはしっくり来ません。ですので、クラス名には monster のような具体的なものではなくて、背景が赤いというような名前を付けておくと良いです。

    .title-bg-red { /* 背景が赤くて、文字が白いスタイル */ }


## `#id`, `!important` は極力使わないようにする

ほとんどの場合、使わなくても書けます。id 要素や important 文が混ざってくると、CSS を適用する優先順位がとても複雑になります。なるべく標準的な要素（`h1`, `p` など）とクラス（`.class`）だけのシンプルなものにしましょう。

id 要素は、アンカーリンクを設定する時、JavaScript からその id を操作したい時に、使うのがベストプラクティスだと思います。

また、話がすこしそれますが、JavaScript によって状態を変化させる時は、以下のように決めておくと、第三者から見てもどの要素が JavaScript で変更されるかが分かりやすいです。

* クラス名の先頭に `js-` と付ける
* WAI-ARIA で定められたプロパティ（`aria-hidden` など）を踏襲する


## ブラウザのデベロッパーツール機能を使えるようになる

テキストを太文字にしたつもりなのだけれど、反映されていないということが CSS を書いていると多々あります。それをどのように修正していくかというアプローチのひとつとして、ブラウザのデベロッパーツールがあります。

例として、Google Chrome での操作方法を紹介します。対象のページで、`command + opetion + i` を押します（あるいは、メニュー -> 表示 -> 開発/管理 -> デベロッパーツール）。

すると新しく画面が開かれます。この画面上部の虫眼鏡をクリックして、検証したい要素を選択すると、どのようなスタイルが最終的に適用されているかが分かります。

また、デバイスマークを押すと、iPhone や Android での見え方が表示されます（表示がおかしい時は、ブラウザをリロードしてください）。こちらでモバイルデバイスでの見え方を検証できますが、文字サイズやボタンの大きさに違和感がないように、最終的には自分の手元の端末で確認するように心がけておきましょう。
