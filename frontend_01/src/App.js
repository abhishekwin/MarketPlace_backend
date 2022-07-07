import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import {
  ConnectWallet,
  Dashboard,
  Footer,
  Header,
  NftDetails,
  NftList,
  
} from "./components";
import { getAuction, getAuctions } from "./components/ApiCalls";

import { ReactForm } from "./containers/form";








function App() {

  

  return (
    <div>
      <Container>
      <Header/>
      <br/>
      <ReactForm/>
      {/* <ConnectWallet />
      <Dashboard/>
      <Footer/>
      <Header/>
      <NftDetails/>
      <NftList/> */}

      {/* <button type="button" onClick={getAuctions}> Get Details</button> */}
      <br/>
      <Button type="button" onClick={getAuctions}>
        Get Details
      </Button> 
      
      {/* <button type="button" onClick={getAuction}> Get Details</button> */}
      <Button type="button" onClick={getAuction}>
        Get Detail
      </Button>
      <br/>

      </Container>
    </div>

  );
}

export default App;
