#!/bin/sh

set -e

DIR=$(cd $(dirname ${0}) && pwd)
cd ${DIR}

hugo_new() {
  SLUG=${1}
  FILENAME=$(date '+%F')-${SLUG}.md
  hugo new archives/${FILENAME}
  sed -i '' "s/slug: null/slug: ${SLUG}/g" content/archives/${FILENAME}
  open content/archives/${FILENAME}
}

hugo_server() {
  open http://localhost:1313/
  hugo server --watch --buildDrafts
}

publish() {
  sass static/assets/sass/style.scss:static/assets/css/style.css \
    --style compressed \
    --sourcemap=none
  hugo
  aws s3 sync ${DIR}/public s3://rakuishi.com --delete --exclude=.DS_Store --cache-control "max-age=300"
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
