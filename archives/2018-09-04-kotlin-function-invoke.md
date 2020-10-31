---
categories:
  - Android
date: "2018-09-04T23:41:27+09:00"
slug: kotlin-function-invoke
title: "Kotlin: 関数オブジェクトと Invoke でクリックイベントをシンプルに書く"
---

Kotlin では関数をオブジェクトとして扱うことができます。そして、その関数オブジェクトを `invoke()` すれば、その関数を発火することができます：

```kotlin
fun main(args: Array<String>) {
  val onClick: ((String) -> Unit) = { text -> println(text) }
  onClick.invoke("Hello, world!")
}
=== Output ===
Hello, world!
```

Android での実用例として、RecyclerView にセットした Adapter の各 ViewHolder からイベントを受け取るような処理は、`View.OnClickListener` を参考に Interface を記述するのが普通ですが、以下のように書くこともできます：

```kotlin
class CustomAdapter() : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
  var onItemClick: ((String) -> Unit)? = null
  // 省略
  override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
    // 省略
    holder.onItemClick = { onItemClick?.invoke("Hello, world!") }
  }
}

/**
 * 利用例：
 * val adapter = CustomAdapter()
 * adapter.onItemClick = { text -> println(text) }
 */
```

