import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SupportChat from "@/components/SupportChat";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <SupportChat />
    </>
  );
}
