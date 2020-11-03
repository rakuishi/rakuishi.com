import "styles/global.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        @font-face {
          font-family: "NotoSans";
          font-style: normal;
          font-weight: 400;
          font-display: optional;
          src: local("NotoSansCJKjp-Regular.otf"),
            local("NotoSansJP-Regular.otf"),
            url("/assets/fonts/NotoSans-Regular.woff2") format("woff2");
        }

        @font-face {
          font-family: "NotoSans";
          font-style: normal;
          font-weight: 700;
          font-display: optional;
          src: local("NotoSansCJKjp-Bold.otf"), local("NotoSansJP-Bold.otf"),
            url("/assets/fonts/NotoSans-Bold.woff2") format("woff2");
        }
      `}</style>
    </>
  );
}
