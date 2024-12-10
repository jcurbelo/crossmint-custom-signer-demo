import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { CrossmintProvider } from "@crossmint/client-sdk-react-ui";

const client = new QueryClient();
const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY as string;

if (!clientApiKey) {
  throw new Error("Missing NEXT_PUBLIC_CLIENT_API_KEY");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <CrossmintProvider apiKey={clientApiKey}>
            <Component {...pageProps} />
          </CrossmintProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
