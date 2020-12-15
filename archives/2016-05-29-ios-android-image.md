---
categories:
- iOS
date: "2016-05-29T23:21:22+09:00"
slug: ios-android-image
title: iOS と Android の画像周りチートシート
---

iOS 7 以降（iPad 含まない）、Android 4.0 以降で必要になる画像素材をまとめています。

## アプリ内で使用する画像

### iOS

iOS 7 以降に対応している iPhone 端末を挙げます。iPhone 3GS（比率：1x）などは、iOS 7 以降に対応していません。ですので、iOS 7 以降のアプリを作る際は、2x, 3x の 3 種類を用意すれば OK です。

| 端末名 | ポイント | ピクセル | インチ | 比率 | ファイル名 |
| --- | --- | --- | --- | --- | --- |
| iPhone 4, 4S | 320 x 480 | 640 x 960 | 3.5inch | 2x | sample\@2x.png |
| iPhone 5, 5s, 5c | 320 x 568 | 640 x 1136 | 4.0inch | 2x | sample\@2x.png |
| iPhone 6, 6s | 375 x 667 | 750 x 1334 | 4.7inch | 2x | sample\@2x.png |
| iPhone 6 Plus, 6s Plus | 414 x 736 | 1242 x 2208 | 5.5inch | 3x | sample\@3x.png |

iPhone 6 Plus が登場するまでは、Retina（レティナ） = 比率 2x の解釈で問題なかったのですが、登場以降、比率 1x 以外の高解像度画像も含むようになりました。ただ、サイト向けに Retina 対応をする時は、比率 2x の画像を用意するので現状は問題ありません。

### Android

[Android Developers - Screen Sizes and Densities](http://developer.android.com/about/dashboards/index.html#Screens) によれば、hdpi, xhdpi, xxhdpi の 3 種類の解像度で、世界の全シェアの 8 割を占めています。日本では Android 4.0 以降が搭載された端末は、ほとんど xhdpi 以上であり、Analytics を見ている限り、98% は xhdpi 以上ですので、xhdpi と xxhdpi を用意すれば十分でしょう。

日本でよく使われているそれらの解像度を持った端末を挙げます。

| 端末名 | ピクセル | 比率 | フォルダ・ファイル名 |
| --- | --- | --- | --- |
| Xperia Z3 Compact | 720 x 1280 | 2x (xhdpi) | drawable-xhdpi/sample.png |
| Xperia Z3, Nexus 5 | 1080 × 1920 | 3x (xxhdpi) | drawable-xxhdpi/sample.png |

### iOS と Android で用意する画像ファイル

2x, 3x を用意すれば OK です。以下のように、フォルダを分けて、ファイル名を付けて頂けるとエンジニアの作業がしやすいです。

```
ios/
├── sample@2x.png # 2x
├── sample@3x.png # 3x
android/
├── drawable-xhdpi/
│   └── sample.png # 2x
└── drawable-xxhdpi/
    └── sample.png # 3x
```

## アイコン

### iOS

不透過 PNG で用意します。角丸は OS 側で処理されます。

| 画像名 | ピクセル | 比率 |
| --- | --- | --- |
| icon-60\@2x.png | 120 x 120 | 2x |
| icon-60\@3x.png | 180 x 180 | 3x |

* [iOSヒューマンインターフェイスガイドライン: アイコンや画像の大きさ](https://developer.apple.com/jp/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix/IconMatrix.html)

### Android

透過 PNG 可です。iOS とは違って、余白と影を付けないとデフォルトアイコンと馴染みません。192px は、Nexus 6 のような高解像度端末で必要になるアイコンです。今後、増えていくと思いますので用意しておくことを推奨します。

| フォルダ・ファイル名 | ピクセル | 比率 |
| --- | --- | --- |
| mipmap-xhdpi/ic_launcher.png | 96 x 96 | 2x |
| mipmap-xxhdpi/ic_launcher.png | 144 x 144 | 3x |
| mipmap-xxxhdpi/ic_launcher.png | 192 x 192 | 4x |

* [Icons - Style - Google design guidelines](http://www.google.com/design/spec/style/icons.html#icons-system-icons)
* [Android Asset Studio - Icon Generator - Launcher icons](http://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
* [アプリを Nexus 6 と Nexus 9 に備えましょう - Google Developer Japan Blog](http://googledevjp.blogspot.jp/2014/11/nexus-6-nexus-9.html)

## 申請用画像

### iOS

| 名称 | ピクセル | 枚数 |
| --- | --- | --- |
| スクリーンショット画像 3.5inch | 640 x 960  | 1~5 |
| スクリーンショット画像 4.0inch | 640 x 1136  | 1~5 |
| スクリーンショット画像 4.7inch | 750 x 1334  | 1~5 |
| スクリーンショット画像 5.5inch | 1080 x 1920  | 1~5 |
| 高解像度アイコン | 512 x 512 | 1 |

### Android

スクリーンショット画像については、許可されているサイズに幅があるため、iOS で作ったものが流用できると思います。

| 名称 | ピクセル | 枚数 |
| --- | --- | --- |
| スクリーンショット | 320\~3840 x 320\~3840 | 2〜8 |
| 高解像度アイコン | 512 x 512 | 1 |
| 宣伝用画像 | 1024 x 500 | 1 |

* [画像アセット、スクリーンショット、動画 - Google Play デベロッパー ヘルプ](https://support.google.com/googleplay/android-developer/answer/1078870?hl=ja)

## 画像を圧縮しましょう

基本的にすべての画像は提出する前に圧縮しましょう。

* [ImageOptim — better Save For Web](https://imageoptim.com/)
* [TinyPNG – Compress PNG images while preserving transparency](https://tinypng.com/)

経験談として、iPhone 4 でアプリ開発していた時に、圧縮していない画像を載せたセルをスクロールした時にカクつくことがあったのですが、圧縮するとカクつかなくなりました。圧縮は、アプリのパフォーマンスに関わってきます。
