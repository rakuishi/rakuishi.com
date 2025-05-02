import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://rakuishi.com/",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
    remarkPlugins: [shortcodePlugin],
  },
});

export function shortcodePlugin() {
  return function (tree, _) {
    const traverse = (node) => {
      if (node.type === "html" && node.value) {
        // img
        node.value = node.value.replace(
          /<img alt="(.*?)" src="(.+?)" width="(\d*?)" height="(\d*?)">/g,
          '<p><img alt="$1" src="$2" width="$3" height="$4" loading="lazy"></p>'
        );
        node.value = node.value.replace(
          /<img alt="(.*?)" src="(.+?)">/g,
          '<p><img alt="$1" src="$2" loading="lazy"></p>'
        );

        // amazon
        node.value = node.value.replace(
          /<amazon id="(.+?)" title="(.+?)" src="(.+?)">/g,
          '<p><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" target="_blank" rel="noopener"><img src="$3" align="left" alt="$2" width="200" style="margin-right: 10px;" loading="lazy"></a><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" rel="noopener" target="_blank">$2</a><br style="clear: both;"></p>'
        );

        // app
        node.value = node.value.replace(
          /<app id="(\d+?)" title="(.+?)" src="(.+?)">/g,
          '<p><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT"><img src="$3" align="left" alt="$2" width="100" height="100" style="margin-right: 10px;" loading="lazy"></a><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT" target="_blank">$2</a><br style="clear: both;"></p>'
        );

        // youtube
        node.value = node.value.replace(
          /<youtube (.+?)>/g,
          '<div class="iframe-wrapper"><iframe width="640" height="360" src="https://www.youtube.com/embed/$1" allowfullscreen frameborder="0"></iframe></div>'
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
