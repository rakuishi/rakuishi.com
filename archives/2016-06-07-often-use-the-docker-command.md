---
categories:
  - 雑記
date: "2016-06-07T22:44:24+09:00"
slug: often-use-the-docker-command
title: "Docker でよく使用するコマンド一覧"
---

数カ月後にはしっかり忘れていると思うのでメモしておきます。

## 前準備

[VirtualBox](https://www.virtualbox.org/) と [Docker Toolbox](https://www.docker.com/docker-toolbox) をインストールしておきます。

また、作業するフォルダ上に Dockerfile を用意します。今回はサンプルに LAMP 環境を構築できる [tutumcloud/lamp: LAMP base docker image](https://github.com/tutumcloud/lamp) を使用しました。tutumcloud/lamp では、app フォルダはルートに設定されています。

```
FROM tutum/lamp:latest
RUN rm -fr /app && mkdir /app
EXPOSE 80 3306
CMD ["/run.sh"]
```

ファイル共有をテストするために、適当なファイルを用意しておきます。

```bash
$ mkdir app
$ echo 'Hello, World!' > app/index.html
```

## Dokcer コマンド一覧

### Dokcer マシンを立ち上げる

Docker Toolbox インストール時に作成される Docker Quickstart Terminal.app を起動し、`default` という名前で用意された Linux 環境を立ち上げます。実際には内部に含まれている start.sh シェルスクリプトが実行されており、以下のコマンドによって Docker マシンを立ち上げています。

```bash
$ docker-machine create -d virtualbox --virtualbox-memory 2048 --virtualbox-disk-size 204800 default
```

### Docker マシン一覧を確認する

```bash
$ docker-machine ls
NAME     ACTIVE  DRIVER      STATE    URL                        SWARM  DOCKER  ERRORS
default  *       virtualbox  Running  tcp://192.168.99.100:2376         v1.9.1
```

### Docker マシンの IP Address を確認する

```bash
$ docker-machine ip default
192.168.99.100
```

### Dockerfile をビルドし、Docker イメージを作成する

```bash
$ docker build -t [IMAGE NAME] .
```

### Docker コンテナを起動する

`-v` オプションを使用することでファイル共有が可能になります。

```bash
$ docker run -d -p 80:80 -v $(pwd)/app:/app --name=[CONTAINER NAME] [IMAGE NAME]
```

起動できれば、Docker マシンの IP Address をブラウザに入力し、実際に index.html の内容が表示されていることを確認できます。また、index.html を変更すれば、ブラウザ上に表示されている内容も変更されます。

```bash
$ open "http://$(docker-machine ip default)"
```

### Docker コンテナ内に入る

```bash
$ docker exec -it [CONTAINER NAME] bash
```

### Dokcer イメージ一覧を確認する

```bash
$ docker images
REPOSITORY  TAG     IMAGE ID      CREATED       VIRTUAL SIZE
tutum/lamp  latest  f02090877f42  5 months ago  426.5 MB
```

### Docker イメージを削除する

```bash
$ docker rmi -f [IMAGE NAME]
```

### Docker コンテナ一覧を確認する

```bash
$ docker ps -a
```

### Docker コンテナを削除する

[CONTAINER NAME] は、[CONTAINER ID] でも良くて、その場合、先頭数文字などを入力するだけで削除できます。

```bash
$ docker rm -f [CONTAINER NAME]
```
