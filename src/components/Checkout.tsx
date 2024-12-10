import { CrossmintEmbeddedCheckout } from "@crossmint/client-sdk-react-ui";
import { useAccount, useWalletClient } from "wagmi";
import { Hex, parseTransaction } from "viem";
import { useState } from "react";

const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID as string;

if (!collectionId) {
  throw new Error("Missing NEXT_PUBLIC_COLLECTION_ID");
}

export const Checkout = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
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
              initialChain: "base-sepolia",
              handleChainSwitch: async (chain) => {
                try {
                  setError(null);
                  await walletClient.switchChain({ id: chain.id });
                } catch (error) {
                  console.error("Chain switch failed:", error);
                  setError("Failed to switch chain");
                }
              },
              handleSignAndSendTransaction: async (serializedTransaction) => {
                try {
                  setError(null);
                  // Parse the transaction
                  const tx = parseTransaction(serializedTransaction as Hex);

                  // Send the transaction
                  const hash = await walletClient.sendTransaction({
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
