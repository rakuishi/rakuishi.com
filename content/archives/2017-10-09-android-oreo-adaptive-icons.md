---
categories:
- Android
date: 2017-10-09T11:14:17+09:00
draft: false
slug: android-oreo-adaptive-icons
title: 'Android Oreo: アダプティブアイコン実装ガイド'
---

Android Oreo では、端末メーカーが選択したマスクに応じてアイコンが自動生成される、アダプティブアイコンを利用できます。開発者は、背景色（もしくは画像）とフォアグラウンド画像を用意すれば、それぞれの Android 端末に沿う、いい感じのアイコンがホーム（ランチャー）、ショートカット、設定、共有ダイアログ、オーバービュー画面に並ぶことになります。

この記事ではその実装を見ていきます。

## 必要な素材

以下のふたつの素材を用意します。背景色が一色の場合は、画像を用意する必要はありません。108px は mdpi 時なので、各解像度ごとの mdpi (1x), hdpi (1.5x), xhdpi (2x), xxhdpi (3x), xxxhdpi (4x) を用意します。

- 背景（background）：背景色もしくは、背景画像（108x108）を用意する
- アイコン（foreground）：108x108 の透過画像の中心に 72x72 のアイコンを配置する

Google 純正アプリから読み取れる隠れ仕様として、背景を白以外の濃い色 + アイコンが白色の場合は、そのアイコンに斜めのロングシャドウを置くのがお決まりのようです。

## 実装

compileSdkVersion, targetSdkVersion を API Level 26 にし、`res/mipmap-anydpi-v26/ic_launcher.xml` を設置します。

```
res/
├── mipmap-anydpi-v26/
│   └── ic_launcher.xml
└── mipmap-mdpi/
    └── ic_foreground.png
```

`ic_launcher.xml` では `<adaptive-icon>` の中に、背景と前景の drawable を指定します。

```
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_background" />
    <foreground android:drawable="@mipmap/ic_foreground" />
</adaptive-icon>
```

手元の Android Studio 2.3.3 では、`<adaptive-icon>` に警告が表示されていますが、これで問題なくビルドできます。

## 参考

- [Adaptive Icons | Android Developers](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive.html)
