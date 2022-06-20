import { ConnectWallet, Dashboard,Footer,Header,NftDetails,NftList } from "./components";

function App() {
  return (
    <div>
      <h1>Hello world</h1>
      
      <ConnectWallet />
      <Dashboard/>
      <Footer/>
      <Header/>
      <NftDetails/>
      <NftList/>
    </div>
  );
}

export default App;
