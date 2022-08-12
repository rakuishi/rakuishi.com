---
categories:
  - Web Service
date: "2018-11-20T22:25:23+09:00"
slug: circleci-settings-of-gh-organization
title: "GitHub Organization に紐付く Project の CircleCI 設定方法"
---

1. [CircleCI Local CLI](https://circleci.com/docs/2.0/local-cli/) をインストールする
2. Project に .circleci/config.yml を設置し、対応環境の記述をする
3. `circleci build .circleci/config.yml` で成功するまで調整する（キャッシュ機能など一部足りない機能があるため、ある程度は割り切る）
4. 成功すればそれを master ブランチ（デフォルト）に push する
5. https://circleci.com/ から GitHub アカウントでログインする
6. 左上の "Swith Organization" より企業アカウントを選択する
7. "ADD PROJECTS" より、Project を探す。権限が足りなくて "Contact repo admin" となっているため、管理者に問い合わせて "Set Up Project" より "Start building" を押してもらう
8. それ以降は管理者でなくても "Follow Project" できるようになる
9. 後は手元で config.yml を調整したり、push して動作を確認する
