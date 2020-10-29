---
categories:
- Mac
date: 2017-02-12T09:55:48+09:00
draft: false
slug: macos-sierra-init-setup
title: "[Macbook Pro / Touch Bar] macOS Sierra 初期設定"
---

仕事で新しい MacBook Pro / Touch Bar を使うことになったから、macOS Sierra の初期設定を自分用のメモを兼ねてまとめておきます。基本的に、[4 年前に書いた記事](/archives/5571/)から変わっていません。ガリガリ魔改造しているわけでなく、標準のシステム環境設定と、最低限のアプリを使用しています。

キーボードの打鍵感は慣れたのですが、左右の矢印キーの上下の余白が失われ、結構な確率でミスをしてしまいます。あの余白が、矢印のホームポジションを掴むために大事だったのにね。

## システム環境設定

### Dock

- 画面上の位置を「右」に設定する
- 「Dock を自動的に隠す」を入にする

### キーボード

- キーボード → 「キーのリピート」を最速に、「リピート入力認識までの時間」を最短にする
- キーボード → 「ショートカット」タブ → キーボード → 「次のウインドウを操作対象にする」を `Option + Tab` に変更する（アプリケーション単位の切り替えは、`Command + Tab` なので、アプリケーションのウィンドウ単位のウインドウ切り替えを `Option + Tab` にしておくと操作感を統一できる）
- キーボード → 「ショートカット」タブ → 入力ソース → 「前の入力ソースを選択」を「⌘スペース」に変更する（Spotlight と競合するからチェックを外す。US キーボードを使う時は、入力ソースの変換は頻繁に利用するため、`Command + Space` に割り当てた。後述する Alfred は `Option + Space`）
- フルキーボードアクセス（Tab キーを押してウインドウやダイアログ内の操作対象を移動できる）を「すべてのコントロール」に設定する
- キーボード → 「修飾キー...」を選択 → 「Caps Lock」を 「^ Control」に変更する（Caps Lock を使う機会がないため）
- 日本語の入力ソースは「カタカナ」と「ローマ字」のチェックを解除する
- キーボード → Touch Bar に表示する項目 → コントロールスリップ（展開した状態）に変更する（自宅で使っている旧 MacBook Pro Retina との操作感を統一する）

### トラックパッド

- トラックパッド → ポイントとクリック → 「タップでクリック」を有効にする

### ホットコーナー

デスクトップとスクリーンセーバ → 「スクリーンセーバ」タブ → 「ホットコーナー...」 から各種設定できる。何故、スクリーンセーバにこのメニューがあるのかは長年の謎である。

- 左上：ディスプレイをスリープさせる
- 右上：Mission Control
- 左下・右下：デスクトップ  

### ファイアウォール

- セキュリティとプライバシー → 「ファイアウォール」タブ → 「ファイアウォールを入にする」を選択する

### Touch ID

- 「Mac のロックを解除」を有効にする

### アクセシビリティ

- アクセシビリティ → マウスとトラックパッド → トラックパッドオプション... →「ドラッグを有効にする」を有効にし、「3 本指のドラッグ」を選択する
- アクセシビリティ → ディスプレイ → 「透明度を下げる」を選択する

### ディスプレイ

常に Night Shift（画面を暖色にし、ブルーライトを軽減する設定）が有効になるように、次のように設定した。

{{<img alt="" src="/images/2017/02/night-shift.png" width="1336" height="1000">}}

### 共有

コンピュータ名を適当なものに変更する。

## ダウンロードしたアプリケーション

### [1Password](https://itunes.apple.com/jp/app/1password-password-manager-and-secure-wallet/id443987910?l=en&mt=12)

- Preferences → Touch ID → 「Allow Touch ID to unlock 1Password」を設定する

### [Alfred 2](https://www.alfredapp.com/help/v2/)

- 起動を `Option + Space`、履歴機能を `Control + Space` に指定する
- 頻繁に起動するアプリケーションを `Option + Control + 頭文字` で開けるように指定する
  - https://github.com/rakuishi/static/tree/master/alfredworkflows

### [Android Studio](https://developer.android.com/studio/index.html?hl=ja)

- Preferences → Appearance & Behavior → Appearance → Theme → Darcula
- Preferences → Keymap → 「Move Caret to Line End with Selection」に `Shift + Ctrl + E` を「Move Caret to Line Start with Selection」に `Shift + Ctrl + A` を追加する
- Preferences → Keymap → 「Select Previous Tab」に `Ctrl + Shift + Tab` を「Select Next Tab」に `Ctrl + Tab` を追加する
- Preferences → Editor → Colors & Fonts → 「Scheme」に「Darcula 2」を追加し、「Monaco 14」を設定する

### [Dropbox](https://www.dropbox.com/)

- Preferences → Import → Photos → 「Enable camera uploads for」を無効にする

### [Google Chrome](https://www.google.co.jp/chrome/browser/desktop/index.html)

Safari は、アドレス表示バーにフルアドレスが表示されないのが残念だから、Google Chrome を常用している。Safari は、iPhone Simulator に表示しているウェブページのソース情報を見る時に使用している。

### [Google 日本語入力](https://www.google.co.jp/ime/)

アルファベットと数字、スペースを入力する時は、半角文字しか使用しないから設定する。Google 日本語入力の環境設定の「一般」タブから、「スペースの入力」を「半角」に変更、「入力補助」タブから「カタカナ」「アルファベット」を両方「半角」に設定する。

### [Moom](https://itunes.apple.com/jp/app/id419330170?at=11l3RT)

- ウィンドウサイズをキーボードから調整できる
- `Option + 1` は左半分、`Option + 2` は右半分、`Option + 3` は全画面に設定する

### [Sketch](https://www.sketchapp.com/)

### Terminal

Pro を複製し Pro 2 を作り、Monaco 14 を設定した。後は、Homebrew をインストールする：

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Git を Developer ツールからダウンロードする。

```bash
$ git // Developer ツールが起動する
$ git config --global user.name "rakuishi"
$ git config --global user.email "rakuishi@gmail.com"
```

### [Tower](https://www.git-tower.com/mac/)

### [Visual Studio Code](https://www.microsoft.com/ja-jp/dev/products/code-vs.aspx)

Sublime Text 3 から試しに乗り換えている。Sublime Text は拡張機能（パッケージ）を使用するハードルが高い（最初に、呪文をコンソールに打ち込む必要がある）。Code は、標準でマークダウンプレビューができる。

settings.json:

```json
// Place your settings in this file to overwrite the default settings
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.fontFamily": "Monaco",
  "editor.wrappingColumn": 0,
  "editor.renderWhitespace": "boundary",
  "workbench.colorTheme": "Monokai",
  "window.openFilesInNewWindow": "off",
  "workbench.editor.enablePreview": false
}
```

keybindings.json:

```json
// Place your key bindings in this file to overwrite the defaults
[
  {
    "key": "shift+ctrl+e",
    "command": "cursorEndSelect",
    "when": "editorTextFocus"
  },
  {
    "key": "shift+ctrl+a",
    "command": "cursorHomeSelect",
    "when": "editorTextFocus"
  }
]
```

