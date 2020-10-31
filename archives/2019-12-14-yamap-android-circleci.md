---
categories:
  - Android
date: "2019-12-14T11:01:10+09:00"
slug: yamap-android-circleci
title: "YAMAP Android の CircleCI 環境"
---

YAMAP エンジニア Advent Calendar 2019 の 15 日目の記事を担当する [rakuishi](https://github.com/rakuishi) です。
この記事では「YAMAP Android の CircleCI 環境」をお話します。

※ 12 月 11 日に行われた CircleCI ユーザーコミュニティミートアップ福岡の内容を要約したものになります。

https://rakuishi.github.io/static/slides/20191211_circleci.pdf

## CircleCI と YAMAP Android

YAMAP の Android チームでは、ちょうど 1 年前に CircleCI の導入を始めました。最初は develop ブランチを更新した際に、アプリの配信ファイル apk を作成するために利用していました。

## 既存の配信ファイル形式を aab に対応する

一年ほど前に Google Play Developer Console 上に、アプリの配信ファイル形式を変えることを推奨する Warning が表示されるようになりました。apk（Android Application Package）から Google が推奨する aab（Android App Bundle）にです。

Android App Bundle の特徴は以下の通り。

- 各デバイスごとに最適化された apk を含む（イメージ）
- 配信サイズが小さくなる
  - YAMAP Android では 20MB → 13MB (40% 減) になりました
- ProGuard のマッピングファイルを含んでいるため、別画面でアップロードする必要がない
- 気軽に Android 端末にインストールするのが面倒なため、リリース専用

```bash
// 絶対に覚えられない aab を手元の Android 端末にインストールするコマンド
$ java -jar bundletool-all-0.7.1.jar build-apks \
     --bundle=app.aab --output=app.apks \
     --ks=keystore.jks --ks-pass=pass:PASSWORD --ks-key-alias=ALIAS \
     --key-pass=pass:PASSWORD
$ java -jar bundletool-all-0.7.1.jar install-apks --apks=app.apks
```

この aab の登場により、CircleCI 周りの設定も見直す必要があり、最終的に以下のようになりました。

- master
- develop
  - `./gradlew app:assembleRelease` により apk を CircleCI により自動生成
- release/VERSION
  - `./gradlew app:bundleRelease` により aab を CircleCI により自動生成
- feature/TICKET
  - Test が走る

## 最近の審査待ちとの付き合いかた

また、今までは iOS だけだったのですが、Android も審査が必要になりました。審査を含めた Android のリリース手順は、以下の通り。

- release/X.X.X を作成する
- aab を CircleCI の artifact よりダウンロードし、それを D&D してベータ配信
- 最近は Android も審査時間があるため、ベータ配信に少し時間がかかる (2時間程度？)
- ベータ配信 → 本番リリースは即反映される
- 午前中にベータ配信して、確認して、本番リリースをポチる

来年はリリース作業も自動化したいと思っています。😛

## CircleCI v2.1 の新機能で config.yml を整理する

YAMAP では Android Wear アプリを提供しています。が、Wear は、まだ Android 10 未対応となっています。ですので、Android アプリは 10, Wear アプリは 9 対応となります。😥

そのため、config.yml に複数 Docker Image の定義が必要となり、なかなか複雑になってしまいますが、CircleCI v2.1 で登場した `executors` を使えばスッキリします。

このように `executors` 以下に、Android アプリ向けの `app_excecutor` 設定、Wear アプリ向けの `wear_executor` 設定を定義すれば：

```yml
executors:
  app_excecutor:
    working_directory: ~/code
    docker:
      - image: circleci/android:api-29
    environment:
      JVM_OPTS: -Xmx3200m
  wear_executor:
    working_directory: ~/code
    docker:
      - image: circleci/android:api-28
    environment:
      JVM_OPTS: -Xmx3200m
```

後は、各 job の `executor` に、定義した executor を登録すれば OK です。

```yml
jobs:
  build_apk_app:
    executor:
      name: app_excecutor
    steps:
      # Android アプリの apk を作成する steps が続く...
  build_aab_app:
    executor:
      name: app_excecutor
    steps:
      # Android アプリの aab を作成する steps が続く...
  build_apk_wear:
    executor:
      name: wear_excecutor
    steps:
      # Wear アプリの apk を作成する steps が続く...
  build_aab_wear:
    executor:
      name: wear_excecutor
    steps:
      # Wear アプリの aab を作成する steps が続く...
```

さらに apk と abb を生成する処理は、途中まで一緒のため、CircleCI v2.1 で登場した commands で整理できます！

`app_steps` という command を定義すれば：

```yml
commands:
  app_steps:
    steps:
      - checkout
      - restore_cache: # 省略
      - run:
          name: "Download Dependencies"
          command: ./gradlew app:androidDependencies
      - save_cache: # 省略
      - run:
          name: "Test app"
          command: ./gradlew app:testDebug
```

以下のように簡潔に各 job を書くことができます。

```yml
jobs:
  build_apk_app:
    executor:
      name: app_excecutor
    steps:
      - app_steps
      - run:
          name: "Build apk"
          command: ./gradlew app:assembleRelease
  build_aab_app:
    executor:
      name: app_excecutor
    steps:
      - app_steps
      - run:
          name: "Build aab"
          command: ./gradlew app:bundleRelease
  # 以下、省略
  # build_apk_wear, build_aab_wear
```

## slack-orb で CircleCI の結果を Slack に自在に通知する

もともと CircleCI デフォルトの webhook を導入していましたが、そのの通知を自在にカスタムするために、slack-orb 導入を行いました。

Orb は CircleCI v2.1 で登場した「ジョブ、コマンド、Executor のような設定要素をまとめた共有可能なパッケージ」です。

slack-orb を利用するには、CircleCI 管理画面の Environment Variables に `SLACK_WEBHOOK` で Webhook の URL を登録し、以下のように config.yml に記述します。

```yml
orbs:
  slack: circleci/slack@3.4.1
 
jobs:
  build_apk_app:
    steps:
      # 省略
      - slack/notify:
          message: "Success: Build app apk"
          color: "#39A04E"
          include_job_number_field: false
          include_project_field: false
```

ビルドが終了したら以下のように知らせてくれます：

{{<img alt="slack-orb" src="/images/2019/12/slack-orb.png" width="320" height="164">}}
