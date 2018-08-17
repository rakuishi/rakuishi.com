DIR=$(cd $(dirname ${0}) && pwd)
cd ${DIR}

sass --watch static/assets/sass/style.scss:layouts/partials/style.css \
  --style compressed
