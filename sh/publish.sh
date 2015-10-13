#!/bin/sh

DIR=$(cd $(dirname ${0})/.. && pwd)
cd ${DIR}
gulp sass
hugo
find ${DIR}/public/ -name ".DS_Store" | xargs rm
rsync -auv --delete \
      --chmod=Du=rwx,Dg=rx,Do=rx,Fu=rw,Fg=r,Fo=r \
      ${DIR}/public/ rakuishi@rakuishi.sakura.ne.jp:/home/rakuishi/www/
