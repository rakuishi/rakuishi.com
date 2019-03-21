---
categories:
  - Android
date: 2018-09-03T20:16:28+09:00
draft: false
slug: android-9-pie-foreground
title: Android 9 Pie 時代のフォアグラウンドサービス
---

![android-9-pie](/images/2018/09/android-9-pie.png)

Android 9 Pie（API レベル 28）が正式にリリースされ、会社でも Android 9 対応のアプリをリリースしました。

[動作の変更点](https://developer.android.com/about/versions/pie/android-9.0-changes-28?hl=ja)を見る限り、多くのアプリは `targetSdkVersion 28` に数字を上げるだけで問題なさそうですが、会社で開発しているアプリは、フォアグラウンドサービスを利用しており、追加の対応が必要でした。

## フォアグラウンドサービス対応

まずは、Android 8 Oreo では、フォアグラウンドサービスの起動に制約が加わりました。まだ Android Oreo に対応していない場合は、[この記事](/archives/android-oreo-notification-foreground/)に書いたように、下記の対応も必要となります。

- Service の起動には `Context.startForegroundService()` を使用する
- 起動後、5 秒以内に `Service.startForeground()` を呼ぶ

Android 8 の対応が終わっていれば、Android 9 では Manifest ファイルに `FOREGROUND_SERVICE` パーミッションを追加するだけです。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="your.package.name">
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <!-- 省略 -->
</manifest>
```

ダイアログを利用して、ユーザーに許可を求める Dangerous permissions ではなく Normal permissions のため、アプリに自動でパーミッションが付与されます。

## 参考

- [動作の変更点: API レベル 28+ をターゲットとするアプリ  |  Android Developers](https://developer.android.com/about/versions/pie/android-9.0-changes-28?hl=ja)
