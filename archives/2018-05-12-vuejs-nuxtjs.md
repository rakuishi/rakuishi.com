---
categories:
  - JavaScript
date: "2018-05-12T23:11:45+09:00"
slug: vuejs-nuxtjs
title: Vue.js / Nuxt.js を採用した Web 開発で得た知見
---

{{<img alt="merlion" src="/images/2018/05/merlion.jpg" width="1564" height="880">}}

2018 年に入ってからは [Vue.js](https://jp.vuejs.org/) / [Nuxt.js](https://ja.nuxtjs.org/) を採用した Web サイト開発に携わっています。ログイン機能がある Web サイトで、データは API サーバーを叩いて取得するという構成。最近のフロントエンド開発は、感覚としてはアプリ開発ですね。

Vue.js に加えて Nuxt.js を採用したのは SSR（Server Side Rendering）をしたいという理由に尽きます。SSR することによるメリットは、以下となります：

1. Facebook や Twitter が OGP タグを正しく評価してくれる
1. 検索エンジンがサイトを正しく評価してくれる
1. 副産物として、ログインユーザー情報が描画されて返るため、クライアント側で描画されるまでの空白状態がユーザーに見えない

この記事ではそんな Vue.js / Nuxt.js を採用した Web 開発で得た知見を紹介していきます。

## 親と子のデータの受け渡しと Vuex ストアの勘所

ほとんどのデータの受け渡しは、親と子のコンポーネントで発生します（親はページも含む）。親から子は `props` による受け渡し、子から親には `$emit` による受け渡しになります。

### parent.vue

```javascript
<template>
  <div>
    <child
      v-bind:message="message"
      v-on:onSubmitted="onSubmitted" />
  </div>
</template>

<script>
import child from '~/components/child';

export default {
  components: {
    children
  },
  methods: {
    onSubmitted(message) {
      console.log('message from child: ' + message);
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
```

### child.vue

```javascript
<template>
  <div>
    <!-- 親から受け取った message がそのまま入る -->
    <input v-model="message" />
    <button v-on:click="onSubmitted">Submit</button>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  },
  methods: {
    onSubmitted() {
      // message に変更があるたびに、parent.vue の onSubmitted が発火する
      this.$emit('onSubmitted', this.message);
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
```

これ以外の親と子の関係を超えて値を渡したい時は、[Vuex ストア](https://ja.nuxtjs.org/guide/vuex-store)を使うことになると思います。

Vuex ストアの実装例で検索すると、API 通信結果を受け取り、それを Vuex ストアに格納して、`getters` から読み込む記事が多く紹介されていますが、この方法は以下の理由からプロジェクトが大きくなるにつれて限界を迎えました。

- API 数に比例して Vuex ストアが肥大化する
- Promise で返る通信結果を格納するために Vuex ストアの各変数を用意する繰り返しの作業がだるい
- 通信結果の成功時と失敗時のデータが `getters` に逃げるため、コードを追いにくい
- Vuex ストアのデータの初期化忘れが多発し、別の画面で昔のデータが表示されてしまう

そのため、Vuex ストアは本来の使い方である「親と子の関係を超えて値を渡したい時」に限定して使うようにしました。

## Vuex ストアサンプルコードの SSR 時における不可解な挙動

[Vuex ストア](https://ja.nuxtjs.org/guide/vuex-store) を有効にするには、いくつか書き方があり、プロジェクト初期には [vuejs/vuex](https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/store/index.js) に掲載されている書き方を参考にしていました。

しかし、このサンプルコードと Nuxt.js を組み合わせた時に、不可解な挙動が発生しました。クライアント側（ユーザーのブラウザ）では、問題は起きないのですが、Nuxt サーバー側では、状態が初期化されず、他ユーザーからデータが見える汚染が発生しました。

サンプルコードでは `state` はオブジェクトですが、これを関数で書き換えることにより、`req` 毎に Vue インスタンスが生成され、さらに `state` が初期化されていることを確認しました。

結果的に Nuxt.js のサイトにあるクラシックモード、モジュールモードの書き方では、`state` は関数になっていて、vuejs/vuex の書き方のオブジェクトを先に参考にしたのが、すべての間違いでした。同じ間違いをする人のために文章として残しておきます。

- https://ja.nuxtjs.org/guide/vuex-store/
- https://github.com/nuxt/nuxt.js/issues/2508

## Nuxt サーバーの描画とクライアントの描画の差

Vuejs の SPA（Single Page Application）では表現できないものを Nuxtjs によって解決しようとしているから当然なのですが、その実装難易度は大幅に上がります。以下に気を付けておきたいです：

- `process.server`, `process.client` による条件分岐により、必要なコードだけをそれぞれの環境（Nuxt サーバー上、ブラウザ上）で実行できるようにする
- ブラウザ上の JavaScript に慣れていると `window` オブジェクトはあることが当たり前だけれど、Nuxt サーバー上にはもちろん存在しない
- Nuxt サーバーによる SSR（Server Side Rendering）では、`created` 時までのライフサイクルのコードが実行されるため、`created` までに書いている API 通信結果は DOM に格納されるが、CSR（Client Side Rendering）時にも実行されるため、通信が無駄になることがある。その場合 `beforeMount` に書くのが良い
- SSR 時と CSR 時の情報の差がある場合、エラーを吐く。そのため、ホットリロードではなく全画面リロードして動作の確認をする必要がある。条件分岐をコントロールする変数が、`asyncData` や `created` で更新される場合は要注意

## ユーザーのログイン情報の取り扱い方法

ログインユーザーを取り扱うウェブサイトでは、ログインしている状態と、ゲスト状態のふたつの画面が発生します。そのふたつの状態を、SSR と CSR 時で上手く取り扱う必要があり、以下に気を付けておきたいです：

- SSR と CSR で構築する DOM に差がある場合（`created` 後の DOM）、エラーを吐く
  - SSR 時は `beforeMount` は呼ばれないため、DOM に差がある場合はそこに記述するか
  - `<no-ssr>` で囲むことで回避する
- ログイン情報を Local Storage や Cookie に保存している場合、（恐らく最速で）CSR 時の `beforeMount` に評価されるため、`created` → `beforeMount` に画面描画に差がある場合、画面のチラつきが発生する

ログイン機能を持つ Web サイトでは、ユーザーの認証状態は token として Cookie に保持していると思いますが、それで上記を考慮して Vuejs / Nuxtjs を採用した場合の、たぶんベストプラクティスなユーザーのログイン情報の取り扱い方法は、以下のようになりました：

```javascript
async nuxtServerInit({ commit, state }, { req }) {
  const hasToken = !!req.cookies.token;
  const promise = hasToken
    ? this.$axios.$get('/me')
    : Promise.resolve({});

  await promise
    .then(response => {
      // ユーザー情報を JSON として保存する
      commit('SET_USER', response);
      commit('RENDER_PAGE_AS_LOGIN_USER_ON_SSR', hasToken);
    })
    .catch(error => {
      // エラー内容を解釈する
      commit('RENDER_PAGE_AS_LOGIN_USER_ON_SSR', hasToken);
    });
},
```

```javascript
const getters = {
  isLogin: state => {
    // SSR 時は nuxtServerInit から値を設定できる renderPageAsLoginUserOnSSR によって
    // ログイン後のページを SSR で描画するかどうかを決定する
    if (process.server) {
      return state.renderPageAsLoginUserOnSSR;
    }

    // CSR 時はブラウザの Cookie に token が存在するかどうか
    return process.client && hasToken();
  },
}
```

[NuxtServerInit](https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action) により Nuxt サーバー上で `nuxtServerInit` が解釈され DOM にユーザー情報が JSON として埋め込まれることになります。つまり、`isLogin` フラグも `SET_USER` によって更新されるユーザー情報の JSON も最初から描画できます。
