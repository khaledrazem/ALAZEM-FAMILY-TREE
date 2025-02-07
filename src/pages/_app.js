import "@/styles/globals.css";
import FloatingButtons from "@/component/floating-buttons";

export default function App({ Component, pageProps }) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  return (
    <>
      <Component {...pageProps} />
      <FloatingButtons />
    </>
  );
}
