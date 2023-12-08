---
categories:
  - Tech
date: "2023-12-07T19:23:29+09:00"
page: false
slug: android-app-improvement-2023
title: "Android アプリ改善 2023 年（version catalogs, build-logic, Baseline Profiles）"
---

最新の Android Studio から新規プロジェクトを作成すると、見慣れない書き方がちらほら登場します。この記事では、仕事の Android プロジェクトをその最新のビルド構成に追従したときの覚え書きと、今年対応したビルド時間と起動速度の改善内容について触れます。

## ビルド構成の改善

### ビルドをバージョンカタログに移行する

まずはバージョンカタログに移行しました。複数の関連ライブラリが同じバージョンを利用していることを明示する時、今までは gradle.properties にバージョン名を定義して、それを参照していましたが、公式の機能としてバージョンカタログが登場しています。

実装としては gradle/libs.versions.toml を作成し、バージョン定数と利用ライブラリを書いていくだけになります。公式ドキュメントどおりに作業すれば躓く箇所はありませんが、定義名を考えるのが少し面倒ではあります。

```toml
[versions]
androidxCamerax = "1.2.3"

[libraries]
androidx-camera-core = { group = "androidx.camera", name = "camera-core", version.ref = "androidxCamerax" }
androidx-camera-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "androidxCamerax" }
```

```groovy
dependencies {
  // implementation "androidx.camera:camera-core:$camerax_version"
  // implementation "androidx.camera:camera-lifecycle:$camerax_version"
  implementation libs.androidx.camera.core
  implementation libs.androidx.camera.lifecycle
}
```

