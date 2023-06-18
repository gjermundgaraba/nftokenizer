import '../app/globals.css'
import {AppProps} from "next/app";

export default function App({Component, pageProps}: AppProps) {
  return (
    <div>
      hei
      <Component {...pageProps} />
    </div>
  );
}