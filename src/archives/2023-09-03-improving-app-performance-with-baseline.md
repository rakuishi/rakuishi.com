---
categories:
  - Tech
date: "2023-09-03T07:11:38+09:00"
page: false
slug: improving-app-performance-with-baseline
title: "ベースラインプロファイルによるアプリの起動時間短縮"
---

ベースラインプロファイルをアプリの AAB, APK に含めて配信することにより、アプリの起動時間が短縮されます。ベースラインプロファイルに関する詳細は [公式ドキュメント](https://developer.android.com/studio/profile/baselineprofiles?hl=ja)に任せ、この記事では実際の導入方法を共有します。

## 環境

- Android Studio Giraffe
- com.android.tools.build:gradle:7.3.1
- androidx.benchmark:benchmark-macro-junit4:1.2.0-alpha15
- androidx.profileinstaller:profileinstaller:1.3.1

## bechmark モジュールの作成

パフォーマンス改善のためには、まずは計測が大事です。その計測のためにベンチマークモジュールを作成していきます。

ベンチマークモジュールの作成方法は、[公式ドキュメント](https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview?hl=ja#kts)通りですが、自分の環境では次の手順で作成し、app/benchmark 以下に配置されました。

1. Android Studio の Project パネルの app 上を右クリックして、New > Module をクリック
2. Templates ペインで Benchmark を選択
3. パッケージ名を `${APP_PACKAGE_NAME}.benchmark` に変更
4. Finish をクリックして benchmark モジュールが自動生成される

続いては生成されたコードに対して修正を加えていきます。

app/build.gradle の release ビルドの `signingConfig signingConfigs.release` が勝手に `signingConfig signingConfigs.debug` になっていたのを修正しました。

また、ドキュメントでは /app/src/main/AndroidManifest.xml に profileable タグが自動で追加されると書いてありますが、抜けていたため application タグ内に追加しています。

```xml
<application>
  <profileable
    android:shell="true"
    tools:targetApi="s" />
</application>
```

ちなみに [benchmark ライブラリ](https://developer.android.com/jetpack/androidx/releases/benchmark)は現状 1.2.0-beta04 まで出ていますが、alpha16 以降 compileSdk: 34 が必要になるため、自分の手元では alpha15 を利用しています。

このモジュールに対してさらに手を加えていきます。

まずは、ベンチマークビルドの難読化を防ぐために app/proguard-rules-benchmark.pro を作成します。

```
-dontobfuscate
```

これを参照できるように app/build.gradle の benchmark に以下を加えておきます。

```groovy
benchmark {
  initWith release
  signingConfig signingConfigs.debug
  matchingFallbacks = ['release']
  proguardFiles 'proguard-rules-benchmark.pro'
}
```

次に、デフォルトで追加される ExampleStartupBenchmark.kt を StartupBenchmark.kt に名前を変えて、次のように Test の種類を変えておきます。

```kotlin
@RunWith(AndroidJUnit4::class)
class StartupBenchmark {

  @get:Rule
  val benchmarkRule = MacrobenchmarkRule()

  @Test
  fun startupNoCompilation() = startup(CompilationMode.None())

  @Test
  fun startupBaselineProfile() = startup(CompilationMode.Partial())

  private fun startup(compilationMode: CompilationMode) = benchmarkRule.measureRepeated(
      packageName = "YOUR_APP_PACKAGE_NAME",
      metrics = listOf(StartupTimingMetric()),
      compilationMode = compilationMode,
      iterations = 5,
      startupMode = StartupMode.COLD,
      setupBlock = {
        pressHome()
      }
  ) {
    // Waits for the first rendered frame, which represents time to initial display.
    startActivityAndWait()

    // Waits for content to be visible, which represents time to fully drawn.
    // device.wait(Until.hasObject(By.res("my-content")), 5_000)
  }
}
```

ここでは最初のフレームが表示されるまでの時間を CompilationMode を切り替えた 2 パターン走るようになっています。プリコンパイルしないパターン、ベースラインプロファイルによるプリコンパイルしたパターンです。

StartupBenchmark クラス名横の ▶ より接続している端末上で計測されます。ベースラインプロファイル適用前は次のような計測結果となりました。今はまだふたつの値はほぼ同じになります。

```
StartupBenchmark_startupNoCompilation
timeToInitialDisplayMs min 584.8, median 600.8, max 626.0
Traces: Iteration 0 1 2 3 4

StartupBenchmark_startupBaselineProfile
timeToInitialDisplayMs min 577.3, median 589.8, max 620.5
Traces: Iteration 0 1 2 3 4
```

## Gradle Managed Devices の作成

先程の計測処理は接続されている端末に対して行われており、実際には次のコマンドが走っていました。

```
% ./gradlew :app:benchmark:connectedBenchmarkAndroidTest
```

しかし、実運用ではベースラインプロファイルの作成を含めて CI 上で動かす必要があるため、[Gradle Managed Devices](https://developer.android.com/studio/test/gradle-managed-devices?hl=ja) による仮想テストデバイスを導入します。

app/benchmark/build.gradle に以下を追加します。ここでは Pixel 7 の apiLevel: 33 を指定しています。device は Device Manager の Create device にあるデバイス名を利用しています。

```groovy
import com.android.build.api.dsl.ManagedVirtualDevice

android {
  defaultConfig {
    // Benchmark は実際のデバイスで走らせることを期待しており「EMULATOR WARNINGS」が発生するため無視する
    // https://developer.android.com/codelabs/android-macrobenchmark-inspect#6
    testInstrumentationRunnerArguments["androidx.benchmark.suppressErrors"] = 'EMULATOR'
  }

  testOptions {
    managedDevices {
      devices {
        pixel7Api33(ManagedVirtualDevice) {
          device = "Pixel 7"
          apiLevel = 33
          systemImageSource = "google"
        }
      }
    }
  }
}
```

先程のベンチマークテストは次のように書き換えることにより、この仮想デバイス上で走らせることができます。

```
% ./gradlew :app:benchmark:pixel7Api33BenchmarkAndroidTest
```

## ベースラインプロファイルの導入

最後にベースラインプロファイルを導入していきます。

app/build.gradle にライブラリを追加します。

```groovy
dependencies {
  implementation "androidx.profileinstaller:profileinstaller:1.3.1"
}
```

benchmark モジュールの StartupBenchmark.kt を置いた階層と同じところに BaselineProfileGenerator.kt を定義します。

```kotlin
@RunWith(AndroidJUnit4::class)
class BaselineProfileGenerator {

  @get:Rule
  val baselineProfileRule = BaselineProfileRule()

  @Test
  fun startup() = baselineProfileRule.collectBaselineProfile(
      packageName = "YOUR_APP_PACKAGE_NAME",
      profileBlock = {
        pressHome()
        startActivityAndWait()
      }
  )
}
```

作成後、先程と同じ benchmark コマンドにベースラインプロファイルのテストだけを指定したものを走らせます。

```
% ./gradlew :app:benchmark:pixel7Api33BenchmarkAndroidTest -P android.testInstrumentationRunnerArguments.androidx.benchmark.enabledRules=BaselineProfile
```

テスト後 app/benchmark/build/outputs 配下にベースラインプロファイルが出力されます。これを app/src/main 以下に配置してベースラインプロファイルを有効にします。

```
% cp app/benchmark/build/outputs/managed_device_android_test_additional_output/benchmark/pixel7Api33/BaselineProfileGenerator_startup-baseline-prof.txt app/src/main/baseline-prof.txt
```

また、.gitignore に app/src/main/baseline-prof.txt を加えておくのが良いかと思います。

確認のため、接続した端末に対して StartupBenchmark を走らせてみます。中央値を見るとプロファイル利用時は 60ms 弱早くなっていることが確認できます。

```
StartupBenchmark_startupNoCompilation
timeToInitialDisplayMs min 583.2, median 608.0, max 642.1
Traces: Iteration 0 1 2 3 4

StartupBenchmark_startupBaselineProfile
timeToInitialDisplayMs min 520.6, median 551.0, max 589.0
Traces: Iteration 0 1 2 3 4
```

この baseline-prof.txt が配置された状態で、通常通りアプリの release ビルドを作成することにより、ベースラインプロファイルが含まれたものが作成されます。ユーザーに提供するための特別なステップは必要はなく、AAB, APK を Google Play から配信するだけで良いです。

ここまでのまとめとして、実運用では CI 上で release ビルドする前に次の 2 つのコマンドを走らせればベースラインプロファイルが含まれます。

```
% ./gradlew :app:benchmark:pixel7Api33BenchmarkAndroidTest -P android.testInstrumentationRunnerArguments.androidx.benchmark.enabledRules=BaselineProfile
% cp app/benchmark/build/outputs/managed_device_android_test_additional_output/benchmark/pixel7Api33/BaselineProfileGenerator_startup-baseline-prof.txt app/src/main/baseline-prof.txt
```
