import React from "react";
import { useState, useEffect, setState } from "react";
import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "reactstrap";
import { createFlatSale } from "../ApiCalls/FixedPriceApi";
import * as IPFS from "ipfs-core";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import Wallet from "../../pages/Wallet";
import '../NftForm/NftForm.css'

const client = create("https://ipfs.infura.io:5001/api/v0");

const NftForm = () => {
  

  const [formData, setFormData] = useState({
    nft__name: "",
    nft__Description: "",
    sale_amount: "",
    seller_address: "",
    royalty: "",
    uri: "",
  });

  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    createFlatSale(formData);
    formData.seller_address = Wallet.account;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const captureFile = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    const added = await client.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(added.cid.toString());
    formData.uri = url;
  };

  const valueChanged =  () =>{

    
  }
  return (
    <Container>
      <Row>
        <div className="create__nft">
          <h2>Create NFT</h2>

          <Col lg="2"></Col>
          <Col lg="8">
            <Form className="align-text-center">
              <Form.Group className="mb-3">
                <Form.Label>Upload File</Form.Label>
                <Form.Control
                  type="file"
                  name="nft_image"
                  onChange={captureFile}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="nft__name"
                  value={formData.nft__name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="nft__Description"
                  value={formData.nft__Description}
                  onChange={handleChange}
                />
              </Form.Group>
              <div>
                <span>Put On Sale</span>
              <label class="switch">
                <input type="checkbox" name="sale_btn"  onChange={valueChanged}/>
                <span class="slider round"></span>
              </label>
              </div>
              <div class="sale">
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="sale_amount"
                  value={formData.sale_amount}
                  onChange={handleChange}
                />
              </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Royalty</Form.Label>
                <Form.Control
                  type="number"
                  name="royalty"
                  value={formData.royalty}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Create NFT
              </Button>
            </Form>
          </Col>
          <Col lg="2"></Col>
        </div>
      </Row>
    </Container>
  );
};

export default NftForm;
