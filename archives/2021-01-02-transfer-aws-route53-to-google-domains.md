---
categories:
  - Web Service
date: "2021-01-02T11:32:07+09:00"
page: false
slug: transfer-aws-route53-to-google-domains
title: "AWS Route 53 から Google Domains への移行"
---

現在、このブログは Next.js + Firebase Hosting + AWS Route 53 を利用して運用しています。今回、利用しているウェブサービスの棚卸しとして、Route 53 から Google Domains への移行を行いました。

## Google Domains へ移行した理由

最近、AWS を Route 53 以外には利用しておらず、移行できたらパスワード管理ツールに登録する項目が減らせるのが最大のモチベーションです。

また、Google Domains の管理画面が簡易に見えるのと、料金が安くなることを期待しています。

現在、AWS Route 53 での com ドメインは [TLD 別の最新料金表](https://d32ze2gidvkk54.cloudfront.net/Amazon_Route_53_Domain_Registration_Pricing_20140731.pdf) によれば年額 $12 となっています。これに加え、月額 $0.5 必要です。年額に直すと合計 $18 になります。

一方、Google Domains での com ドメインは年額 1,400 円でした。圧倒的なドル高が進まない限りは Google Domains のほうが安いことがわかります。

## AWS Route 53 から Google Domains へ移行する手順

https://console.aws.amazon.com/route53

まずは AWS Route 53 → 登録済みドメインより、移行するドメインを選択します。移管のロックが有効になっているため、これを無効にします（メールが届きます）。その後、認証コード → コードの取得より、10 数文字のコードを控えておきます。

{{<img alt="AWS Route 53" src="/images/2021/01/aws-route53.jpg" width="1920" height="1055">}}

https://domains.google.com/registrar/transfer

次に Google Domains → 移管に移動します。ドメイン名を入力し、案内通りに認証コードを入力していきます。移管時に掛かる料金は、ドメイン更新代に充てられるため、移管料金は実質無料ですね。

{{<img alt="Google Domains 移管手順1" src="/images/2021/01/google-domains-1.jpg" width="1920" height="1055">}}
{{<img alt="Google Domains 移管手順2" src="/images/2021/01/google-domains-2.jpg" width="1920" height="1055">}}
{{<img alt="Google Domains 移管手順3" src="/images/2021/01/google-domains-3.jpg" width="1920" height="1055">}}
{{<img alt="Google Domains 移管手順4" src="/images/2021/01/google-domains-4.jpg" width="1920" height="1055">}}

この後、AWS から移管確認のメール「[Domain transfer request] We got a request to transfer the domain」が届くので許可のリンクを踏みます。

その後、Google Domains からメールアドレス確認のメールも届くため、こちらも許可のリンクを踏みます。これにて移行が完了です。
