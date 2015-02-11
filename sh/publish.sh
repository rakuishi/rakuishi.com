#!/bin/sh
# This is publish script with rsync.

DIR=$(cd $(dirname ${0})/.. && pwd)

hugo
gulp sass
gulp critical
find ${DIR}/public/ -name ".DS_Store" | xargs rm
rsync -auv --delete \
      --chmod=Du=rwx,Dg=rx,Do=rx,Fu=rw,Fg=r,Fo=r \
      ${DIR}/public/ rakuishi@rakuishi.sakura.ne.jp:/home/rakuishi/www/
