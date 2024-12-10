import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Checkout } from "../components/Checkout";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Crossmint Custom Signer Demo</title>
        <meta content="Crossmint Custom Signer Demo" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div className="grid">
          <div className="card">
            <ConnectButton />
          </div>
          <div className="card">
            <Checkout />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
