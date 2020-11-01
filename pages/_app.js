import "styles/global.scss";
import { initDarkmode } from "utils/darkmode";

export default function App({ Component, pageProps }) {
  React.useEffect(() => {
    initDarkmode();
  });
  return <Component {...pageProps} />;
}
