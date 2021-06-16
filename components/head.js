import NextHead from "next/head";
import { escape } from "utils/escape";
import { parseISO, format } from "date-fns";

export default function Head({ props }) {
  const title =
    props != null && props.title != null
      ? `${props.title} | rakuishi.com`
      : "rakuishi.com";
  const description =
    props != null && props.summary != null
      ? props.summary
      : "Blog posts by rakuishi since Aug 25, 2011";
  const image =
    props != null && props.image != null
      ? `https://rakuishi.com${props.image}`
      : "https://rakuishi.com/assets/images/og.jpg";

  return (
    <NextHead>
      <title>{title}</title>
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta key="description" name="description" content={description} />
      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:site" name="twitter:site" content="@rakuishi07" />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:image" property="og:image" content={image} />
      <link rel="alternate" type="application/rss+xml" href="/feed/index.xml" />
      {_createJsonLd(title, description, image, props)}
    </NextHead>
  );
}

function _createJsonLd(title, description, image, props) {
  if (props && props.date && props.slug) {
    const iso8601 = "yyyy-MM-dd'T'HH:mm:ssxxx";
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `
[{
  "@context": "http://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": "",
  "headline": "${escape(title)}",
  "description": "${escape(description)}",
  "datePublished": "${escape(format(parseISO(props.date), iso8601))}",
  "dateModified": "${escape(format(parseISO(props.date), iso8601))}",
  "author": {
    "@type": "Person",
    "name": "rakuishi",
    "url": "https://rakuishi.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "rakuishi",
    "logo": {
      "@type": "ImageObject",
      "url": "https://rakuishi.com/assets/images/avatar.jpg"
    }
  },
  "image": {
    "@type": "ImageObject",
    "url": "${escape(image)}"
  }
},
{
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "item": {
      "@id": "https://rakuishi.com",
      "name": "rakuishi.com"
    }
  }, {
    "@type": "ListItem",
    "position": 2,
    "item": {
      "@id": "https://rakuishi.com/archives/${escape(props.slug)}/",
      "name": "${escape(title)}"
    }
  }]
}]
`,
        }}
      />
    );
  } else {
    return null;
  }
}
