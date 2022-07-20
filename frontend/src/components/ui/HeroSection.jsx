import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import './hero-section.css'

import FixedPriceNfts from "../FixedPriceNfts/FixedPriceNfts";


const HeroSection = () => {
  return (
    <section className="hero__section">
      <Container>
        <Row>
          {/* <Col lg="6" md="6">
            <div className="her__content">
              <h2>Discover, collect, and sell extraordinary NFTs</h2>
              <h5>OpenSea is the world's first and largest NFT marketplace</h5>
              <div className="her__btn">
                <button>
                  <Link to="#">
                    <span>Explore</span>
                  </Link>
                </button>
                <button>
                  <Link to="#">
                    <span>Create</span>
                  </Link>
                </button>
              </div>
            </div>
          </Col> */}

          <Col lg="12" md="12">
            <div className="her__content">
            
              <h2 className="align-text-center"><span className="hero_heding">Community</span>-centric <br/>
NFT marketplace</h2>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <FixedPriceNfts/>
        </Row>
      </Container>
    </section>

  );
};

export default HeroSection;
