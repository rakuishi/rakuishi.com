+++
categories = ["Web Service"]
date = "2016-01-31T21:04:03+09:00"
draft = false
slug = "sakura-vps"
title = "さくらの VPS：環境設定から Web ページの表示まで"
+++

こういうのは数日後に確実に忘れるのでメモしておきます。

さくらの VPS（メモリ 1 GB, SSD ストレージ 30 GB, 月額 900 円）を借りたので、割り当てられた IP アドレスにアクセスして、Hello World! と表示するところまでがゴールです。

今回、以下のように設定されています（しましたが）、適宜読み替えてください。

* ホスト名: host.vs.sakura.ne.jp（割り当てられたホスト名）
* IP アドレス（割り当てられた IP アドレス）
* 作業用ユーザー名: apps（任意）
* 変更する ssh ポート番号: 61203（1024~65535  の範囲で任意）

作業中にローカルとリモートの環境を行き来しています。どこでどのユーザーが作業しているかは、以下のように見方を知っておくと便利です。

```bash
apps:~ apps$ # <= Mac 側での作業
[root@host ~]# # <= VPS ルートログイン
[apps@host ~]$ # <= VPS apps ユーザーログイン
```

## VPS 起動

申し込み後に送られてくる「[さくらのVPS] 仮登録完了のお知らせ」に書かれているコントロールパネルにアクセスし、申し込んだサーバーを起動します。

