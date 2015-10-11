+++
categories = ["Android"]
date = "2015-10-11T14:51:01+09:00"
draft = false
slug = "release-android-library-to-bintray"
title = "Android のライブラリの作りかたと Bintray にアップロードするまでの手順"
+++

[Aileron](https://github.com/rakuishi/aileron) という Android のライブラリを作成しました。Activity や Fragment の生成時に、Intent に詰めた引数を取り出す手間を減らすためのライブラリです。ちなみに、Aileron（エルロン）とは、飛行機の補助翼のことです。

折角作ったならば、使う時は build.gradle に、以下のように一行追加すれば、ライブラリを使えるようにしたい。今回は、Bintray というサービスにライブラリをアップロードして、それを実現しました。

```
dependencies {
    compile 'com.rakuishi:aileron:0.1.0'
}
```

この記事では、Android Studio でのライブラリを作りかたと、Bintray にライブラリをアップロードするまでの手順を紹介します。

## Android Studio でライブラリを作る

Android のライブラリを作る時は、まずはサンプル用のプロジェクトを作り、そこにモジュールとしてライブラリを組み込むのが一般的みたいです。

まずは普通に、新しく Project を作成します。Application name は、ライブラリ名で良いですが、Package name は、com.rakuishi.aileron.sample のように、最後に sample を付けておくと後で変える手間が減ります。

Project を作成し終えたら、ルートディレクトリの app フォルダを 副クリック → Refactor → Rename から、sample に名前を変えます。特に必要な作業ではありませんが、ライブラリの多くは、sample というフォルダ名を採用しているため、その習慣に倣いました。

Menu → File → New → New Module からモジュールを追加します。ライブラリの種類は、Android Library を選択しました。パッケージ名を com.rakuishi.aileron のようにし、Minimum SDK を設定します。

後は、sample の build.gradle に、dependencies を追加すれば、ライブラリを sample で使えるようになります。

```
dependencies {
    // 省略
    compile project(':aileron')
}
```

## Bintray にライブラリをアップロードする

[Bintray](https://bintray.com/) に Sign In します（今回は、GitHub ログインを行いました）。その後、ユーザー画面 Edit → API Key 画面から、アップロードする際に必要になる API Key を確認できます。

### bintray-release

ライブラリをアップロードするために、[novoda/bintray-release](https://github.com/novoda/bintray-release) というヘルパーを使用します。build.gradle にライブラリに必要となる情報を入力して、コマンドを叩くと Bintray にライブラリを登録する作業を行ってくれます。

ルートディレクトリにある build.gradle に、bintray-release を追加します。

```
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.3.0'
        classpath 'com.novoda:bintray-release:0.3.4' // 追加
    }
}
```

次に、ライブラリディレクトリにある build.gradle を以下のように修正します。`lintOptions` ですが、自分の環境では設定しないとエラーでアップロード出来なかったため追加してます。

```
apply plugin: 'com.android.library'
apply plugin: 'com.novoda.bintray-release' // 追加

android {
    // 省略
    lintOptions {
        abortOnError false
    }
}

dependencies {
  // 省略
}

// 以下、必要な情報に書き換える
publish {
    userOrg = 'rakuishi'
    groupId = 'com.rakuishi'
    artifactId = 'aileron'
    publishVersion = "0.1.0"
    desc = 'Extracting values from bundle in activity or fragment made easy.'
    website = 'https://github.com/rakuishi/aileron'
}
```

後は、以下のコマンドを叩くと、Bintray にライブラリが登録されます。User と API Key は、適宜変えてください。

```sh
$ ./gradlew clean build bintrayUpload -PbintrayUser=[bintrayUser] -PbintrayKey=[bintrayKey] -PdryRun=false
```

### jcenter に登録する

Bintray の maven にライブラリが登録されたら、次に jcenter に登録します。以下のスクリーンショットは登録後なのですが、右下に jcenter に追加するボタンがあるはずなので、そこから申請を行います（フォームには特に何も埋めませんでした）。

![](/images/2015/10/bintray.png)

自分の場合は、2 時間ぐらいで承認されました。jcenter に追加された後は、以下のように、一行追加するだけでライブラリが使用できるようになります。お疲れ様でした！

```
dependencies {
    compile 'com.rakuishi:aileron:0.1.0'
}
```

## 参考

* [Androidオープンソースライブラリの作り方 // Speaker Deck](https://speakerdeck.com/takahirom/androidopunsosuraiburarifalsezuo-rifang)
* [BintrayにAndroidのライブラリをアップする - visible true](http://sys1yagi.hatenablog.com/entry/2015/02/06/002823)
