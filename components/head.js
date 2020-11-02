import NextHead from "next/head";

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
      : "";

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@rakuishi07" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <link rel="alternate" type="application/rss+xml" href="/feed/index.xml" />
    </NextHead>
  );
}
