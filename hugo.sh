#!/bin/sh

DIR=$(cd $(dirname ${0}) && pwd)
cd ${DIR}

build_sass() {
  sass static/assets/sass/style.scss static/assets/css/style.css \
    --style compressed \
    --sourcemap=none
}

hugo_new() {
  SLUG=${1}
  FILENAME=$(date '+%F')-${SLUG}.md
  hugo new archives/${FILENAME}
  sed "s/slug = \"\"/slug = \"${SLUG}\"/" \
    content/archives/${FILENAME} > content/archives/${FILENAME}.new
  mv content/archives/${FILENAME}.new content/archives/${FILENAME}
  open content/archives/${FILENAME}
}

hugo_server() {
  open http://localhost:1313/
  hugo server --watch --buildDrafts
}

publish() {
  build_sass
  hugo
  find ${DIR}/public/ -name '.DS_Store' | xargs rm
  aws s3 sync --delete ${DIR}/public s3://rakuishi.com
}

case $1 in
  'sass')
    build_sass
    ;;
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
    echo "Usage: $0 <sass|new|server|publish>"
    exit 2
    ;;
esac
