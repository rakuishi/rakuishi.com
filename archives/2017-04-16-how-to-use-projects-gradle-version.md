---
categories:
- Android
date: "2017-04-16T09:26:44+09:00"
slug: how-to-use-projects-gradle-version
title: Error:Minimum supported Gradle version is 3.3. Current version is 2.14.1.
---

Android Studio で Gradle のバージョンを上げた際、下記エラーで躓いたのでメモしておきます。

```
Error:Minimum supported Gradle version is 3.3. Current version is 2.14.1. If using the gradle wrapper, try editing the distributionUrl in /Users/YourName/Path/gradle/wrapper/gradle-wrapper.properties to gradle-3.3-all.zip
```

このエラーが表示される時は、Android Studio が使用している Gradle プラグインのバージョンが高いが、指定している Gradle のバージョンが低い時に表示されます。

Gradle プラグインのバージョンは、プロジェクト直下にある /build.gradle に書かれています：

```gradle
buildscript {
    dependencies {
        classpath 'com.android.tools.build:gradle:2.3.0'
    }
}
```

上記と相対するように /gradle/wrapper/gradle-wrapper.properties に、使用する Gradle のバージョンを以下のように宣言する必要があります：

```gradle
distributionUrl=https\://services.gradle.org/distributions/gradle-3.3-all.zip
```

非常にややこしいのですが、Gradle と Gradle プラグインのバージョンは以下のように対応しており、上記のふたつの設定は現時点では正しい。以下、対応表です：

| Plugin version | Required Gradle version |
| --- | --- |
| 1.0.0 - 1.1.3 | 2.2.1 - 2.3 |
| 1.2.0 - 1.3.1 | 2.2.1 - 2.9 |
| 1.5.0 | 2.2.1 - 2.13 |
| 2.0.0 - 2.1.2 | 2.10 - 2.13 |
| 2.1.3 - 2.2.3 | 2.14.1+ |
| 2.3.0+ | 3.3+ |

- [Android Plugin for Gradle Release Notes | Android Studio](https://developer.android.com/studio/releases/gradle-plugin.html)

ですが、Android Studio で冒頭のエラーが発生していました。Android Studio にある Terminal から Grale のバージョンを確認しても問題なさそう（初めは、プラグインのダウンロードが始まります）。

```bash
$ ./gradlew -v

------------------------------------------------------------
Gradle 3.3
------------------------------------------------------------

Build time:   2017-01-03 15:31:04 UTC
Revision:     075893a3d0798c0c1f322899b41ceca82e4e134b

Groovy:       2.4.7
Ant:          Apache Ant(TM) version 1.9.6 compiled on June 29 2015
JVM:          1.8.0_121 (Oracle Corporation 25.121-b13)
OS:           Mac OS X 10.12.4 x86_64
```

躓いた原因としては、上記 Gradle のバージョンはあくまでこのプロジェクトの Gradle バージョンであり、Android Studio が現在使用している Gradle とは違うということでした。

この設定を変えるには、Android Studio → Preferences → Builds, Execution, Deployment → Gradle → Project-level settings から Use local gradle distribution を選択します。

こうすれば無事にこのエラーを解決できました。(●・▽・●)
