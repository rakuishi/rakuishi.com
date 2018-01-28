---
categories:
  - Python
date: 2018-01-27T20:01:04+09:00
draft: false
slug: getting-started-with-keras
title: Python の深層学習ライブラリ Keras で手書き文字の認識を始めよう
---

![](/images/2018/01/keras.png)

去年の始めに読んだ[ゼロから作る Deep Learning](/archives/deep-learning-from-scratch/) では、外部ライブラリを極力使用せずにディープラーニング（深層学習）の基礎を学べる良書だった。この記事では、ニューラルネットの構造を簡単に記述できる [Keras](https://github.com/keras-team/keras) ライブラリを使用し、手書き文字の認識まで一通り行う。

## 開発環境

- Anaconda 1.6.5 / [Anaconda - python.jp](https://www.python.jp/install/windows/anaconda/install_anaconda.html)
- Python 3.6.3 :: Anaconda, Inc.
- Keras `$ pip install tensorflow`, `$ pip install keras`
- Jupyter Notebook の起動 `$ jupyter notebook`

## 画像を読み込む

まずは、手書き文字を datasets から取得します。

```python
from keras.datasets import mnist

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train.shape, y_train.shape, x_test.shape, y_test.shape
# 学習用データ、学習用正解データ、テスト用データ、テスト用正解データ
# ((60000, 28, 28), (60000,), (10000, 28, 28), (10000,))
```

`x_train` には、`(28, 28)` の行列の白黒の画像データ（数値は 0~255）が 60,000 枚用意されています。`y_train` には、例えば `y_train[0] = 5` などの正解の数値が格納されています。`(28, 28)` の行列の 0~255 の数値を元に、「この配置の並びは数字の 5 だ」というように、コンピュータに学習させるのが目的になります。

次はニューラルネットで扱えるようにデータの加工をしていきます。

```python
from keras.utils import to_categorical

x_train = x_train.reshape(-1, 784) / 255
x_test = x_test.reshape(-1, 784) /255
y_train = to_categorical(y_train)
y_test = to_categorical(y_test)
x_train.shape, y_train.shape, x_test.shape, y_test.shape
# ((60000, 784), (60000, 10), (10000, 784), (10000, 10))
```

`x_train` の行列を `(28, 28) -> (784,)` に変更し、255 でブロードキャスト割り算をして、0.0 ~ 1.0 の範囲内にまとめます（この後の計算用の関数に通すため）。ここでは、1 次元に置き換えているため、画像の持つ 2 次元データがロストしています。それを上手く活かすには畳み込み層（Convolution）が使われますが、ここでは割愛します。

`y_train` は `y_train[0]` を見ると `array([ 0.,  0.,  0.,  0.,  0.,  1.,  0.,  0.,  0.,  0.])` のようになっています。これは数字の 5（0 から数え始めて 6 番目）が答えとなっていることを示しています。

## ニューラルネットワークの構築と学習

それでは、実際のニューラルネットワークの構築に入ります。

```python
from keras.models import Sequential
from keras.layers import Dense, Activation

model = Sequential() # モデルを作成
model.add(Dense(units=256, input_shape=(784,))) # 784 -> 256 に線形変換
model.add(Activation('relu')) # ReLU 関数で活性化
model.add(Dense(units=100))
model.add(Activation('relu'))
model.add(Dense(units=10)) # 最終的に 0 ~ 9 にする
model.add(Activation('softmax'))
model.summary()
# _________________________________________________________________
# Layer (type)                 Output Shape              Param #   
# =================================================================
# dense_1 (Dense)              (None, 256)               200960    
# _________________________________________________________________
# activation_1 (Activation)    (None, 256)               0         
# _________________________________________________________________
# dense_2 (Dense)              (None, 100)               25700     
# _________________________________________________________________
# activation_2 (Activation)    (None, 100)               0         
# _________________________________________________________________
# dense_3 (Dense)              (None, 10)                1010      
# _________________________________________________________________
# activation_3 (Activation)    (None, 10)                0         
# =================================================================
# Total params: 227,670
# Trainable params: 227,670
# Non-trainable params: 0
# _________________________________________________________________
```

誤差関数 `loss='categorical_crossentropy'`, 最適化手法 `optimizer='sgd'`, 評価関数 `metrics=['accuracy']` でモデルをコンパイルします。そして、一度に学習させる枚数 `batch_size=100`, 学習のエポック数 `epochs=10` で学習を開始します。

```python
model.compile(
    loss='categorical_crossentropy',
    optimizer='sgd',
    metrics=['accuracy']
)

model.fit(
  x_train, y_train,
  batch_size=100, epochs=10,
  validation_data=(x_test, y_test)
)

# Train on 60000 samples, validate on 10000 samples
# Epoch 1/10 loss: 0.1978 - acc: 0.9441 - val_loss: 0.1907 - val_acc: 0.9445
# Epoch 2/10 loss: 0.1888 - acc: 0.9466 - val_loss: 0.1847 - val_acc: 0.9459
# Epoch 3/10 loss: 0.1800 - acc: 0.9492 - val_loss: 0.1757 - val_acc: 0.9486
# Epoch 4/10 loss: 0.1724 - acc: 0.9515 - val_loss: 0.1695 - val_acc: 0.9498
# Epoch 5/10 loss: 0.1653 - acc: 0.9534 - val_loss: 0.1638 - val_acc: 0.9514
# Epoch 6/10 loss: 0.1588 - acc: 0.9553 - val_loss: 0.1584 - val_acc: 0.9522
# Epoch 7/10 loss: 0.1527 - acc: 0.9569 - val_loss: 0.1530 - val_acc: 0.9538
# Epoch 8/10 loss: 0.1471 - acc: 0.9587 - val_loss: 0.1508 - val_acc: 0.9561
# Epoch 9/10 loss: 0.1418 - acc: 0.9603 - val_loss: 0.1439 - val_acc: 0.9572
# Epoch 10/10 loss: 0.1366 - acc: 0.9617 - val_loss: 0.1411 - val_acc: 0.9578
```

学習用データでは、正答率 `acc: 0.9617`, テスト用データでは、正答率 `val_acc: 0.9578` となりました。どちらも 96% の確率で与えられたデータから正しい数値を答えられることを示しています。

{{<amazon id="4873117585" title="ゼロから作るDeep Learning ―Pythonで学ぶディープラーニングの理論と実装" src="https://images-na.ssl-images-amazon.com/images/I/512ru2i5gyL._SL160_.jpg">}}
