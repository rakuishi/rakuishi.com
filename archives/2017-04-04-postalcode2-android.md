---
categories:
- 開発
date: "2017-04-04T21:07:50+09:00"
slug: postalcode2-android
title: ｢オフライン郵便番号検索の決定版！ - 郵便番号検索くん for Android｣を 3 年ぶりにアップデートしました
---

{{<img alt="" src="/images/2017/04/promotion.png" width="1024" height="500">}}

最近、放置していたアプリのアップデートを頑張っていて、iOS の「[Quicka2 - 検索を快適に](https://itunes.apple.com/jp/app/id725195676?mt=8&uo=4&at=11l3RT)」「[オフライン郵便番号検索の決定版！ - 郵便番号検索くん](https://itunes.apple.com/jp/app/id578073498?mt=8&uo=4&at=11l3RT)」に続いて、Android の郵便番号検索くんをアップデートしました。アップデートしたと書きましたが、実は別アプリとしてリリースしています。

[{{<img alt="" src="/images/2017/04/en_generic_rgb_wo_60.png" width="172" height="60">}}](https://play.google.com/store/apps/details?id=com.rakuishi.postalcode2)

## [オフライン郵便番号検索の決定版！ - 郵便番号検索くん](https://play.google.com/store/apps/details?id=com.rakuishi.postalcode2)

郵便番号データは、[zipcloud](http://zipcloud.ibsnet.co.jp/) のデータを SQLite データベースに保存して、利用しています。以前は、ここから落とせる CSV データを Excel で開いて、カタカナをひらがなに変換して、その CSV データをテキストエディタで Shift-JIS から UTF-8 にして、sqlite3 コマンドからインポートする手順を踏んでいましたが、Ruby スクリプトを使って一発でそれが対応できるようにしました。

50 行ぐらいのスクリプトを叩けば、データを生成する面倒な作業が終わるので、今後のアップデート作業が負担にならずに済みそう。こういった作業の効率化は、3 年前には思いつかなかったので成長を感じます。

言語留学中は Android の知識をアップデート出来ていなかったので、その間に勉強できていなかった以下の技術を使って書いてみました。では、アプリをよろしくお願いします。(●・▽・●)

- DataBinding
- BottomNavigationView
- RecyclerView
- Dagger2
- Android Orma
- RxJava2

## ストア掲載情報

日本全国15万人が使ってる郵便番号アプリの決定版！郵便番号を快適に検索できる無料のアプリです。
郵便番号の検索は、電波がなくても行えます。

都道府県から順に選択して郵便番号を調べたり、住所から郵便番号を検索することもできます。もちろん、郵便番号から住所も検索できます。

主な特徴 

- お気に入りに登録すれば、後から探すのも簡単
- 検索結果は、メールで送信したり、コピーすることができます

郵便番号の情報は、日本郵便株式会社様の提供するデータ（2017年02月28日）を利用しています。
このアプリは、iPhone アプリを Android アプリに移植したものになります。

{{<img alt="" src="/images/2017/04/postalcode2-ss-1.png" width="2180" height="1920">}}

{{<img alt="" src="/images/2017/04/postalcode2-ss-2.png" width="2180" height="1920">}}
