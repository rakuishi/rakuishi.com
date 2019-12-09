#!/bin/sh

set -e

DIR=$(cd $(dirname ${0}) && pwd)
cd ${DIR}

hugo_new() {
  SLUG=${1}
  FILENAME=$(date '+%F')-${SLUG}.md
  hugo new archives/${FILENAME}
  sed -i '' "s/slug: /slug: ${SLUG}/g" content/archives/${FILENAME}
  open content/archives/${FILENAME}
}

hugo_server() {
  open http://localhost:1313/
  hugo server --watch --buildDrafts
}

publish() {
  sass static/assets/sass/style.scss:layouts/partials/style.css \
    --style compressed
  rm -rf public/
  hugo
  # brew install htmlcompressor
  rm -rf temp/
  cp -r public/ temp/
  htmlcompressor --recursive --output temp/ public/
  cp -r temp/ public/
  rm -rf temp/
  firebase deploy
}

case $1 in
  'new')
    hugo_new $2
    ;;
  'server')
    hugo_server
    ;;
  'publish')
    publish
    ;;
  *)
    echo "Usage: $0 <new|server|publish>"
    exit 2
    ;;
esac
