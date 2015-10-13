#!/bin/sh

DIR=$(cd $(dirname ${0})/.. && pwd)
SLUG=${1}
FILENAME=$(date '+%F')-${SLUG}.md
cd ${DIR}
hugo new archives/${FILENAME}
sed "s/slug = \"\"/slug = \"${SLUG}\"/" content/archives/${FILENAME} > content/archives/${FILENAME}.new
mv content/archives/${FILENAME}.new content/archives/${FILENAME}
open content/archives/${FILENAME}
