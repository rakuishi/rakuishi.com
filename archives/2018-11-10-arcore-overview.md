---
categories:
  - Android
date: "2018-11-10T09:34:51+09:00"
slug: arcore-overview
title: '[Google Pixel 3] ARCore で拡張現実を体験してみた'
---

{{<img alt="Playground" src="/images/2018/11/playground.jpg" width="1080" height="540">}}

Google Pixel 3 を買いました。写真が肉眼の印象に近いのと、低めのバイブレーションが特に良いですね。

そんな Pixel 3 のカメラアプリに付属している Playground では、空間にキャラクターや文字を書き込めます。これは ARCore によって提供されています。

この記事では ARCore のサンプルコードを触って、各機能の概要を紹介していきます。

## ARCore

{{<img alt="ARCore" src="/images/2018/11/arcore-discover-hero.jpg" width="1712" height="728">}}

- [ARCore Overview | ARCore | Google Developers](https://developers.google.com/ar/discover/)

ARCore は拡張現実を体験するための Google のプラットフォームです。Android だけでなく iOS にも提供されていますが、現時点では後述する Cloud Anchors のみのようです。

ARCore を理解するために、一番大事（そう）なのが Anchors です。これはカメラから得られる情報をもとに、位置（position）と向き（orientation）を持つ Anchors を空間内に配置します。

- [Working with Anchors | ARCore | Google Developers](https://developers.google.com/ar/develop/developer-guides/anchors)

[sceneform-android-sdk](https://github.com/google-ar/sceneform-android-sdk.git) にある多くのサンプルは、その Anchor に 3D オブジェクトを紐付け、現実世界に仮想オブジェクトが存在するように見せます。配置されたオブジェクトは、裏側を覗いたりも出来ます。

ARCore には Anchors と組み合わせて利用できる 3 つの機能があります。

- [Sceneform](#sceneform)
- [Augumented Images](#augumented-images)
- [Cloud Anchors](#cloud-anchors)

## Sceneform

Sceneform を使えば AR および 非 AR アプリで 3D オブジェクトのレンダリングができます。各種サンプルでは、Anchor に紐付くオブジェクト（ドロイド君、太陽系）をカメラ越しに仮想空間上で見られます。

Sceneform に関連する機能は以下です：

- Android の View の描画
- インポートした 3D Assets の描画
- 立方体や球、円柱などのシンプルな形の描画
- Lights の追加
- Shadows の追加
- タッチジェスチャー
- アニメーション

出来合いの 3D Assets を使えば、Android Studio 環境のみで作業できそうな感じがしました。ただ、3D オブジェクトの取り扱いに関する知識は必要で、このあたりはソースコードを読むのに難儀しそうです（匙を投げかけています）。

- [Sceneform Overview | ARCore | Google Developers](https://developers.google.com/ar/develop/java/sceneform/)

## Augumented Images

Augumented Images は、事前に用意した画像に一致するオブジェクトをカメラを向けて特定できる機能。具体的には、15cm x 15cm 程度のフラットな画像を解釈し、その位置、向き、物理的なサイズを提供します。

[sceneform-android-sdk](https://github.com/google-ar/sceneform-android-sdk.git) のサンプルでは、プロジェクト内にある地球の画像をカメラ越しに読み込むと、その地球の画像に額縁が付きます。

- [Recognize and Augment Images | ARCore | Google Developers](https://developers.google.com/ar/develop/java/augmented-images/)

## Cloud Anchors

Cloud Anchors は、AR 体験を共有できる機能。同じ空間にいる A さんが仮想空間に設置した 3D オブジェクトを、B さんも仮想空間で見ることができます。

ソースコードも提供されている [Just a Line](https://experiments.withgoogle.com/justaline) では、仮想空間上に書いた線情報をユーザー間で共有できます。

{{<youtube IOKwGCQJVCw>}}

- [Share AR Experiences with Cloud Anchors | ARCore | Google Developers](https://developers.google.com/ar/develop/java/cloud-anchors/overview-android)
