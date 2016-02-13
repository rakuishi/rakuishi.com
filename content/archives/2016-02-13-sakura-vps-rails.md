+++
categories = ["Web Service"]
date = "2016-02-13T00:23:58+09:00"
draft = false
slug = "sakura-vps-rails"
title = "さくらの VPS：WEBrick と Unicorn + Nginx で Ruby on Rails の表示まで"
+++

さくらの VPS に Ruby on Rails の環境を導入するまでの手順をまとめました。まずは、Ruby 付属の Web サーバー WEBrick による動作を確認し、その後に Unicorn + Nginx による動作を確認します。

## Create user account

ルートユーザーで ssh ログインします。

```bash
$ ssh root@${id_address}
```

一般ユーザー apps を追加します。

```bash
# useradd apps
# passwd apps
```

一般ユーザー apps がルート権限で作業できるようにします。

```bash
# usermod -G wheel apps
# visudo
```

コメントアウトされている部分を解除します。`visudo` コマンドを経由して、/etc/sudoers を編集しています。

```sh
## Allows people in group wheel to run all commands
%wheel  ALL=(ALL) ALL
```

ルートユーザーでログインできないようにします。

```bash
# cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bk
# vim /etc/ssh/sshd_config
```

コメントアウトされている部分を解除して、`yes` → `no` に変更します。

```sh
PermitRootLogin no
```

記述を確認してから `sshd` を再起動します。

```bash
# /usr/sbin/sshd -t
# service sshd restart
```

以降、すべての作業は一般ユーザーでログインした状態のホームディレクトリ /home/apps で作業を行います。

```bash
# exit
$ ssh apps@${id_address}
```

パスワードから鍵認証に切り替えます。鍵を置く場所を作って、作業マシンに戻ります。

```bash
$ mkdir .ssh
$ chmod 700 .ssh/
$ exit
```

作業用マシンの公開鍵を送ります。パスワードなしで apps ユーザーでログインできるようになります。

```bash
$ scp ~/.ssh/id_rsa.pub apps@${id_address}:~/.ssh/authorized_keys
$ ssh apps@${id_address}
```

## Installation Firewall

公開するポートを設定します。ssh: 20, http: 80, https: 443, Rails: 3000 を開けています。

```bash
$ sudo vim /etc/sysconfig/iptables
```

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
-A SERVICES -p tcp --dport 22 -j ACCEPT
-A SERVICES -p tcp --dport 80 -j ACCEPT
-A SERVICES -p tcp --dport 443 -j ACCEPT
-A SERVICES -p tcp --dport 3000 -j ACCEPT
COMMIT
```

```bash
$ sudo service iptables start
```

## Add deploy key to GitHub repo

GitHub に公開鍵を登録して、レポジトリをクローンします。

```bash
$ ssh-keygen -t rsa -b 4096 -C "rakuishi@gmail.com"
$ cat .ssh/id_rsa.pub
$ git clone git@github.com:rakuishi/sakura-vps-rails.git rails
```

このサンプルレポジトリには、Unicorn の設定ファイル [config/unicorn.rb](https://github.com/rakuishi/sakura-vps-rails/blob/master/config/unicorn.rb) が含まれています。

```ruby
APP_PATH = "/home/apps/rails"

worker_processes 4
working_directory APP_PATH
listen "/var/run/unicorn/unicorn.socket"
pid APP_PATH + "/tmp/pids/unicorn.pid"
stderr_path APP_PATH + "/log/unicorn.log"
stdout_path APP_PATH + "/log/unicorn.log"

preload_app true

