---
category: tech
date: "2025-05-08T10:27:13+09:00"
page: false
slug: migrating-objective-c-to-swift
title: "Objective-C → Swift 完全移行マニュアル"
---

[個人プロジェクトの iOS アプリ](https://github.com/rakuishi/postalcode-ios/)は Objective-C で記述されていましたが、今回、AI の支援を受けながら Objective-C から Swift に移行しました。

完全移行する観点のマニュアル記事が世の中に不足しているため、ここに書きまとめておきます。

## ファイル管理をグループからフォルダに変更

まずは Swift 移行する前にファイル管理をグループからフォルダに変更しました。

古いプロジェクトではグループ管理されていますが、ファイル操作時に pbxproj への奇怪な変更も走るため、AI の支援を受けながらファイルを作成したり削除してもらうのと組み合わせが悪いためです。

Xcode 16 以降は、メニューから簡単に変換できるようになってます。Xcode 上の見え方と、実際のフォルダ上の見え方を揃えた上でフォルダを選択し、「Convert to Folder」を選択するだけです。

変換後、フォルダの色が灰色から青色に変換されます。まずは下位階層から変換し、ルートのプロジェクトファイル名も青色になるまで繰り返します。

参考：[Xcode 16 からビルド対象を Group から Folder 構成に変換するメニューができてる](https://zenn.dev/yimajo/articles/a86227cf85099f)

## CocoaPods → Swift Package Manager

ライブラリ側が対応していれば、Swift Package Manager で導入したライブラリであっても Objective-C で引き続き使えます。

この順番で作業するのが最適なのかわかりませんが、自分は CocoaPods で管理している GoogleMobileAds ライブラリを Swift Package Manager に移行しました。

参考：[AdMob を Swift Package Manager で導入する方法](https://zenn.dev/donchan922/articles/f1b07d08d78e34)

## Swift 移行の準備

ここからは Swift 移行本編になります。Objective-C と Swift の互換性はあるものの、いくつか気をつける点があります。

まずはプロジェクト側の準備をします。

1. Targets → アプリ名 → Build Settings → Defines Module: Yes にする
2. Targets → アプリ名 → Build Settings → Swift Language Version: Swift 6 にする
3. 空の「アプリ名-Bridging-Header.h」ヘッダーファイルを作成し、Targets → アプリ名 → Build Settings →  Objective-C Bridging Header に登録する

参考：[Swift ライブラリを Objective-C から利用できるようにする](https://zenn.dev/kobayann/articles/bf2564e371ccc9)

## Swift から Objective-C のコードを参照する

Swift からは Objective-C で書かれたファイルがどこにあるかわかりません。

そのため、作成した「アプリ名-Bridging-Header.h」に Objective-C のファイルを import 記入する必要があります。このヘッダーファイルは Swift からは適切に参照されており、特に Swift ファイルからは別途 import する必要はありません。

## Objective-C から Swift のコードを参照する

同様に Objective-C から Swift で書かれたファイルがどこにあるかわかりません。

先程は手動で import を記載しましたが、ここは自動化されており、「アプリ名-Swift.h」がビルド時に自動で生成されています。これを Objective-C ファイルに `#import "アプリ名-Swift.h"` として記述します。

さらに、Swift のクラス側に `@objcMembers` を追加します。公開する関数を絞りたいならば個別に `@objc` を付与します。これで Objetive-C から Swift のコードが触れるようになりました。

```swift
// 全体公開
@objcMembers class SwiftMembers: {
    func sayHello() {}
}

// 部分公開
@objc class SwiftMember: {
    @objc func sayHello() {}
}

```

## 移行方針

移行は ViewController → View → Model の順に行いました。なるべく参照されている数が少ないクラスから始めるのがよいと思います。

さらに移行の手順に付け加えるとするならば、Swift クラスは Objective-C クラスでは継承できないため、継承しているクラスは最後のほうに移行するのが良いです。以下の例だと、BaseTableViewController が Swift ファイルの時は、うまくビルドできません。

```objc
// DetailViewController.h
@interface DetailViewController : BaseTableViewController
@end
```

参考：[Swift クラスは Objective-C クラスでは継承できない](https://ez-net.jp/article/84/sSRPxlxL/aJtttnhN8gQv/)

## 移行作業は AI に移譲する

後は AI の力を借りて移行を進めていきます。

最近、[GitHub Copilot が Xcode で使えるになった](https://github.com/github/CopilotForXcode)ため、こちらを最初試していましたが、Xcode の上にレイヤーとしてウィンドウが存在するのが慣れず、結局 VSCode から Copilot を利用したり、気分転換に Cursor を利用して AI と Chat しました。

基本的には Objetive-C の h, m ファイルを Add context し、「この Objetive-C ファイルを Swift に変換してください」と指示するだけですが、関数のリファクタリングを始めたり、お節介をし始めることがあるため、そこはお好みで抑制しましょう。

## AI が解決できなかった例

とはいえ、手作業が必要になるケースも多々発生しました。

### Swift Concurrency 対応

以下の非同期処理を扱っていた `dispatch_async` の Objective-C のコードは、Swift 変換後、クロージャーがどうのこうの言われてビルドすることができませんでした。

```objc
dispatch_async(q_global, ^{
    NSMutableArray *results = [[PostalCodeRepository shared] searchWithQuery:query];
    dispatch_async(q_main, ^{
        // メインスレッド処理
    });
});
```

この問題は詳しく調査していませんが、折角だし Swift Concurrency に対応することにしました。

まずは、非同期処理を扱っていた Repository を Actor 化します。並列処理時のデータ競合を避けるための Swift 5.5 以降の機能です。そして、`withCheckedContinuation` で今までの非同期処理を囲います。

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    Task {
        let results = await search(with: query)
        // メインスレッド処理（ViewController は暗黙的に MainActor）
    }
}

private func search(with query: String) async -> [PostalCode] {
    return await withCheckedContinuation { continuation in
        DispatchQueue.global(qos: .default).async {
            let results = PostalCodeRepository.shared.search(with: query)
            continuation.resume(returning: results)
        }
    }
}

actor PostalCodeRepository { } // class → actor
class PostalCode: NSObject, NSSecureCoding { }
```

次に、流していた PostalCode クラスを Sendable 対応することにより、記述を省略できます。

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    Task {
        let results = await search(with: query)
        // メインスレッド処理（ViewController は暗黙的に MainActor）
    }
}

private func search(with query: String) async -> [PostalCode] {
    return await PostalCodeRepository.shared.search(with: query)
}

actor PostalCodeRepository { }
class PostalCode: NSObject, NSSecureCoding, @unchecked Sendable { } // Add Sendable
```

### ATTrackingManager.requestTrackingAuthorization

`ATTrackingManager.requestTrackingAuthorization` が Async 化されていたため、Swift Concurrency の Task で囲ってあげます。 

```swift
Task {
    await ATTrackingManager.requestTrackingAuthorization()
}
```

### sqlite3_bind_text

本プロジェクトでは SQLite を扱っているのですが、`sqlite3_bind_text` の値のバインドが正常に動かなくなりました。渡すクエリを以下のように string → NSString → utf8String すれば今まで通り動くようになりました。

```swift
sqlite3_bind_text(statement, index, (query as NSString).utf8String, -1, nil)
```

### NSKeyedUnarchiver.unarchivedObject

UserDefaults に突っ込んでいた NSSecureCoding なモデルが適切に扱えず、変換エラーが発生していました。これはクラスに `@objc(クラス名)` を書くことにより、解決できました。

```swift
@objc(PostalCode)
class PostalCode: NSObject, NSSecureCoding, @unchecked Sendable { }
```

## 移行完了

Swift に移行完了したら「アプリ名-Bridging-Header.h」を削除します。Build Settings →  Objective-C Bridging Header から消すことも忘れずに。また「アプリ名-Prefix.pch」も削除できます。

移行途中に付与した `@objcMembers`, `@objc` も基本的には削除できます。

さらに「Control + Shift + i 」で [swift-format](https://github.com/swiftlang/swift-format) のコード整形もかけておきましょう。

以上で移行完了しました。お疲れ様でした！