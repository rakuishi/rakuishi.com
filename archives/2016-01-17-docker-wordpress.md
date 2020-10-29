---
categories:
  - WordPress
date: 2016-01-17T14:53:50+09:00
draft: false
slug: docker-wordpress
title: "Docker で WordPress サイト開発を始める"
---

以前、WordPress のローカル仮想環境の構築を Vagrant を利用した [VCCW](http://vccw.cc/) で試したことがあるのですが、以下の理由から使うのを諦めたことがありました。

* 仮想環境の起動が遅かった
* 恐らくパーミッション設定が間違えているのかメディアがアップロードできなかった
* 開発しているテーマとプラグインをどのように Git で管理するのか、サンプル記事をどのように共有するのか、イメージが湧かなかった

仕方なくこれまで通りに [MAMP](https://www.mamp.info/en/) でローカル仮想環境を構築していた折、[Docker で WordPress サイトを開発してみよう](http://www.slideshare.net/mookjp/dockerword-press) というスライドを見かけて、Docker を始めてみました。上記の悩みを見事に解決出来たので（特に起動と破棄が一瞬だったのに感動した！）、今後は Docker を使っていくことにしました。

この記事は上記のスライドを参考に、Docker で WordPress サイトを動かし、さらにテーマとプラグインを管理できるところまでを書きました。

## Mac OS X：Docker での作業の流れ

[VirtualBox](https://www.virtualbox.org/) と [Docker Toolbox](https://www.docker.com/docker-toolbox) をインストールしておきます。

1. Dockerfile に設定を書く
1. Dockerfile をビルドしてイメージ（Docker images）を作る（例えば、 Ubuntu や、Apache、作成した Web アプリケーションを含む)
1. イメージからコンテナ（Docker containers）を立ち上げる

## Docker Machine を起動する

Docker Toolbox のインストール時に、アプリケーションフォルダに追加される Docker Quickstart Terminal.app を起動し、`default` という名前で用意された Linux 環境を立ち上げます。起動に成功するとコンテナを積んでいる Moby Dock くんが表示されます。

```
                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/


docker is configured to use the default machine with IP 192.168.99.100
For help getting started, check out the docs at https://docs.docker.com
```

## Dockerfile をビルドしてイメージを作成する

GitHub 上に置いたレポジトリ [rakuishi/wordpress: Wordpress Docker image](https://github.com/rakuishi/wordpress) から Dockerfile を持ってきます。Dockerfile をビルドすると、必要なファイルがダウンロードされイメージが作成されます。

この [Dockerfile](https://github.com/rakuishi/wordpress/blob/master/Dockerfile) には、LAMP 環境（Linux, Apache, MySQL, PHP）を元に WordPress に必要な作業の手順が書かれています。

```bash
$ git clone https://github.com/rakuishi/wordpress.git docker-wordpress
$ cd docker-wordpress
$ docker build -t docker-wordpress .
```

イメージの一覧は、以下のコマンドで確認できます。

```bash
$ docker images
REPOSITORY        TAG     IMAGE ID      CREATED         VIRTUAL SIZE
docker-wordpress  latest  38ebdeeaeb7e  10 seconds ago  475.4 MB
tutum/lamp        latest  f02090877f42  4 weeks ago     426.5 MB
```

## イメージからコンテナを立ち上げる

イメージからコンテナを立ち上げます。`-v $(pwd):/data-share` のオプションは必須ではありませんが、次の作業でコンテナ内とローカルのファイルを共有するために書いています。ブラウザに初回設定画面が表示されるので、アカウントの作成まで済ませておきます。

```bash
$ docker run -d -p 80:80 -v $(pwd):/data-share --name=docker-wordpress docker-wordpress
$ docker-machine ip default
192.168.99.100
$ open http://192.168.99.100/
```

また、コンテナの一覧は、以下のコマンドで確認できます。

```bash
$ docker ps
CONTAINER ID  IMAGE             COMMAND    CREATED         STATUS         PORTS                         NAMES
c5f1ba815676  docker-wordpress  "/run.sh"  28 seconds ago  Up 27 seconds  0.0.0.0:80->80/tcp, 3306/tcp  docker-wordpress
```

## データベースとテーマ・プラグインを dump する

WordPress サイトを管理できるように、データベースの内容をまるごとと、テーマ・プラグインを含む wp-content/ をコンテナから dump します。これらのファイルを含めてバージョン管理することで、他の人と同じ環境を共有できます。

```bash
$ docker exec docker-wordpress sh -c "mysqldump -u root wordpress > /data-share/dump.sql"
$ mkdir public_html
$ docker exec docker-wordpress sh -c "cp -r /app/wp-content/ /data-share/public_html/"
```

## dump したデータをもとに WordPress を立ち上げる

Dockerfile に記述している以下のコメントアウトを外します。

```
# ADD public_html/wp-content /app/wp-content
```

mysql-setup.sh に記述している以下のコメントアウトを外します。

```
# mysql -uroot wordpress < /dump.sql
```

一度、立ち上がっているコンテナを削除し、再度、Dockerfile からイメージを作成し、コンテナを立ち上げます。wp-content/ をコンテナ内と共有しているので、ローカルでテーマ・プラグインを編集すると反映されます。

```bash
$ docker rm -f docker-wordpress
$ docker build -t docker-wordpress .
$ docker run -d -p 80:80 -v $(pwd)/public_html/wp-content:/app/wp-content/ -v $(pwd)/dump.sql:/dump.sql --name=docker-wordpress docker-wordpress
```

## 参考

* [Installation on Mac OS X](https://docs.docker.com/engine/installation/mac/)
* [tutumcloud/lamp: LAMP base docker image](https://github.com/tutumcloud/lamp)
* [tutumcloud/wordpress: Wordpress docker image with bundled MySQL server (only for testing purposes)](https://github.com/tutumcloud/wordpress)