* [さくらのVPSコントロールパネル](https://secure.sakura.ad.jp/vps/#/login)

## ssh 接続

サーバー起動後すぐは `Connection refused` のエラーがでましたが、コーヒー豆を挽いてドリップしている間に接続できるようになりました。繋がらない場合は再起動すると良いみたい。これでルートユーザーでログインできました。

```bash
apps:~ apps$ ssh root@${ip_address}
ssh: connect to host ${ip_address} port 22: Connection refused
apps:~ apps$ ssh root@${ip_address}
The authenticity of host '${ip_address} (${ip_address})' can't be established.
Are you sure you want to continue connecting (yes/no)? # yes を入力
root@${ip_address}'s password: # メールに記載されていたパスワードを入力

SAKURA Internet [Virtual Private Server SERVICE]

[root@host ~]# 
```

## yum update

システムのアップデートをしておきます。

```bash
[root@host ~]# yum update
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

```bash
[root@host ~]# vim /etc/sysconfig/i18n
```

```sh
LANG="C"
↓
LANG="ja_JP.UTF-8"
```

変更後、一度ログアウトし再度ログインすると言語設定が日本語になります。

```bash
[root@host ~]# exit
apps:~ apps$ ssh root@${ip_address}
[root@host ~]# date
2016年  1月 31日 日曜日 16:13:13 JST
```

## 作業用ユーザーの設定

```bash
[root@host ~]# useradd apps
[root@host ~]# passwd apps
ユーザー apps のパスワードを変更。
新しいパスワード:
新しいパスワードを再入力してください:
passwd: 全ての認証トークンが正しく更新できました。
```

一般ユーザーであってもルート権限で作業できるコマンド `sudo` を使えるようにします。

```bash
[root@host ~]# usermod -G wheel apps
[root@host ~]# visudo
```

vim エディタが開くので `/wheel` と打ち込んで以下の部分を検索し、コメントアウトを外す。

```sh
# %wheel  ALL=(ALL)       ALL
↓
%wheel  ALL=(ALL)       ALL
```

試しに一度ログアウトして、ログインしてみます。

```bash
apps:~ apps$ ssh apps@${ip_address}
apps@${ip_address}'s password: # 先ほど設定したパスワード

SAKURA Internet [Virtual Private Server SERVICE]

[apps@host ~]$
```

## パスワードから鍵認証に切り替える

ssh 用のディレクトリを作成し、権限を 700 に変更します（自分には読み書き実行できるが、他人にはできない）。

```bash
[apps@host ~]$ mkdir ~/.ssh
[apps@host ~]$ chmod 700 ~/.ssh
```

既にssh 公開鍵を作っているから、鍵を作成する手順をスキップしました。以前に[この手順](https://help.github.com/articles/generating-a-new-ssh-key/)に従って作成しました。

```bash
apps:~ apps$ ls -a .ssh/ | grep 'id_rsa'
id_rsa
id_rsa.pub
```

公開鍵を `authorized_keys` という名前で転送します。

```bash
apps:~ apps$ scp ~/.ssh/id_rsa.pub apps@${ip_address}:~/.ssh/authorized_keys
apps@${ip_address}'s password: 
id_rsa.pub 100% 744 0.7KB/s 00:00 
```

すると転送後は、パスフレーズ無しでログインできるようになります。

```bash
apps:~ apps$ ssh apps@${ip_address}
```

## ポート番号の変更

ssh の接続ポートはデフォルト TCP 22 番が割り当てられていますが、攻撃されやすいので任意の番号（1024~65535  の範囲）に変えておきます。

以後、ルート権限の処理が続くため、以下のコマンドを打ち込んでルートに成り代わっておきます。

```bash
[apps@host ~]$ sudo -s

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for apps: 
[root@host apps]# 
```

```bash
[root@host apps]# cp /etc/ssh/sshd_config /etc/ssh/sshd_config.org
[root@host apps]# vim /etc/ssh/sshd_config
```

Port 番号を任意の数字（1024~65535  の範囲）に変更します。また、その他 2 点変更します。

```sh
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

```bash
[root@host apps]# diff /etc/ssh/sshd_config /etc/ssh/sshd_config.org
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

```bash
[root@host apps]# /usr/sbin/sshd -t # 記述が正しいかテスト
[root@host apps]# service sshd restart
sshd を停止中: [  OK  ]
sshd を起動中: [  OK  ]
```

一度ログアウトしてポート番号が変更されているか確認します。`-p 61203` のように任意の番号を付けないと入れないようになっているのを確認できます。

```bash
[apps@host ~]$ exit
apps:~ apps$ ssh apps@${ip_address}
ssh: connect to host ${ip_address} port 22: Connection refused
apps:~ apps$ ssh -p 61203 apps@${ip_address}
Last login: Sun Jan 31 17:08:03 2016 from 124x32x8x139.ap124.ftth.ucom.ne.jp

SAKURA Internet [Virtual Private Server SERVICE]
```

## ファイアウォールの設定

引き続きルート権限での処理が続きます。ファイアウォール機能である iptables は、サーバへ接続させる通信のルールを設定できます。 

```bash
[root@host apps]# vim /etc/sysconfig/iptables
```

以下のように記述します。

```sh
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

```bash
[root@host apps]# service iptables start
iptables: ファイアウォールルールを適用中: [  OK  ]
[root@host apps]# iptables -L # 確認用
```

## Web サーバーの設定

Web サーバー Apache httpd をインストールします。

```bash
[root@host apps]# yum install httpd
[root@host apps]# chkconfig httpd on # 再起動の時に、自動的に立ち上げる
```

設定ファイルを念の為にコピーしておきます。

```bash
[root@host apps]# cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.bk
[root@host apps]# vim /etc/httpd/conf/httpd.conf
```

以下のように 3 箇所書き換えます。

```sh
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

```bash
[root@host apps]# diff /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.bk
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

```bash
[root@host apps]# service httpd configtest
Syntax OK
[root@host apps]# service httpd start
httpd を起動中: [  OK  ]
```

デフォルトの DocumentRoot の場所に html ファイルを置いて確認してみます。作業用ユーザーでファイルを作成しました。http://${ip_address}/ にアクセスして見えていれば、成功です。

```bash
[root@host apps]# chown -R apps:apps /var/www/html/
[root@host apps]# exit
[apps@host ~]$ echo 'Hello World!' >> /var/www/html/index.html
```

## 参考

* [さくらのVPS入門 (全21回) - プログラミングならドットインストール](http://dotinstall.com/lessons/basic_sakura_vps)
