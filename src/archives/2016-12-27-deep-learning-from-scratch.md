---
categories:
  - Tech
date: "2016-12-27T09:11:26+09:00"
slug: deep-learning-from-scratch
title: ｢ゼロから作る Deep Learning｣を読んだ
---

Deep Learning（深層学習）を勉強するために、[ゼロから作る Deep Learning](http://www.amazon.co.jp/exec/obidos/ASIN/4873117585/rakuishi-22/ref=nosim/) を手を動かしながら読んだ。手書き数字の画像データ MNIST を正しく判別するのが本書のテーマだ。

本書では、1 〜 3 章までは基礎（Python, 関数, ニューラルネットワーク）を扱う。4 章では自動学習のキモとなる勾配に触れ、実際に学習できるコードが手元で動かせるようになる。5 章では、その勾配の計算をより効率良く行う手法を学ぶ（確かに、この計算方法でないと 4 章のコードは遅すぎる）。6 章では 4 章をベースに最適化のためのトピックを扱う。7 章では、画像を 1 次元的に扱っていたのを畳み込みの計算を挟むことにより三次元的に捉え、より学習の精度を上げる。8 章では、ディープラーニングの手法と歴史を紹介している。

<amazon id="4873117585" title="ゼロから作るDeep Learning ―Pythonで学ぶディープラーニングの理論と実装" src="https://images-na.ssl-images-amazon.com/images/I/512ru2i5gyL._SL160_.jpg">

画像データの判別と言えば、高専の卒業研究で OpenCV を使って画像から物体を判別していた。その時は、自分でパラメータ（閾値）を設定したものだけれど、Deep Learning では、学習用の画像を用意しておけば、後は勝手に学習してくれる。実際に本書では、正規分布に従う適当なパラメータが、学習を経る毎に、画像を適切に扱う値に変わっていくのが分かる。

また、本書の内容を理解するに当たって、行列や微分の知識を少なからず必要とした。数学の先生に習った内容を思い出し、余白に内容を補完する数式を書きながら読み進めた。一度習ったことは忘れていても、勘のようなもので補えるのが不思議だった。

## ネットワークの認識精度

実際に作成した各種ネットワーク（手書き数字の画像データを正しく判別するための）の認識精度はこんな感じでした。ディープなネットワーク（Deep Learning）については、学習時間が半日ぐらいかかるそうなので本書を読むだけに留めました。

### ニューラルネットワーク（4 章）

- 認識精度: 94.5%
- 勾配の計算方法: 誤差逆伝播法

### 最適化ニューラルネットワーク（6 章）

- 認識精度: 96.5%（訓練データに対しては 97.9%）
- 学習率: 0.1 → 0.001
- 更新手法: 確率的勾配降下法（stochastic gradient descent, SGD） → Adam
- 重みの初期値: ガウス分布 → Xavier 初期値

### 畳み込みニューラルネットワーク（7 章）

- 認識精度: 99.3%（訓練データに対しては 99.9%）
- Convolution/Pooling レイヤを追加したネットワーク構成

## 参考

- [ゼロから作る Deep Learning](http://www.oreilly.co.jp/books/9784873117584/)
- [oreilly-japan/deep-learning-from-scratch](https://github.com/oreilly-japan/deep-learning-from-scratch)
- [rakuishi/deep-learning-from-scratch: ゼロから作る Deep Learning](https://github.com/rakuishi/deep-learning-from-scratch)（写経用レポジトリ）
