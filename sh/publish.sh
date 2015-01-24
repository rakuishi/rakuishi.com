#!/bin/sh
hugo
find ~/Dropbox/Private/rakuishi.com/public/ -name ".DS_Store" | xargs rm
gulp critical
rsync -auv --delete ~/Dropbox/Private/rakuishi.com/public/ rakuishi@rakuishi.sakura.ne.jp:/home/rakuishi/www/