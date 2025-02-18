import { CrossmintEmbeddedCheckout } from "@crossmint/client-sdk-react-ui";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { parseTransaction, type Hex } from "viem";
import { useState } from "react";
import { baseSepolia, polygonAmoy, sepolia } from "viem/chains";

const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID as string;

// map, crossmint custom chain to number
const chainIds: Record<string, number> = {
  "base-sepolia": baseSepolia.id,
  "polygon-amoy": polygonAmoy.id,
  "ethereum-sepolia": sepolia.id,
};

if (!collectionId) {
  throw new Error("Missing NEXT_PUBLIC_COLLECTION_ID");
}

export const Checkout = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  if (!walletClient || !address) {
    return <p style={{ marginTop: "10px" }}>Connect your wallet to checkout</p>;
  }

  return (
    <div style={{ marginTop: "10px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <CrossmintEmbeddedCheckout
        lineItems={{
          collectionLocator: `crossmint:${collectionId}`,
          callData: {
            totalPrice: "0.001",
            quantity: 1,
          },
        }}
        recipient={{
          walletAddress: address,
        }}
        payment={{
          crypto: {
            enabled: true,
            payer: {
              address,
              supportedChains: [
                "base-sepolia",
                "polygon-amoy",
                "ethereum-sepolia",
              ],
              initialChain: "base-sepolia",
              handleChainSwitch: async (chain) => {
                console.log("Switching to chain");
                console.log({ chain });
                try {
                  setError(null);
                  await walletClient.switchChain({ id: chainIds[chain] });
                } catch (error) {
                  console.error("Chain switch failed:", error);
                  setError("Failed to switch chain");
                }
              },
              handleSignAndSendTransaction: async (serializedTransaction) => {
                console.log("Sending transaction");
                console.log({ serializedTransaction });
                try {
                  setError(null);
                  // Parse the transaction
                  const tx = parseTransaction(serializedTransaction as Hex);

                  // Send the transaction
                  const hash = await walletClient.sendTransaction({
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    to: tx.to!,
                    value: tx.value,
                    data: tx.data ?? "0x",
                    gas: tx.gas,
                    chainId: tx.chainId,
                  });

                  return {
                    success: true,
                    txId: hash,
                  };
                } catch (error) {
                  console.error("Transaction failed:", error);
                  setError("Transaction failed to send");
                  return {
                    success: false,
                    errorMessage:
                      error instanceof Error
                        ? error.message
                        : "Transaction failed",
                  };
                }
              },
            },
          },
          fiat: { enabled: false },
        }}
      />
    </div>
  );
};
