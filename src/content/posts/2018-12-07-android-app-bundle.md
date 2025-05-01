---
category: tech
date: "2018-12-07T23:14:32+09:00"
slug: android-app-bundle
title: Android App Bundle でアプリサイズを削減
---

Android Studio 3.2 + Android Gradle Plugin 3.2 の環境が揃えば、以下のふたつの機能が使えるようになります。

- [Support Library を AndroidX に移行](/archives/migration-to-androidx/)
- Android App Bundle の導入

この記事では、Android App Bundle の導入とストアへのアップロードまでを書いていきます。

## Android App Bundle でアプリサイズを削減

![android-app-bundle](/images/2018/12/app-bundle-logo.svg)

[Android App Bundle](https://developer.android.com/platform/technology/app-bundle/) を使うと配信しているアプリのサイズを落とすことが出来ます。

開発者は、apk ではなく aab（Android App Bundle）という形式で Play Store にアップロードすれば、Play Store 側で端末ごとに必要なリソースを含んだ apk を配信してくれます。

実際、業務のアプリでは aab 導入前のダウンロードサイズが 23MB だったのが、aab 導入後 13MB になっていました。

## aab を生成する

`./gradlew tasks` で確認できるように `./gradlew bundleXXX` で作れます。

手元の環境では、`app/build/outputs/bundle/release/app.aab` に吐き出されました。

## aab を手元の端末にインストールする

aab ファイルは apk ファイルの元になるため、そのままでは直接 `adb install app.aab` し、端末にインストール出来ません。そのため、手元の端末にインストールするには [bundletool](https://github.com/google/bundletool) を利用します。

[Releases · google/bundletool](https://github.com/google/bundletool/releases) から jar を落とし、aab から apks ファイルを作って、接続している端末に apk をインストールします：

```bash
$ java -jar bundletool-all-0.7.1.jar build-apks \
    --bundle=app.aab --output=app.apks \
    --ks=keystore.jks --ks-pass=pass:PASSWORD --ks-key-alias=ALIAS \
    --key-pass=pass:PASSWORD
$ java -jar bundletool-all-0.7.1.jar install-apks --apks=app.apks
```

ここでは、端末ごとに最適化された apks を生成していないため、上のコマンドで生成される apks ファイルは、結構大きくなります。端末ごとに最適化された apk がたくさん含まれているのでしょう。

`--connected-device`, `--device-spec` などのオプションを使えば最適化された apks ファイルが作成できます。

- [bundletool | Android Developers](https://developer.android.com/studio/command-line/bundletool)

ちなみに、手元の環境では \$ANDROID_HOME の環境変数するように言われたため、.bash_profile に以下を追加しました：

```bash
export ANDROID_HOME="/Users/name/Library/Android/sdk"
```

## aab をストアにアップロードする

手元で確認して問題なさそうならば、後は aab をストアにアップロードするだけなのですが、Google Play App Signing の機能を有効にする必要があります。

先程 bundletool で行っていた作業を Play Store でさせるために、鍵が必要になるためです。以下の記事などを参考に Google Play App Signing を導入しましょう。

- [【連載】ヤフーのエンジニアが教える! アプリ開発で気をつけたい Android のセキュリティ [4] Google Play App Signing で安全な鍵運用を｜セキュリティ｜ IT 製品の事例・解説記事](https://news.mynavi.jp/itsearch/article/security/3073)

後は aab ファイルを Google Play Store にアップロードすれば、端末ごとに最適化された apk が配信されます。まだ、試した回数が少ないため確かなことは言えませんが、デバッグ版の反映は、apk の時と比べて少し時間がかかるような気がします。
