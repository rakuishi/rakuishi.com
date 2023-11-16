---
categories:
  - Tech
date: "2018-09-27T22:22:38+09:00"
slug: migration-to-androidx
title: 既存のプロジェクトの Support Library を AndroidX に移行する
---

Android の下位互換性を提供している Support Library の整理の一環として、[AndroidX](https://developers-jp.googleblog.com/2018/05/hello-world-androidx.html) という仕組みが導入されました。2018/09/21 に 1.0.0 がリリースされたので、プロジェクトを AndroidX に移行しました。この記事はその時のメモとなります。

## Android Gradle プラグインを 3.2.0 に上げる

Android Studio 3.2.0 には「Refactor -> Migrate to AndroidX...」が追加され、基本的にはこのボタンをポチっとするだけで対応が完了するはずですが、その前に Android Gradle プラグインを 3.2.0 までバージョンを上げる必要があります：

```groovy
// build.gradle
- classpath 'com.android.tools.build:gradle:3.1.3'
+ classpath 'com.android.tools.build:gradle:3.2.0'
```

```
// gradle-wrapper.properties
- distributionUrl=https\://services.gradle.org/distributions/gradle-4.4-all.zip
+ distributionUrl=https\://services.gradle.org/distributions/gradle-4.6-all.zip
```

以上を書き換えてビルドした後、Fabric 1.+ では以下のエラーが出ました。最新安定版の 1.26.0 だと動作不良だったため 1.25.4 を指定します。

```
Could not find method create() for arguments
[crashlyticsStoreDeobsRelease,
class com.crashlytics.tools.gradle.tasks.StoreMappingFileTask,
com.android.build.gradle.internal.scope.BuildArtifactsHolder$FinalBuildableArtifact@1711854a]
on task set of type org.gradle.api.internal.tasks.DefaultTaskContainer.
```

```groovy
// build.gradle
- classpath 'io.fabric.tools:gradle:1.+'
+ classpath 'io.fabric.tools:gradle:1.25.4'
```

## Migrate to AndroidX…

ここまでで「Refactor -> Migrate to AndroidX...」が押せるようになります。

<img alt="" src="/images/2018/09/migration-to-androidx.png" width="440" height="440">

ボタンを押すと書き換え予定のファイル一覧が表示されるので「Do Refactor」を選択します。後は、Android Studio 側の作業が終わるのを待ちましょう。

## BottomNavigationView 周りの手動対応

手元のプロジェクトでは何故か BottomNavigationView や BottomNavigationMenuView を使っているところは import エラーが出ました。無効になっている import を消して、提示される import を承認していきます。

他では、BottomNavigationView のタブ数が 4 以上の時の挙動を変えるパッチコード [BottomNavigationViewHelper](https://github.com/DroidKaigi/conference-app-2017/blob/master/app/src/main/java/io/github/droidkaigi/confsched2017/view/helper/BottomNavigationViewHelper.java) でエラーが出ました。`BottomNavigationItemView.setShiftingMode()` が存在しなくなった模様。

BottomNavigationViewHelper で実現しようとしてた挙動は、もう正式な挙動としてサポートされています。
以下のように `labelVisibilityMode` を指定してあげれば OK です。

```xml
<com.google.android.material.bottomnavigation.BottomNavigationView
  app:labelVisibilityMode="labeled"
  /* 省略 */
  />
```

これでちゃんとビルドできるようになりました。動作も問題なさそうです。

## 参考

- [Google Developers Japan: AndroidX の紹介](https://developers-jp.googleblog.com/2018/05/hello-world-androidx.html)
- [AndroidX release notes  |  Android Developers](https://developer.android.com/topic/libraries/support-library/androidx-rn)
- [I have a problem with fabric and crashlytics when building my Android App - Stack Overflow](https://stackoverflow.com/questions/52493141/i-have-a-problem-with-fabric-and-crashlytics-when-building-my-android-app)
