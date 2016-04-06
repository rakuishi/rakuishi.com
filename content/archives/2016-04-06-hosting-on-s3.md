---
categories:
- Web Service
date: 2016-04-06T22:16:34+09:00
draft: false
slug: hosting-on-s3
title: "Amazon S3 にサイトのホスティング先を移行した"
---

このブログは静的サイトジェネレータ Hugo によって生成された静的ファイルをアップロードして作られています。今回、ホスティング先を Sakura Internet から Amazon S3 (Simple Storage Service) に変更しました。

この記事では、導入する際に行った Amazon S3 の静的サイト設定、Route53 によるドメイン管理についてメモします。

## Amazon S3

https://aws.amazon.com/jp/s3/

クレジットカード番号の登録、電話番号認証を行って、アカウントを作成しました。[ストレージ & コンテンツ配信] → [S3] → [バケットの作成] からバケット名 `rakuishi.com` を作成しました。

ちなみに、アカウント作成直後では「反映まで最大24時間かかることがあります」と言われ、設定できませんでしたが、寝て起きたら使えるようになっていました。

### アクセス許可

初期設定では、ホスティングしたファイルへのアクセスが制限されています。見れるように、[プロパティ] → [アクセス許可] → [バケットポリシーの編集] から以下のルールを追加します。この `Version` は、作成日などではなくて `2012-10-17` を指定する必要があります。

```
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadForGetBucketObjects",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::rakuishi.com/*"]
  }]
}
```

### 静的ウェブサイトホスティング

[プロパティ] → [静的ウェブサイトホスティング] → [ウェブサイトのホスティングを有効にする] から、インデックスドキュメント index.html を設定します。また、リダイレクトルールを以下のように設定しました。

```
<RoutingRules>
  <RoutingRule>
    <Condition>
      <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
    </Condition>
    <Redirect>
      <ReplaceKeyWith>404.html</ReplaceKeyWith>
    </Redirect>
  </RoutingRule>
  <RoutingRule>
    <Condition>
      <KeyPrefixEquals>feed/</KeyPrefixEquals>
    </Condition>
    <Redirect>
      <ReplaceKeyWith>index.xml</ReplaceKeyWith>
      <HttpRedirectCode>301</HttpRedirectCode>
    </Redirect>
  </RoutingRule>
</RoutingRules>
```

これで静的サイトとしての設定は終わりました。

## AWS CLI

### ユーザー作成

メニュー右上にある [ユーザー名] → [認証情報] → [IAM ユーザーの使用開始] を選択します。ユーザーを作成して、`Access Key Id` と `Secret Access Key` を保存します。

作成したユーザーを選択し、[アクセス許可] → [ポリシーのアタッチ] から `AmazonS3FullAccess` を付与します。

### Install AWS CLI

Python パッケージ管理ツール pip をインストールし、pip から AWS CLI をインストールします。 OS X El Capitan 以降では、3行目のインストール方法を試すと、エラーが出ることなく AWS CLI をインストールできました。

```
$ sudo easy_install pip
$ sudo pip install awscli
$ sudo -H pip install awscli --upgrade --ignore-installed six
```

次に認証情報を登録していきます。対話的に入力していきます。登録内容は ~/.aws/ に格納されます。

```
$ aws configure
AWS Access Key ID [None]: XXXXXXXXXXXXXXXXXXXX
AWS Secret Access Key [None]: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Default region name [None]: ap-northeast-1
Default output format [None]: text
```

今回、デプロイのための転送コマンドは以下のように書きました。これで一括で流し込めて、割り当てられたドメインにファイルが設置されていることを確認できました。

```
aws s3 sync --delete ./public s3://rakuishi.com
```

## 独自ドメインの設定

ネイキッドドメイン（www.rakuishi.com ではなく rakuishi.com）を使用するには、DNS サーバーを Route 53 に設定する必要があります。ドメインは、お名前.com のDNSサーバーを使用しているのでそこから移行する必要がありました。

まずは、Route 53 での作業を行います。

[Route53] → [DNS management] → [Create Hosted Zone] から、Hosted Zone を作成する。

* Domain Name: rakuishi.com
* Type: Public Hosted Zone

[Create Record Set] を選択し、rakuishi.com を作成した S3 のバケットに向ける。

* Name: 空白
* Type: A – IPv4 Address
* Alias: Yes
* Alias Target: S3 website endpoints から選択できる
* Routing Policy: Simple
* Evaluate Target Health: No

今回は、以下の NS レコードが生成されました。これをお名前.com に登録します。お名前.com 管理画面 → [ネームサーバーの変更] → [他のネームサーバーを利用] から、ネームサーバーの情報を登録します。

* 1 プライマリネームサーバー(必須): ns-1571.awsdns-04.co.uk
* 2 セカンダリネームサーバー(必須): ns-907.awsdns-49.net
* 3: ns-391.awsdns-48.com
* 4: ns-1368.awsdns-43.org

確認は、`nslookup` コマンドを使用しました。浸透すれば、`server` を設定する必要なく `nslookup rakuishi.com` だけで返ってきます。

```
rakuishi:rakuishi.com rakuishi$ nslookup
> server ns-1571.awsdns-04.co.uk
Default server: ns-1571.awsdns-04.co.uk
Address: 205.251.198.35#53
> rakuishi.com
Server:   ns-1571.awsdns-04.co.uk
Address:  205.251.198.35#53
```

## 料金

現在このサイトは 30,000PV あり、ストレージ容量は 100MB 程度。ストレージ容量は大したことがないから、基本的に GET リクエスト数によって月々の料金が前後するはずです。リクエスト数はページで使用する画像やスタイルシートを読み込む関係上、PV よりも大きくなることはわかっていましたが、3 日間運用してみて、月間推定 180,000 GET Request が発生するようでした。

よりリクエスト数を抑えるために、インライン画像、CSS Sprite などの小賢しいテクニックを使用し、月間推定 100,000 GET Request に抑えました。ですので、現状は以下のコストで運用できる予定です（S3 のストレージ容量、Route 53 のクエリ課金は無視）。

* S3  
100,000 (GET Request) / 10,000 x 0.0037 ($/10,0000 GET Request) = 0.037 ($)
* Route 53  
1 HostedZone = 0.5 ($)
* 計  
($0.037 + $0.5) x 110 (yen/$) = 59 (yen)

Sakura Internet スタンダードプラン 515 円で運用していたから、それよりも安くなりそうです。浮いた分を最近はまっている甘酒代にしようと思います。

## 参考

* [ブログをHugoとAmazon S3に移行しました - As a Futurist...](https://blog.riywo.com/2015/09/migrate-to-huge-and-s3/)
* [[AWS]S3×Route53×お名前.comでルートドメインな静的Webサイトホスティングする | 遊び場](http://www30304u.sakura.ne.jp/blog/?p=3154)
* [【初心者向け】MacユーザがAWS CLIを最速で試す方法 ｜ Developers.IO](http://dev.classmethod.jp/cloud/aws/mac-aws-cli/)
* [s3 — AWS CLI 1.10.18 Command Reference](http://docs.aws.amazon.com/cli/latest/reference/s3/index.html)
* [Fail to install aws-cli via sudo pip install awscli · Issue #1522 · aws/aws-cli](https://github.com/aws/aws-cli/issues/1522)
