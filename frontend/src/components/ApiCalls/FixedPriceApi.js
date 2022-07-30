import axios from "axios";
import { useState } from "react";
import React from "react";

export const createFlatSale = async (formData) => {
  console.log("form Data", formData);

  axios({
    url: "http://localhost:5000/flatesale",
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: formData,
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
};

export const getFlateSale = async() => {
  const res=  await axios.get("http://localhost:5000/flatesale");
    return res;

    
};
