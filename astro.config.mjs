import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { visit } from "unist-util-visit";
import gfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
  site: "https://rakuishi.com/",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
    remarkPlugins: [
      gfm, // tables
      shortcodePlugin,
      descriptionPlugin,
    ],
  },
});

export function shortcodePlugin() {
  return function (tree, file) {
    visit(tree, ["html"], (node) => {
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
        '<p><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" target="_blank" rel="noopener"><img src="$3" align="left" alt="$2" style="width: 200px; margin-right: 10px;" loading="lazy"></a><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" rel="noopener" target="_blank">$2</a><br style="clear: both;"></p>'
      );

      // app
      node.value = node.value.replace(
        /<app id="(\d+?)" title="(.+?)" src="(.+?)">/g,
        '<p><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT"><img src="$3" align="left" alt="$2" width="100" height="100" style="width: 100px; height: 100px; margin-right: 10px;" loading="lazy"></a><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT" target="_blank">$2</a><br style="clear: both;"></p>'
      );

      // youtube
      node.value = node.value.replace(
        /<youtube (.+?)>/g,
        '<div class="iframe-wrapper"><iframe width="640" height="360" src="https://www.youtube.com/embed/$1" allowfullscreen frameborder="0"></iframe></div>'
      );

      // cryptocurrency
      node.value = node.value.replace("<cryptocurrency>", "");
    });
  };
}

export function descriptionPlugin() {
  return function (tree, file) {
    var description = "";
    const types = ["text", "link", "inlineCode", "listItem"];
    for (let i = 0; i < tree.children.length; i++) {
      if (!tree.children[i].children) continue;
      let type = tree.children[i].children[0].type;
      if (types.includes(type)) {
        visit(tree.children[i], types, (node) => {
          if (node.value) description += node.value;
        });
        break;
      }
    }
    file.data.astro.frontmatter.description = description;
  };
}
