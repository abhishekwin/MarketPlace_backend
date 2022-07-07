import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

import { createAuction } from "../components/ApiCalls";

export const ReactForm = () => {
  const [formData, setFormData] = useState({
    starting_amount: "",
    reserve_amount: "",
    decline_amount: "",
    uri: "",
    to_address: "",
    royalty: "",
  });

  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.firstName && formData.email) {
      setFormData({ firstName: "", email: "" });
    }
    createAuction(formData);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Starting Amount</Form.Label>
          <Form.Control
            type="number"
            name="starting_amount"
            value={formData.starting_amount}
            onChange={handleChange}
            placeholder="Enter Starting Amount"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Reserve Amount</Form.Label>
          <Form.Control
            type="number"
            name="reserve_amount"
            value={formData.reserve_amount}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Decline Amount</Form.Label>
          <Form.Control
            type="number"
            name="decline_amount"
            value={formData.decline_amount}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>To Address</Form.Label>
          <Form.Control
            type="text"
            name="to_address"
            value={formData.to_address}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Uri</Form.Label>
          <Form.Control
            type="text"
            name="uri"
            value={formData.uri}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Royalty</Form.Label>
          <Form.Control
            type="number"
            name="royalty"
            value={formData.royalty}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Create Auction
        </Button>
      </Form>
    </>
  );
};
