import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

export default function DisconnectWallet(){
    const { activate, deactivate, account, library } = useWeb3React();
    const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState();
    const refreshState = () => {
        window.localStorage.setItem("provider", undefined);
        setNetwork("");
        setMessage("");
        setSignature("");
        setVerified(undefined);
      };
    
      const disconnect = () => {
        refreshState();
        deactivate();
      };
}