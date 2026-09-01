import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { transformerFilename } from 'shiki-transformer-filename';

// https://astro.build/config
export default defineConfig({
  site: "https://rakuishi.com/",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "css-variables",
      transformers: [
        transformerFilename(),
      ],
    },
    processor: unified({
      remarkPlugins: [shortcodePlugin],
      rehypePlugins: [externalLinksPlugin],
    }),
  },
});

// 外部リンクだけ別タブで開く。ルート相対や自サイトの絶対 URL は対象外
export function externalLinksPlugin() {
  return (tree, _) => {
    const traverse = (node) => {
      if (
        node.type === "element" &&
        node.tagName === "a" &&
        /^https?:\/\//.test(node.properties?.href ?? "") &&
        !node.properties.href.startsWith("https://rakuishi.com")
      ) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener", "noreferrer"];
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    traverse(tree);
  };
}

export function shortcodePlugin() {
  return (tree, _) => {
    const traverse = (node) => {
      if (node.type === "html" && node.value) {
        // img
        node.value = node.value.replace(
          /<img alt="([^"]*)" src="([^"]*)" width="(\d+)" height="(\d+)">/g,
          '<figure><img alt="$1" src="$2" width="$3" height="$4" loading="lazy"></figure>'
        );
        node.value = node.value.replace(
          /<img alt="([^"]*)" src="([^"]*)">/g,
          '<figure><img alt="$1" src="$2" loading="lazy"></figure>'
        );
        node.value = node.value.replace(
          /<img src="([^"]*)" alt="([^"]*)">/g,
          '<figure><img alt="$2" src="$1" loading="lazy"></figure>'
        );

        // amazon
        node.value = node.value.replace(
          /<amazon id="(.+?)" title="(.+?)" src="(.+?)">/g,
          '<p><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" target="_blank" rel="noopener"><img src="$3" align="left" alt="$2" width="200" style="width: 200px; margin-right: 10px;" loading="lazy"></a><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" rel="noopener" target="_blank">$2</a><br style="clear: both;"></p>'
        );

        // app
        node.value = node.value.replace(
          /<app id="(\d+?)" title="(.+?)" src="(.+?)">/g,
          '<p><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT"><img src="$3" align="left" alt="$2" width="100" height="100" style="width: 100px; margin-right: 10px;" loading="lazy"></a><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT" target="_blank">$2</a><br style="clear: both;"></p>'
        );

        // youtube
        node.value = node.value.replace(
          /<youtube (.+?)>/g,
          '<div class="iframe-wrapper"><iframe width="640" height="360" src="https://www.youtube.com/embed/$1" allowfullscreen frameborder="0" loading="lazy"></iframe></div>'
        );

        // cryptocurrency
        node.value = node.value.replace("<cryptocurrency>", "");
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    traverse(tree);
  };
}
