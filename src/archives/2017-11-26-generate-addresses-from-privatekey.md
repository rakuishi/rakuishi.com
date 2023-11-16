---
categories:
  - Tech
date: "2017-11-26T09:11:22+09:00"
slug: generate-addresses-from-privatekey
title: "｢お客様用ビットコインアドレスは変わることがあります。｣ってどういうこと？ビットコインのアドレスが複数作られる仕組みとは"
subtitle: "秘密鍵からアドレスを作りだす一方向の仕組みと、ある Seed から複数の秘密鍵・アドレスを作れる仕組みから、その謎を解き明かしていきます。"
---

[bitFlyer](https://bitflyer.jp/?bf=hus1mkdt) でビットコインの受け取り用のアドレス確認画面の注意書きに「お客様用ビットコインアドレスは変わることがあります。」と書かれています。

<img src="/images/2017/11/generate-addresses-from-privatekey-1.png" alt="お客様用ビットコインアドレスは変わることがあります。">

最初は「え？口座番号が変わるってどういうこと？受け取るのに支障がないの？」と思ったのですが、ビットコインの仕組みを調べていくうちに、便利な仕組みだなと唸りました。便利であると同時に匿名性をもたらすため、悪用される恐れもあるのですが。

この記事では、まずはビットコインアドレスの生成方法について触れ、その後、複数のアドレスを持てる仕組みを紹介していきます。

## ビットコインの秘密鍵とアドレスを作ってみよう

ビットコインのアドレスは、秘密鍵（プライベートキー）から計算できます。秘密鍵もアドレスも、半角英数を組み合わせた長い文字列のことです。といっても、想像しにくいと思いますので、まずは [bitaddress.org](https://www.bitaddress.org/) から使い捨ての秘密鍵とアドレスを作ってみましょう。

この秘密鍵はランダムに生成されます。bitaddress.org では、ユーザーのマウスのランダムな動きから秘密鍵を生成しています。このランダムな数値を作る難しさは、参考記事が詳しいです。→ [乱数生成器とゲームと諜報活動の話｜ Rui Ueyama ｜ note](https://note.mu/ruiu/n/nb5c3fe7e4e7d)

<img src="/images/2017/11/generate-addresses-from-privatekey-2.png">

100% にすると、秘密鍵（プライベートキー）とアドレスが生成されます。本当はこの秘密鍵は誰にも漏らしてはいけません。それぞれ長い文字列が生成されているのが分かります。

<img src="/images/2017/11/generate-addresses-from-privatekey-3.png">

## 秘密鍵からアドレスを作る仕組み

秘密鍵は、誰にも漏らしていけはない変わることのない文字列です。この秘密鍵からはアドレスが計算によって求められます（本当は途中に公開鍵の計算が入りますが省略しています）。

- **アドレス ＝ 秘密鍵にある計算処理をする**

しかし、この計算処理は、秘密鍵からはアドレスを求められますが、アドレスからは秘密鍵を求められません。このような計算処理のことを一方向性関数といいます。この関数の特性は、現在の暗号処理の根幹をなす機能であり、このことから暗号通貨と呼ばれているのだと思います。

ビットコインにとって、秘密鍵を知られるのは口座番号とパスワードを渡すのと同じ行為です。しかし、**口座番号（アドレス）を知られても、秘密鍵をそこから計算できない**ということです。

## Seed から複数の秘密鍵・アドレスを作れる HD ウォレット

ひとつの秘密鍵からはひとつのアドレスが作れることを見てきました。ちなみに、新しい用語になりますが、**秘密鍵とアドレスのセットをウォレット**といいます。さて、ここからは bitFlyer の注意書きに迫っていきます。

このウォレットにはいくつかの種類があり、HD ウォレット（階層的決定性ウォレット、Hierarchical Deterministic Wallet）では、ひとつの Seed（種）から複数の秘密鍵を作ることができます。

このことから、恐らく bitFlyer では、この HD ウォレットのような、**ひとつの Seed から複数の秘密鍵、そこから複数のアドレスを作れるウォレット**を採用していることが想像できます（ちなみに、bitFlyer のようなオンライン上にある仮想通貨取引所を利用する場合は、秘密鍵を取引所に預けている状態）。

Seed から複数のアドレスが作れるタイプのウォレットを使える場合は、アドレスを適宜変えることが推奨されています。何故なら、アドレスに対するやりとりは、ブロックチェーン上でオープンに公開されているからです。アドレスを変えた場合、そこから逆算して他のアドレスや秘密鍵を求めることはできないため、結局、誰のもとに届いたのはかわかりません。

このような理由から、bitFlyer では、都合の良いタイミングでアドレスが変わることがあるということですね。

<cryptocurrency>

## 参考

- <a href="http://www.amazon.co.jp/exec/obidos/ASIN/4757103670/rakuishi-22/ref=nosim/" name="amazletlink" target="_blank">ビットコインとブロックチェーン:暗号通貨を支える技術</a>
- <a href="http://www.amazon.co.jp/exec/obidos/ASIN/410215972X/rakuishi-22/ref=nosim/" name="amazletlink" target="_blank">暗号解読〈上〉 (新潮文庫)</a>
- <a href="http://www.amazon.co.jp/exec/obidos/ASIN/4102159738/rakuishi-22/ref=nosim/" name="amazletlink" target="_blank">暗号解読 下巻 (新潮文庫)</a>
- [address - How are different Addresses generated from the same Private key? - Bitcoin Stack Exchange](https://bitcoin.stackexchange.com/questions/48322/how-are-different-addresses-generated-from-the-same-private-key)
