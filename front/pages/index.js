import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import {
  connect,
  useChainChangesListener,
  useAccountChangesListener,
  useCheckConnectionOnLoad,
  useDisconnectListener,
  chainIdHelper,
} from '../libs/metamaskConnector';

import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [balance, setBalance] = useState();
  const [chainName, setChainName] = useState();

  const connectHandler = async () => {
    const { address, chainName, balance, provider, signer } = await connect();
    setAddress(address);
    setChainName(chainName);
    setProvider(provider);
    setBalance(balance);
  };

  useCheckConnectionOnLoad(({ address, chainName, balance, provider, signer }) => {
    setAddress(address);
    setChainName(chainName);
    setProvider(provider);
    setBalance(balance);
  });

  useAccountChangesListener(accounts => {
    setAddress(accounts[0]);
  });

  useChainChangesListener(chainId => {
    setChainName(chainIdHelper(chainId));
  });

  useDisconnectListener((error) => console.log(error));

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <button onClick={connectHandler}>Connect</button>
        <p>
          <span>Eth address: </span>
          <span>{address}</span>
        </p>
        <p>
          <span>Balance: </span>
          <span>{balance}</span>
        </p>
        <p>
          <span>Network: </span>
          <span>{chainName}</span>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