before_fork do |server, worker|
  ActiveRecord::Base.connection.disconnect!

  old_pid = "#{server.config[:pid]}.oldbin"
  if old_pid != server.pid
    begin
      sig = (worker.nr + 1) >= server.worker_processes ? :QUIT : :TTOU
      Process.kill(sig, File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
    end
  end
end

after_fork do |server, worker|
  ActiveRecord::Base.establish_connection
end
```

listen で指定している /var/run/unicorn/ を作ります。ちなみに、APP_PATH + /tmp/sockets/ に指定したかったのですが、権限の問題なのかうまく動作しませんでした（要調査）。

```bash
$ sudo mkdir /var/run/unicorn
$ sudo chmod 777 /var/run/unicorn/
```

## Installation Ruby with RVM

Ruby, Ruby on Rails に必要なパッケージをインストールします。必要に応じて間引いてください。

```bash
$ sudo yum clean all
$ sudo yum install gcc gcc-c++ autoconf make wget git zlib-devel openssl-devel libyaml-devel readline-devel libxml2-devel libxslt-devel libffi-devel sqlite-devel mysql-devel
```

Ruby Version Manager（RVM）をインストールし、RVM を使用するユーザーを rvm グループに追加して、反映するために一度ログアウトします。

```bash
$ sudo gpg2 --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
$ \curl -L https://get.rvm.io | sudo bash -s stable
$ sudo usermod -a -G rvm apps
$ exit
```

rvm.sh によってパスを通した後に、Ruby 2.2.1 をインストールします。

```bash
$ source /etc/profile.d/rvm.sh
$ rvm install 2.2.1
```

ドキュメントをインストールしないように設定します。

```bash
$ echo "gem: --no-ri --no-rdoc" >> ~/.gemrc
```

`bundle install` し、データベースのマイグレーションを行います。開発環境は development を指定しています。

```bash
$ cd rails
$ ./bin/bundle install --path vendor/bundle
$ ./bin/rake db:migrate RAILS_ENV=development
$ ./bin/rake db:seed RAILS_ENV=development
```

Ruby on Rails を付属の WEBrick で動かします。http://${id_address}:3000/ から起動が確認できます。

```bash
$ ./bin/rails s -b 0.0.0.0 -p 3000 -e development
```

## Unicorn

Unicorn がプロセスとして動作することを確認します。

```bash
$ gem install unicorn-rails
$ unicorn_rails -c /home/apps/rails/config/unicorn.rb -E development -D
$ ps aux | grep unicorn
```

## Nginx

Nginx をインストールして起動し、サーバーが再起動した時に自動で Nginx が立ち上がるように設定します。http://${id_address}/ から Nginx の起動が確認できます。

```bash
$ sudo yum install nginx
$ sudo service nginx start
$ sudo chkconfig nginx on
```

次に実行されている `unicorn_rails` プロセスを見るように Nginx の設定を変えます。

```bash
$ sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bk
$ sudo vim /etc/nginx/conf.d/default.conf
```

```sh
upstream unicorn {
  server unix:/var/run/unicorn/unicorn.socket fail_timeout=0;
}

server {
  listen 80;
  server_name localhost;

  root /home/apps/rails/public;
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;
  error_page 404 /404.html;
  error_page 500 502 503 504 /500.html;
  client_max_body_size 10M;

  location ~ ^/assets/ {
    gzip_static on;
    expires max;
    add_header Cache-Control public;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
  }

  try_files $uri $uri/index.html $uri.html @unicorn;

  location @unicorn {
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_redirect off;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://unicorn;
  }
}
```

```bash
$ sudo /etc/init.d/nginx configtest
$ sudo service nginx reload
```

http://${id_address}/ から Ruby on Rails の起動が確認できます。

## Create init.d script

この状態だとサーバーを再起動 `sudo reboot` した時に、`unicorn_rails` プロセスが自動で起動されません。自動で起動するように、スクリプトを作成します。

```bash
$ sudo vim /etc/init.d/unicorn
```

```sh
#!/bin/sh
#
# unicorn - this script starts and stops the unicorn
#
# chkconfig:   3456 85 35
# description: unicorn
# processname: unicorn

RAILS_ENV="development"
USER="apps"
APP_PATH="/home/apps/rails"
PID="${APP_PATH}/tmp/pids/unicorn.pid"

start()
{
  sudo -u ${USER} bash -login -c "cd ${APP_PATH} && unicorn_rails -c ${APP_PATH}/config/unicorn.rb -E ${RAILS_ENV} -D"
  return 0
}

stop()
{
  if [ ! -e $PID ]; then
    return 0
  fi
  kill -QUIT `cat ${PID}`
  rm -f $PID
  return 0
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  *)
    echo $"Usage: $0 {start|stop|restart}"
    exit 2
esac
```

```bash
$ sudo chmod 755 /etc/init.d/unicorn
$ sudo chkconfig unicorn on
```

起動スクリプトから一般ユーザー apps が、`unicorn_rails` プロセスを立ち上げる都合上、root ユーザーは tty 無しの `sudo` を許可するようにします。

```bash
$ sudo visudo
```

`Defaults:root !requiretty` を書き換えます。

```sh
#
# Disable "ssh hostname sudo <cmd>", because it will show the password in clear.
#         You have to run "ssh -t hostname sudo <cmd>".
#
Defaults    requiretty
Defaults:root !requiretty
```

再起動して Ruby on Rails の起動を確認します。

```bash
sudo reboot
```

表示されていたら成功です。
