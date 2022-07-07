import React from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import './footer.css'
const MY__ACCOUNT = [
  {
    display: "Author Profile",
    url: "#",
  },
  {
    display: "Author Profile",
    url: "#",
  },
  {
    display: "Author Profile",
    url: "#",
  },
  {
    display: "Author Profile",
    url: "#",
  },
  {
    display: "Author Profile",
    url: "#",
  },
];
const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="4" md="6" sm="6">
            <div className="logo">
              <h2 className="d-flex gap-2 align-items-center">
                <span>
                  <i class="ri-store-2-fill"></i>
                </span>{" "}
                NFT Marketplace
              </h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima
                fugiat mollitia, velit ratione fuga ipsa amet sapiente eveniet
                ipsum omnis.
              </p>
            </div>
          </Col>
          <Col lg="4" md="3" sm="6">
            <h5>My Account</h5>
            <ListGroup className="list__group">
              {MY__ACCOUNT.map((item, index) => (
                <ListGroupItem key={index} className="list__item">
                  <Link to={item.url}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="4" md="3" sm="6">
            <h5>Newsletter</h5>
            <input type="e-mail" placeholder="E-mail"  className="input__mail"/>
            <div className="social__links d-flex gap-3 align-items-center">
              <span>
                <Link to="#">
                  <i class="ri-facebook-circle-fill"></i>
                </Link>
              </span>
              <span>
                <Link to="#">
                <i class="ri-twitter-fill"></i>
                </Link>
              </span>
              <span>
                <Link to="#">
                <i class="ri-pinterest-fill"></i>
                </Link>
              </span>
            </div>
          </Col>
          <Col className="copy__right mt-4 text-center">
          <p>Developed By Vinay Dubey</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
