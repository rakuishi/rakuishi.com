#!/bin/sh

DIR=$(cd $(dirname ${0})/.. && pwd)
cd ${DIR}
open http://localhost:1313/
hugo server --watch --buildDrafts
