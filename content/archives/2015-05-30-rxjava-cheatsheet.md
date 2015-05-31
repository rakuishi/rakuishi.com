+++
categories = ["Android"]
date = "2015-05-30T11:40:00+09:00"
draft = false
slug = "rxjava-cheatsheet"
title = "RxJava Operators 私的チートシート"
+++

RxJava には、それを扱うための数多くの関数（オペレーター）が用意されているが、頻繁に使うのは極一部だったから、今までに使ったオペレーターとその使用例をまとめてみた。

## Observable を作る - [just](http://reactivex.io/documentation/operators/just.html)

Rx では、データを `Observable<T>` の形で取り扱うが、これを一番簡単に作れるのが `just` である。以下の例では、`Observable<String>` を作成している。

    public Observable<String> doSampleJust() {
        return Observable.just("RxJava");
    }

## Observable を作る - [create](http://reactivex.io/documentation/operators/create.html)

Observable を自作する時に使える。例外が発生するような処理を取り扱いたい場合に使っている。処理中に `onNext`, `onError`, `onCompleted` を呼べるから、通信処理をここで書くのが良いと思っている。

    public Observable<String> doSampleCreate() {
        return Observable.create(new Observable.OnSubscribe<String>() {
            @Override
            public void call(Subscriber<? super String> subscriber) {
                try {
                    // 例外が発生するような処理
                    doSomething();
                    subscriber.onNext("RxJava");
                    subscriber.onCompleted();
                } catch (Exception e) {
                    subscriber.onError(e);
                }
            }
        });
    }

## 値の加工 - [map](http://reactivex.io/documentation/operators/map.html)

`map` は、値の加工を行う時に使用する。ここでは、`Observable<String>` を `Observable<Integer>` に変換している。ちなみに、変換用の関数を切り分けて用意しておくと、可読性が上がる。

    public Observable<Integer> doSampleMap() {
        return Observable.just("RxJava")
                .map(convertStringToInteger());
    }
    
    public Func1<String, Integer> convertStringToInteger() {
        return new Func1<String, Integer>() {
            @Override
            public Integer call(String s) {
                return s.length();
            }
        };
    }

## 値の選別 - [filter](http://reactivex.io/documentation/operators/filter.html)

`filter` は、流れてくるデータの状態をチェックし、true/false によってフィルタリングを行える。よく例として、配列に突っ込まれた値を間引いたりするのを見るが、以下のように値が想定とは違う場合に例外を投げるのもなかなか使い勝手が良いと思った。

    public Observable<String> doSampleFilter() {
        return Observable.just("RxJava").filter(new Func1<String, Boolean>() {
            @Override
            public Boolean call(String s) {
                if (s.equals("RxJava")) {
                    return true;
                } else {
                    throw new IllegalStateException("Error");
                    // 普通にフィルタリングする場合は、false
                    // return false;
                }
            }
        });
    }


## 流れの途中で値を利用する - doOnNext

流れてきた値を変える必要はないが、その値を保存したい時などは `doOnNext` が使える。

    public Observable<String> doSampleDoOnNext() {
        return Observable.just("RxJava").doOnNext(new Action1<String>() {
            @Override
            public void call(String s) {
                // 値の保存など
                doSomething(s);
            }
        });
    }

似たようなオペレーターに、`doOnEach`, `doOnCompleted`, `doOnError` がある。

## 参考

* [ReactiveX/RxJava](https://github.com/ReactiveX/RxJava)
* [REACTIVE EXTENSIONS 学習ノート](http://wilfrem.github.io/learn_rx/operators.html)