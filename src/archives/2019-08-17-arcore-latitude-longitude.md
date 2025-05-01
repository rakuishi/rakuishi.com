---
category: tech
date: "2019-08-17T11:04:35+09:00"
slug: arcore-latitude-longitude
title: "ARCore: AR 空間に緯度経度をもとにオブジェクトを配置する"
---

Android では ARCore という AR を表現できるライブラリ群が提供されている。これを利用して、ヘンゼルとグレーテルのように、自分が歩いた場所を緯度経度として保存しておいて、その緯度経度にクッキー（球）を置くアプリを作ろうと試みた。

結果的には、緯度経度の誤差の扱いが難しく挫折したけれど、緯度経度の計算や AR 空間上への配置が勉強になったのでまとめる。

- [rakuishi/guidepost: Leaves a trail of spheres like Hansel and Gretel](https://github.com/rakuishi/guidepost)

## 実装方針

1. 端末の AR 空間 {x,y,z} を獲得する
2. 緯度経度を順次獲得する
3. 最後の緯度経度と、それまでに獲得した緯度経度を比較し、方角(bearing)、距離(distance)を求める
4. 現在の端末の方向(orientation)と方角から回転(rotation)を求める
5. 回転から x, z を求める。今回は高さ y は現在の AR 空間の y とする
6. 新しく求めた {x,y,z} を AR 空間上に配置する

## 2 点の緯度経度から方角を求める

```kotlin
/**
 * @param lat1 latitude 1
 * @param lon1 longitude 1
 * @param lat2 latitude 2
 * @param lon2 longitude 2
 * @return bearing(0~360)
 */
fun bearing(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
  val radLat1 = Math.toRadians(lat1)
  val radLat2 = Math.toRadians(lat2)
  val diffLon = Math.toRadians(lon2 - lon1)
  val x = cos(radLat1) * sin(radLat2) - sin(radLat1) * cos(radLat2) * cos(diffLon)
  val y = cos(radLat2) * sin(diffLon)
  return (Math.toDegrees(atan2(y, x)) + 360) % 360
}
```

- [Formula to Find Bearing or Heading angle between two points: Latitude Longitude - GIS MAP INFO](https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/)

## 2 点の緯度経度から距離を求める

今回は、地球を球面と仮定する球面三角法を採用した。楕円状の 2 点間の距離を求める方法もあるが、計算式が複雑になるのと、東京駅から新宿駅までの距離の誤差が 5m 程度のため、今回は球面三角法を採用する。

```kotlin
/**
 * @param lat1 latitude 1
 * @param lon1 longitude 1
 * @param lat2 latitude 2
 * @param lon2 longitude 2
 * @return distance(m)
 */
fun distance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
  val radLat1 = Math.toRadians(lat1)
  val radLon1 = Math.toRadians(lon1)
  val radLat2 = Math.toRadians(lat2)
  val radLon2 = Math.toRadians(lon2)
  val r = 6378137.0 // equatorial radius
  val averageLat = (radLat1 - radLat2) / 2
  val averageLon = (radLon1 - radLon2) / 2
  return 2 * r * asin(sqrt(sin(averageLat).pow(2) + cos(radLat1) * cos(radLat2) * sin(averageLon).pow(2)))
}
```

- [地球上の 2 点間の距離の求め方 - Qiita](https://qiita.com/port-development/items/eea3a0a225be47db0fd4)

## 回転と距離から AR 空間上にオブジェクトを配置する

ARCore の AR 空間は、右手系の空間を持っており、単位は 1m である。右が +x, 上が +y, 手前が +z 軸となる。例えば、自分から見て右上にある時計は {1, 1, -1} となる。

回転は、時計の 12 時が 0°, 360°、3 時が 90°、6 時が 180°、9 時が 270° と定義されている。今回、高さ y は、現在のカメラの姿勢からそのまま利用したため、{x, y, z} はそれぞれ以下のように表現できる。

```kotlin
// distance は、2 点の緯度経度から求めた距離
// radRotation は、現在の端末の方向(orientation)と方角から回転(rotation)を求めたもの
val z = (-distance * cos(radRotation)).toFloat()
val x = ( distance * sin(radRotation)).toFloat()
val y = camera.displayOrientedPose.ty()
```

## 一旦挫折

実際は、端末に落ちてくる緯度経度の誤差が大きいため、まともに動作しなかった。以前の緯度経度と、最後の緯度経度を比較する時、手元の Google Pixel 3 では緯度経度の Accuracy が 15m 程度のため、方角も距離もまるで異なる値が計算されてしまう。緯度経度は、移動平均のフィルタを噛ませることによりある程度は改善されると思うけれど、基本的にはなかなか難しい気がする。

最近、Google Maps に追加された AR 機能は、少なくとも 1 点の緯度経度は正確な値のため、綺麗にオブジェクトが配置されている。後は、謎の補正テクノロジーが使われているのだろうと想像する（AR 空間から道の情報を把握するなど）。

Google Pixel 3 は、準天頂衛星システムみちびき対応製品リストに含まれているけれど、実際には利用できていない模様。みちびきは cm 級測位が可能のため、今後、対応したらもう一度開発を再開してみようと思う。

- [みちびき対応製品リスト｜利用者向け情報｜みちびき（準天頂衛星システム：QZSS）公式サイト - 内閣府](https://qzss.go.jp/usage/products/list.html)
