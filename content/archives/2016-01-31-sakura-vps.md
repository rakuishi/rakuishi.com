+++
categories = ["Web Service"]
date = "2016-01-31T21:04:03+09:00"
draft = false
slug = "sakura-vps"
title = "さくらの VPS：環境設定から Web ページの表示まで"
+++

こういうのは数日後に確実に忘れるのでメモしておきます。

さくらの VPS（メモリ 1 GB, SSD ストレージ 30 GB, 月額 900 円）を借りたので、割り当てられた IP アドレスにアクセスして、「Hello World!」と表示するところまでがゴールです。

今回、以下のように設定されています（しましたが）、適宜読み替えてください。

* ホスト名: sample.vs.sakura.ne.jp（割り当てられたホスト名）
* IP アドレス（割り当てられた IP アドレス）
* 作業用ユーザー名: rakuishi（任意）
* 変更する ssh ポート番号: 61203（1024~65535  の範囲で任意）

作業中にローカルとリモートの環境を行き来しています。どこでどのユーザーが作業しているかは、以下のように見方を知っておくと便利です。

```
rakuishi:~ rakuishi$ # <= Mac 側での作業
[root@sample ~]# # <= VPS ルートログイン
[rakuishi@sample ~]$ # <= VPS rakuishi ユーザーログイン
```

## VPS 起動

申し込み後に送られてくる「[さくらのVPS] 仮登録完了のお知らせ」に書いているコントロールパネルにアクセスし、申し込んだサーバーを起動する。

https://secure.sakura.ad.jp/vps/

## ssh 接続

サーバー起動後すぐは `Connection refused` のエラーがでましたが、コーヒー豆を挽いてドリップしている間に接続できるようになりました。繋がらない場合は再起動すると良いみたい。これでルートユーザーでログインできました。

```
rakuishi:~ rakuishi$ ssh root@[IP アドレス]
ssh: connect to host [IP アドレス] port 22: Connection refused
rakuishi:~ rakuishi$ ssh root@[IP アドレス]
The authenticity of host '[IP アドレス] ([IP アドレス])' can't be established.
Are you sure you want to continue connecting (yes/no)? # yes を入力
root@[IP アドレス]'s password: # メールに記載されていたパスワードを入力

SAKURA Internet [Virtual Private Server SERVICE]

[root@sample ~]# 
```

## yum update

システムのアップデートをしておきます。

```
[root@sample ~]# yum update
読み込んだプラグイン:fastestmirror, security
更新処理の設定をしています
Loading mirror speeds from cached hostfile
 * base: ftp.tsukuba.wide.ad.jp
 * epel: ftp.kddilabs.jp
 * extras: ftp.tsukuba.wide.ad.jp
 * updates: ftp.tsukuba.wide.ad.jp
更新と設定されたパッケージがありません。
```

## 言語設定を日本語化

```
[root@sample ~]# vim /etc/sysconfig/i18n
```

```
LANG="C"
↓
LANG="ja_JP.UTF-8"
```

変更後、一度ログアウトし再度ログインすると言語設定が日本語になります。

```
[root@sample ~]# exit
rakuishi:~ rakuishi$ ssh root@[IP アドレス]
[root@sample ~]# date
2016年  1月 31日 日曜日 16:13:13 JST
```

## 作業用ユーザーの設定

```
[root@sample ~]# useradd rakuishi
[root@sample ~]# passwd rakuishi
ユーザー rakuishi のパスワードを変更。
新しいパスワード:
新しいパスワードを再入力してください:
passwd: 全ての認証トークンが正しく更新できました。
```

一般ユーザーであってもルート権限で作業できるコマンド `sudo` を使えるようにします。

```
[root@sample ~]# usermod -G wheel rakuishi
[root@sample ~]# visudo
```

vim エディタが開くので `/wheel` と打ち込んで以下の部分を検索し、コメントアウトを外す。

```
# %wheel  ALL=(ALL)       ALL
↓
%wheel  ALL=(ALL)       ALL
```

試しに一度ログアウトして、ログインしてみます。

```
rakuishi:~ rakuishi$ ssh rakuishi@[IP アドレス]
rakuishi@[IP アドレス]'s password: # 先ほど設定したパスワード

SAKURA Internet [Virtual Private Server SERVICE]

[rakuishi@sample ~]$
```

## パスワードから鍵認証に切り替える

ssh 用のディレクトリを作成し、権限を 700 に変更します（自分には読み書き実行できるが、他人にはできない）。

```
[rakuishi@sample ~]$ mkdir ~/.ssh
[rakuishi@sample ~]$ chmod 700 ~/.ssh
```

