---
categories:
  - Tech
date: "2016-06-24T00:11:32+09:00"
slug: getting-started-react
title: Hello, React.js!
---

今の業務では、JavaScript で Single Page Application を作る機会はないのですが、後学のために React.js の開発環境の構築と、いくつかチュートリアルを写経しました。この記事では、React.js アプリをビルドし、Hello, World! アプリを作成するところまでを紹介します。

## ビルド環境が必要になる理由

React は JavaScript のライブラリなので jQuery と同じように、スクリプトタグを貼り付けても利用できますが、ツールを使ってコードをひとつのファイルにまとめてビルドする開発方法が推奨されています。

React では、以下のように変換が必要になる書きかたを積極的に行っています。

- ES6（別名 ES2015）: 次期 JavaScript 仕様。ブラウザがサポートしていないと利用できないため、従来の ES5 仕様に変換する
- JSX: JavaScript の中に HTML タグを書ける記法（.jsx という拡張子が使われることがある）。ブラウザ上で動かすには JavaScript で表現できるコードに変換する

それらの変換をブラウザ上でサポートする JavaScript はあるものの、ブラウザ上（ユーザーの手元）で行うのは効率が良くないため、予め変換し、さらに HTTP リクエスト数を削減するために、ひとつのファイルにまとめることが推奨されているというわけです。

ちなみに、React.js v15.1.0 をスクリプトファイルだけで動かすには、react.js, react-dom.js, browser.js（ES6）, JSXTransformer.js（JSX）が必要になります。

ここでは、それらのスクリプトファイルで担っている機能を JavaScript のパッケージ管理ツール npm で導入していきます。

## ビルド環境を準備する

`npm init` により package.json を作成し、必要となるライブラリをインストールしていきます。package.json が更新され、node_modules フォルダが作成されます。

```bash
$ mkdir react
$ cd react
$ npm init
$ npm install --save react react-dom
$ npm install --save-dev watchify babelify babel-preset-react babel-preset-es2015
```

インストールしたライブラリを簡単に説明しておきます。

- react: The core React library
- react-dom: The ReactDom library
- [babelify](https://github.com/babel/babelify): プリセットと組み合わせて変換してくれる
- [preset-es2015](http://babeljs.io/docs/plugins/preset-es2015/): ES6（ES2015）
- [preset-react](http://babeljs.io/docs/plugins/preset-react/): React, JSX が含まれている
- [watchify](https://github.com/substack/watchify): [browserify](https://github.com/substack/node-browserify) というビルドツールをファイル変更時に自動でコンパイルする

babelify で使用するプリセットを .babelrc ファイルに宣言します。

```bash
$ echo '{ "presets": ["react", "es2015"] }' > .babelrc
```

package.js の scripst に、ビルドするためのコマンドを書いていきます。ここに書いたコマンドは `$ npm run hoge` のように入力すれば、実行されます。ちなみに、ライブラリを `npm install --global watchify` とグローバルインストールすると、`$ watchify -t babelify ./main.js -o ./bundle.js` と直接コマンドが叩けます。

```json
"scripts": {
  "watch": "watchify -t babelify ./main.js -o ./bundle.js"
}
```

必要になるファイルを用意して、試しに走らせてみます。

```bash
$ touch index.html
$ touch main.js
$ npm run watch
```

main.js のファイルに変更があると bundle.js が出力されるはずです。main.js には何も書いていませんが、bundle.js には `require` 関数の定義だけが出力されています。

## Hello, World! アプリを作成する

ここまでで開発環境の準備が終わったので、React アプリを書いてみます。先程、作成した index.html, main.js を書いていきます。

### index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="content"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

### main.js

`import` は、ES6 で定義されている記述方法です。また、`<h1>Hello, World!</h1>` のように JavaScript 中に HTML タグを記述しているのが、JSX です。Sublime Text をお使いの方は、Babel プラグインをインストール後に、JavaScript(Babel) の Syntax を有効にすれば、適切にハイライトされるようになります。

```javascript
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<h1>Hello, World!</h1>, document.getElementById("content"));
```

index.html をブラウザで表示すると、「Hello, World!」と表示されているはずです。

## 参考

### 開発環境

- [React を npm でビルドする方法 browserify (watchify) + babelify 編 | mae's blog](http://mae.chab.in/archives/2765)
- [春からはじめるモダン JavaScript / ES2015 - Qiita](http://qiita.com/mizchi/items/3bbb3f466a3b5011b509)

### チュートリアル・デモ

- [Tutorial | React](https://facebook.github.io/react/docs/tutorial.html)
- [Thinking in React | React](https://facebook.github.io/react/docs/thinking-in-react.html)
- [ruanyf/react-demos: a collection of simple demos of React.js](https://github.com/ruanyf/react-demos)
- [rakuishi/react-js-practice: Hello, React.js!](https://github.com/rakuishi/react-js-practice)
