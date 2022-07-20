import React from 'react'
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
//import { toHex, truncateAddress } from '../components/utils/utils';
//import { networkParams } from '../components/networks/networks';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import "./wallet.css"



const Wallet = () => {
  
  
  const { activate, deactivate, account, library, chainId, active } = useWeb3React();
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState();
  const isActive = localStorage.getItem("isActive");

  const handleNetwork = (e) =>{
    const id = e.target.supportedChainIds;
    setNetwork(Number(id));
  };

   const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42,56, 137],
   
    
  });

  const coinbasewallet = async () =>{
  try {
    const CoinbaseWallet = new WalletLinkConnector({
    
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      appName: "Web3-react Demo",
      supportedChainIds: [1, 3, 4, 5, 42],
    }); 
  } 
  catch (error) {
    console.log(error);
    alert("Coinbasewallet not found");
  }
}
   
  
   const WalletConnect = new WalletConnectConnector({
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
  });

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        //params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            //params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // useEffect(() => {
  //   const provider = window.localStorage.getItem("provider");
  //   if (provider) activate(provider);
  // }, []);

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };
  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };
  // const disconnect = () => {
  //   refreshState();
  //   deactivate();
  //   localStorage.setItem("isActive",false);
  //   this.setState({
  //     isActive:false
  //   })

  // };
  console.log("ccccccc",account);
  
  return (
    <Container>
      <Row>
        <div>

          <div className='wallet__btns d-flex gap-2 align-items-center'>
          <Col lg="3">
          <div >
            {/* {this.state.isActive ? "true" : "false"} */}
          
          <Button onClick={() => {
                    activate(Injected);
                    setProvider("Injected");
                    // this.setState({
                    //   isActive:true
                    // })
                    
                  }}
                   
                  className="btn__metamask">
              <span>Connect to Metamask</span>
          </Button>
          
        </div>
          </Col>
          <Col lg="3">
          <div >
          
          <Button onClick={() => {
                    activate(coinbasewallet.CoinbaseWallet);
                  }} className="btn__coinbase">
              <span>Connect to Coinbase</span>
          </Button>
          
        </div>
          </Col>
          <Col lg="3">
          <div >
          
          <Button onClick={() => {
                    activate(WalletConnect);
                  }} className="btn__walletconnect">
              <span>Connect to Wallet Connect</span>
          </Button>
          
        </div>
          </Col>
          <Col>
            
              {/* <Button onClick={disconnect}>Disconnect</Button> */}
            
          </Col>
          </div>
        </div>
      </Row>
      <Row>
        <div className='connect__info'>

          <Col lg="4">
            <p>Connection Status:</p>
            {active ? (<span>Connected</span>) : <span>Not Connected</span>}
          </Col>
          <Col lg="4">
            <p>
            {/* {'Account: ${truncateAddress(account)}`} */}
            </p>
          </Col>
          <Col lg="4">
            <p>
            {`Network ID: ${chainId ? chainId : "No Network"}`}
            </p>
          </Col>
        </div>
      </Row> 
    </Container>
  )
}

export default Wallet;