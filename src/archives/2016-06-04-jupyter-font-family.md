---
categories:
  - Tech
date: "2016-06-04T22:50:42+09:00"
slug: jupyter-font-family
title: Jupyter (IPython) Notebook の Output を等幅フォントに変える
---

データサイエンスの勉強のために、Python 3.5 とデータサイエンスのための各種ライブラリが詰まった [Annaconda](https://www.continuum.io/) をダウンロードして、Jupyter (IPython) Notebook を使用しています。

ですが、Notebook の Output が等幅フォントでなく見にくかったため、それを等幅フォントに変える方法をメモしておきます。

```bash
$ echo '.CodeMirror pre, .output pre { font-family: Monaco, monospace; }' >  ~/.jupyter/custom/custom.css
```
