import "@/styles/globals.css";
import "@/custome-modules/family-chart/dist/styles/family-chart.css";
import 'dotenv/config'

export default function App({ Component, pageProps }) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  require('dotenv').config() 

  return (
    <>
      <Component {...pageProps} />
      
    </>
  );
}
