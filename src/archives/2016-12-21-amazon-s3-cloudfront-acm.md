---
categories:
  - Tech
date: "2016-12-21T16:56:51+09:00"
slug: amazon-s3-cloudfront-acm
title: Amazon S3 で運用しているブログを HTTPS 化した
---

<img alt="" src="/images/2016/12/amazon-s3-cloudfront-acm.png" width="728" height="148">

勉強のためにブログを HTTPS 化しました。このブログは静的サイトジェネレータ Hugo で生成したファイルを Amazon S3 にホスティングしており、ドメインも Amazon Route 53 で管理しています。

HTTPS 化の手順としては、AWS Certificate Manager, ACM から SLL 証明書を取得します。その証明書はそのまま S3 には使用できないため、CloudFront という Content Delivery Network, CDN を間に挟んで HTTPS 化します。

以下の記事を参考に進めましたが、躓いた点をこの記事にメモとして残しておきます。

- [[ACM] AWS Certificate Manager 無料のサーバ証明書で CloudFront を HTTPS 化してみた ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/acm-cloudfront-ssl/)

## AWS Certificate Manager, ACM

ドメイン認証の際、ドメイン管理者のメールアドレス（administrator@, postmaster@, admin@, hostmaster@, webmaster@）に確認メールが送信されますが、メールサーバーを持っていなかったため、以下の記事を参考にドメイン認証を行いました。

- [【そんなときどうする？】メールサーバはないけれど ACM を使いたい！ | サーバーワークス エンジニアブログ](http://blog.serverworks.co.jp/tech/2016/06/30/acm-auth-method/)

ちなみに、バケットに登録するアカウント ID は次のページから確認できます。→ [Billing Management Console](https://console.aws.amazon.com/billing/home?#/account)

自分の場合 www 無しの rakuishi.com を設定したいので「ドメイン名」にワイルドカード `*.rakuishi.com` を「追加の名前」に `rakuishi.com` を設定しました。

また、AWS Certificate Manager では、米国東部（バージニア北部）を選択するようにします。後述する CloudFront では、他の地域には対応していないためです。

- [Services Integrated with AWS Certificate Manager - AWS Certificate Manager](https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/acm-services.html)

## CloudFront

基本的には、先程の記事に従いますが、Route 53 の設定に入る前に、CloudFront に Amazon S3 のコンテンツが紐付けされているかどうか確認してみます。CloudFront Distribution 作成後に表示される以下のような Domain Name をブラウザに貼り付けます。

- \*\*\*.cloudfront.net

自分の場合、トップページ `/index.html` とサブディレクトリ `/about/index.html` が AccessDenied が返ってきてしまったので、以下の記事を参考に修正しました。

- [[CloudFront + S3]特定バケットに特定ディストリビューションのみからアクセスできるよう設定する ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/cloudfront-s3-origin-access-identity/)
- [CloudFront に S3 bucket のサブディレクトリパスのコンテンツを参照させる - Qiita](http://qiita.com/naoiwata/items/3c6626cbeacbb44d4aa8)

後は、Behaviors の Time to live, TTL を調整したり、Viewer Protocol Policy を Redirect HTTP to HTTPS に変更したりしました。CloudFront では設定に時間がかかるし、CDN キャッシュがあるし、のんびり作業しましょう。

## Route 53

S3 のために作成していたレコードの Alias Target を S3 → CloudFront に向くようにすれば OK です。

## Others

HTTP からのリソース読み込みがあると Google Chrome の場合では、緑色の鍵マークにならないため、画像のリンク先を HTTPS に変える必要があります。→ [SSL ページに Amazon からの画像を表示する。 - 前人未踏の領域へ](http://d.hatena.ne.jp/takeR/20141026/1414356669)

また、コメントシステム Disqus のマイグレーションのために、CSV ファイルを用意しました。詳しい方法は次の記事が詳しいです。→ [How to Migrate Disqus Comments to HTTPS - woorkup](https://woorkup.com/migrate-disqus-comments-https/)
