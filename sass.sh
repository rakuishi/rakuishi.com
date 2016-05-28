DIR=$(cd $(dirname ${0}) && pwd)
cd ${DIR}

sass --watch static/assets/sass/style.scss:static/assets/css/style.css \
  --style compressed \
  --sourcemap=none
