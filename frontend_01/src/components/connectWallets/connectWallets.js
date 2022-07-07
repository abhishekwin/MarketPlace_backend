import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { toHex, truncateAddress } from "../utils/utils";
import { networkParams } from "../networks/networks";

import { useWeb3React } from "@web3-react/core";
import { disconnect } from "mongoose";

export const Injected = new InjectedConnector({
  supportedChainIds: [1,3],
});
export const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
});

export const WalletConnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

function ConnectWallet() {
  const { activate, deactivate, account, library } = useWeb3React();
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState();

  const handleNetwork = (e) =>{
    const id = e.target.supportedChainIds;
    setNetwork(Number(id));
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  //disconnect wallet code here


  console.log("Connected", account);

  

  return (
   <div>
    </div>
  );
}



export default ConnectWallet;


