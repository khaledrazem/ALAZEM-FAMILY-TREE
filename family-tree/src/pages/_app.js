import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
  return <Component {...pageProps} />;
}
