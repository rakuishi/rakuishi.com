export function applyShortcodes(content) {
  // img
  content = content.replace(
    /{{<img alt="(.*?)" src="(.+?)" width="(\d*?)" height="(\d*?)">}}/g,
    '<p><img alt="$1" src="$2" width="$3" height="$4" loading="lazy"></p>'
  );

  // amazon
  content = content.replace(
    /{{<amazon id="(.+?)" title="(.+?)" src="(.+?)">}}/g,
    '<p><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" target="_blank" rel="noopener"><img src="$3" align="left" alt="$2" style="width: 200px; margin-right: 10px;" loading="lazy"></a><a href="http://www.amazon.co.jp/exec/obidos/ASIN/$1/rakuishi-22/ref=nosim/" rel="noopener" target="_blank">$2</a><br style="clear: both;"></p>'
  );

  // app
  content = content.replace(
    /{{<app id="(\d+?)" title="(.+?)" src="(.+?)">}}/g,
    '<p><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT"><img src="$3" align="left" alt="$2" width="100" height="100" style="width: 100px; height: 100px; margin-right: 10px;" loading="lazy"></a><a href="https://itunes.apple.com/jp/app/id$1?at=11l3RT" target="_blank">$2</a><br style="clear: both;"></p>'
  );

  // youtube
  content = content.replace(
    /{{<youtube (.+?)>}}/g,
    '<div class="iframe-wrapper"><iframe width="640" height="360" src="https://www.youtube.com/embed/$1" allowfullscreen frameborder="0"></iframe></div>'
  );

  // cryptocurrency
  content = content.replace("{{<cryptocurrency>}}", "");

  return content;
}
