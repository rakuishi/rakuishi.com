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
- キーボード → 「ショートカット」タブ → キーボード → 「次のウインドウを操作対象にする」を Option + Tab に変更する（アプリケーション単位の切り替えは、Command + Tab なので、アプリケーションのウィンドウ単位のウインドウ切り替えを Option + Tab にしておくと操作感を統一できる）
- キーボード → 「ショートカット」タブ → 入力ソース → 「前の入力ソースを選択」を「⌘スペース」に変更する（Spotlight と競合するからチェックを外す。US キーボードを使う時は、入力ソースの変換は頻繁に利用するため、Command + Space に割り当てた。後述する Alfred は Option + Space）
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

## ダウンロードしたアプリケーション

### 1Password

- Preferences → Touch ID → 「Allow Touch ID to unlock 1Password」を設定する

### Alfred

- 起動を「⌥ + Space」、履歴機能を「⌥ + /」に指定する
- 頻繁に起動するアプリケーションを「⌥ + Control + 頭文字」で開けるように指定する
- ウィンドウサイズをキーボードから調整・現在のフォルダー場所をターミナルで開けるように、以下のワークフローを導入する（ウィンドウサイズの方はマルチディスプレイだと動かなかったから [Moom](https://itunes.apple.com/jp/app/id419330170?at=11l3RT) を使っている。Apple Script でディスプレイを識別しなければ…）
  - [rakuishi/alfred-workflow-window-resizer](https://github.com/rakuishi/alfred-workflow-window-resizer)
  - [rakuishi/alfred-workflow-terminal](https://github.com/rakuishi/alfred-workflow-terminal)

### Android Studio

- Preferences → Appearance & Behavior → Appearance → Theme → Darcula
- Preferences → Keymap → 「Move Caret to Line End with Selection」に「Shift + Ctrl + E」を「Move Caret to Line Start with Selection」に「Shift + Ctrl + A」を追加する
- Preferences → Editor → Colors & Fonts → 「Scheme」に「Darcula 2」を追加し、「Monaco 14」を設定する

### Dropbox

- Preferences → Import → Photos → 「Enable camera uploads for」を無効にする

### Flux

画面を暖色にし、ブルーライトを軽減するソフト。眼の疲れが軽減される（気がする）。このソフトを使用していない時の画面に違和感を感じるほど依存している。iOS 10 では標準でこの Night Shift が実装されており、Android では Twilight というアプリを使っている（Android 7.0 では通知センターに格納出来るから便利）。Mac には Sierra 10.12.4 に標準搭載予定という噂を見た。

### Google Chrome

Safari は、アドレス表示バーにフルアドレスが表示されないのが残念だから、Google Chrome を常用している。Safari は、iPhone Simulator に表示しているウェブページのソース情報を見る時に使用している。

### Google 日本語入力

アルファベットと数字、スペースを入力する時は、半角文字しか使用しないから設定する。Google 日本語入力の環境設定の「一般」タブから、「スペースの入力」を「半角」に変更、「入力補助」タブから「カタカナ」「アルファベット」を両方「半角」に設定する。

### Sketch

### Terminal

Pro を複製し Pro 2 を作り、Monaco 14 を設定した。後は、Homebrew をインストールする：

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Tower

### Visual Studio Code

Sublime Text 3 から試しに乗り換えている。Sublime Text は拡張機能（パッケージ）を使用するハードルが高い（最初に、呪文をコンソールに打ち込む必要がある）。Code は、標準でマークダウンプレビューができる。

settings.json:

```
// Place your settings in this file to overwrite the default settings
{
    "editor.fontSize": 14,
    "editor.tabSize": 2,
    "editor.fontFamily": "Monaco",
    "editor.wrappingColumn": 0,
    "editor.renderWhitespace": "boundary",
    "workbench.colorTheme": "Monokai",
    "window.openFilesInNewWindow": "off"
  }
```

keybindings.json:

```
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