既にssh 公開鍵を作っているから、鍵を作成する手順をスキップしました。以前に[この手順](https://help.github.com/articles/generating-a-new-ssh-key/)に従って作成しました。

```
rakuishi:~ rakuishi$ ls -a .ssh/ | grep 'id_rsa'
id_rsa
id_rsa.pub
```

公開鍵を `authorized_keys` という名前で転送します。

```
rakuishi:~ rakuishi$ scp ~/.ssh/id_rsa.pub rakuishi@[IP アドレス]:~/.ssh/authorized_keys
rakuishi@[IP アドレス]'s password: 
id_rsa.pub                                                        100%  744     0.7KB/s   00:00 
```

すると転送後は、パスフレーズ無しでログインできるようになります。

```
rakuishi:~ rakuishi$ ssh rakuishi@[IP アドレス]
```

## ポート番号の変更

ssh の接続ポートはデフォルト TCP 22 番が割り当てられていますが、攻撃されやすいので任意の番号（1024~65535  の範囲）に変えておきます。

以後、ルート権限の処理が続くため、以下のコマンドを打ち込んでルートに成り代わっておきます。

```
[rakuishi@sample ~]$ sudo -s

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for rakuishi: 
[root@sample rakuishi]# 
```

```
[root@sample rakuishi]# cp /etc/ssh/sshd_config /etc/ssh/sshd_config.org
[root@sample rakuishi]# vim /etc/ssh/sshd_config
```

Port 番号を任意の数字（1024~65535  の範囲）に変更します。また、その他 2 点変更します。

```
#Port 22
↓ # コメントアウトを外し、任意の数字にする
Port 61203
—
PasswordAuthentication no
↓ # no を yes にする
PasswordAuthentication yes
—
#PermitRootLogin yes
↓ # コメントアウトを外し、yes を no にする
PermitRootLogin no
```

`diff` コマンドで変更内容を確認します。

```
[root@sample rakuishi]# diff /etc/ssh/sshd_config /etc/ssh/sshd_config.org
13c13
< Port 61203
---
> #Port 22
42c42
< PermitRootLogin no
---
> #PermitRootLogin yes
66c66
< PasswordAuthentication no
---
> PasswordAuthentication yes
```

```
[root@sample rakuishi]# /usr/sbin/sshd -t # 記述が正しいかテスト
[root@sample rakuishi]# service sshd restart
sshd を停止中:                                             [  OK  ]
sshd を起動中:                                             [  OK  ]
```

一度ログアウトしてポート番号が変更されているか確認します。`-p 61203` のように任意の番号を付けないと入れないようになっているのを確認できます。

```
[rakuishi@sample ~]$ exit
rakuishi:~ rakuishi$ ssh rakuishi@[IP アドレス]
ssh: connect to host [IP アドレス] port 22: Connection refused
rakuishi:~ rakuishi$ ssh -p 61203 rakuishi@[IP アドレス]
Last login: Sun Jan 31 17:08:03 2016 from 124x32x8x139.ap124.ftth.ucom.ne.jp

SAKURA Internet [Virtual Private Server SERVICE]
```

## ファイアウォールの設定

引き続きルート権限での処理が続きます。ファイアウォール機能である iptables は、サーバへ接続させる通信のルールを設定できます。 

```
[root@sample rakuishi]# vim /etc/sysconfig/iptables
```

以下のように記述します。

```
*filter
:INPUT          DROP    [0:0]
:FORWARD        DROP    [0:0]
:OUTPUT         ACCEPT  [0:0]
:SERVICES       -       [0:0]
-A INPUT -i lo -j ACCEPT
-A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 4 -j ACCEPT
-A INPUT -p tcp -m state --state ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p tcp -m state --state NEW -j SERVICES
-A INPUT -p udp --sport 53 -j ACCEPT
-A INPUT -p udp --sport 123 --dport 123 -j ACCEPT
-A SERVICES -p tcp --dport 61203 -j ACCEPT
-A SERVICES -p tcp --dport 80 -j ACCEPT
-A SERVICES -p tcp --dport 443 -j ACCEPT
COMMIT
```

```
[root@sample rakuishi]# service iptables start
iptables: ファイアウォールルールを適用中:                  [  OK  ]
[root@sample rakuishi]# iptables -L # 確認用
```

## Web サーバーの設定

Web サーバー Apache httpd をインストールします。

```
[root@sample rakuishi]# yum install httpd
[root@sample rakuishi]# chkconfig httpd on # 再起動の時に、自動的に立ち上げる
```

設定ファイルを念の為にコピーしておきます。

```
[root@sample rakuishi]# cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.org
[root@sample rakuishi]# vim /etc/httpd/conf/httpd.conf
```

以下のように 3 箇所書き換えます。

```
ServerTokens OS
↓
ServerTokens Prod
—
ServerSignature On
↓
ServerSignature Off
—
Options Indexes FollowSymLinks
↓
Options -Indexes FollowSymLinks
```

`diff` コマンドで変更内容を確認します。

```
[root@sample rakuishi]# diff /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.org
44c44
< ServerTokens Prod
---
> ServerTokens OS
331c331
<     Options -Indexes FollowSymLinks
---
>     Options Indexes FollowSymLinks
536c536
< ServerSignature Off
---
> ServerSignature On

```

Web サーバーを立ち上げます。

```
[root@sample rakuishi]# service httpd configtest
Syntax OK
[root@sample rakuishi]# service httpd start
httpd を起動中:                                            [  OK  ]
```

デフォルトの DocumentRoot の場所に html ファイルを置いて確認してみます。作業用ユーザーでファイルを作成しました。http://[IP アドレス]/ にアクセスして見えていれば、成功です。

```
[root@sample rakuishi]# chown -R rakuishi:rakuishi /var/www/html/
[root@sample rakuishi]# exit
[rakuishi@sample ~]$ echo 'Hello World!' >> /var/www/html/index.html
```

## 参考

* [さくらのVPS入門 (全21回) - プログラミングならドットインストール](http://dotinstall.com/lessons/basic_sakura_vps)
