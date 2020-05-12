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

deploy() {
  sass static/assets/sass/style.scss:layouts/partials/style.css \
    --style compressed
  rm -rf public/
  hugo
  html-minifier --input-dir public/ --output-dir public/ --file-ext html -c minifier.json
  firebase deploy
}

case $1 in
  'new')
    hugo_new $2
    ;;
  'server')
    hugo_server
    ;;
  'deploy')
    deploy
    ;;
  *)
    echo "Usage: $0 <new|server|deploy>"
    exit 2
    ;;
esac
