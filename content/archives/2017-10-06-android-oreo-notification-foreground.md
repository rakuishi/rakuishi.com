---
categories:
- Android
date: 2017-10-06T21:59:23+09:00
draft: false
slug: android-oreo-notification-foreground
title: 'Android Oreo: 通知とサービスのフォアグラウンド実行'
---

Android Oreo (API Level 26) を compileSdkVersion, targetSdkVersion とするアプリは、通知と、サービスのフォアグラウンド実行に対して新しく制限が加えられました。従来の SdkVersion を指定してビルドしたアプリを Android Oreo 上で動かす場合は、影響はありません。

Oreo 以降では、通知ごとにチャンネルを紐付ける必要があります。例えば、Twitter アプリでは、メンションとダイレクトメッセージを異なるチャンネルで取り扱っており、ユーザーが通知チャンネルごとに、音声と画面表示のオン／オフを切り替えることができます。

これにより、ユーザーは手ずから行儀の悪い通知を管理できるようになるのですが、行儀の良いデベロッパーにとっては実装が面倒になった印象しかありません。

サービスのフォアグラウンド実行では、サービスを起動する際に、`Context.startForegroundService()` を使用します。その方法で起動したサービスは 5 秒以内に、サービス内で `Service.startForeground()` を呼ぶことになりました。

最低限の実装とともに、その詳細を見ていきます。

## 通知

[googlesamples/android-NotificationChannels](https://github.com/googlesamples/android-NotificationChannels) を参考に最低限の実装にまとめました。従来の通知から変わったのは、あらかじめ NotificationChannel を設定しておく、個々の Notification にチャンネルを設定することです。今回の実装では、ひとつの通知チャンネルしか作成していませんが、通知の種類ごとに発行するのが通知チャンネルの思想です。

```
public class NotificationHelper extends ContextWrapper {

  private static final String CHANNEL_GENERAL_ID = "general";
  private NotificationManager manager;

  public NotificationHelper(Context base) {
    super(base);

    if (isOreoOrLater()) {
      NotificationChannel channel = new NotificationChannel(CHANNEL_GENERAL_ID, "General Notifications", NotificationManager.IMPORTANCE_LOW);
      getManager().createNotificationChannel(channel);
    }
  }

  public Notification.Builder getNotification() {
    Notification.Builder builder = isOreoOrLater()
        ? new Notification.Builder(this, CHANNEL_GENERAL_ID)
        : new Notification.Builder(this);

    return builder.setContentTitle(getString(R.string.app_name))
        .setContentText("Hello World!")
        .setSmallIcon(R.mipmap.ic_launcher);
  }

  public void notify(int id, Notification.Builder builder) {
    getManager().notify(id, builder.build());
  }

  private NotificationManager getManager() {
    if (manager == null) {
      manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    }
    return manager;
  }

  private boolean isOreoOrLater() {
    return android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O;
  }
}
```

後は、Activity 内で次のように使用すれば OK です。今回は NotificationHelper のインスタンス作成時に、チャンネルの登録を行っていますが、出来れば `Application.onCreate()` 内で行ったほうが良いと思います。アプリを起動すれば、ユーザーがそのアプリの全通知チャンネルを確認できるからです。

```
NotificationHelper notificationHelper = new NotificationHelper(context);
Notification.Builder builder = notificationHelper.getNotification();
notificationHelper.notify(1, builder);
```

通知チャンネルに登録した重要度は以下のように設定されており、これがデフォルト値です。設定 → アプリと通知 → アプリ情報 → アプリ名 → アプリの通知 → カテゴリからユーザーは自由に設定できます。`IMPORTANCE_LOW` は Low ではなく Medium なのが、ややこしいです。

重要度 | 音／画面表示の有無
--- | ---
`IMPORTANCE_HIGH`, `IMPORTANCE_MAX` | Urgent: Make sound and pop on screen
`IMPORTANCE_DEFAULT` | High: Make sound
`IMPORTANCE_LOW` | Medium: No sound
`IMPORTANCE_MIN` | Low: No sound or visual interruption

また、通知チャンネルは、ユーザーが目に触れる単語では、カテゴリ（Categories）です。

## サービスのフォアグラウンド実行

Android Oreo よりも前のバージョンでは、バックグラウンドサービスを作成してから、そのサービス内で `Service.startForeground()` を呼べば、フォアグラウンド実行に昇格していましたが、Android Oreo ではそれに一手間加える必要があります。

- Service の起動には `Context.startForegroundService()` を使用する
- 起動後、5 秒以内に `Service.startForeground()` を呼ぶ

5 秒以内に呼ばないとクラッシュするため、Service の `onCreate()` の一番最初に `Service.startForeground()` を呼ぶのが好ましいと言えます。ちなみに、`Service.startForeground()` する前に、`Service.stopSelf()` などでサービスの終了を行った場合もクラッシュします。

```
public class ForegroundService extends Service {

  public static void start(@NonNull Context context) {
    Intent intent = new Intent(context, ForegroundService.class);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      context.startForegroundService(intent);
    } else {
      context.startService(intent);
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();

    NotificationHelper notificationHelper = new NotificationHelper(this);
    Notification.Builder builder = notificationHelper.getNotification();
    startForeground(2, builder.build());
  }

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }
}
```

後は、Activity 内で次のように使用すれば OK です。サンプルは行儀が悪くてサービスを終了する方法を提供していないので強制終了します。

```
ForegroundService.start(this);
```

ちなみに、5 秒以内に呼ばなかった場合は RemoteServiceException を吐いてクラッシュします。

```
android.app.RemoteServiceException: Context.startForegroundService() did not then call Service.startForeground()
```

## 参考

- [googlesamples/android-NotificationChannels](https://github.com/googlesamples/android-NotificationChannels)
- [バックグラウンド実行制限 | Android Developers](https://developer.android.com/about/versions/oreo/background.html)