---
categories:
- Cryptocurrency
date: 2017-11-07T20:24:37+09:00
draft: false
slug: realtime-bitcoin-transactions-on-chainflyer
title: 'ビットコインの取引をリアルタイムで見てみよう'
subtitle: 'ビットコインの取引をリアルタイムで見れるサイト chainFlyer。取引はオープンであることを肌で感じ、ブロックチェーン上に記録された取引の確認の仕方を学びましょう。'
---

<img src="/images/2017/11/bitcoin.svg" width="728" height="200" alt="bitcoin">

ビットコインの取引をリアルタイムで見れるサイト <a href="https://chainflyer.bitflyer.jp/" target="_blank">chainFlyer</a> では、グラフィカルに、いま世界中で行われている取引を見ることができます。

<img src="/images/2017/11/realtime-bitcoin-transactions-1.png" width="1024" height="768" alt="Blockchain Explorer" href="https://chainflyer.bitflyer.jp/">

- [Blockchain Explorer - chainFlyer](https://chainflyer.bitflyer.jp/)

## 総ブロック数

横に並んでいるのがブロックです。ブロックには約 10 分ごとに発生したトランザクション（取引）が格納されていて、現在（2017/11/07）時点では、493453 ブロックがこれまでに生成されています。ですので、以下の計算より：

493453 ブロック ✕ 10 分 ／ (24 時間 ✕ 60 分) ／ 365 日 ≒ 9 年

9 年前からビットコインの取引が行われていることがわかります。後述しますが、2009/01/04 に最初のブロックが生成されているので、計算はだいたい合っているようですね。

## 取引は公開されている

<img src="/images/2017/11/realtime-bitcoin-transactions-2.png" width="1024" height="768" alt="Blockchain Explorer" href="https://chainflyer.bitflyer.jp/">

試しにひとつブロックを覗いてみましょう。そのブロックの情報に加えて、そのブロックに含まれている全トランザクションが見えます。

このように、**ブロックチェーン上に記録された取引は、オープン**です。ですが、銀行の口座と違って、個人を特定できないため、アドレスを知っていても振り込むことぐらいしか出来ません。

## GENESIS（創世記）ブロック

chainFlyer のトップページの右側にある黒いブロックには、ビットコイン開発者であるサトシ・ナカモトが自分宛てに 50 BTC を送った取引が格納されています。

- [Block 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f - chainFlyer](https://chainflyer.bitflyer.jp/Block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f)

そして、その中にある取引（トランザクション）を見てみると、以下のメッセージが含まれています（ビットコインでは送金するときにメッセージを含めることができます）。

> 2009/01/04 03:15:05 JST  
> The Times 03/Jan/2009 Chancellor on brink of second bailout for banks  
> タイム紙 2009年1月3日 英大蔵大臣は銀行への二度目の救済を決めようとしている

- [Transaction 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b - chainFlyer](https://chainflyer.bitflyer.jp/Transaction/4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b)

ビットコインが開発された理由は本人は明らかにしていませんが、メッセージからは、破綻しそうな銀行を国民のお金で救済するという中央銀行による貨幣のコントロールを皮肉っているように思えます。

{{<cryptocurrency>}}