- [ビルドをバージョンカタログに移行する | Android デベロッパー | Android Developers](https://developer.android.com/studio/build/migrate-to-catalogs?hl=ja)

### ビルド構成を Groovy から KTS に移行する

build.gradle は Groovy で記述されていますが、今後は Kotlin スクリプト（KTS）が推奨されるため、その移行作業を行いました。基本的には次の 2 ファイルになります：

- build.gradle → build.gradle.kts // Top-level と Module-level の 2 箇所
- settings.gradle → settings.gradle.kts

これも公式ドキュメントを参考に都度ビルドエラーを解消しながら進めていけば良いですが、変換方法が分からない時は GitHub のコード検索で Kotlin をフィルターして先人の知恵を拝借しました。

- [ビルド構成を Groovy から KTS に移行する | Android デベロッパー | Android Developers](https://developer.android.com/studio/build/migrate-to-kts?hl=ja)

### buildscript から plugins ブロックに移行する

次は buildscript から plugins block への移行です。

作業内容としては build.grale.kts に repositories が記述されていたのを settings.grale.kts に引っ越し。移行後は次のような構成となります：

```kotlin
// build.gradle.kts Top-level
@Suppress("DSL_SCOPE_VIOLATION")
plugins {
  alias(libs.plugins.play.services) apply false
  alias(libs.plugins.android.application) apply false
  alias(libs.plugins.kotlin.android) apply false
}

task("clean", Delete::class) {
  delete = setOf(rootProject.buildDir)
}
```

```kotlin
// settings.gradle.kts
pluginManagement {
  repositories {
    google()
    mavenCentral()
    maven(url = "https://maven.google.com")
    gradlePluginPortal()
  }
}

@Suppress("UnstableApiUsage")
dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
    maven(url = "https://maven.google.com")
  }
}

include(":app")
```

```toml
# libs.versions.toml

[plugins]
play-services = { id = "com.google.gms.google-services", version.ref = "playServicesPlugin" }
android-application = { id = "com.android.application", version.ref = "androidGradlePlugin" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
```

- [buildscript から plugins ブロックに移行する | Android デベロッパー | Android Developers](https://developer.android.com/build/migrate-to-kotlin-dsl?hl=ja#migrate-buildscript)

### build-logic module

最後は build-logic です。これは公式ドキュメントが観測範囲では存在しないため、[Now in Android App](https://github.com/android/nowinandroid/tree/main/build-logic) を参考に実装しました。

build-logic は各 Module-level の build.gradle.kts での記述を統一するために利用されます。例えば build.gradle.kts には次のように plugins, sdkVersion, JavaVersion が記述されていますが、複数モジュール利用している場合、この記述を繰り返し書く必要があります。

```kotlin
// app/build.gradle.kts
plugins {
  alias(libs.plugins.android.application) // com.android.application
  alias(libs.plugins.kotlin.android)      // org.jetbrains.kotlin.android
}

android {
  compileSdk = 33

  defaultConfig {
    minSdk = 26
    targetSdk = 34
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }

  kotlinOptions {
    jvmTarget = "17"
  }
}
```

build-logic を利用すると、定義した plugin 名に置き換えると plugins, sdkVersion, JavaVersion は別の場所に定義を逃がせて共通化できます：

```kotlin
// app/build.gradle.kts
plugins {
  alias(libs.plugins.myapp.android.application)
}
```

この記事では android.application の共通化の実装例を示しますが、library, test も共通化できます。他の例は Now in Android App を参照されたし。

実装としては Android アプリのプロジェクト直下に build-logic モジュールを作成して、以下のように各ファイルを設置します：

```
build-logic/
├── settings.gradle.kts
├── gradle.properties
└── convention/
    ├── build.gradle.kts
    └── src/main/kotlin
        ├── AndroidApplicationConventionPlugin.kt
        └── Config.kt
```

```kotlin
// settings.gradle.kts
@file:Suppress("UnstableApiUsage")

dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
  }
  versionCatalogs {
    create("libs") {
      from(files("../gradle/libs.versions.toml"))
    }
  }
}

rootProject.name = "build-logic"
include(":convention")
```

```kotlin
// convention/build.gradle.kts
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  `kotlin-dsl`
}

group = "your.domain.buildlogic"

java {
  sourceCompatibility = JavaVersion.VERSION_17
  targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType<KotlinCompile>().configureEach {
  kotlinOptions {
    jvmTarget = JavaVersion.VERSION_17.toString()
  }
}

dependencies {
  compileOnly(libs.android.gradlePlugin)
  compileOnly(libs.kotlin.gradlePlugin)
  compileOnly(libs.ksp.gradlePlugin)
  // libs.version.toml の [libraries] に次の定義を書く
  // android-gradlePlugin = { group = "com.android.tools.build", name = "gradle", version.ref = "androidGradlePlugin" }
  // kotlin-gradlePlugin = { group = "org.jetbrains.kotlin", name = "kotlin-gradle-plugin", version.ref = "kotlin" }
  // ksp-gradlePlugin = { group = "com.google.devtools.ksp", name = "com.google.devtools.ksp.gradle.plugin", version.ref = "ksp" }
}

gradlePlugin {
  plugins {
    register("androidApplication") {
      id = "myapp.android.application"
      implementationClass = "AndroidApplicationConventionPlugin"
    }
  }
}
```

```kotlin
// AndroidApplicationConventionPlugin.kt
import com.android.build.api.dsl.ApplicationExtension
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.kotlin.dsl.configure

@Suppress("unused")
class AndroidApplicationConventionPlugin : Plugin<Project> {

  override fun apply(target: Project) {
    with(target) {
      with(pluginManager) {
        apply("com.android.application")
        apply("org.jetbrains.kotlin.android")
      }
      extensions.configure<ApplicationExtension> {
        configureAndroidCommonExtension(this)
        defaultConfig.targetSdk = AndroidVersion.targetSdk
      }
    }
  }
}
```

```kotlin
// Config.kt
import com.android.build.api.dsl.CommonExtension
import org.gradle.api.JavaVersion
import org.gradle.api.Project
import org.gradle.kotlin.dsl.withType
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

object AndroidVersion {

  const val compileSdk = 34
  const val targetSdk = 33
  const val minSdk = 23
}

internal fun Project.configureAndroidCommonExtension(
    commonExtension: CommonExtension<*, *, *, *, *>,
) {
  commonExtension.apply {
    compileSdk = AndroidVersion.compileSdk

    defaultConfig {
      minSdk = AndroidVersion.minSdk
    }

    compileOptions {
      sourceCompatibility = JavaVersion.VERSION_17
      targetCompatibility = JavaVersion.VERSION_17
    }

    tasks.withType<KotlinCompile>().configureEach {
      kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
      }
    }
  }
}
```

## ビルド時間の改善

### CircleCI 設定の見直し

CircleCI の android-orb の書き方が古く、gradle-cache は利用していましたが、build-cache を利用できていないことに気付く…。次のようにビルド処理を restore-build-cache, save-build-cache で挟むように修正しました。

```yml
unit_testing:
  <<: *defaults_environment
  steps:
    - <<: *install_ssh_key
    - checkout
    - android/restore-gradle-cache
    - android/restore-build-cache
    - <<: *download_dependencies
    - <<: *run_unit_testing
    - android/save-gradle-cache
    - android/save-build-cache
```

これにより同じ PR でのテスト時間は 12m → 3m に減少し、またキャッシュが少し効かないケースでも 10m に減少しました。

### R クラスの最適化

特に手元の環境ではビルド時間の大幅な短縮には繋がりませんでしたが、非推移的な R クラスを使用する、非定数の R クラスを使用する、の対応を行いました。

- [ビルド速度を最適化する | Android デベロッパー | Android Developers](https://developer.android.com/studio/build/optimize-your-build?hl=ja)

## 起動速度の改善

### ベースラインプロファイルでアプリのパフォーマンスを改善

[こちらの記事](/archives/improving-app-performance-with-baseline/)に導入方法を書きましたが、ベースラインプロファイルをアプリの AAB, APK に含めて配信することにより、アプリの起動時間が短縮されます。

実際のユーザー環境での計測値である Firebase Performance 上では、ホーム画面の起動速度が 1.30 → 1.06 秒に改善されていました。

### System tracing

以下の YouTube を参考に、System tracing を眺めながら改善策を考えました。

<youtube ktknfQykhXU>
<youtube aUrqx9AnDUg>

結果、次の改善が有効に働いて Choreographer の仕事を減らせました。結果的に 100ms ほど起動速度の改善に繋がりました。

- AdGeneration の広告ライブラリのホットロード処理のタイミングをずらす
- 少し大きめの画像の読み込みタイミングをずらす
- オーバードロー改善（複数の背景色を重ねる意味のないコードを削除）

## その他

後は工数少なめでサクッと対応できる改善を入れました。

- タブレット端末、フォーダブル端末で最低限の動作をするように対応
  - 実機を持っていないため、Android Emulator 上での最低限の対応
- TalkBack で文字読み上げに対応していない箇所を対応
