+++
categories = ["Android"]
date = "2015-09-05T22:02:53+09:00"
draft = false
slug = "okhttp-call-cancel"
title = "OkHttp: Call.cancel が MainThread で実行されてクラッシュする"
+++

会社で開発している Android アプリで、通信に Square の [OkHttp](https://github.com/square/okhttp) ライブラリを使っているのだけれど、HTTPS 通信時 `Call.cancel()` が MainThread を触ってクラッシュすることがあった。Android 3（API Level 11）以降、同期的な通信は OS によって許されていないためだ。

    android.os.NetworkOnMainThreadException
           at android.os.StrictMode$AndroidBlockGuardPolicy.onNetwork(StrictMode.java:1126)
           at org.apache.harmony.xnet.provider.jsse.OpenSSLSocketImpl.close(OpenSSLSocketImpl.java:908)
           at com.squareup.okhttp.Connection.closeIfOwnedBy()
           at com.squareup.okhttp.OkHttpClient$1.newTransport()
           at com.squareup.okhttp.internal.http.HttpConnection.setTimeouts()
           at com.squareup.okhttp.internal.http.HttpTransport.createRequestBody()
           at com.squareup.okhttp.internal.http.HttpEngine.disconnect()
           at com.squareup.okhttp.Call.cancel()

以下のようなコードを書いて対処した：

    public void cancel(final String tag) {
        Executor executor = mOkHttpClient.getDispatcher().getExecutorService();
        if (Looper.myLooper() != Looper.getMainLooper()) {
            mOkHttpClient.cancel(tag);
        } else {
            executor.execute(new Runnable() {
                @Override
                public void run() {
                    mOkHttpClient.cancel(tag);
                }
            });
        }
    }

MainThread にいる場合は、非同期的に `Call.cancel()` を呼んでいる。上記の例では、`OkHttpClient.cancel()` と書いているが、最終的に `Call.cancel()` を呼び出している。

これがクラッシュレポートの大半を占めていたのだが、アップデート後はピタリと止んだので、期待通りに動いていると思う。

この OkHttp のバグは、3.0 に修正されるようだ。→ [Call.cancel shouldn&#39;t offend strict mode · Issue #1592 · square/okhttp](https://github.com/square/okhttp/issues/1592)
