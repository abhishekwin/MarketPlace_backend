import {
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Form,
  Button,
} from "react-bootstrap";
import { ConnectWallet } from "../connectWallets";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../connectWallets";
import { CoinbaseWallet } from "../connectWallets";
import { WalletConnect} from "../connectWallets";


function Header() {
  const { activate, deactivate, account } = useWeb3React();
  const connectWallet = ConnectWallet

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Link</Nav.Link>
            <NavDropdown title="Connect Wallet" id="navbarScrollingDropdown">
              <NavDropdown title="Wallets">
                <NavDropdown.Item
                  onClick={() => {
                    activate(Injected);
                  }}
                >
                  Connect Metamask
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    activate(CoinbaseWallet);
                  }}
                >
                  Connect Coinbase
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => {
                    activate(WalletConnect);
                  }}
                >
                  Wallet Connect
                </NavDropdown.Item>

              </NavDropdown>

              <NavDropdown.Item onClick={() => {
                deactivate();
              }}>Disconnect</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
