# rakuishi.com

This is the repository for the [rakuishi.com](rakuishi.com). This is a [Hugo](https://github.com/spf13/hugo) project, which is a static site generator written in [Go](https://github.com/golang/go).

![](.github/Screenshot.png)

## Installation & Usage

```
$ brew install hugo
$ brew install sass/sass/sass
$ sass static/assets/sass/style.scss:layouts/partials/style.css --style compressed
$ ./hugo server
```

## Deployment

```
$ brew install nodejs
$ npm install -g firebase-tools
$ firebase login
$ npm install -g html-minifier
$ ./hugo deploy
```