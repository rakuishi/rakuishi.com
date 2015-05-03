+++
categories = ["Android"]
date = "2015-04-29T08:40:12+09:00"
draft = false
slug = "material-design-todo"
title = "Material Design と Realm の勉強がてら作った Todo アプリを公開しました"
+++

[![](https://raw.githubusercontent.com/rakuishi/Todo-Android/master/todo.png)](https://play.google.com/store/apps/details?id=com.rakuishi.todo)

[Material Design](http://www.google.com/design/spec/material-design/introduction.html) と、流行っている <ruby>[Realm](http://realm.io/)<rt>れるむ</rt></ruby> を勉強するために、Todo アプリを作りました。一応、お金を払って Google Play Developer に参加しているのでストアに公開もしました。

* Google Play: [Todo - Google Play の Android アプリ](https://play.google.com/store/apps/details?id=com.rakuishi.todo)
* GitHub: [rakuishi/Todo-Android](https://github.com/rakuishi/Todo-Android)

この記事では、この Todo アプリを実装した上での気付き点を紹介します。

## [Material Design](http://www.google.com/design/spec/material-design/introduction.html)

Android マテリアルデザインガイドの何が良いかというと、色・サイズ・タイポグラフィが厳密に定義してあること。iOS の[フラットデザイン](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/)は、情報・コンポーネントの置き方を詳しく定義しているのですが、マテリアルデザインガイドまで厳密ではないように思う。乱暴だけれど、磨りガラスを取り入れれば、なんとなくフラットデザインっぽいよね、後は自由にやってねという感じだ。

実際、マテリアルデザインに準じたアプリは見た目がほとんど同じだけれど、フラットデザインに準じたアプリは見た目が結構異なっている。それ故に、マテリアルデザインのアプリは真似しやすく、フラットデザインのアプリは真似してもこれじゃない感が結構でる。どちらのアプリも個人で作ったことがあるのですが、マテリアルのほうがびしっと決まる。恰好良い。フラットデザインは、ぺらぺら感が出てダサくなる。難しい。

### 色・サイズ・タイポグラフィ

今回のアプリでは、色・サイズ・タイポグラフィについては、values/ 内に記述し、レイアウトファイルからはそれらを使いまわすようにした。

レイアウトファイル内で記述する属性は、レイアウト情報 `layout_*` に留め、テーマ（スタイル）は styles.xml に逃すことを意識する。

#### colors.xml

    <color name="myPrimaryColor">#3F51B5</color>
    <color name="myPrimaryDarkColor">#303F9F</color>
    <color name="myAccentColor">#FF4081</color>
    <color name="myDrawerBackground">#FFF</color>
    <color name="myWindowBackground">#FFF</color>
    <color name="myTextPrimaryColor">#212121</color>
    <color name="myNavigationColor">#000</color>

    <color name="myTextColor">#212121</color>
    <color name="mySecondaryTextColor">#727272</color>
    <color name="myDisabledTextColor">#B8B8B8</color>
    <color name="myHintTextColor">#B8B8B8</color>
    <color name="myDividerColor">#DADADA</color>

#### dimens.xml

    <!-- Keylines and spacing
         http://www.google.com/design/spec/layout/metrics-keylines.html -->
    <!-- Space between content areas -->
    <dimen name="dp_8">8dp</dimen>
    <!-- Defaults screen margin -->
    <dimen name="dp_16">16dp</dimen>
    <!-- Status bar, Icon size -->
    <dimen name="dp_24">24dp</dimen>
    <!-- Raised button height -->
    <dimen name="dp_36">36dp</dimen>
    <!-- Avatar -->
    <dimen name="dp_40">40dp</dimen>
    <!-- Subtitle, List Item -->
    <dimen name="dp_48">48dp</dimen>
    <!-- Toolbar height, Floating button size -->
    <dimen name="dp_56">56dp</dimen>
    <!-- Button min width -->
    <dimen name="dp_64">64dp</dimen>
    <!-- Title, List item -->
    <dimen name="dp_72">72dp</dimen>

### ツールバーとナビゲーションドロワー

Android 4.4 → 5.0 になり、印象的だったのが、Navigation Drawer が、Toolbar（Actionbar）上に現れること。その影響なのか Toolbar は、レイアウトファイルに記述すれば使えるようになる。これでこの上に、ドロワーを重ねることができる。

    <android.support.v7.widget.Toolbar
        xmlns:android="http://schemas.android.com/apk/res/android"
        style="@style/ToolBarStyle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="?attr/colorPrimary"
        android:minHeight="@dimen/abc_action_bar_default_height_material" />

これと DrawerLayout を使えば、ある程度までは上手く実装できるのですが、これが結構面倒くさい。自分の場合は、何故かドロワーをエッジスワイプするアクションが途中で止まる（？）不具合が発生し、何日か不貞腐れていたのですが、以下のテンプレートを使えば一瞬だった。神。

* [kanytu/Android-studio-material-template](https://github.com/kanytu/Android-studio-material-template)

## [Realm](http://realm.io/jp/docs/java/)

> Realmは、SQLiteやCoreDataから置き換わるモバイルデータベースです。

という紹介の通り、iOS（Objective-C）や Android（Java）から、簡単に使える。前に、SQLite を iOS/Android から生で触ったことがあるのですが、データベースの置き場所を作ったり、`CREATE TABLE` から始めたりと面倒な印象があるし、CoreData に至っては難しくてよく分からん（一応使ってるけれど）。

### モデル

Realm は、`RealmObject` を継承したモデルを元にデータベースを勝手に生成してくれます。便利！ ... ですが、何故かここで少しハマり、作成したモデルがコンパイルエラー。結局、getter, setter の指定が Realm 内の規約と少し違っていたことが原因だった。

その際に、Android Studio では、[Command + N] → [Getter and Setter] を選択すれば、勝手に生成してくれることを知る。恥ずかしいことに、今まで頑張ってタイプしてた。自動生成に任せれば、問題なしでした。

### Autoincrement

Realm-Java では、Autoincrement がまだ使えないようなので、最大値 + 1 して簡易的に実現した。

    public void insert(String name, boolean completed) {
        mRealm.beginTransaction();
        Todo todo = mRealm.createObject(Todo.class);
        todo.setId((int)mRealm.where(Todo.class).maximumInt("id") + 1);
        todo.setName(name);
        todo.setCompleted(completed);
        mRealm.commitTransaction();
    }

## こぼればなし

今回、実装する際に、GitHub に転がっている他の Android プロジェクト [forkhubs/android](https://github.com/forkhubs/android) を参考にしたのだが、かなり勉強になった。

例えば、ある ActivityA から ActivityB を呼びたい時に、B に以下を書いておけば：

    public static Intent createIntent(Context context, int id) {
        Intent intent = new Intent(context, ActivityB.class);
        intent.putExtra("extra.id", id);
        return intent;
    }

ActivityA から ActivityB を呼ぶときは、以下で良い：

    startActivity(ActivityB.createIntent(this, "1"));

AcitityA からは、ActivityB に渡す値のキーを気にする必要がないから、綺麗にまとまる。
