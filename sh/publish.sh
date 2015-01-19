#!/bin/sh
hugo
find ~/Dropbox/Private/rakuishi.com/ -name ".DS_Store" | xargs rm
rsync -auv --delete ~/Dropbox/Private/rakuishi.com/public/ rakuishi@rakuishi.sakura.ne.jp:/home/rakuishi/www/